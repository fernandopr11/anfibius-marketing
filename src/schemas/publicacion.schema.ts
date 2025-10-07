import * as Yup from 'yup';

export const publicacionSchema = Yup.object({
    nombre: Yup.string().required('El nombre es requerido'),
    url: Yup.string().required('La URL es requerida'),
    titulo1: Yup.string().required('El titulo 1 es requerido'),
    texto1: Yup.string().required('El texto 1 es requerido'),
    imagen1: Yup.string().required("La imagen 1 es requerida"),
    titulo2: Yup.string().required('El titulo 2 es requerido'),
    texto2: Yup.string().required('El texto 2 es requerido'),
    imagen2: Yup.string().required("La imagen 2 es requerida"),
});

export interface PublicacionFormValues {
    nombre: string;
    url: string;
    titulo1: string;
    texto1: string;
    imagen1: string;
    titulo2: string;
    texto2: string;
    imagen2: string;
}