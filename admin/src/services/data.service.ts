/**
 * @file data.service.ts
 * @description API service for data endpoints
 */

import api from "../lib/api.js";

export interface DataItem {
  _id: string;
  name: string;
  description?: string;
  value: number;
  metadata?: Record<string, string>;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataPayload {
  name: string;
  description?: string;
  value?: number;
  metadata?: Record<string, string>;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateDataPayload extends Partial<CreateDataPayload> {}

export interface DataListResponse {
  success: boolean;
  data: DataItem[];
  count: number;
}

export interface DataResponse {
  success: boolean;
  data: DataItem;
}

export const dataService = {
  /**
   * Get all data items
   */
  getAll: async (): Promise<DataItem[]> => {
    const response = await api.get<DataListResponse>("/data");
    return response.data.data;
  },

  /**
   * Get data item by ID
   */
  getById: async (id: string): Promise<DataItem> => {
    const response = await api.get<DataResponse>(`/data/${id}`);
    return response.data.data;
  },

  /**
   * Create new data item
   */
  create: async (payload: CreateDataPayload): Promise<DataItem> => {
    const response = await api.post<DataResponse>("/data", payload);
    return response.data.data;
  },

  /**
   * Update data item
   */
  update: async (id: string, payload: UpdateDataPayload): Promise<DataItem> => {
    const response = await api.put<DataResponse>(`/data/${id}`, payload);
    return response.data.data;
  },

  /**
   * Delete data item
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/data/${id}`);
  },
};

