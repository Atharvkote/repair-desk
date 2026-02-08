import api from '@/lib/api'

interface ApiResponse<T> {
    success: boolean
    data: T,
    token?: string,
    message?: string
}

interface LoginResponeData {
    _id: string,
    phone: string,
    name: string,
    email: string,
    role: string,
    createdAt: Date,
}



interface RefreshTokenResponse {
    success: boolean
    accessToken?: string
    refreshToken?: string
    message?: string
}

export const authService = {
    login: async (phone: string, password: string) => {
        const response = await api.post<ApiResponse<LoginResponeData> & { accessToken?: string, refreshToken?: string }>('/admin/login', {
            phone,
            password,
        })
        return response.data
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await api.post<RefreshTokenResponse>('/admin/refresh', {
            refreshToken,
        })
        return response.data
    },

    getAdmins: async () => {
        const response = await api.get<ApiResponse<LoginResponeData>>('/admin/')
        return response.data.data
    },

    getUser : async (id: string) => {
        const response = await api.get<ApiResponse<LoginResponeData>>(`/admin/user/${id}`)
        return response.data.data
    }
}
