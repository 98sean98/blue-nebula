import * as env from 'dotenv';
import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import * as bodyParser from 'body-parser';

import 'reflect-metadata';

import { database } from '@middleware';
import { auth } from '@rest-api';
import { createServer } from '@graphql-api';

env.config();

const main = async () => {
  const app: Application = express();

  // cors
  const corsOptions: CorsOptions = {
    origin: [],
    credentials: true,
  };
  app.use(cors(corsOptions));

  // check if database is connected for each request
  app.use(database);

  // apollo server instance
  const graphqlPath = '/graphql';
  const port = process.env.PORT || 4000;
  const server = await createServer();
  server.applyMiddleware({
    app,
    cors: corsOptions,
    path: graphqlPath,
    bodyParserConfig: {
      limit: '20mb',
    },
  });

  // root route
  app.get('/', (_req, res) => {
    res.status(200).send('ok');
  });

  // body parser for auth REST api
  app.use(bodyParser.json({ type: 'application/json' }));

  // auth REST api
  const authRestRoute = '/auth';
  app.use(authRestRoute, auth);

  // listener
  app.listen(port, () => {
    console.log(
      `Server is running on ${port}, with auth rest api at ${authRestRoute}, and graphql api at ${server.graphqlPath}`,
    );
  });
};

main().then();
