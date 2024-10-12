import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import HttpError from "../../helpers/HttpError.js";
import { migrationLogger, serviceLogger } from "../../config/logConfig.js";
import { logError } from "../../config/logError.js";

export const xlsProfessionsParse = async (db, xlsDirectory) => {
  try {
    const files = fs
      .readdirSync(xlsDirectory)
      .filter((file) => file.endsWith(".xlsx") || file.endsWith(".xls"));

    if (!files.length) {
      throw HttpError(
        400,
        "No XLS or XLSX files found in the 'profXlsx' directory"
      );
    }

    const xlsFilePath = path.resolve(xlsDirectory, files[0]);
    serviceLogger.debug(`FILE PATH (professions): ${xlsFilePath}`);

    if (!fs.existsSync(xlsFilePath)) {
      throw HttpError(400, "XLS or XLSX file not found");
    }

    const workFile = xlsx.readFile(xlsFilePath);
    const worksheet = workFile.Sheets[workFile.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (!rows.length) {
      serviceLogger.warn("XLS or XLSX file is empty or improperly formatted");
      throw HttpError(400, "XLS or XLSX file is empty or improperly formatted");
    }

    serviceLogger.info(
      `Parsed ${rows.length} rows from the XLS file (professions)`
    );

    rows.forEach((row, index) => {
      serviceLogger.debug(`Row ${index}: ${JSON.stringify(row)}`);
    });

    // Підготовка запиту для вставки даних у таблицю professinos
    const insertKvedQuery = db.prepare(`
      INSERT INTO professions (code_kp, name)
      VALUES (?, ?)
    `);

    migrationLogger.info(`Migration from file [${xlsFilePath}] started`);

    // rows.forEach((row, index) => {
    //   try {
    //     insertKvedQuery.run(row["КОД КП"], row["ПРОФЕСІЙНА НАЗВА РОБОТИ"]);
    //     migrationLogger.info(
    //       `Data inserted: ID: ${index + 1}, CODE KP: ${row["КОД КП"]}, NAME: ${
    //         row["ПРОФЕСІЙНА НАЗВА РОБОТИ"]
    //       }`
    //     );
    //   } catch (err) {
    //     migrationLogger.error(`Failed to insert row at index ${index}:`, err);
    //   }
    // });

    rows.forEach((row, index) => {
      // Обрізання пробілів із назви поля та значень
      const codeKp = row["КОД КП "] ? row["КОД КП "].toString().trim() : null;
      const name = row["ПРОФЕСІЙНА НАЗВА РОБОТИ "]
        ? row["ПРОФЕСІЙНА НАЗВА РОБОТИ "].trim()
        : null;

      if (!codeKp || !name) {
        migrationLogger.warn(
          `Skipping row ${index} due to missing data: CODE KP or NAME`
        );
        return;
      }

      try {
        insertKvedQuery.run(codeKp, name);
        migrationLogger.info(
          `Data inserted: ID: ${index + 1}, CODE KP: ${codeKp}, NAME: ${name}`
        );
      } catch (err) {
        migrationLogger.error(`Failed to insert row at index ${index}:`, err);
      }
    });

    migrationLogger.info("Migration for 'professions' completed");
  } catch (error) {
    logError(
      error,
      null,
      "Failed to parse XLS and insert data for 'professions'"
    );
    throw HttpError(
      500,
      "Failed to parse XLS and insert data for 'professions'"
    );
  }
};
