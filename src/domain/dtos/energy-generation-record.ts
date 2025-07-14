import { z } from "zod";

export const CreateEnergyGenerationRecordDTO = z.object({
  solarUnitId: z.string().min(1, "Solar unit ID is required"),
  timestamp: z.string().transform((str) => new Date(str)).optional(),
  energyProduced: z.number().min(0, "Energy produced must be non-negative"),
  intervalHours: z.number().min(0.1).max(24, "Interval must be between 0.1 and 24 hours").optional(),
});

export const UpdateEnergyGenerationRecordDTO = z.object({
  timestamp: z.string().transform((str) => new Date(str)).optional(),
  energyProduced: z.number().min(0, "Energy produced must be non-negative").optional(),
  intervalHours: z.number().min(0.1).max(24, "Interval must be between 0.1 and 24 hours").optional(),
});

export const GetEnergyRecordsByDateRangeDTO = z.object({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)).optional(),
});

export const GetEnergyRecordsBySolarUnitDTO = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default("1"),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default("10"),
});

export type CreateEnergyGenerationRecordType = z.infer<typeof CreateEnergyGenerationRecordDTO>;
export type UpdateEnergyGenerationRecordType = z.infer<typeof UpdateEnergyGenerationRecordDTO>;
export type GetEnergyRecordsByDateRangeType = z.infer<typeof GetEnergyRecordsByDateRangeDTO>;
export type GetEnergyRecordsBySolarUnitDTOType = z.infer<typeof GetEnergyRecordsBySolarUnitDTO>; 