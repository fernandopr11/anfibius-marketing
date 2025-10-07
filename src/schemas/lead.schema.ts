import * as Yup from 'yup';

export const leadSchema = Yup.object({
    cedula: Yup.string()
        .required('La cédula es requerida')
        .matches(/^[0-9]{10}$/, 'La cédula debe tener 10 dígitos'),
    nombres: Yup.string()
        .required('El nombre es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellidos: Yup.string()
        .required('Los apellidos son requeridos')
        .min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    celular: Yup.string()
        .required('El celular es requerido')
        .matches(/^[0-9]{10}$/, 'El celular debe tener 10 dígitos'),
    direccion: Yup.string()
        .required('La dirección es requerida')
        .min(5, 'La dirección debe tener al menos 5 caracteres'),
    ciudad: Yup.string()
        .required('La ciudad es requerida'),
    provincia: Yup.string()
        .required('La provincia es requerida'),
});