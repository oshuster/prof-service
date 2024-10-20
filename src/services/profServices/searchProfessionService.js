import { logError } from "../../config/logError.js";
import "dotenv/config";

const SCHEMA_NAME = process.env.SCHEMA_NAME || "prof_service";

export const searchProfessionService = async (client, query) => {
  try {
    const searchQuery = `
      SELECT id, code_kp, name
      FROM ${SCHEMA_NAME}.professions
      WHERE code_kp ILIKE $1
      OR name ILIKE $2
    `;

    const results = await client.query(searchQuery, [
      `%${query}%`,
      `%${query}%`,
    ]);

    // Форматування результатів
    const formattedResults = results.rows.map((row) => ({
      id: row.id,
      code_kp: row.code_kp,
      name: row.name,
    }));

    return formattedResults;
  } catch (error) {
    console.error("Failed to search professions", error);
    logError(error, null, "Failed to search professions");
    throw new Error("Failed to search professions");
  }
};
