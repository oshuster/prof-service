import { logError } from "../config/logError.js";
import { createProfessionService } from "../services/profServices/createProfessionService.js";

export const createProfController = async (req, res) => {
  try {
    const result = await createProfessionService(req.client, req.body);

    res.json(result);
  } catch (error) {
    console.error("Error in profController:", error);
    logError(error, req, "Error in profController");
    res
      .status(500)
      .json({ error: "Failed to create in classifier of professions" });
  }
};
