# Development Quick Start

Please open an issue to discuss the contribution you wish to make before submitting any changes.

This way we can guide you through the process and give feedback.

## 📦 Prerequisites

You will need `Node.js >=20.18.0`, `pnpm >=10.8.0` and `Docker >= 26.1.3` installed on your machine.

## 🚀 Up and Running

1. Install the required toolchain & SDK: [Node.js][nodejs], [pnpm][pnpm], and [Docker][docker].
2. Install required project dependencies: `pnpm install`
3. Create `.env` file or copy from `.env.example`, then configure required variables.
4. Generate application secret key: `pnpm --silent squelify make app-key`
5. Start the database server and local SMTP server: `pnpm compose:up`
6. Run database migration: `pnpm --silent squelify migrate up`
7. Run project in development mode: `pnpm dev`

> Application will run at <http://localhost:3278>

An alternative option for generating a secret key is to use [AuthWeb](https://auth.web.id/password).

### OAuth Configuration

Callback: `http://localhost:3278/api/auth/<PROVIDER>/callback`

### Webhooks

In order to receive webhooks (_i.e. notifications, payment integrations, etc_), you will need
to expose the local port to the internet. To expose a local port to the internet, you can use
service like [Tailscale Funnel][tailscale], [Expose][expose-dev], [ngrok][ngrok],
or [untun][untun] by [UnJS][unjs].

In this case we will use Tailscale Funnel. By default, no alias for `tailscale` is set up.
If you plan on frequently accessing the Tailscale CLI, you can add an alias to your `.bashrc`
or `.zshrc` to make it easier.

```sh
alias tailscale="/Applications/Tailscale.app/Contents/MacOS/Tailscale"
```

```sh
tailscale funnel --bg=false http://localhost:3278
tailscale funnel status
```

Reference: https://www.twilio.com/blog/expose-localhost-to-internet-with-tunnel

## 🔰 Database Migration

The migration generator creates new migration files with standardized naming format:
`YYYYMMXXX_NAME.ts` where:

- `YYYYMM`: Year and month (e.g. 202412)
- `XXX`: Sequential number within the month (e.g. 001)
- `NAME`: Migration name using snake_case

```bash
pnpm squelify make migration <name>
```

### Example

```sh
pnpm squelify make migration create_users_table
```

### Reset Migrations

To reset the database and seed the database with the default data, you can run the following command:

```sh
pnpm --silent squelify migrate reset --migrate --seed
```

### User Migrations

Squelify supports custom database migrations through SQL files.
Place your migration files in `sqdata/migrations` directory with
format `YYYYMMXXX_description.sql`:

#### Migration Filename Format:

`YYYYMMXXX` = Year Month Sequential Number

- YYYYMM (6 digits) = Year and Month (e.g. 202412)
- XXX (3 digits) = Sequential number within the month (e.g. 001)

#### Validation Rules

- File size limit: 1MB
- Reserved prefix `_sq_` not allowed
- Valid SQLite syntax required
- Foreign key integrity checks
- Column naming conventions
- Valid SQLite data types
- Proper constraint definitions
- Index limitations (max 5 per table)
- View definition validation
- Checksum verification

#### Example:
```sql
--- Path: sqdata/migrations/202504001_create_posts_table.sql

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER,
  deleted_at INTEGER
) STRICT;

CREATE TRIGGER IF NOT EXISTS trg_posts_timestamp
AFTER UPDATE ON posts
FOR EACH ROW
BEGIN
  UPDATE posts
  SET updated_at = strftime('%s', 'now')
  WHERE id = NEW.id;
END;

CREATE INDEX IF NOT EXISTS idx_posts_title ON posts(title);
CREATE INDEX IF NOT EXISTS idx_posts_is_active ON posts(is_active);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
```

## Testing

> TODO: add more information here

### Simple Load Testing

Using [`oha`](https://github.com/hatoo/oha) to perform a simple load testing.

```sh
oha -z 10s -m GET http://localhost:3278/api/sysinfo -c 350 -n 10000
```

## 🐳 Docker Container

### Development Server

```sh
# Start development server
docker-compose up -d

# Stop development server
docker-compose down --remove-orphans --volumes
```

### Build Container

```sh
pnpm docker:build
```

### List Docker Images

```sh
pnpm docker:images
```

### Testing Container

```sh
docker run --network=host --rm -it --env-file .env \
  -v $(pwd)/sqdata:/srv/sqdata --name squelify \
  ghcr.io/squelify/squelify:latest
```

### Push Images

Sign in to container registry:

```sh
echo $REGISTRY_TOKEN | docker login ghcr.io --username YOUR_USERNAME --password-stdin
```

Push docker image:

```sh
docker push ghcr.io/squelify/squelify:latest
```

## 🗂️ Operators

Reference: <https://postgrest.org/en/stable/references/api/tables_views.html#logical-operators>

| Abbreviation | In PostgreSQL      | Meaning                                                                                                                                                                  |
|--------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| eq           | `=`                | equals                                                                                                                                                                   |
| gt           | `>`                | greater than                                                                                                                                                             |
| gte          | `>=`               | greater than or equal                                                                                                                                                    |
| lt           | `<`                | less than                                                                                                                                                                |
| lte          | `<=`               | less than or equal                                                                                                                                                       |
| neq          | `<>` or `!=`       | not equal                                                                                                                                                                |
| like         | `LIKE`             | LIKE operator (to avoid [URL encoding](https://en.wikipedia.org/wiki/Percent-encoding) you can use `*` as an alias of the percent sign `%` for the pattern)              |
| ilike        | `ILIKE`            | ILIKE operator (to avoid [URL encoding](https://en.wikipedia.org/wiki/Percent-encoding) you can use `*` as an alias of the percent sign `%` for the pattern)             |
| match        | `~`                | ~ operator, see [Pattern Matching](#pattern-matching)                                                                                                                    |
| imatch       | `~*`               | ~\* operator, see [Pattern Matching](#pattern-matching)                                                                                                                  |
| in           | `IN`               | one of a list of values, e.g. `?a=in.(1,2,3)` – also supports commas in quoted strings like `?a=in.("hi,there","yes,you")`                                               |
| is           | `IS`               | checking for exact equality (null,not\_null,true,false,unknown)                                                                                                          |
| isdistinct   | `IS DISTINCT FROM` | not equal, treating `NULL` as a comparable value                                                                                                                         |
| fts          | `@@`               | [Full-Text Search](#full-text-search) using to\_tsquery                                                                                                                  |
| plfts        | `@@`               | [Full-Text Search](#full-text-search) using plainto\_tsquery                                                                                                             |
| phfts        | `@@`               | [Full-Text Search](#full-text-search) using phraseto\_tsquery                                                                                                            |
| wfts         | `@@`               | [Full-Text Search](#full-text-search) using websearch\_to\_tsquery                                                                                                       |
| cs           | `@>`               | contains e.g. `?tags=cs.{example, new}`                                                                                                                                  |
| cd           | `<@`               | contained in e.g. `?values=cd.{1,2,3}`                                                                                                                                   |
| ov           | `&&`               | overlap (have points in common), e.g. `?period=ov.[2017-01-01,2017-06-30]` – also supports array types, use curly braces instead of square brackets e.g. `?arr=ov.{1,3}` |
| sl           | `<<`               | strictly left of, e.g. `?range=sl.(1,10)`                                                                                                                                |
| sr           | `>>`               | strictly right of                                                                                                                                                        |
| nxr          | `&<`               | does not extend to the right of, e.g. `?range=nxr.(1,10)`                                                                                                                |
| nxl          | `&>`               | does not extend to the left of                                                                                                                                           |
| adj          | `-\|-`             | is adjacent to, e.g. `?range=adj.(1,10)`                                                                                                                                 |
| not          | `NOT`              | negates another operator, see [Logical operators](#logical-operators)                                                                                                    |
| or           | `OR`               | logical `OR`, see [Logical operators](#logical-operators)                                                                                                                |
| and          | `AND`              | logical `AND`, see [Logical operators](#logical-operators)                                                                                                               |
| all          | `ALL`              | comparison matches all the values in the list, see [Operator Modifiers](#modifiers)                                                                                      |
| any          | `ANY`              | comparison matches any value in the list, see [Operator Modifiers](#modifiers)                                                                                           |

### Pattern Matching
The pattern-matching operators (`like`, `ilike`, `match`, `imatch`) exist to support filtering data using
patterns instead of concrete strings, as described in the [PostgreSQL docs](https://www.postgresql.org/docs/current/functions-matching.html).

To ensure best performance on larger data sets, an [appropriate index](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-INDEX)
should be used and even then, it depends on the pattern value and actual data statistics whether an existing
index will be used by the query planner or not.

### Full-Text Search
The `fts` operator has a number of options to support flexible textual queries, namely the choice of plain vs
phrase search and the language used for stemming.

The following examples illustrate the possibilities, assuming column `my_tsv` is of type
[tsvector](https://www.postgresql.org/docs/current/datatype-textsearch.html).

```sh
curl --get "http://localhost:3080/api/collections/people" -d "my_tsv=fts(french).amusant"

curl --get "http://localhost:3080/api/collections/people" -d "my_tsv=plfts.The%20Fat%20Cats"

curl --get "http://localhost:3080/api/collections/people" -d "my_tsv=not.phfts(english).The%20Fat%20Cats"

curl --get "http://localhost:3080/api/collections/people" -d "my_tsv=not.wfts(french).amusant"
```

### Logical operators

Multiple conditions on columns are evaluated using `AND` by default, but you can combine them using `OR`
with the `or` operator. For example, to return people under 18 or over 21:

```sh
curl "http://localhost:3080/api/collections/people?or=(age.lt.18,age.gt.21)"
```

To `negate` any operator, you can prefix it with `not` like `?a=not.eq.2` or `?not.and=(a.gte.0,a.lte.100)`.

You can also apply complex logic to the conditions:

```sh
# curl "http://localhost:3080/api/collections/people?grade=gte.90&student=is.true&or=(age.eq.14,not.and(age.gte.11,age.lte.17))"

curl --get "http://localhost:3080/api/collections/people" \
  -d "grade=gte.90" \
  -d "student=is.true" \
  -d "or=(age.eq.14,not.and(age.gte.11,age.lte.17))"
```

### Operator Modifiers
You may further simplify the logic using the `any/all` modifiers of `eq,like,ilike,gt,gte,lt,lte,match,imatch`.

For instance, to avoid repeating the same column for `or`, use `any` to get people with last names that start with O or P:

```sh
curl -g "http://localhost:3080/api/collections/people?last_name=like(any).{O*,P*}"
```

In a similar way, you can use `all` to avoid repeating the same column for `and`. To get the people with last
names that start with O and end with n:

```sh
curl -g "http://localhost:3080/api/collections/people?last_name=like(all).{O*,*n}"
```


## 🚀 Deployment

Read [Deployment Guide](./DEPLOY.md) for detailed documentation.

<!-- link reference definition -->
[docker]: https://docs.docker.com/engine/install
[expose-dev]: https://expose.dev/
[ngrok]: https://ngrok.com/
[nodejs]: https://nodejs.org/en/download/
[pnpm]: https://pnpm.io/installation
[tailscale]: https://tailscale.com/kb/1223/funnel
[untun]: https://unjs.io/packages/untun
[unjs]: https://unjs.io
