import type {Prospecto, ProspectoFormData} from '@/types/prospecto.types';
import {storage} from '@/lib/storage';

const API_URL = import.meta.env.PUBLIC_API_URL;

export const prospectosService = {
    /**
     * Crear un nuevo prospecto
     * @param idPersonas
     * @param data
     */
    async create(idPersonas?: number, data?: ProspectoFormData): Promise<Prospecto> {
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
     * Obtener todos los prospectos
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

    /**
     * Obtener prospectos filtrados
     */
    async getFiltered(filters: Record<string, any>): Promise<Prospecto[]> {
        const token = storage.getToken();
        const headers = {'Authorization': `Bearer ${token}`};

        try {
            const queryParams = new URLSearchParams(
                Object.entries(filters)
                    .filter(([_, v]) => v != null && v !== '')
                    .map(([key, value]) => {
                        if (key === 'fecha') {
                            return [key, `"${String(value)}"`];
                        }
                        return [key, String(value)];
                    })
            ).toString();

            const url = queryParams
                ? `${API_URL}/prospectos?${queryParams}`
                : `${API_URL}/prospectos`;

            console.log('🔍 URL generada:', url);

            const response = await fetch(url, {headers});

            if (!response.ok) {
                throw new Error(`Error al obtener prospectos: ${response.status}`);
            }

            const data = await response.json();
            const results = Array.isArray(data) ? data : (data ? [data] : []);

            return results;
        } catch (error) {
            console.error('❌ Error al filtrar prospectos:', error);
            return [];
        }
    },

    async update(id: number, data: any): Promise<Prospecto> {
        throw new Error('Método no implementado');
    },

    async delete(id: number): Promise<void> {
        throw new Error('Método no implementado');
    },
};