import * as env from 'dotenv';
import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import * as bodyParser from 'body-parser';
// import { server } from './server';
import { database } from './middleware';

env.config();

const app: Application = express();

// cors
const corsOptions: CorsOptions = {
  origin: [
    // todo: put server url
    '',
  ].concat(
    process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [],
  ),
  credentials: true,
};
app.use(cors(corsOptions));

// check if database is connected for each request
app.use(database);

// apollo server instance
// const graphqlPath = '/graphql';
const port = process.env.PORT || 4000;
// server.applyMiddleware({
//   app,
//   cors: corsOptions,
//   path: graphqlPath,
//   bodyParserConfig: {
//     limit: '20mb',
//   },
// });

// root route
app.get('/', (_req, res) => {
  res.status(200).send('ok');
});

// body parser for auth REST api
app.use(bodyParser.json({ type: 'application/json' }));

// auth REST api
// app.use('/auth', auth);

// listener
app.listen(port, () => {
  console.log(
    `Graphql server is running on ${port}${
      // server.graphqlPath
      ''
    }`,
  );
});
