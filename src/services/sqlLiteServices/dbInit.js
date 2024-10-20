import pkg from "pg";
import "dotenv/config";
const { Client } = pkg;
import HttpError from "../../helpers/HttpError.js";
import { serviceLogger } from "../../config/logConfig.js";
import { parseXlsAndSaveToDb } from "../fileParserServices/parseXlsAndSaveToDb.js";
import { logError } from "../../config/logError.js";
import { clearDuplicates } from "./clearDublicates.js";

const SCHEMA_NAME = process.env.SCHEMA_NAME || "prof_service";
const DB_INIT = process.env.DB_INIT || "false";
const DB_CLEAR = process.env.DB_CLEAR || "false";

console.log("DB_INIT: ", DB_INIT);
serviceLogger.info(`DB initialize ENABLED: ${DB_INIT}`);

export const initializeDatabase = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT || 5432,
  });
  try {
    await client.connect();
    serviceLogger.info("Connected to PostgreSQL database");

    // Створюємо схему, якщо вона ще не існує
    const createSchemaQuery = `CREATE SCHEMA IF NOT EXISTS ${SCHEMA_NAME};`;
    serviceLogger.debug("Executing query: ", createSchemaQuery);
    await client.query(createSchemaQuery);

    if (DB_INIT === "true") {
      // Видалення існуючих таблиць у схемі, якщо вони вже є
      const dropProfessionsSchemaQuery = `DROP TABLE IF EXISTS ${SCHEMA_NAME}.professions;`;
      serviceLogger.debug("Executing query: ", dropProfessionsSchemaQuery);
      await client.query(dropProfessionsSchemaQuery);

      // Створюємо таблицю professions у схемі prof-service
      const createProfessionsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${SCHEMA_NAME}.professions (
        id SERIAL PRIMARY KEY,
        code_kp TEXT NOT NULL,
        name TEXT NOT NULL
      );
    `;
      serviceLogger.debug("Executing query: ", createProfessionsTableQuery);
      await client.query(createProfessionsTableQuery);

      // Вставка даних
      await parseXlsAndSaveToDb(client);

      serviceLogger.info(
        "Database tables initialized in schema 'prof_service'"
      );
    }

    if (DB_CLEAR === "true" && DB_INIT !== "true") {
      clearDuplicates(client);
    }

    return client;
  } catch (error) {
    logError(error, null, "Failed to initialize the PostgreSQL database");
    console.error("Error details: ", error);
    throw HttpError(500, "Failed to initialize the PostgreSQL database");
  }
};
