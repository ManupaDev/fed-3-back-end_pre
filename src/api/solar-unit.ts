import { Router } from "express";
import {
  getAllSolarUnits,
  getSolarUnitById,
  getSolarUnitsByUserId,
  createSolarUnit,
  updateSolarUnit,
  deleteSolarUnit,
  getSolarUnitsByStatus,
  updateSolarUnitStatus,
  assignUserToSolarUnit,
  unassignUserFromSolarUnit,
  getUnassignedSolarUnits,
} from "../application/solar-unit";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { isAdmin } from "./middlewares/authorization-middleware";

const router = Router();

// Get all solar units (authenticated users only)
router.get("/", isAuthenticated, getAllSolarUnits);

// Get solar unit by ID (authenticated users only)
router.get("/:id", isAuthenticated, getSolarUnitById);

// Get solar units by user ID (authenticated users only)
router.get("/user/:userId", isAuthenticated, getSolarUnitsByUserId);

// Get solar units by status (authenticated users only)
router.get("/status/:status", isAuthenticated, getSolarUnitsByStatus);

// Get unassigned solar units (admin only)
router.get("/unassigned/list", isAuthenticated, isAdmin, getUnassignedSolarUnits);

// Create new solar unit (admin only)
router.post("/", isAuthenticated, isAdmin, createSolarUnit);

// Update solar unit (admin only)
router.put("/:id", isAuthenticated, isAdmin, updateSolarUnit);

// Update solar unit status only (admin only)
router.patch("/:id/status", isAuthenticated, isAdmin, updateSolarUnitStatus);

// Assign user to solar unit (admin only)
router.patch("/:id/assign", isAuthenticated, isAdmin, assignUserToSolarUnit);

// Unassign user from solar unit (admin only)
router.patch("/:id/unassign", isAuthenticated, isAdmin, unassignUserFromSolarUnit);

// Delete solar unit (admin only)
router.delete("/:id", isAuthenticated, isAdmin, deleteSolarUnit);

export default router; 