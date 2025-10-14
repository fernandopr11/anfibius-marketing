import type {Lead, LeadFormData} from '@/types/lead.types.ts';
import {storage} from '@/lib/storage';

const API_URL = import.meta.env.PUBLIC_API_URL;

export const leadsService = {

    /**
     * Crear un Lead
     * @param idPublicacion
     * @param data
     */
    async create(idPublicacion?: number, data?: LeadFormData): Promise<Lead> {
        const leadData = {
            idPublicaciones: idPublicacion,
            ...data,
        };

        const response = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear lead');
        }

        return response.json();
    },

    /**
     * Obtener todos los leads
     */
    async getAll(): Promise<Lead[]> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/leads`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener leads');
        }

        return response.json();

    },

    /**
     * Obtener leads filtrados
     */
    async getFiltered(filters: Record<string, any>): Promise<Lead[]> {
        const token = storage.getToken();
        const headers = {'Authorization': `Bearer ${token}`};

        try {
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, v]) => v != null && v !== '')
            ).toString();

            const url = queryParams
                ? `${API_URL}/leads?${queryParams}`
                : `${API_URL}/leads`;

            const response = await fetch(url, {headers});
            if (!response.ok) throw new Error(`Error al obtener leads (${queryParams || 'todos'})`);

            const data = await response.json();
            const results = Array.isArray(data) ? data : (data ? [data] : []);

            return results;
        } catch (error) {
            console.error('Error al filtrar leads:', error);
            return [];
        }
    },


    async update(id: number, data: any): Promise<Lead> {
        throw new Error('Método no implementado');
    },

    /*
    * Eliminar un lead por ID
    * @param id
     */
    async delete(id: number): Promise<void> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/leads/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar lead');
        }
    }
};