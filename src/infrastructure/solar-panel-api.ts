import {
  CreateSolarUnitDTOType,
  UpdateSolarUnitDTOType,
  AssignUserToSolarUnitDTOType,
  UpdateSolarUnitStatusDTOType,
} from "../domain/dtos/solar-unit";
import {
  CreateEnergyGenerationRecordDTOType,
  UpdateEnergyGenerationRecordDTOType,
  GetEnergyRecordsByDateRangeDTOType,
} from "../domain/dtos/energy-generation-record";
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
  solarUnits: {
    getAll: async () => {
      const response = await fetch(`${SOLAR_PANEL_API_BASE_URL}/api/solar-units`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
        },
      });

      if (!response.ok) {
        await handleHttpError(response);
      }

      const data = await response.json();
      return data;
    },

    create: async (data: CreateSolarUnitDTOType) => {
      const response = await fetch(`${SOLAR_PANEL_API_BASE_URL}/api/solar-units`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    getById: async (id: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/${id}`,
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

    getByUserId: async (userId: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/user/${userId}`,
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

    getByStatus: async (status: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/status/${status}`,
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

    getUnassigned: async () => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/unassigned/list`,
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

    update: async (id: string, data: UpdateSolarUnitDTOType) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    updateStatus: async (id: string, data: UpdateSolarUnitStatusDTOType) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    assignUser: async (id: string, data: AssignUserToSolarUnitDTOType) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/${id}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    unassignUser: async (id: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/${id}/unassign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    delete: async (id: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/solar-units/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },
  },

  energyRecords: {
    create: async (data: CreateEnergyGenerationRecordDTOType) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    getById: async (id: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/${id}`,
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

    update: async (id: string, data: UpdateEnergyGenerationRecordDTOType) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    delete: async (id: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SOLARPANEL_API_SECRET}`,
          },
        }
      );

      if (!response.ok) {
        await handleHttpError(response);
      }
    },

    getBySolarUnit: async (solarUnitId: string, page: number = 1, limit: number = 10) => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/solar-unit/${solarUnitId}?${queryParams}`,
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

    getLatest: async (solarUnitId: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/solar-unit/${solarUnitId}/latest`,
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

    getTotalProduced: async (solarUnitId: string) => {
      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/solar-unit/${solarUnitId}/total`,
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

    getAnalytics: async (solarUnitId: string, period: string = "daily") => {
      const queryParams = new URLSearchParams({ period });

      const response = await fetch(
        `${SOLAR_PANEL_API_BASE_URL}/api/energy-records/solar-unit/${solarUnitId}/analytics?${queryParams}`,
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

    getByDateRange: async (solarUnitId: string, startDate: string, endDate: string) => {
      const queryParams = new URLSearchParams();
      queryParams.append("startDate", startDate);
      queryParams.append("endDate", endDate);

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
