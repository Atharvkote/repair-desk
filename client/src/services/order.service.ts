import api from '@/lib/api'

export interface OrderItem {
  itemId: string
  quantity: number
  type: 'service' | 'part'
}

export interface CreateDraftOrderRequest {
  customerId: string
  tractor?: {
    name?: string
    model?: string
  }
}

export interface Order {
  id: string
  customerId: string
  status: 'draft' | 'started' | 'completed' | 'cancelled'
  items: OrderItem[]
  discounts: Record<string, number>
  orderDiscount?: number
  subtotal: number
  totalDiscount: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface AddItemRequest {
  orderId: string
  itemId: string
  quantity: number
  type: 'service' | 'part'
}

export interface UpdateItemDiscountRequest {
  orderId: string
  itemId: string
  discountPercent: number
}

export interface ApplyOrderDiscountRequest {
  orderId: string
  discountAmount: number
}

export const orderService = {
  createDraftOrder: async (data: CreateDraftOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders/draft', data)
    return response.data
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`)
    return response.data
  },

  addServiceItem: async (data: AddItemRequest): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${data.orderId}/items`, {
      itemId: data.itemId,
      quantity: data.quantity,
      type: 'service',
    })
    return response.data
  },

  addPartItem: async (data: AddItemRequest): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${data.orderId}/items`, {
      itemId: data.itemId,
      quantity: data.quantity,
      type: 'part',
    })
    return response.data
  },

  removeItem: async (orderId: string, itemId: string): Promise<Order> => {
    const response = await api.delete<Order>(`/orders/${orderId}/items/${itemId}`)
    return response.data
  },

  updateItemQuantity: async (
    orderId: string,
    itemId: string,
    quantity: number
  ): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}/items/${itemId}`, {
      quantity,
    })
    return response.data
  },

  updateItemDiscount: async (data: UpdateItemDiscountRequest): Promise<Order> => {
    const response = await api.patch<Order>(
      `/orders/${data.orderId}/items/${data.itemId}/discount`,
      {
        discountPercent: data.discountPercent,
      }
    )
    return response.data
  },

  applyOrderDiscount: async (data: ApplyOrderDiscountRequest): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${data.orderId}/discount`, {
      discountAmount: data.discountAmount,
    })
    return response.data
  },

  startService: async (orderId: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${orderId}/start`)
    return response.data
  },

  completeService: async (orderId: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${orderId}/complete`)
    return response.data
  },
}

