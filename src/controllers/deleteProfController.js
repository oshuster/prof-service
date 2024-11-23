import { logError } from "../config/logError.js";
import { deleteProfessionService } from "../services/profServices/deleteProfessionService.js";

export const deleteProfController = async (req, res) => {
  try {
    const result = await deleteProfessionService(req.client, req.query.id);

    if (!result) {
      return res
        .status(404)
        .json({ message: `Profession with ID ${req.query.id} not found` });
    }

    res.json(result);
  } catch (error) {
    console.error("Error in deleteProfController:", error);
    logError(error, req, "Error in deleteProfController");
    res
      .status(500)
      .json({ error: "Failed to delete in classifier of professions" });
  }
};
