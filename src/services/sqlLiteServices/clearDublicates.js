import { migrationLogger } from "../../config/logConfig.js";
import { logError } from "../../config/logError.js";
import "dotenv/config";

const SCHEMA_NAME = process.env.SCHEMA_NAME || "prof_service";

export const clearDuplicates = async (client) => {
  try {
    await client.query("BEGIN");

    const countDuplicatesQuery = `
      SELECT SUM(count) - COUNT(*) AS total_duplicates
      FROM (
          SELECT code_kp, name, COUNT(*) AS count
          FROM ${SCHEMA_NAME}.professions
          GROUP BY code_kp, name
          HAVING COUNT(*) > 1
      ) sub;
    `;

    const clearQuery = `
      WITH duplicates AS (
        SELECT
          id,
          code_kp,
          name,
          ROW_NUMBER() OVER (
            PARTITION BY code_kp, name
            ORDER BY id ASC
          ) as rn
        FROM ${SCHEMA_NAME}.professions
      )
      DELETE FROM ${SCHEMA_NAME}.professions
      WHERE id IN (
        SELECT id
        FROM duplicates
        WHERE rn > 1
      );
    `;

    migrationLogger.info(`STARTING DUPLICATE CLEARING`);

    const countDuplicatesResult = await client.query(countDuplicatesQuery);
    const totalDuplicates = countDuplicatesResult.rows[0].total_duplicates;

    migrationLogger.info(`Found duplicates: ${totalDuplicates}`);

    if (parseInt(totalDuplicates, 10) > 0) {
      await client.query(clearQuery);
      migrationLogger.info(`Duplicates cleared successfully`);
    } else {
      migrationLogger.info(`No duplicates found`);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to clear duplicates", error);
    migrationLogger.error("Failed to clear duplicates", error);
    logError(error, null, "Failed to clear duplicates");
    throw new Error("Failed to clear duplicates");
  }
};
