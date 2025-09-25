# syntax=docker/dockerfile:1.7

# Arguments with default value (for build).
ARG PLATFORM=linux/amd64
ARG DISTROLESS_TAG=nonroot
ARG NODE_VERSION=22

# -----------------------------------------------------------------------------
# Base image with pnpm package manager.
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} node:${NODE_VERSION}-trixie AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 COREPACK_INTEGRITY_KEYS=0 PNPM_HOME="/pnpm"
ENV CI=true LEFTHOOK=0 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest-10 --activate

# Add tini for signal handling and zombie reaping
RUN set -eux; \
    TINI_DOWNLOAD_URL="https://github.com/krallin/tini/releases/download/v0.19.0" \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
      amd64|x86_64) TINI_BIN_URL="${TINI_DOWNLOAD_URL}/tini" ;; \
      arm64|aarch64) TINI_BIN_URL="${TINI_DOWNLOAD_URL}/tini-arm64" ;; \
      *) echo "unsupported architecture: ${ARCH}"; exit 1 ;; \
    esac; \
    curl -fsSL "${TINI_BIN_URL}" -o /usr/bin/tini; \
    chmod +x /usr/bin/tini

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
RUN mkdir -p /srv/storage/{backup,functions,migrations,pgdata,uploads,wwwroot}
RUN chmod -R 0775 /srv/storage

# -----------------------------------------------------------------------------
# Production image, copy build output files and run the application.
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} busybox:stable-glibc AS glibc
FROM --platform=${PLATFORM} gcr.io/distroless/nodejs${NODE_VERSION}-debian12:${DISTROLESS_TAG}
LABEL org.opencontainers.image.source="https://github.com/squelify/squelify"
LABEL org.opencontainers.image.documentation="https://github.com/squelify/squelify"
LABEL org.opencontainers.image.description="A modern headless CMS and backend-as-a-service platform"
LABEL org.opencontainers.image.licenses="FSL-1.0-Apache-2.0"
LABEL org.opencontainers.image.authors="Aris Ripandi"
LABEL org.opencontainers.image.vendor="Aris Ripandi"

# Read application environment variables
ARG APP_LOG_LEVEL
ARG APP_BASE_URL
ARG DATABASE_ENGINE
ARG DATABASE_URL
ARG DEFAULT_INDEX_FILES
ARG JWT_SECRET_KEY
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USERNAME
ARG SMTP_PASSWORD
ARG SMTP_USE_SSL
ARG SMTP_FROM_NAME
ARG SMTP_FROM_EMAIL
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_BUCKET_NAME
ARG S3_PATH_PREFIX
ARG S3_CDN_BASE_URL
ARG S3_ENDPOINT_URL
ARG S3_REGION
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET

# Copy the build output files from the pruner stage.
COPY --chown=nonroot:nonroot --from=pruner /srv /srv

# Copy some necessary system utilities from previous stage.
# To enhance security, consider avoiding the copying of sysutils.
COPY --from=base /usr/bin/tini /usr/bin/tini
COPY --from=glibc /bin/hostname /bin/hostname

# Define the host and port to listen on.
ARG APP_MODE=production HOST=0.0.0.0 PORT=3000
ENV APP_MODE=$APP_MODE NODE_ENV=$APP_MODE
ENV HOST=$HOST PORT=$PORT
ENV TINI_SUBREAPER=true
ENV PATH="/nodejs/bin:$PATH"

WORKDIR /srv
VOLUME /srv/storage
USER nonroot:nonroot
EXPOSE $PORT/tcp

ENTRYPOINT ["/usr/bin/tini", "--"]

# @ref: https://www.akamas.io/resources/tuning-nodejs-v8-performance-efficiency
CMD ["node", "--max-heap-size=2048", "--max-old-space-size=1024", "server/index.mjs"]
