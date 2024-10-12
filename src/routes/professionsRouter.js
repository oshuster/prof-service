import express from "express";
import { logRequest } from "../config/logConfig.js";
import { checkQueryParam } from "../helpers/checkQueryParams.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { profController } from "../controllers/profController.js";

const professionsRouter = express.Router();

professionsRouter.use(logRequest);

/**
 * @swagger
 * /make-pdf:
 *   post:
 *     summary: Генерація PDF документів
 *     description: Генерує PDF документ на основі даних, переданих у запиті.
 *     tags: [PDF Generation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PdfRequest'
 *     responses:
 *       200:
 *         description: Успішна генерація PDF.
 *       400:
 *         description: Помилка валідації даних.
 *       500:
 *         description: Внутрішня помилка сервера.
 */

professionsRouter.get("/search", checkQueryParam, ctrlWrapper(profController));

export default professionsRouter;
