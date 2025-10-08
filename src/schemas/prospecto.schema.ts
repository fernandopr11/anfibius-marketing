import * as Yup from 'yup';

export const prospectoSchema = Yup.object({
    empresa: Yup.string()
        .required('El nombre de la empresa es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    giro: Yup.string()
        .required('El giro del negocio es requerido'),
    empleados: Yup.number()
        .required('El número de empleados es requerido')
        .positive('Debe ser un número positivo')
        .integer('Debe ser un número entero'),
    metodo: Yup.string()
        .required('El método de contacto es requerido')
        .oneOf(
            ['Llamada telefónica', 'Videollamada', 'Presencial'],
            'Método no válido'
        ),
});