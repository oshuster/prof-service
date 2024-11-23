import { logError } from "../../config/logError.js";
import "dotenv/config";

const SCHEMA_NAME = process.env.SCHEMA_NAME || "prof_service";

export const createProfessionService = async (client, professionData) => {
  try {
    // SQL-запит для вставки нового ітема
    const insertQuery = `
      INSERT INTO ${SCHEMA_NAME}.professions (code_kp, name)
      VALUES ($1, $2)
      RETURNING id, code_kp, name
    `;

    // Виконання запиту
    const result = await client.query(insertQuery, [
      professionData.code_kp,
      professionData.name,
    ]);

    // Повернення створеного ітема
    return {
      id: result.rows[0].id,
      code_kp: result.rows[0].code_kp,
      name: result.rows[0].name,
    };
  } catch (error) {
    console.error("Failed to create profession", error);
    logError(error, null, "Failed to create profession");
    throw new Error("Failed to create profession");
  }
};
