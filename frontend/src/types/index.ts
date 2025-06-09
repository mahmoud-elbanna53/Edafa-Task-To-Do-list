export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    userId?: number;
}

export enum TaskStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED'
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
} 