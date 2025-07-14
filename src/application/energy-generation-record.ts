import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import EnergyGenerationRecord from "../infrastructure/schemas/EnergyGenerationRecord";
import SolarUnit from "../infrastructure/schemas/SolarUnit";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { 
  CreateEnergyGenerationRecordDTO, 
  UpdateEnergyGenerationRecordDTO,
  GetEnergyRecordsByDateRangeDTO,
  GetEnergyRecordsBySolarUnitDTO
} from "../domain/dtos/energy-generation-record";
import { solarPanelAPI } from "../infrastructure/solar-panel-api";

// Type definitions for internal use
interface EnergyRecordData {
  solarUnitId: string | mongoose.Types.ObjectId;
  energyProduced: number;
  intervalHours: number;
  timestamp?: Date;
}

interface DateRangeFilter {
  timestamp: {
    $gte: Date;
    $lte?: Date;
  };
  solarUnitId: string | mongoose.Types.ObjectId;
}

interface GroupByDaily {
  year: { $year: string };
  month: { $month: string };
  day: { $dayOfMonth: string };
}

interface GroupByWeekly {
  year: { $year: string };
  week: { $week: string };
}

interface GroupByMonthly {
  year: { $year: string };
  month: { $month: string };
}

type GroupBy = GroupByDaily | GroupByWeekly | GroupByMonthly;

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

    const recordData = validationResult.data;

    // Verify solar unit exists
    const solarUnit = await SolarUnit.findById(recordData.solarUnitId);
    if (!solarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    const energyRecordData: EnergyRecordData = {
      solarUnitId: recordData.solarUnitId,
      energyProduced: recordData.energyProduced,
      intervalHours: recordData.intervalHours || 2,
    };

    // Only set timestamp if provided, otherwise let schema default to Date.now
    if (recordData.timestamp) {
      energyRecordData.timestamp = recordData.timestamp;
    }

    const energyRecord = new EnergyGenerationRecord(energyRecordData);

    await energyRecord.save();
    res.status(201).json(energyRecord);
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

    const records = await EnergyGenerationRecord.find({ solarUnitId })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('solarUnitId', 'serialNumber capacity');

    const totalRecords = await EnergyGenerationRecord.countDocuments({ solarUnitId });

    res.status(200).json({
      records,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalRecords,
        pages: Math.ceil(totalRecords / Number(limit)),
      },
    });
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
    const { solarUnitId } = req.params;
    const validationResult = GetEnergyRecordsByDateRangeDTO.safeParse(req.query);

    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.message);
    }

    const { startDate, endDate } = validationResult.data;

    // Verify solar unit exists
    const solarUnit = await SolarUnit.findById(solarUnitId);
    if (!solarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    const filter: DateRangeFilter = {
      timestamp: {
        $gte: startDate,
        // Only add $lte if endDate is provided
        ...(endDate && { $lte: endDate }),
      },
      solarUnitId: solarUnitId,
    };

    const records = await EnergyGenerationRecord.find(filter)
      .sort({ timestamp: -1 })
      .populate('solarUnitId', 'serialNumber capacity');

    res.status(200).json(records);
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
    const record = await EnergyGenerationRecord.findById(id)
      .populate('solarUnitId', 'serialNumber capacity status');

    if (!record) {
      throw new NotFoundError("Energy generation record not found");
    }

    res.status(200).json(record);
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

    const updateData = validationResult.data;

    const updatedRecord = await EnergyGenerationRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('solarUnitId', 'serialNumber capacity');

    if (!updatedRecord) {
      throw new NotFoundError("Energy generation record not found");
    }

    res.status(200).json(updatedRecord);
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
    const deletedRecord = await EnergyGenerationRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      throw new NotFoundError("Energy generation record not found");
    }

    res.status(200).json({ message: "Energy generation record deleted successfully" });
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

    const latestRecord = await EnergyGenerationRecord.findOne({ solarUnitId })
      .sort({ timestamp: -1 })
      .populate('solarUnitId', 'serialNumber capacity');

    if (!latestRecord) {
      throw new NotFoundError("No energy generation records found for this solar unit");
    }

    res.status(200).json(latestRecord);
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
    const { period = 'daily' } = req.query; // daily, weekly, monthly

    // Define date grouping based on period
    let groupBy: GroupBy;
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$timestamp' },
          week: { $week: '$timestamp' },
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
        };
        break;
      default:
        throw new ValidationError("Invalid period. Use 'daily', 'weekly', or 'monthly'");
    }

    const analytics = await EnergyGenerationRecord.aggregate([
      { $match: { solarUnitId: new mongoose.Types.ObjectId(solarUnitId) } },
      {
        $group: {
          _id: groupBy,
          totalEnergyProduced: { $sum: '$energyProduced' },
          recordCount: { $sum: 1 },
          maxEnergyProduced: { $max: '$energyProduced' },
          minEnergyProduced: { $min: '$energyProduced' },
          averageEnergyProduced: { $avg: '$energyProduced' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1, '_id.week': -1 } },
      { $limit: 30 }, // Limit to last 30 periods
    ]);

    res.status(200).json({
      period,
      analytics,
    });
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

    const totalStats = await EnergyGenerationRecord.aggregate([
      { $match: { solarUnitId: new mongoose.Types.ObjectId(solarUnitId) } },
      {
        $group: {
          _id: null,
          totalEnergyProduced: { $sum: '$energyProduced' },
          totalRecords: { $sum: 1 },
          averageEnergyProduced: { $avg: '$energyProduced' },
          firstRecord: { $min: '$timestamp' },
          lastRecord: { $max: '$timestamp' },
        },
      },
    ]);

    if (totalStats.length === 0) {
      throw new NotFoundError("No energy generation records found for this solar unit");
    }

    res.status(200).json(totalStats[0]);
    return;
  } catch (error) {
    next(error);
  }
}; 

export const syncEnergyRecordsFromTimestamp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { solarUnitId } = req.params;
    const { fromTimestamp } = req.body;

    if (!fromTimestamp) {
      throw new ValidationError("fromTimestamp is required");
    }

    // Verify solar unit exists in our local database
    const solarUnit = await SolarUnit.findById(solarUnitId);
    if (!solarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    // Convert timestamp string to Date object
    const timestampDate = new Date(fromTimestamp);
    if (isNaN(timestampDate.getTime())) {
      throw new ValidationError("Invalid timestamp format");
    }

    // Fetch energy records from the solar panel API service
    const energyRecordsFromAPI = await solarPanelAPI.energyRecords.syncFromTimestamp(
      solarUnitId, 
      timestampDate
    ) as Array<{
      solarUnitId: string;
      timestamp: string;
      energyProduced: number;
      intervalHours?: number;
    }>;

    // Save the fetched records to our local database
    let savedCount = 0;
    let skippedCount = 0;

    for (const record of energyRecordsFromAPI) {
      try {
        // Check if record already exists (to avoid duplicates)
        const existingRecord = await EnergyGenerationRecord.findOne({
          solarUnitId: record.solarUnitId,
          timestamp: new Date(record.timestamp),
          energyProduced: record.energyProduced
        });

        if (!existingRecord) {
          // Create new energy record
          const newRecord = new EnergyGenerationRecord({
            solarUnitId: record.solarUnitId,
            timestamp: new Date(record.timestamp),
            energyProduced: record.energyProduced,
            intervalHours: record.intervalHours || 2
          });

          await newRecord.save();
          savedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        // Log individual record errors but continue with others
        console.error(`Error saving energy record:`, error);
      }
    }

    res.status(200).json({
      message: "Energy records sync completed",
      totalFetched: energyRecordsFromAPI.length,
      savedCount,
      skippedCount,
      fromTimestamp: timestampDate.toISOString(),
      syncedAt: new Date().toISOString()
    });
    return;
  } catch (error) {
    next(error);
  }
}; 