import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import ForbiddenError from "../domain/errors/forbidden-error";

const SOLAR_PANEL_API_BASE_URL =
  process.env.SOLAR_PANEL_API_URL || "http://localhost:8001";
const SOLARPANEL_API_SECRET = process.env.SOLARPANEL_API_SECRET;

// Helper function to handle HTTP errors and throw appropriate domain errors
const handleHttpError = async (response: Response) => {
  const errorData = await response.json() as { message?: string };
  const errorMessage = `Solar Panel API Error: ${errorData.message}`;

  switch (response.status) {
    case 400:
      throw new ValidationError(errorMessage);
    case 401:
      throw new UnauthorizedError(errorMessage);
    case 403:
      throw new ForbiddenError(errorMessage);
    case 404:
      throw new NotFoundError(errorMessage);
    default:
      throw new Error(errorMessage);
  }
};

export const solarPanelAPI = {
  energyRecords: {
    // Sync energy records from a given timestamp to the latest available
    syncFromTimestamp: async (solarUnitId: string, fromTimestamp: Date) => {
      const queryParams = new URLSearchParams();
      queryParams.append("startDate", fromTimestamp.toISOString());
      // No endDate - will get all records from startDate to latest

      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/solar-unit/${solarUnitId}/date-range?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }

      const data = await response.json();
      return data;
    },
  },
};
