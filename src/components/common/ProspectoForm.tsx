import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { prospectosService } from '@/services/prospectos.service';
import { prospectoSchema } from '@/schemas/prospecto.schema';
import type { ProspectoFormData } from '@/types/prospecto.types';

interface ProspectoFormProps {
    idPersonas: number;
}

export default function ProspectoForm({ idPersonas }: ProspectoFormProps) {
    const [descargaCompleta, setDescargaCompleta] = useState(false);

    const initialValues: ProspectoFormData = {
        empresa: '',
        giro: '',
        empleados: 0,
        fecha: '',
        hora: '',
        metodo: '',
    };

    const handleSubmit = async (values: ProspectoFormData, { setSubmitting }: any) => {
        try {
            await prospectosService.create(idPersonas, values);
            toast.success('¡Cita agendada exitosamente!');

            // Obtener datos del recurso de sessionStorage
            const recursoArchivo = sessionStorage.getItem('recursoArchivo');
            const recursoNombre = sessionStorage.getItem('recursoNombre');
            const recursoFormato = sessionStorage.getItem('recursoFormato');

            // Descargar el archivo
            if (recursoArchivo && recursoNombre && recursoFormato) {
                const link = document.createElement('a');
                link.href = recursoArchivo;
                link.download = `${recursoNombre}.${recursoFormato}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Limpiar sessionStorage
                sessionStorage.removeItem('recursoArchivo');
                sessionStorage.removeItem('recursoNombre');
                sessionStorage.removeItem('recursoFormato');

                setDescargaCompleta(true);
                toast.success('¡Tu descarga ha comenzado!');
            }
        } catch (error) {
            console.error('Error al crear prospecto:', error);
            toast.error('Error al agendar tu cita. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    if (descargaCompleta) {
        return (
            <div className="text-center py-12">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    ¡Todo listo!
                </h3>
                <p className="text-gray-600 mb-4">
                    Tu cita ha sido agendada y tu descarga ha comenzado.
                </p>
                <p className="text-gray-600">
                    Nos pondremos en contacto contigo pronto.
                </p>
                <Button
                    onClick={() => window.location.href = '/'}
                    className="mt-6 bg-[#7EB520] hover:bg-[#6DA018]"
                >
                    Volver al inicio
                </Button>
            </div>
        );
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={prospectoSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    {/* Empresa */}
                    <div className="space-y-2">
                        <label htmlFor="empresa" className="text-sm font-medium">
                            Nombre de la empresa <span className="text-red-600">*</span>
                        </label>
                        <Field
                            id="empresa"
                            name="empresa"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="TechSoft Solutions"
                        />
                        <ErrorMessage
                            name="empresa"
                            component="p"
                            className="text-sm text-red-600"
                        />
                    </div>

                    {/* Giro y Empleados en grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="giro" className="text-sm font-medium">
                                Giro del negocio <span className="text-red-600">*</span>
                            </label>
                            <Field
                                id="giro"
                                name="giro"
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Tecnología y Software"
                            />
                            <ErrorMessage
                                name="giro"
                                component="p"
                                className="text-sm text-red-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="empleados" className="text-sm font-medium">
                                Número de empleados <span className="text-red-600">*</span>
                            </label>
                            <Field
                                id="empleados"
                                name="empleados"
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="25"
                            />
                            <ErrorMessage
                                name="empleados"
                                component="p"
                                className="text-sm text-red-600"
                            />
                        </div>
                    </div>

                    {/* Fecha y Hora en grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="fecha" className="text-sm font-medium">
                                Fecha <span className="text-red-600">*</span>
                            </label>
                            <Field
                                id="fecha"
                                name="fecha"
                                type="date"
                                className="w-full px-3 py-2 border rounded-md"
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <ErrorMessage
                                name="fecha"
                                component="p"
                                className="text-sm text-red-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="hora" className="text-sm font-medium">
                                Hora <span className="text-red-600">*</span>
                            </label>
                            <Field
                                id="hora"
                                name="hora"
                                type="time"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                            <ErrorMessage
                                name="hora"
                                component="p"
                                className="text-sm text-red-600"
                            />
                        </div>
                    </div>

                    {/* Método de contacto */}
                    <div className="space-y-2">
                        <label htmlFor="metodo" className="text-sm font-medium">
                            Método de contacto preferido <span className="text-red-600">*</span>
                        </label>
                        <Field
                            as="select"
                            id="metodo"
                            name="metodo"
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Llamada telefónica">Llamada telefónica</option>
                            <option value="Videollamada">Videollamada</option>
                            <option value="Presencial">Presencial</option>
                        </Field>
                        <ErrorMessage
                            name="metodo"
                            component="p"
                            className="text-sm text-red-600"
                        />
                    </div>

                    {/* Nota */}
                    <p className="text-xs text-gray-500 italic">
                        * Todos los campos son obligatorios
                    </p>

                    {/* Botón de envío */}
                    <Button
                        type="submit"
                        className="w-full bg-[#7EB520] hover:bg-[#6DA018] text-lg py-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                Enviar Datos
                            </>
                        )}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}