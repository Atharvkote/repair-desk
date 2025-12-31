import api from '@/lib/api'

export type ItemStatus = 'DISABLED' | 'AVAILABLE' | 'OUT_OF_STOCK'

export interface ApiResponse<T> {
  success: boolean
  items: T
  message?: string
}


export interface ServiceItem {
  id: string
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


export const catalogService = {

  searchServices: (query: string): Promise<ServiceItem[]> =>
    safeSearch<ServiceItem>('/services/search', query),

  getServices: async (): Promise<ServiceItem[]> => {
    const response = await api.get<ApiResponse<ServiceItem[]>>('/services')
    return response.data.items ?? []
  },

  searchParts: (query: string): Promise<PartItem[]> =>
    safeSearch<PartItem>('/parts/search', query),

  getParts: async (): Promise<PartItem[]> => {
    const response = await api.get<ApiResponse<PartItem[]>>('/parts')
    return response.data.items ?? []
  },

  createService: async (data: ServiceItem): Promise<ServiceItem> => {
    const response = await api.post<ServiceItem>('/services', data)
    return response.data
  },
  createPart: async (data: PartItem): Promise<PartItem> => {
    const response = await api.post<PartItem>('/parts', data)
    return response.data
  },

}


export const isAvailable = <T extends { status: string }>(item: T) =>
  item.status === 'AVAILABLE'
