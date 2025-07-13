import { NextFunction, Request, Response } from "express";
import { solarPanelAPI } from "../infrastructure/solar-panel-api";
import { 
  CreateEnergyGenerationRecordDTO, 
  UpdateEnergyGenerationRecordDTO, 
  GetEnergyRecordsByDateRangeDTO,
  GetEnergyRecordsBySolarUnitDTO
} from "../domain/dtos/energy-generation-record";
import ValidationError from "../domain/errors/validation-error";

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

    await solarPanelAPI.energyRecords.create(validationResult.data);
    res.status(201).json({ message: "Energy generation record created successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const getEnergyRecordById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const energyRecord = await solarPanelAPI.energyRecords.getById(id);
    res.status(200).json(energyRecord);
    return;
  } catch (error) {
    next(error);
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

    await solarPanelAPI.energyRecords.update(id, validationResult.data);
    res.status(200).json({ message: "Energy generation record updated successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteEnergyGenerationRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await solarPanelAPI.energyRecords.delete(id);
    res.status(200).json({ message: "Energy generation record deleted successfully" });
    return;
  } catch (error) {
    next(error);
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
    const energyRecords = await solarPanelAPI.energyRecords.getBySolarUnit(solarUnitId, page, limit);
    res.status(200).json(energyRecords);
    return;
  } catch (error) {
    next(error);
  }
};

export const getLatestEnergyRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { solarUnitId } = req.params;
    const energyRecord = await solarPanelAPI.energyRecords.getLatest(solarUnitId);
    res.status(200).json(energyRecord);
    return;
  } catch (error) {
    next(error);
  }
};

export const getTotalEnergyProduced = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { solarUnitId } = req.params;
    const totalEnergy = await solarPanelAPI.energyRecords.getTotalProduced(solarUnitId);
    res.status(200).json(totalEnergy);
    return;
  } catch (error) {
    next(error);
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
    const analytics = await solarPanelAPI.energyRecords.getAnalytics(solarUnitId, period as string);
    res.status(200).json(analytics);
    return;
  } catch (error) {
    next(error);
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

    const energyRecords = await solarPanelAPI.energyRecords.getByDateRange(validationResult.data);
    res.status(200).json(energyRecords);
    return;
  } catch (error) {
    next(error);
  }
}; 