import * as Yup from 'yup';

export const recursoSchema = Yup.object({
    nombre: Yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    formato: Yup.string()
        .required('El formato es requerido')
        .oneOf(['pdf', 'docx', 'xlsx', 'pptx'], 'Formato no válido'),
    archivo: Yup.string()
        .required('El archivo es requerido')
        .test('is-base64', 'El archivo debe estar en formato válido', (value) => {
            if (!value) return false;
            return value.startsWith('data:') && value.includes('base64,');
        }),
});