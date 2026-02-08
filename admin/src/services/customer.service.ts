import api from '@/lib/api'

export interface Customer {
  _id: string
  name: string
  phone?: string
  email?: string
  isActivated?: boolean
  createdBy?: string
}


export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}


export interface UpsertCustomerRequest {
  name: string
  phone?: string
  email?: string
}

export const customerService = {
  searchCustomers: async (query: string): Promise<Customer[]> => {
    if (!query.trim()) {
      return []
    }

    const response = await api.get<ApiResponse<Customer[]>>(
      "/customers/search",
      { params: { q: query } }
    )

    return response.data.data
  },

  upsertCustomer: async (data: UpsertCustomerRequest): Promise<Customer> => {
    const response = await api.post<Customer>('/customers/upsert', data)
    return response.data
  },
}

