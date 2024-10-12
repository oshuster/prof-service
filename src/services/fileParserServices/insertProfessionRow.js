import "dotenv/config";
import { migrationLogger } from "../../config/logConfig.js";
import { cleanField } from "../../helpers/cleanField.js";

const SCHEMA_NAME = process.env.SCHEMA_NAME || "prof_service";

export const insertProfessionRow = async (client, row, index) => {
  const codeKp = cleanField(row["КОД КП "]);
  const name = cleanField(row["ПРОФЕСІЙНА НАЗВА РОБОТИ "]);

  if (!codeKp || !name) {
    migrationLogger.warn(
      `Skipping row ${index} due to missing data: CODE KP or NAME`
    );
    return;
  }

  try {
    const insertQuery = `
      INSERT INTO ${SCHEMA_NAME}.professions (code_kp, name)
      VALUES ($1, $2)
    `;
    await client.query(insertQuery, [codeKp, name]);

    migrationLogger.info(
      `Data inserted: ID: ${index + 1}, CODE KP: ${codeKp}, NAME: ${name}`
    );
  } catch (err) {
    migrationLogger.error(`Failed to insert row at index ${index}:`, err);
  }
};
