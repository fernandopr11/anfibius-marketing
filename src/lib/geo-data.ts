import geoData from '@/data/ecuador-geo.json';
import type { EcuadorGeoData } from '@/types/geo.types';

const ecuadorData = geoData as unknown as EcuadorGeoData;

export const geoService = {
    /**
     * Obtiene todas las provincias
     */
    getProvincias(): Array<{ value: string; label: string }> {
        return Object.entries(ecuadorData).map(([key, data]) => ({
            value: data.provincia,
            label: data.provincia
        }));
    },

    /**
     * Obtiene los cantones de una provincia específica
     */
    getCantonesByProvincia(provincia: string): Array<{ value: string; label: string }> {
        const provinciaData = Object.values(ecuadorData).find(
            p => p.provincia === provincia
        );

        if (!provinciaData) return [];

        // Ahora canton es un objeto con la propiedad canton
        return Object.entries(provinciaData.cantones).map(([key, cantonData]) => ({
            value: cantonData.canton,
            label: cantonData.canton
        }));
    },

    /**
     * Verifica si una provincia existe
     */
    provinciaExists(provincia: string): boolean {
        return Object.values(ecuadorData).some(
            p => p.provincia === provincia
        );
    },

    /**
     * Verifica si un cantón existe en una provincia
     */
    cantonExistsInProvincia(provincia: string, canton: string): boolean {
        const provinciaData = Object.values(ecuadorData).find(
            p => p.provincia === provincia
        );

        if (!provinciaData) return false;

        return Object.values(provinciaData.cantones).some(
            c => c.canton === canton
        );
    }
};