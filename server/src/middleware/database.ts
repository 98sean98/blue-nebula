import * as env from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { Client } from 'pg';

env.config();

const connectionString = process.env.DATABASE_URL;

export const database = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const client = new Client({
      connectionString,
    });
    await client.connect();
    await client.end();
  } catch (error) {
    console.log('Database is not connected.', error);
    res.status(500).send('Internal server error.');
    return;
  }

  next();
};
