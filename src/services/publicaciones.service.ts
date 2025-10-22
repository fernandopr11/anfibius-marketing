import type { Publicacion } from '@/types/publicacion.types';
import { storage } from '@/lib/storage';

const API_URL = import.meta.env.PUBLIC_API_URL;

// Función helper para transformar strings vacíos a null
const transformImageData = (data: any) => {
    return {
        ...data,
        imagen1: data.imagen1 === '' ? null : data.imagen1,
        imagen2: data.imagen2 === '' ? null : data.imagen2,
    };
};

export const publicacionesService = {
    async getAll(): Promise<Publicacion[]> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/publicaciones`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener publications');
        }

        return response.json();
    },

    async create(data: Publicacion): Promise<Publicacion> {
        const token = storage.getToken();
        const transformedData = transformImageData(data);

        const response = await fetch(`${API_URL}/publicaciones`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear publicacion');
        }

        return response.json();
    },

    async update(id: number, data: Publicacion): Promise<Publicacion> {
        const token = storage.getToken();

        // Eliminar el id del objeto data antes de enviarlo
        const { id: _, ...dataWithoutId } = data;
        const transformedData = transformImageData(dataWithoutId);

        const response = await fetch(`${API_URL}/publicaciones/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar publicacion');
        }

        return response.json();
    },

    async delete(id: number): Promise<void> {
        const token = storage.getToken();

        const response = await fetch(`${API_URL}/publicaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar publicacion');
        }
    },
};