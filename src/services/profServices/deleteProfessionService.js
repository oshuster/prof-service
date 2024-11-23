import { logError } from "../../config/logError.js";
import "dotenv/config";
import HttpError from "../../helpers/HttpError.js";

const SCHEMA_NAME = process.env.SCHEMA_NAME || "prof_service";

export const deleteProfessionService = async (client, id) => {
  try {
    // SQL-запит для видалення ітема за ID
    const deleteQuery = `
      DELETE FROM ${SCHEMA_NAME}.professions
      WHERE id = $1
      RETURNING id, code_kp, name
    `;

    // Виконання запиту
    const result = await client.query(deleteQuery, [id]);

    // Перевірка, чи було знайдено і видалено запис
    if (result.rowCount === 0) {
      return null;
    }

    // Повернення даних видаленого ітема
    return result.rows[0];
  } catch (error) {
    console.error("Failed to delete profession", error);
    logError(error, null, "Failed to delete profession");
    throw new Error("Failed to delete profession");
  }
};
