const old_env = process.env;
import 'dotenv/config';
process.env = { ...process.env, ...old_env };
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { container } from './ioc/containter';
import { errorCatchMiddleware } from './middlewares';
// import { createConnection } from 'typeorm';

if (!process.env.MONGO_URL) {
  throw new Error('Invalid env config, required: mongodb_url');
}
if (!process.env.POSTGRES_URL) {
  throw new Error('Invalid env config, required: postgres_url');
}

Promise.all([
  mongoose.connect(process.env.MONGO_URL),
  // createConnection({
  //   type: 'postgres',
  //   url: process.env.POSTGRES_URL,
  //   ssl: true,
  // }),
]).then(() => {
  const server = new InversifyExpressServer(container);

  server.setConfig((theApp) => {
    theApp.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    theApp.use(bodyParser.json());
    theApp.use(errorCatchMiddleware);
  });

  const app = server.build();
  app.listen(process.env.PORT);
  console.log(`Server started on port ${process.env.PORT} :)`);
});
