import type {BaseEntity} from './crud.types';
import type {Publicacion} from './publicacion.types';

export interface Lead extends BaseEntity {
    idPublicaciones: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    celular: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    publicacion?: Publicacion;
}

export interface LeadFormData {
    cedula: string;
    nombres: string;
    apellidos: string;
    celular: string;
    direccion: string;
    ciudad: string;
    provincia: string;
}