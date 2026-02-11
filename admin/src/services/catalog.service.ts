import api from '@/lib/api'

export type ItemStatus = 'DISABLED' | 'AVAILABLE' | 'OUT_OF_STOCK'

export interface ApiResponse<T> {
  success: boolean
  items: T
  message?: string
}


export interface ServiceItem {
  _id: string
  serviceCode: string
  name: string
  description?: string
  price: number
  status: 'DISABLED' | 'AVAILABLE'
}

export interface PartItem {
  id: string
  partCode: string
  name: string
  description?: string
  price: number
  stock?: number
  unit?: string
  status: ItemStatus
}


const safeSearch = async <T>(
  url: string,
  query: string
): Promise<T[]> => {
  if (!query.trim()) return []

  try {
    const response = await api.get<{ items: T[] }>(url, {
      params: { q: query },
    })

    return response.data.items ?? []
  } catch (error: any) {
    if (error.response?.status === 404) return []
    throw error
  }
}


interface ServiceCreateData {
  serviceCode: string
  name: string
  description?: string
  price: number
  status?: 'AVAILABLE' | 'DISABLED'
}

interface ServiceUpdateData {
  name?: string
  description?: string
  price?: number
  status?: 'AVAILABLE' | 'DISABLED'
}

interface PartCreateData {
  partCode: string
  name: string
  description?: string
  unit?: string
  price: number
  stock?: number
  status?: ItemStatus
}

interface PartUpdateData {
  name?: string
  description?: string
  unit?: string
  price?: number
  stock?: number
  status?: ItemStatus
}

interface DeleteResponse {
  success: boolean
  message: string
}

export const catalogService = {

  searchServices: (query: string): Promise<ServiceItem[]> =>
    safeSearch<ServiceItem>('/services/search', query),

  getServices: async (): Promise<ServiceItem[]> => {
    const response = await api.get<ApiResponse<ServiceItem[]>>('/services')
    return response.data.items ?? []
  },

  getServiceById: async (id: string): Promise<ServiceItem> => {
    const response = await api.get<{ success: boolean, data: ServiceItem }>(`/services/${id}`)
    return response.data.data
  },

  createService: async (data: ServiceCreateData): Promise<ServiceItem> => {
    const response = await api.post<{ success: boolean, data: ServiceItem }>('/services', data)
    return response.data.data
  },

  updateService: async (id: string, data: ServiceUpdateData): Promise<ServiceItem> => {
    const response = await api.patch<{ success: boolean, data: ServiceItem }>(`/services/${id}`, data)
    return response.data.data
  },

  deleteService: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/services/${id}`)
    return response.data
  },

  searchParts: (query: string): Promise<PartItem[]> =>
    safeSearch<PartItem>('/parts/search', query),

  getParts: async (): Promise<PartItem[]> => {
    const response = await api.get<ApiResponse<PartItem[]>>('/parts')
    return response.data.items ?? []
  },

  getPartById: async (id: string): Promise<PartItem> => {
    const response = await api.get<{ success: boolean, data: PartItem }>(`/parts/${id}`)
    return response.data.data
  },

  createPart: async (data: PartCreateData): Promise<PartItem> => {
    const response = await api.post<{ success: boolean, data: PartItem }>('/parts', data)
    return response.data.data
  },

  updatePart: async (id: string, data: PartUpdateData): Promise<PartItem> => {
    const response = await api.patch<{ success: boolean, data: PartItem }>(`/parts/${id}`, data)
    return response.data.data
  },

  deletePart: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/parts/${id}`)
    return response.data
  },

}


export const isAvailable = <T extends { status: string }>(item: T) =>
  item.status === 'AVAILABLE'
