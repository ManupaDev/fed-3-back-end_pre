import { Router } from "express";
import {
  createEnergyGenerationRecord,
  deleteEnergyGenerationRecord,
  getEnergyAnalytics,
  getEnergyRecordById,
  getEnergyRecordsByDateRange,
  getEnergyRecordsBySolarUnit,
  getLatestEnergyRecord,
  getTotalEnergyProduced,
  updateEnergyGenerationRecord
} from "../application/energy-generation-record";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { isAdmin } from "./middlewares/authorization-middleware";
import { syncEnergyRecords } from "./middlewares/energy-record-sync-middleware";

const router = Router();

// Create new energy generation record (admin only)
router.post("/", isAuthenticated, isAdmin, createEnergyGenerationRecord);

// Get energy record by ID (authenticated users only)
router.get("/:id", isAuthenticated, getEnergyRecordById);

// Update energy generation record (admin only)
router.put("/:id", isAuthenticated, isAdmin, updateEnergyGenerationRecord);

// Delete energy generation record (admin only)
router.delete("/:id", isAuthenticated, isAdmin, deleteEnergyGenerationRecord);

// Get energy records by solar unit with pagination (authenticated users only)
router.get("/solar-unit/:solarUnitId", isAuthenticated, syncEnergyRecords,getEnergyRecordsBySolarUnit);

// Get latest energy record for a solar unit (authenticated users only)
router.get("/solar-unit/:solarUnitId/latest", isAuthenticated, getLatestEnergyRecord);

// Get total energy produced for a solar unit (authenticated users only)
router.get("/solar-unit/:solarUnitId/total", isAuthenticated, getTotalEnergyProduced);

// Get energy analytics (daily/weekly/monthly aggregation) (authenticated users only)
router.get("/solar-unit/:solarUnitId/analytics", isAuthenticated, getEnergyAnalytics);

// Get energy records by date range for a specific solar unit (authenticated users only)
router.get("/solar-unit/:solarUnitId/date-range", isAuthenticated, syncEnergyRecords, getEnergyRecordsByDateRange);

export default router; 