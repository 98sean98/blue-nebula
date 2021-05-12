# Server

Nodejs server to manage data in a database.

## Local development setup

### Prerequisites

You need to have the following software tools available in your machine.

- docker
- NodeJs 14 or later

### Environment variables

Create an `.env` file based on the `.env.sample` provided.

This is an example for local development.

```text
DATABASE_URL=postgresql://prisma:db-secret@localhost:5432/blue-nebula?schema=public
POSTGRES_USER=prisma
POSTGRES_PASSWORD=db-secret
POSTGRES_DB=blue-nebula

STAGE=dev
APPLICATION_SECRET=
APPLICATION_MASTER_PASSWORD=
POSITION_STACK_API_KEY=
```

### Docker - postgres db

Spin up a local postgres db as a docker container.

```sh
docker compose up -d
```

### Installation

Install node modules, migrate the database, and generate prisma bindings.

```sh
# install node_modules
npm i

# migrate database
npm run prisma:migrate:dev

# generate prisma bindings
npm run prisma:generate
```

### Start dev server

Start a local development server at `localhost:4000`.

```sh
npm run dev
```

Go to http://localhost:4000 to get the root url, which is useful as a health check as it simply returns a 200 OK. Implemented urls are at

- `/auth`: restful authentication endpoint
  - `/auth/login`: login route
  - `/auth/logout`: logout route
  - `/auth/isAuthenticated`: route that checks if a user is already authenticated
- `/graphql`: graphql endpoint

## Production setup

### Installation

Install node modules, and apply database migrations.

```sh
# install node_modules
npm i

# migrate database
npm run prisma:migrate:prod
```

### Build

Build a `/dist` javascript output to run on a production server.

```sh
npm run build
```

_This package script runs `prisma generate` before the actual typescript-javascript transpile process aka `tsc`._

### Start

Start the server using the built `/dist`.

```sh
npm start
```

## API Endpoints

These are the implemented api endpoints:

- `/`: GET 200 OK health check
- `/auth`: restful auth endpoints
  - `/login`: POST login route
  - `/logout`: POST logout route
  - `/isAuthenticated`: GET is authenticated route
- `/graphql`: POST graphql endpoint

## Project

### Authentication and authorisation

A user is authenticated by a combination of a username, and a password. A `jsonwebtoken` is returned to the client so that subsequent calls to protected api endpoints need to include it either in the `authorization` header, or in cookies.

A user is authorised by the `jsonwebtoken` that is generated upon authentication. Protected api endpoints always check for a valid token before resolving the request. A token can also identify the user it belongs to. It is invalidated upon logging out, so it should be removed by the client application after calling `/logout` successfully.

### GraphQL

To obtain and navigate the GraphQL schema, open the `/graphql` endpoint on a web browser, you should see the GraphQL playground that should provide what you need.
