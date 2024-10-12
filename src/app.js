import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { swaggerDocs } from "./config/swaggerConfig.js";
import professionsRouter from "./routes/professionsRouter.js";
import { initializeDatabase } from "./services/sqlLiteServices/dbInit.js";
import { logError } from "./config/logError.js";
import { serviceLogger } from "./config/logConfig.js";

const HTTP_PORT = process.env.PORT || 3344;
const app = express();
let client;

const startServer = async () => {
  try {
    // створення БД
    client = await initializeDatabase();
    // парсимо exel
    // Якщо база успішно створена, налаштовуємо сервер
    app.use(morgan("tiny"));
    app.use(
      cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
      })
    );
    app.use(express.json());

    app.use(
      "/api/professions",
      (req, res, next) => {
        req.client = client;
        next();
      },
      professionsRouter
    );

    swaggerDocs(app, HTTP_PORT);

    app.use((_, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    app.use((err, req, res, next) => {
      const { status = 500, message = "Server error" } = err;
      res.status(status).json({ message });
    });

    app.listen(HTTP_PORT, () => {
      serviceLogger.info(
        `HTTP Server is running. Use our API on port: ${HTTP_PORT}`
      );
      console.log(`HTTP Server is running. Use our API on port: ${HTTP_PORT}`);
    });
  } catch (error) {
    // Логуємо та виводимо помилку, якщо база даних не створилася
    logError(error, null, "Failed to start the server");
    console.error("Failed to start the server", error);
  }
};

startServer();

process.on("SIGINT", async () => {
  try {
    await client.end();
    console.log("PostgreSQL client disconnected gracefully");
    process.exit(0);
  } catch (error) {
    console.error("Error during disconnection", error);
    process.exit(1);
  }
});
