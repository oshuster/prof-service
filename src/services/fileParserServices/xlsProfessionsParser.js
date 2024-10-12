import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import HttpError from "../../helpers/HttpError.js";
import { migrationLogger, serviceLogger } from "../../config/logConfig.js";
import { logError } from "../../config/logError.js";
import { insertProfessionRow } from "./insertProfessionRow.js";

export const xlsProfessionsParse = async (client, xlsDirectory) => {
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

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      serviceLogger.debug(`Row ${index}: ${JSON.stringify(row)}`);
      await insertProfessionRow(client, row, index);
    }

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
