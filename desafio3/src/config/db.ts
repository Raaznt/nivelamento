import { Sequelize } from 'sequelize';
import { dbConfig } from './dbconfig';

const database: string = dbConfig.development.database!;
const username: string = dbConfig.development.username!;
const password: string = dbConfig.development.password!;
const host: string = dbConfig.development.host!;
const port: string = dbConfig.development.port!;
const dialect: any = dbConfig.development.dialect;
const logging: boolean = dbConfig.development.logging;

const sequelize = new Sequelize(
  {
    database: database,
    username: username,
    password: password,
    host: host,
    port: Number.parseInt(port),
    dialect: dialect,
    logging: logging
  }
);

export {sequelize};
