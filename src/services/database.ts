import { Config, JsonDB } from 'node-json-db';

export const db = new JsonDB(new Config("database", true, true));
