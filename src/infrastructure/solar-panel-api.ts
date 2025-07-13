import { 
  CreateSolarUnitDTOType, 
  UpdateSolarUnitDTOType, 
  AssignUserToSolarUnitDTOType, 
  UpdateSolarUnitStatusDTOType 
} from "../domain/dtos/solar-unit";
import { 
  CreateEnergyGenerationRecordDTOType, 
  UpdateEnergyGenerationRecordDTOType, 
  GetEnergyRecordsByDateRangeDTOType 
} from "../domain/dtos/energy-generation-record";

const SOLAR_PANEL_API_BASE_URL = process.env.SOLAR_PANEL_API_URL || "http://localhost:8001";
const SOLARPANEL_API_SECRET = process.env.SOLARPANEL_API_SECRET;

// Helper function to make authenticated requests to solar panel API
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${SOLAR_PANEL_API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(SOLARPANEL_API_SECRET && { Authorization: `Bearer ${SOLARPANEL_API_SECRET}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    (error as any).response = {
      status: response.status,
      data: await response.json().catch(() => ({ message: response.statusText })),
    };
    throw error;
  }

  return response.json();
};

// Solar Unit API methods
export const solarUnitService = {
  // Get all solar units
  getAllSolarUnits: async () => {
    return await makeRequest("/api/solar-units");
  },

  // Get solar unit by ID
  getSolarUnitById: async (id: string) => {
    return await makeRequest(`/api/solar-units/${id}`);
  },

  // Get solar units by user ID
  getSolarUnitsByUserId: async (userId: string) => {
    return await makeRequest(`/api/solar-units/user/${userId}`);
  },

  // Get solar units by status
  getSolarUnitsByStatus: async (status: string) => {
    return await makeRequest(`/api/solar-units/status/${status}`);
  },

  // Get unassigned solar units
  getUnassignedSolarUnits: async () => {
    return await makeRequest("/api/solar-units/unassigned/list");
  },

  // Create new solar unit
  createSolarUnit: async (data: CreateSolarUnitDTOType) => {
    return await makeRequest("/api/solar-units", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update solar unit
  updateSolarUnit: async (id: string, data: UpdateSolarUnitDTOType) => {
    return await makeRequest(`/api/solar-units/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Update solar unit status
  updateSolarUnitStatus: async (id: string, data: UpdateSolarUnitStatusDTOType) => {
    return await makeRequest(`/api/solar-units/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Assign user to solar unit
  assignUserToSolarUnit: async (id: string, data: AssignUserToSolarUnitDTOType) => {
    return await makeRequest(`/api/solar-units/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Unassign user from solar unit
  unassignUserFromSolarUnit: async (id: string) => {
    return await makeRequest(`/api/solar-units/${id}/unassign`, {
      method: "PATCH",
    });
  },

  // Delete solar unit
  deleteSolarUnit: async (id: string) => {
    return await makeRequest(`/api/solar-units/${id}`, {
      method: "DELETE",
    });
  },
};

// Energy Generation Record API methods
export const energyRecordService = {
  // Create new energy generation record
  createEnergyRecord: async (data: CreateEnergyGenerationRecordDTOType) => {
    return await makeRequest("/api/energy-records", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get energy record by ID
  getEnergyRecordById: async (id: string) => {
    return await makeRequest(`/api/energy-records/${id}`);
  },

  // Update energy generation record
  updateEnergyRecord: async (id: string, data: UpdateEnergyGenerationRecordDTOType) => {
    return await makeRequest(`/api/energy-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete energy generation record
  deleteEnergyRecord: async (id: string) => {
    return await makeRequest(`/api/energy-records/${id}`, {
      method: "DELETE",
    });
  },

  // Get energy records by solar unit
  getEnergyRecordsBySolarUnit: async (solarUnitId: string, page: number = 1, limit: number = 10) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return await makeRequest(`/api/energy-records/solar-unit/${solarUnitId}?${queryParams}`);
  },

  // Get latest energy record for a solar unit
  getLatestEnergyRecord: async (solarUnitId: string) => {
    return await makeRequest(`/api/energy-records/solar-unit/${solarUnitId}/latest`);
  },

  // Get total energy produced for a solar unit
  getTotalEnergyProduced: async (solarUnitId: string) => {
    return await makeRequest(`/api/energy-records/solar-unit/${solarUnitId}/total`);
  },

  // Get energy analytics
  getEnergyAnalytics: async (solarUnitId: string, period: string = "daily") => {
    const queryParams = new URLSearchParams({ period });
    return await makeRequest(`/api/energy-records/solar-unit/${solarUnitId}/analytics?${queryParams}`);
  },

  // Get energy records by date range
  getEnergyRecordsByDateRange: async (params: GetEnergyRecordsByDateRangeDTOType) => {
    const queryParams = new URLSearchParams();
    queryParams.append("startDate", params.startDate);
    queryParams.append("endDate", params.endDate);
    if (params.solarUnitId) {
      queryParams.append("solarUnitId", params.solarUnitId);
    }
    return await makeRequest(`/api/energy-records/date-range?${queryParams}`);
  },
}; 