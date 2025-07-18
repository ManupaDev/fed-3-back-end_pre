import { NextFunction, Request, Response } from "express";

import SolarUnit from "../infrastructure/schemas/SolarUnit";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { 
  CreateSolarUnitDTO, 
  UpdateSolarUnitDTO, 
  AssignUserToSolarUnitDTO, 
  UpdateSolarUnitStatusDTO 
} from "../domain/dtos/solar-unit";

export const getAllSolarUnits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const solarUnits = await SolarUnit.find();
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
    const solarUnitId = req.params.id;
    const solarUnit = await SolarUnit.findById(solarUnitId);
    if (!solarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

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
    const userId = req.params.userId;
    const solarUnits = await SolarUnit.find({ userId: userId });
    
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
    // Validate input using Zod schema
    const validationResult = CreateSolarUnitDTO.safeParse(req.body);

    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const solarUnitData = validationResult.data;

    // Create the solar unit
    const solarUnit = new SolarUnit({
      _id: solarUnitData._id,
      userId: solarUnitData.userId,
      serialNumber: solarUnitData.serialNumber,
      installationDate: solarUnitData.installationDate,
      capacity: solarUnitData.capacity,
      status: solarUnitData.status || "UNASSIGNED",
    });

    await solarUnit.save();
    res.status(201).json(solarUnit);
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
    const solarUnitId = req.params.id;
    
    // Validate input using Zod schema
    const validationResult = UpdateSolarUnitDTO.safeParse(req.body);

    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const updateData = validationResult.data;

    // Find and update the solar unit
    const updatedSolarUnit = await SolarUnit.findByIdAndUpdate(
      solarUnitId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSolarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    res.status(200).json(updatedSolarUnit);
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
    const solarUnitId = req.params.id;
    const deletedSolarUnit = await SolarUnit.findByIdAndDelete(solarUnitId);

    if (!deletedSolarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    res.status(200).json({ message: "Solar unit deleted successfully" });
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
    const status = req.params.status.toUpperCase();
    
    // Validate status
    if (!["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"].includes(status)) {
      throw new ValidationError("Invalid status. Must be one of: ACTIVE, INACTIVE, MAINTENANCE, FAULT, UNASSIGNED");
    }

    const solarUnits = await SolarUnit.find({ status: status });
    
    res.status(200).json(solarUnits);
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
    const solarUnitId = req.params.id;
    const validationResult = UpdateSolarUnitStatusDTO.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const { status } = validationResult.data;

    const updatedSolarUnit = await SolarUnit.findByIdAndUpdate(
      solarUnitId,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedSolarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    res.status(200).json(updatedSolarUnit);
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
    const solarUnitId = req.params.id;
    
    // Validate input using Zod schema
    const validationResult = AssignUserToSolarUnitDTO.safeParse(req.body);

    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const { userId, status } = validationResult.data;

    // Find the solar unit
    const solarUnit = await SolarUnit.findById(solarUnitId);
    if (!solarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    // Check if solar unit is already assigned to a user
    if (solarUnit.userId && solarUnit.userId !== userId) {
      throw new ValidationError("Solar unit is already assigned to another user");
    }

    // Update the solar unit with user assignment
    const updatedSolarUnit = await SolarUnit.findByIdAndUpdate(
      solarUnitId,
      { 
        userId: userId,
        status: status || "INACTIVE" // Default to INACTIVE when assigned
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "User assigned to solar unit successfully",
      solarUnit: updatedSolarUnit
    });
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
    const solarUnitId = req.params.id;

    // Find the solar unit
    const solarUnit = await SolarUnit.findById(solarUnitId);
    if (!solarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    // Check if solar unit is assigned to a user
    if (!solarUnit.userId) {
      throw new ValidationError("Solar unit is not assigned to any user");
    }

    // Remove user assignment and set status to UNASSIGNED
    const updatedSolarUnit = await SolarUnit.findByIdAndUpdate(
      solarUnitId,
      { 
        userId: null,
        status: "UNASSIGNED"
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "User unassigned from solar unit successfully",
      solarUnit: updatedSolarUnit
    });
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
    const unassignedSolarUnits = await SolarUnit.find({ 
      $or: [
        { userId: null },
        { userId: { $exists: false } },
        { status: "UNASSIGNED" }
      ]
    });
    
    res.status(200).json(unassignedSolarUnits);
    return;
  } catch (error) {
    next(error);
  }
}; 