// src/migrations/coordinates.js

const { Knex } = require("knex");

exports.up = async function (knex) {
  await knex.schema.createTable("coordinates", (table) => {
    table.increments("id");
    table.datetime("captured_at");
    table.float("latitude");
    table.float("longitude");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("coordinates");
};
