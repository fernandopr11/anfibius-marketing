import type {Recurso, RecursoFormData} from '@/types/recurso.types';
import {storage} from '@/lib/storage';

const API_URL = import.meta.env.PUBLIC_API_URL;

export const recursosService = {
    /**
     * Obtener el recurso de una publicación específica
     * GET /recursos?publicacion=:id
     */
    async getByPublicacion(idPublicacion: number): Promise<Recurso | null> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/recursos?publicacion=${idPublicacion}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener recurso');
        }

        const recursos = await response.json();
        return recursos.length > 0 ? recursos[0] : null;
    },

    /**
     * Crear un nuevo recurso para una publicación
     * POST /recursos
     */
    async create(idPublicacion: number, data: RecursoFormData): Promise<Recurso> {
        const token = storage.getToken();

        const recursoData = {
            idPublicaciones: idPublicacion,
            ...data,
        };

        const response = await fetch(`${API_URL}/recursos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recursoData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear recurso');
        }

        return response.json();
    },

    /**
     * Actualizar el recurso de una publicación
     * PATCH /recursos/:id
     */
    async update(id: number, data: RecursoFormData): Promise<Recurso> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/recursos/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar recurso');
        }

        return response.json();
    },

    /**
     * Eliminar el recurso de una publicación
     * DELETE /recursos/:id
     */
    async delete(id: number): Promise<void> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/recursos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar recurso');
        }
    },
};