import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "@/src/routes/v1/routes";
import fs from "fs";
import path from "path";
import loggerMiddleware from "./middleware/logger.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error-handle-middleware";


// Dynamically load swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "docs/swagger.json"), "utf8")
);

// ========================
// Initialize App Express
// ========================
export const app = express();

// ========================
// Global Middleware
// ========================
app.use(express.json()); // Help to get the json from request body

app.use(loggerMiddleware);

// ========================
// Global API V1
// ========================
RegisterRoutes(app);

// ========================
// API Documentations
// ========================
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
