export interface User {
    id: number;
    nombre: string;
    correo: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface LoginRequest {
    correo: string;
    contraseña: string;
}

export interface RegisterRequest {
    nombre: string;
    correo: string;
    contraseña: string;
}