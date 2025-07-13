import { z } from "zod";

export const CreateSolarUnitDTO = z.object({
  userId: z.string().optional(),
  serialNumber: z.string().min(1, "Serial number is required"),
  installationDate: z.string().datetime().optional(),
  capacity: z.number().positive("Capacity must be a positive number"),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"]).default("UNASSIGNED"),
});

export const UpdateSolarUnitDTO = z.object({
  userId: z.string().optional(),
  serialNumber: z.string().min(1, "Serial number is required").optional(),
  installationDate: z.string().datetime().optional(),
  capacity: z.number().positive("Capacity must be a positive number").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"]).optional(),
});

export const AssignUserToSolarUnitDTO = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const UpdateSolarUnitStatusDTO = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"]),
});

export type CreateSolarUnitDTOType = z.infer<typeof CreateSolarUnitDTO>;
export type UpdateSolarUnitDTOType = z.infer<typeof UpdateSolarUnitDTO>;
export type AssignUserToSolarUnitDTOType = z.infer<typeof AssignUserToSolarUnitDTO>;
export type UpdateSolarUnitStatusDTOType = z.infer<typeof UpdateSolarUnitStatusDTO>; 