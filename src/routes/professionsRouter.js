import express from "express";
import { logRequest } from "../config/logConfig.js";
import { checkQueryParam } from "../helpers/checkQueryParams.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { profController } from "../controllers/profController.js";
import { addUuidMiddleware } from "../middlewares/addUuidMiddleware.js";

const professionsRouter = express.Router();

professionsRouter.use(addUuidMiddleware);

professionsRouter.use(logRequest);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Пошук професій
 *     description: Повертає список професій на основі запиту.
 *     tags: [Professions]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Пошуковий запит для назви або коду професії
 *     responses:
 *       200:
 *         description: Успішний запит. Повертається список професій.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profession'
 *       400:
 *         description: Помилка валідації даних.
 *       500:
 *         description: Внутрішня помилка сервера.
 */

professionsRouter.get("/search", checkQueryParam, ctrlWrapper(profController));

export default professionsRouter;
