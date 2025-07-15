import { z } from "zod";

export const GetSolarUnitsByUserIdDTO = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  serialNumber: z.string().min(1, "Serial number is required"),
  installationDate: z.string().optional(),
  capacity: z.number().positive("Capacity must be a positive number"),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"]),
});

export const CreateSolarUnitDTO = z.object({
  _id: z.string().optional(),
  userId: z.string().min(1, "User ID is required").optional(),
  serialNumber: z.string().min(1, "Serial number is required"),
  installationDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  capacity: z.number().positive("Capacity must be a positive number"),
  status: z
    .enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"])
    .optional(),
});

export const UpdateSolarUnitDTO = z.object({
  installationDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  capacity: z
    .number()
    .positive("Capacity must be a positive number")
    .optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"])
    .optional(),
});

export const AssignUserToSolarUnitDTO = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT"]).optional(),
});

export const UpdateSolarUnitStatusDTO = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"]),
});

export type CreateSolarUnitType = z.infer<typeof CreateSolarUnitDTO>;
export type UpdateSolarUnitType = z.infer<typeof UpdateSolarUnitDTO>;
export type AssignUserToSolarUnitType = z.infer<
  typeof AssignUserToSolarUnitDTO
>;
export type UpdateSolarUnitStatusDTOType = z.infer<
  typeof UpdateSolarUnitStatusDTO
>;
