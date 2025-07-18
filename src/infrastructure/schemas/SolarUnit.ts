import mongoose from "mongoose";

const solarUnitSchema = new mongoose.Schema({
  userId: {
    type: String,
    // removed required: true to make it optional
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  installationDate: {
    type: Date,
  },
  capacity: {
    type: Number, // in watts
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "MAINTENANCE", "FAULT", "UNASSIGNED"],
    default: "UNASSIGNED", // Default status for units not assigned to users
  },
});

const SolarUnit = mongoose.model("SolarUnit", solarUnitSchema);

export default SolarUnit; 