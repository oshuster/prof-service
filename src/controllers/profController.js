import { logError } from "../config/logError.js";
import { searchProfessionService } from "../services/profServices/searchProfessionService.js";

export const profController = async (req, res) => {
  try {
    const result = await searchProfessionService(req.client, req.query.q);

    res.json(result);
  } catch (error) {
    console.error("Error in profController:", error);
    logError(error, req, "Error in profController");
    res
      .status(500)
      .json({ error: "Failed to search in classifier of professions" });
  }
};
