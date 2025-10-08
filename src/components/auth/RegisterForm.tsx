import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { storage } from '@/lib/storage';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schema';

export default function RegisterForm() {
    const [error, setError] = useState('');

    const initialValues: RegisterFormValues = {
        nombre: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
    };

    const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: any) => {
        setError('');

        try {
            // Solo enviamos nombre, correo y contraseña (sin confirmarContraseña)
            const { nombre, correo, contraseña } = values;
            const response = await authService.register({ nombre, correo, contraseña });

            storage.saveToken(response.access_token);
            storage.saveUser(response.user);

            window.location.href = '/admin';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrarse');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                            Nombre completo
                        </label>
                        <Field
                            id="nombre"
                            name="nombre"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005873] focus:border-transparent"
                            placeholder="Juan Pérez"
                        />
                        <ErrorMessage name="nombre" component="p" className="text-sm text-red-600" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <Field
                            id="correo"
                            name="correo"
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005873] focus:border-transparent"
                            placeholder="tu@email.com"
                        />
                        <ErrorMessage name="correo" component="p" className="text-sm text-red-600" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <Field
                            id="contraseña"
                            name="contraseña"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005873] focus:border-transparent"
                            placeholder="••••••••"
                        />
                        <ErrorMessage name="contraseña" component="p" className="text-sm text-red-600" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700">
                            Confirmar contraseña
                        </label>
                        <Field
                            id="confirmarContraseña"
                            name="confirmarContraseña"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005873] focus:border-transparent"
                            placeholder="••••••••"
                        />
                        <ErrorMessage name="confirmarContraseña" component="p" className="text-sm text-red-600" />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#005873] hover:bg-[#7EB520] text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}