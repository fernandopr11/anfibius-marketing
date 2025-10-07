import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { leadsService } from '@/services/leads.service';
import { leadSchema } from '@/schemas/lead.schema';
import type { LeadFormData } from '@/types/lead.types';

interface LeadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    idPublicacion: number;
    nombrePublicacion: string;
    onSuccess: () => void;
}

export function LeadModal({
                              open,
                              onOpenChange,
                              idPublicacion,
                              nombrePublicacion,
                              onSuccess
                          }: LeadModalProps) {

    const initialValues: LeadFormData = {
        cedula: '',
        nombres: '',
        apellidos: '',
        celular: '',
        direccion: '',
        ciudad: '',
        provincia: '',
    };

    const handleSubmit = async (values: LeadFormData, { setSubmitting }: any) => {
        try {
            await leadsService.create(idPublicacion, values);
            toast.success('¡Gracias por tu interés! Tu descarga comenzará en breve.');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Error al crear lead:', error);
            toast.error('Error al procesar tu solicitud. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">
                        {nombrePublicacion}
                    </DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">
                        Por favor completa tus datos para acceder al recurso
                    </p>
                </DialogHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={leadSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* Cédula */}
                            <div className="space-y-2">
                                <label htmlFor="cedula" className="text-sm font-medium">
                                    Cédula <span className="text-red-600">*</span>
                                </label>
                                <Field
                                    id="cedula"
                                    name="cedula"
                                    type="text"
                                    maxLength={10}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                                <ErrorMessage
                                    name="cedula"
                                    component="p"
                                    className="text-sm text-red-600"
                                />
                            </div>

                            {/* Nombres y Apellidos en grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="nombres" className="text-sm font-medium">
                                        Nombres <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        id="nombres"
                                        name="nombres"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                    <ErrorMessage
                                        name="nombres"
                                        component="p"
                                        className="text-sm text-red-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="apellidos" className="text-sm font-medium">
                                        Apellidos <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        id="apellidos"
                                        name="apellidos"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                    <ErrorMessage
                                        name="apellidos"
                                        component="p"
                                        className="text-sm text-red-600"
                                    />
                                </div>
                            </div>

                            {/* Celular */}
                            <div className="space-y-2">
                                <label htmlFor="celular" className="text-sm font-medium">
                                    Celular <span className="text-red-600">*</span>
                                </label>
                                <Field
                                    id="celular"
                                    name="celular"
                                    type="text"
                                    maxLength={10}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                                <ErrorMessage
                                    name="celular"
                                    component="p"
                                    className="text-sm text-red-600"
                                />
                            </div>

                            {/* Dirección */}
                            <div className="space-y-2">
                                <label htmlFor="direccion" className="text-sm font-medium">
                                    Dirección <span className="text-red-600">*</span>
                                </label>
                                <Field
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                                <ErrorMessage
                                    name="direccion"
                                    component="p"
                                    className="text-sm text-red-600"
                                />
                            </div>

                            {/* Ciudad y Provincia en grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="provincia" className="text-sm font-medium">
                                        Provincia <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        id="provincia"
                                        name="provincia"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                    <ErrorMessage
                                        name="provincia"
                                        component="p"
                                        className="text-sm text-red-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="ciudad" className="text-sm font-medium">
                                        Ciudad <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        id="ciudad"
                                        name="ciudad"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                    <ErrorMessage
                                        name="ciudad"
                                        component="p"
                                        className="text-sm text-red-600"
                                    />
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#7EB520] hover:bg-[#6DA018]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Descargar ahora
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}