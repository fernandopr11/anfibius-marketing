import type {BaseEntity} from './crud.types';
import type {Lead} from "@/types/lead.types.ts";
import type {Publicacion} from "@/types/publicacion.types.ts";

export interface Prospecto extends BaseEntity {
    idPersonas: number;
    giro: string;
    hora: string;
    fecha: string;
    metodo: string;
    empleados: number;
    empresa: string;
    persona?: Lead;
}

export interface ProspectoFormData {
    giro: string;
    metodo: string;
    empleados: number;
    empresa: string;
}