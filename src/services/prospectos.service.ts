import type { Prospecto, ProspectoFormData } from '@/types/prospecto.types';
import { storage } from '@/lib/storage';

const API_URL = import.meta.env.PUBLIC_API_URL;

export const prospectosService = {
    /**
     * Crear un nuevo prospecto
     * @param idPersonas
     * @param data
     */
    async create(idPersonas: number, data: ProspectoFormData): Promise<Prospecto> {
        const prospectoData = {
            idPersonas,
            ...data,
        };

        const response = await fetch(`${API_URL}/prospectos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prospectoData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear prospecto');
        }

        return response.json();
    },

    /**
     * Obtener todos los prospectos (CON token - admin)
     */
    async getAll(): Promise<Prospecto[]> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/prospectos`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener prospectos');
        }

        return response.json();
    },
};