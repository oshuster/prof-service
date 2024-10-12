import Database from "better-sqlite3";
import HttpError from "../../helpers/HttpError.js";
import { serviceLogger } from "../../config/logConfig.js";
import { parseXlsAndSaveToDb } from "../fileParserServices/parseXlsAndSaveToDb.js";
import { logError } from "../../config/logError.js";

export const initializeDatabase = async () => {
  try {
    const db = new Database("database.sqlite");

    serviceLogger.info("Connected to SQLite database");

    // Видалення існуючих таблиць, якщо вони вже є
    // const dropProfessionsSchemaQuery = `DROP TABLE IF EXISTS professions;`;
    // db.exec(dropProfessionsSchemaQuery);

    // Створюємо таблицю professions
    // const createProfessionsTableQuery = `
    //   CREATE TABLE IF NOT EXISTS professions (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     code_kp TEXT NOT NULL,
    //     name TEXT NOT NULL
    //   );
    // `;
    // db.exec(createProfessionsTableQuery);

    // await parseXlsAndSaveToDb(db);

    serviceLogger.info("Database tables initialized");
    return db;
  } catch (error) {
    logError(error, null, "Failed to initialize the SQLite database");
    throw HttpError(500, "Failed to initialize the SQLite database");
  }
};
