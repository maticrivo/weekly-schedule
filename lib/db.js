import config from "../knexfile.js";
import knex from "knex";

/**
 * Global is used here to ensure the connection
 * is cached across hot-reloads in development
 *
 * see https://github.com/vercel/next.js/discussions/12229#discussioncomment-83372
 */
let cached = global.db;
if (!cached) cached = global.db = {};

export function getKnex() {
  if (!cached.instance) cached.instance = knex(config);
  return cached.instance;
}
