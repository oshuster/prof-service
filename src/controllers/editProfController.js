import { logError } from "../config/logError.js";
import { editProfessionService } from "../services/profServices/editProfessionService.js";

export const editProfController = async (req, res) => {
  try {
    const result = await editProfessionService(req.client, req.body);

    if (!result) {
      return res
        .status(404)
        .json({ message: `Profession with ID ${req.body.id} not found` });
    }

    res.json(result);
  } catch (error) {
    console.error("Error in profController:", error);
    logError(error, req, "Error in profController");
    res
      .status(500)
      .json({ error: "Failed to create in classifier of professions" });
  }
};
