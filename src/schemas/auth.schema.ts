// src/schemas/auth.schema.ts
import * as Yup from 'yup';

export const loginSchema = Yup.object({
    correo: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo es requerido'),
    contraseña: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
});

export const registerSchema = Yup.object({
    nombre: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .required('El nombre es requerido'),
    correo: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo es requerido'),
    contraseña: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
    confirmarContraseña: Yup.string()
        .oneOf([Yup.ref('contraseña')], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
});

export interface LoginFormValues {
    correo: string;
    contraseña: string;
}

export interface RegisterFormValues {
    nombre: string;
    correo: string;
    contraseña: string;
    confirmarContraseña: string;
}