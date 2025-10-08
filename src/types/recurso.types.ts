import type {BaseEntity} from './crud.types';

export interface Recurso extends BaseEntity {
    idPublicaciones: number;
    nombre: string;
    formato: 'pdf' | 'docx' | 'xlsx' | 'pptx';
    archivo: string;
}

export interface RecursoFormData {
    nombre: string;
    formato: 'pdf' | 'docx' | 'xlsx' | 'pptx';
    archivo: string;
}