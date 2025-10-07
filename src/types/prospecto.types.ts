import type {BaseEntity} from './crud.types';

export interface Prospecto extends BaseEntity {
    idPersonas: number;
    giro: string;
    hora: string;
    fecha: string;
    metodo: string;
    empleados: number;
    empresa: string;
}

export interface ProspectoFormData {
    giro: string;
    hora: string;
    fecha: string;
    metodo: string;
    empleados: number;
    empresa: string;
}