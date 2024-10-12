import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { serviceLogger } from "../../config/logConfig.js";
import { xlsProfessionsParse } from "./xlsProfessionsParser.js";
import { logError } from "../../config/logError.js";
import HttpError from "../../helpers/HttpError.js";

export const parseXlsAndSaveToDb = async (client) => {
  try {
    let xlsProfessionsPath;

    // DEVELOPMENT mode
    if (process.env.ENVIRONMENT === "DEVELOPMENT") {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      // PROFESSIONS
      xlsProfessionsPath = path.resolve(
        __dirname,
        "../../../inputFiles/profXlsx"
      );
      serviceLogger.debug(
        `XLS TYPE File Path (Development): ${xlsProfessionsPath}`
      );

      await xlsProfessionsParse(client, xlsProfessionsPath);
    }

    // PRODUCTION mode
    if (process.env.ENVIRONMENT === "PRODUCTION") {
      const professionsDirectory =
        process.env.XLS_PROFESSION_PATH || "./inputFiles/profXlsx/";
      serviceLogger.debug(`XLS PROFESSION Directory: ${professionsDirectory}`);

      await xlsProfessionsParse(client, xlsProfessionsPath);
    }

    serviceLogger.info("XLS files parsed and data inserted into the database");
  } catch (error) {
    logError(error, null, "Failed to parse XLS and insert data");
    throw HttpError(500, `Failed to parse XLS and insert data, ${error}`);
  }
};
