# syntax=docker/dockerfile:1.7

# Arguments with default value (for build).
ARG PLATFORM=linux/amd64
ARG NODE_VERSION=20

FROM --platform=${PLATFORM} busybox:stable-glibc AS glibc
FROM --platform=${PLATFORM} gcr.io/distroless/nodejs${NODE_VERSION}-debian12:nonroot AS runner
LABEL org.opencontainers.image.source="https://github.com/squelify/squelify"
LABEL org.opencontainers.image.documentation="https://github.com/squelify/squelify"
LABEL org.opencontainers.image.description="A modern headless CMS and backend-as-a-service platform"
LABEL org.opencontainers.image.licenses="FSL-1.0-Apache-2.0"
LABEL org.opencontainers.image.authors="Aris Ripandi"
LABEL org.opencontainers.image.vendor="Aris Ripandi"

# -----------------------------------------------------------------------------
# Base image with pnpm package manager.
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} node:${NODE_VERSION}-bookworm-slim AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 COREPACK_INTEGRITY_KEYS=0 PNPM_HOME="/pnpm"
ENV CI=true LEFTHOOK=0 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
RUN apt-get update && apt-get -yqq --no-install-recommends install tini
WORKDIR /srv

# -----------------------------------------------------------------------------
# Install dependencies and build the application.
# -----------------------------------------------------------------------------
FROM base AS builder

# Copy the source files
COPY --chown=node:node . .

# Install dependencies and build the application.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts \
    --frozen-lockfile && pnpm prepare && NODE_ENV=production pnpm build

# -----------------------------------------------------------------------------
# Cleanup the builder stage and create data directory.
# -----------------------------------------------------------------------------
FROM base AS pruner

# Copy output and config files from the builder stage.
COPY --from=builder /srv/build /srv

# Create the data directory and set permissions.
RUN mkdir -p /srv/storage/{backup,migrations,pgdata,uploads,wwwroot}
RUN chmod -R 0775 /srv/storage

# -----------------------------------------------------------------------------
# Production image, copy build output files and run the application.
# -----------------------------------------------------------------------------
FROM runner

# Read application environment variables
ARG DATABASE_AUTO_MIGRATE DISABLE_LOG_TIMESTAMP APP_LOG_LEVEL=info
ARG APP_BASE_URL DATABASE_TYPE DATABASE_URL JWT_SECRET_KEY SMTP_HOST \
    SMTP_PORT SMTP_USERNAME SMTP_PASSWORD SMTP_USE_SSL SMTP_FROM_NAME \
    SMTP_FROM_EMAIL GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET \
    GITHUB_CLIENT_ID GITHUB_CLIENT_SECRET

# Copy the build output files from the pruner stage.
COPY --chown=nonroot:nonroot --from=pruner /srv /srv

# Copy some necessary system utilities from previous stage.
COPY --from=base /usr/bin/tini /usr/bin/tini
COPY --from=glibc /bin/hostname /bin/hostname

# Copy additional system utilities for debugging (~9MB).
# To enhance security, consider avoiding the copying of sysutils.
COPY --from=glibc /bin/whoami /bin/whoami
COPY --from=glibc /bin/clear /bin/clear
COPY --from=glibc /bin/mkdir /bin/mkdir
COPY --from=glibc /bin/which /bin/which
COPY --from=glibc /bin/head /bin/head
COPY --from=glibc /bin/cat /bin/cat
COPY --from=glibc /bin/ls /bin/ls
COPY --from=glibc /bin/sh /bin/sh

# Define the host and port to listen on.
ARG APP_MODE=production HOST=0.0.0.0 PORT=3000
ENV APP_MODE=$APP_MODE NODE_ENV=$APP_MODE
ENV HOST=$HOST PORT=$PORT
ENV TINI_SUBREAPER=true

WORKDIR /srv
ENV PATH="/nodejs/bin:$PATH"
USER nonroot:nonroot
EXPOSE $PORT/tcp

ENTRYPOINT ["/usr/bin/tini", "--"]

# @ref: https://www.akamas.io/resources/tuning-nodejs-v8-performance-efficiency
CMD ["node", "--max-heap-size=2048", "--max-old-space-size=1024", "server/index.mjs"]
