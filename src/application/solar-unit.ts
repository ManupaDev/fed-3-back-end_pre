import { NextFunction, Request, Response } from "express";
import { solarPanelAPI } from "../infrastructure/solar-panel-api";
import { 
  CreateSolarUnitDTO, 
  UpdateSolarUnitDTO, 
  AssignUserToSolarUnitDTO, 
  UpdateSolarUnitStatusDTO 
} from "../domain/dtos/solar-unit";
import ValidationError from "../domain/errors/validation-error";

export const getAllSolarUnits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const solarUnits = await solarPanelAPI.solarUnits.getAll();
    res.status(200).json(solarUnits);
    return;
  } catch (error) {
    next(error);
  }
};

export const getSolarUnitById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const solarUnit = await solarPanelAPI.solarUnits.getById(id);
    res.status(200).json(solarUnit);
    return;
  } catch (error) {
    next(error);
  }
};

export const getSolarUnitsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const solarUnits = await solarPanelAPI.solarUnits.getByUserId(userId);
    res.status(200).json(solarUnits);
    return;
  } catch (error) {
    next(error);
  }
};

export const getSolarUnitsByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.params;
    const solarUnits = await solarPanelAPI.solarUnits.getByStatus(status);
    res.status(200).json(solarUnits);
    return;
  } catch (error) {
    next(error);
  }
};

export const getUnassignedSolarUnits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const solarUnits = await solarPanelAPI.solarUnits.getUnassigned();
    res.status(200).json(solarUnits);
    return;
  } catch (error) {
    next(error);
  }
};

export const createSolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = CreateSolarUnitDTO.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    await solarPanelAPI.solarUnits.create(validationResult.data);
    res.status(201).json({ message: "Solar unit created successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validationResult = UpdateSolarUnitDTO.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    await solarPanelAPI.solarUnits.update(id, validationResult.data);
    res.status(200).json({ message: "Solar unit updated successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSolarUnitStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validationResult = UpdateSolarUnitStatusDTO.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    await solarPanelAPI.solarUnits.updateStatus(id, validationResult.data);
    res.status(200).json({ message: "Solar unit status updated successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const assignUserToSolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validationResult = AssignUserToSolarUnitDTO.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    await solarPanelAPI.solarUnits.assignUser(id, validationResult.data);
    res.status(200).json({ message: "User assigned to solar unit successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const unassignUserFromSolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await solarPanelAPI.solarUnits.unassignUser(id);
    res.status(200).json({ message: "User unassigned from solar unit successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteSolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await solarPanelAPI.solarUnits.delete(id);
    res.status(200).json({ message: "Solar unit deleted successfully" });
    return;
  } catch (error) {
    next(error);
  }
}; 