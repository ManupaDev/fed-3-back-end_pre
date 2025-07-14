import { z } from "zod";

export const CreateEnergyGenerationRecordDTO = z.object({
  solarUnitId: z.string().min(1, "Solar unit ID is required"),
  timestamp: z.string().datetime().optional(),
  energyProduced: z.number().min(0, "Energy produced cannot be negative"),
  intervalHours: z.number().min(0.1, "Interval must be at least 6 minutes").max(24, "Interval cannot exceed 24 hours").default(2),
});

export const UpdateEnergyGenerationRecordDTO = z.object({
  solarUnitId: z.string().min(1, "Solar unit ID is required").optional(),
  timestamp: z.string().datetime().optional(),
  energyProduced: z.number().min(0, "Energy produced cannot be negative").optional(),
  intervalHours: z.number().min(0.1, "Interval must be at least 6 minutes").max(24, "Interval cannot exceed 24 hours").optional(),
});

export const GetEnergyRecordsByDateRangeDTO = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const GetEnergyRecordsBySolarUnitDTO = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default("1"),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default("10"),
});

export type CreateEnergyGenerationRecordDTOType = z.infer<typeof CreateEnergyGenerationRecordDTO>;
export type UpdateEnergyGenerationRecordDTOType = z.infer<typeof UpdateEnergyGenerationRecordDTO>;
export type GetEnergyRecordsByDateRangeDTOType = z.infer<typeof GetEnergyRecordsByDateRangeDTO>;
export type GetEnergyRecordsBySolarUnitDTOType = z.infer<typeof GetEnergyRecordsBySolarUnitDTO>; 