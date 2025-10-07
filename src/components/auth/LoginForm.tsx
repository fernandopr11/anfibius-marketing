import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { storage } from '@/lib/storage';
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema';

export default function LoginForm() {
    const [error, setError] = useState('');

    const initialValues: LoginFormValues = {
        correo: '',
        contraseña: '',
    };

    const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
        setError('');

        try {
            const response = await authService.login(values);

            storage.saveToken(response.access_token);
            storage.saveUser(response.user);

            window.location.href = '/admin';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
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

                    <Button
                        type="submit"
                        className="w-full bg-[#005873] hover:bg-[#7EB520] text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}