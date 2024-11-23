import express from "express";
import { logRequest } from "../config/logConfig.js";
import { checkQueryParam } from "../helpers/checkQueryParams.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { addUuidMiddleware } from "../middlewares/addUuidMiddleware.js";
import { profController } from "../controllers/searchProfController.js";
import { createProfController } from "../controllers/createProfController.js";
import { deleteProfController } from "../controllers/deleteProfController.js";
import { editProfessionService } from "../services/profServices/editProfessionService.js";
import { editProfessionSchema } from "../schemas/editSchema.js";
import { createProfessionSchema } from "../schemas/createSchema.js";
import { validateRequest } from "../middlewares/validateProfession.js";
import { editProfController } from "../controllers/editProfController.js";

const professionsRouter = express.Router();

professionsRouter.use(addUuidMiddleware);

professionsRouter.use(logRequest);

/**
 * @swagger
 * tags:
 *   name: Professions
 *   description: Операції з професіями
 */

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

professionsRouter.get(
  "/search",
  checkQueryParam(["q"]),
  ctrlWrapper(profController)
);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Додавання професії
 *     description: Додає нову професію в список.
 *     tags: [Professions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profession'
 *     responses:
 *       201:
 *         description: Професія успішно створена.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profession'
 *       400:
 *         description: Помилка валідації даних.
 *       500:
 *         description: Внутрішня помилка сервера.
 */

professionsRouter.post(
  "/create",
  validateRequest(createProfessionSchema),
  ctrlWrapper(createProfController)
);

/**
 * @swagger
 * /delete:
 *   delete:
 *     summary: Видалення професії
 *     description: Видаляє професію за ID.
 *     tags: [Professions]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID професії для видалення
 *     responses:
 *       200:
 *         description: Професія успішно видалена.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profession'
 *       404:
 *         description: Професія не знайдена.
 *       500:
 *         description: Внутрішня помилка сервера.
 */

professionsRouter.delete(
  "/delete",
  checkQueryParam(["id"]),
  ctrlWrapper(deleteProfController)
);

/**
 * @swagger
 * /edit:
 *   patch:
 *     summary: Редагування професії
 *     description: Оновлює професію за ID.
 *     tags: [Professions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditProfession'
 *     responses:
 *       200:
 *         description: Професія успішно оновлена.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profession'
 *       400:
 *         description: Помилка валідації даних.
 *       404:
 *         description: Професія не знайдена.
 *       500:
 *         description: Внутрішня помилка сервера.
 */

professionsRouter.patch(
  "/edit",
  validateRequest(editProfessionSchema),
  ctrlWrapper(editProfController)
);

export default professionsRouter;
