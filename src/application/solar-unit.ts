import { NextFunction, Request, Response } from "express";
import { solarUnitService } from "../infrastructure/solar-panel-api";
import { 
  CreateSolarUnitDTO, 
  UpdateSolarUnitDTO, 
  AssignUserToSolarUnitDTO, 
  UpdateSolarUnitStatusDTO 
} from "../domain/dtos/solar-unit";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";

export const getAllSolarUnits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const solarUnits = await solarUnitService.getAllSolarUnits();
    res.status(200).json(solarUnits);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar units not found"));
    } else {
      next(error);
    }
  }
};

export const getSolarUnitById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const solarUnit = await solarUnitService.getSolarUnitById(id);
    res.status(200).json(solarUnit);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar unit not found"));
    } else {
      next(error);
    }
  }
};

export const getSolarUnitsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const solarUnits = await solarUnitService.getSolarUnitsByUserId(userId);
    res.status(200).json(solarUnits);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar units not found"));
    } else {
      next(error);
    }
  }
};

export const getSolarUnitsByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.params;
    const solarUnits = await solarUnitService.getSolarUnitsByStatus(status);
    res.status(200).json(solarUnits);
    return;
  } catch (error: any) {
    if (error.response?.status === 400) {
      next(new ValidationError(error.response.data.message || "Invalid status"));
    } else if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar units not found"));
    } else {
      next(error);
    }
  }
};

export const getUnassignedSolarUnits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const solarUnits = await solarUnitService.getUnassignedSolarUnits();
    res.status(200).json(solarUnits);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "No unassigned solar units found"));
    } else {
      next(error);
    }
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

    const solarUnit = await solarUnitService.createSolarUnit(validationResult.data);
    res.status(201).json(solarUnit);
    return;
  } catch (error: any) {
    if (error.response?.status === 400) {
      next(new ValidationError(error.response.data.message || "Invalid input data"));
    } else {
      next(error);
    }
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

    const solarUnit = await solarUnitService.updateSolarUnit(id, validationResult.data);
    res.status(200).json(solarUnit);
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

    const solarUnit = await solarUnitService.updateSolarUnitStatus(id, validationResult.data);
    res.status(200).json(solarUnit);
    return;
  } catch (error: any) {
    if (error.response?.status === 400) {
      next(new ValidationError(error.response.data.message || "Invalid status"));
    } else if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar unit not found"));
    } else {
      next(error);
    }
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

    const solarUnit = await solarUnitService.assignUserToSolarUnit(id, validationResult.data);
    res.status(200).json(solarUnit);
    return;
  } catch (error: any) {
    if (error.response?.status === 400) {
      next(new ValidationError(error.response.data.message || "Invalid user ID"));
    } else if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar unit not found"));
    } else {
      next(error);
    }
  }
};

export const unassignUserFromSolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const solarUnit = await solarUnitService.unassignUserFromSolarUnit(id);
    res.status(200).json(solarUnit);
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar unit not found"));
    } else {
      next(error);
    }
  }
};

export const deleteSolarUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await solarUnitService.deleteSolarUnit(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    if (error.response?.status === 404) {
      next(new NotFoundError(error.response.data.message || "Solar unit not found"));
    } else {
      next(error);
    }
  }
}; 