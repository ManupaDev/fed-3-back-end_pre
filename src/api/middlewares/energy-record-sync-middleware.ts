import e, { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";
import { getAuth } from "@clerk/express";
import SolarUnit from "../../infrastructure/schemas/SolarUnit";
import NotFoundError from "../../domain/errors/not-found-error";
import EnergyGenerationRecord from "../../infrastructure/schemas/EnergyGenerationRecord";
import { solarPanelAPI } from "../../infrastructure/solar-panel-api";

export const syncEnergyRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const { userId } = getAuth(req);
  const userId = "user_test123";
  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }
  const solarUnit = await SolarUnit.findOne({ userId });
  if (!solarUnit) {
    throw new NotFoundError("Solar unit not found");
  }

  const latestRecord = await EnergyGenerationRecord.findOne({
    solarUnitId: solarUnit._id,
  }).sort({ timestamp: -1 });

  if (!latestRecord) {
    const energyRecords = await solarPanelAPI.energyRecords.getAll(
      solarUnit._id.toString()
    );

    await EnergyGenerationRecord.insertMany(
      energyRecords.map((record) => ({
        _id: record._id,
        solarUnitId: solarUnit._id,
        timestamp: record.timestamp,
        energyProduced: record.energyProduced,
        intervalHours: record.intervalHours,
      }))
    );
    next();
    return;
  }

  const energyRecords = await solarPanelAPI.energyRecords.syncFromTimestamp(
    solarUnit._id.toString(),
    latestRecord.timestamp
  );

  await EnergyGenerationRecord.insertMany(
    energyRecords.map((record) => ({
      _id: record._id,
      solarUnitId: solarUnit._id,
      timestamp: record.timestamp,
      energyProduced: record.energyProduced,
      intervalHours: record.intervalHours,
    }))
  );
  next();
  //   await EnergyGenerationRecord.insertMany(energyRecords.map);
};
