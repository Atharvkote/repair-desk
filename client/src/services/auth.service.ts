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



export const authService = {
    login: async (phone: string, password: string) => {
        const response = await api.post<ApiResponse<LoginResponeData>>('/admin/login', {
            phone,
            password,
        })
        return response.data
    },

    getAdmins: async () => {
        const response = await api.get<ApiResponse<LoginResponeData>>('/admin/')
        return response.data.data
    },
}
