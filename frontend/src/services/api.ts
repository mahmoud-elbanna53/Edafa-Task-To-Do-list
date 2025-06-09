import axios from 'axios';
import type { LoginRequest, RegisterRequest, Task, AuthResponse } from '../types';


const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<void> => {
        await api.post('/auth/register', data);
    },
};

export const taskService = {
    getAllTasks: async (): Promise<Task[]> => {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },

    getTaskById: async (id: number): Promise<Task> => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
        const response = await api.post<Task>('/tasks', task);
        return response.data;
    },

    updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
        const response = await api.put<Task>(`/tasks/${id}`, task);
        return response.data;
    },

    deleteTask: async (id: number): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
}; 