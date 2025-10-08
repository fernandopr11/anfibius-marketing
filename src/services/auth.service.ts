// src/services/auth.service.ts
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth.types';

const API_URL = import.meta.env.PUBLIC_API_URL;

export const authService = {
    async register({ nombre, correo, contraseña }: RegisterRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, correo, contraseña }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al registrar');
        }

        return response.json();
    },

    async login({ correo, contraseña }: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contraseña }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al iniciar sesión');
        }

        return response.json();
    },
};