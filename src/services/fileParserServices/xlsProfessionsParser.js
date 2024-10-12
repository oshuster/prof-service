import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import HttpError from "../../helpers/HttpError.js";
import { migrationLogger, serviceLogger } from "../../config/logConfig.js";
import { logError } from "../../config/logError.js";
import { insertProfessionRow } from "./insertProfessionRow.js";

export const xlsProfessionsParse = async (client, xlsDirectory) => {
  try {
    serviceLogger.debug(`Початок парсингу. Каталог XLS: ${xlsDirectory}`);

    // Перевірка наявності файлів у каталозі
    const files = fs
      .readdirSync(xlsDirectory)
      .filter((file) => file.endsWith(".xlsx") || file.endsWith(".xls"));

    serviceLogger.debug(`Знайдено файлів: ${files.length}`);
    serviceLogger.debug(`Файли: ${files.join(", ")}`);

    if (!files.length) {
      throw HttpError(
        400,
        "No XLS or XLSX files found in the 'profXlsx' directory"
      );
    }

    const xlsFilePath = path.resolve(xlsDirectory, files[0]);
    serviceLogger.debug(`FILE PATH (professions): ${xlsFilePath}`);

    // Перевірка наявності конкретного файлу
    if (!fs.existsSync(xlsFilePath)) {
      serviceLogger.error(`Файл не знайдено за шляхом: ${xlsFilePath}`);
      throw HttpError(400, "XLS or XLSX file not found");
    }

    // Відкриття та парсинг файлу
    serviceLogger.debug("Читання XLS файлу...");
    const workFile = xlsx.readFile(xlsFilePath);

    const sheetNames = workFile.SheetNames;
    serviceLogger.debug(`Sheet Names: ${sheetNames}`);

    const worksheet = workFile.Sheets[sheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    serviceLogger.debug(`Кількість рядків: ${rows.length}`);

    if (!rows.length) {
      serviceLogger.warn("XLS or XLSX file is empty or improperly formatted");
      throw HttpError(400, "XLS or XLSX file is empty or improperly formatted");
    }

    serviceLogger.info(
      `Parsed ${rows.length} rows from the XLS file (professions)`
    );

    // Процес вставки рядків у базу даних
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      serviceLogger.debug(`Row ${index}: ${JSON.stringify(row)}`);

      try {
        await insertProfessionRow(client, row, index);
        serviceLogger.debug(`Row ${index} успішно вставлено.`);
      } catch (insertError) {
        serviceLogger.error(
          `Помилка при вставці рядка ${index}: ${insertError.message}`
        );
      }
    }

    migrationLogger.info("Migration for 'professions' completed");
  } catch (error) {
    serviceLogger.error("Помилка при парсингу та вставці даних:", error);
    logError(
      error,
      null,
      "Failed to parse XLS and insert data for 'professions'"
    );
    throw HttpError(
      500,
      `Failed to parse XLS and insert data for 'professions': ${error.message}`
    );
  }
};
