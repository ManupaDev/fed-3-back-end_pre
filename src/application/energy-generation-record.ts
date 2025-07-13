import { NextFunction, Request, Response } from "express";
import { energyRecordService } from "../infrastructure/solar-panel-api";
import { 
  CreateEnergyGenerationRecordDTO, 
  UpdateEnergyGenerationRecordDTO, 
  GetEnergyRecordsByDateRangeDTO,
  GetEnergyRecordsBySolarUnitDTO
} from "../domain/dtos/energy-generation-record";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";

export const createEnergyGenerationRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = CreateEnergyGenerationRecordDTO.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const energyRecord = await energyRecordService.createEnergyRecord(validationResult.data);
    res.status(201).json(energyRecord);
    return;
  } catch (error: any) {
    if (error.response?.status === 400) {
      next(new ValidationError(error.response.data.message || "Invalid input data"));
    } else if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar unit not found"));
    } else {
      next(error);
    }
  }
};

export const getEnergyRecordById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const energyRecord = await energyRecordService.getEnergyRecordById(id);
    res.status(200).json(energyRecord);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Energy record not found"));
    } else {
      next(error);
    }
  }
};

export const updateEnergyGenerationRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validationResult = UpdateEnergyGenerationRecordDTO.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const energyRecord = await energyRecordService.updateEnergyRecord(id, validationResult.data);
    res.status(200).json(energyRecord);
    return;
  } catch (error: any) {
    if (error.response?.status === 400) {
      next(new ValidationError(error.response.data.message || "Invalid input data"));
    } else if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Energy record not found"));
    } else {
      next(error);
    }
  }
};

export const deleteEnergyGenerationRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await energyRecordService.deleteEnergyRecord(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Energy record not found"));
    } else {
      next(error);
    }
  }
};

export const getEnergyRecordsBySolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { solarUnitId } = req.params;
    const validationResult = GetEnergyRecordsBySolarUnitDTO.safeParse(req.query);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const { page, limit } = validationResult.data;
    const energyRecords = await energyRecordService.getEnergyRecordsBySolarUnit(solarUnitId, page, limit);
    res.status(200).json(energyRecords);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Energy records not found"));
    } else {
      next(error);
    }
  }
};

export const getLatestEnergyRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { solarUnitId } = req.params;
    const energyRecord = await energyRecordService.getLatestEnergyRecord(solarUnitId);
    res.status(200).json(energyRecord);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "No energy records found"));
    } else {
      next(error);
    }
  }
};

export const getTotalEnergyProduced = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { solarUnitId } = req.params;
    const totalEnergy = await energyRecordService.getTotalEnergyProduced(solarUnitId);
    res.status(200).json(totalEnergy);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "No energy records found"));
    } else {
      next(error);
    }
  }
};

export const getEnergyAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { solarUnitId } = req.params;
    const { period } = req.query;
    const analytics = await energyRecordService.getEnergyAnalytics(solarUnitId, period as string);
    res.status(200).json(analytics);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "No energy records found"));
    } else {
      next(error);
    }
  }
};

export const getEnergyRecordsByDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = GetEnergyRecordsByDateRangeDTO.safeParse(req.query);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const energyRecords = await energyRecordService.getEnergyRecordsByDateRange(validationResult.data);
    res.status(200).json(energyRecords);
    return;
  } catch (error: any) {
    if (error.response?.status === 400) {
      next(new ValidationError(error.response.data.message || "Invalid date range"));
    } else if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "No energy records found"));
    } else {
      next(error);
    }
  }
}; 