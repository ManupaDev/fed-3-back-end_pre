import "dotenv/config";
import express from "express";
import connectDB from "./infrastructure/db";

import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import solarUnitsRouter from "./api/solar-unit";
import energyRecordsRouter from "./api/energy-generation-record";
import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";
import { handleWebhook } from "./application/payment";
import bodyParser from "body-parser";
import paymentsRouter from "./api/payment";
// Create an Express instance
const app = express();

app.use(clerkMiddleware());
// Middleware to parse JSON data in the request body
app.use(cors({ origin: process.env.FRONTEND_URL }));

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());

app.use("/api/payments", paymentsRouter);
app.use("/api/solar-units", solarUnitsRouter);
app.use("/api/energy-records", energyRecordsRouter);

app.use(globalErrorHandlingMiddleware);

// Define the port to run the server
connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
