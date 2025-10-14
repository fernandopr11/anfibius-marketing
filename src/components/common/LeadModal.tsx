import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { leadsService } from '@/services/leads.service';
import { leadSchema } from '@/schemas/lead.schema';
import { encryptForUrl } from '@/lib/crypto';
import { geoService } from '@/lib/geo-data';
import type { LeadFormData } from '@/types/lead.types';

interface LeadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    idPublicacion: number;
    nombrePublicacion: string;
    recursoArchivo: string;
    recursoNombre: string;
    recursoFormato: string;
}

export function LeadModal({
                              open,
                              onOpenChange,
                              idPublicacion,
                              nombrePublicacion,
                              recursoArchivo,
                              recursoNombre,
                              recursoFormato
                          }: LeadModalProps) {
    // Estados para manejar provincias y cantones
    const [provincias, setProvincias] = useState<Array<{ value: string; label: string }>>([]);
    const [cantones, setCantones] = useState<Array<{ value: string; label: string }>>([]);
    const [selectedProvincia, setSelectedProvincia] = useState<string>('');

    // Guardar la ruta de origen al abrir el modal, solo si no existe
    useEffect(() => {
        if (open && !sessionStorage.getItem('rutaOrigen')) {
            sessionStorage.setItem('rutaOrigen', window.location.pathname);
        }
    }, [open]);

    // Cargar provincias al montar el componente
    useEffect(() => {
        const provinciasData = geoService.getProvincias();
        setProvincias(provinciasData);
    }, []);

    // Manejar cambio de provincia
    const handleProvinciaChange = (provincia: string, setFieldValue: any) => {
        setSelectedProvincia(provincia);
        setFieldValue('provincia', provincia);
        setFieldValue('ciudad', ''); // Reset ciudad

        // Cargar cantones de la provincia seleccionada
        const cantonesData = geoService.getCantonesByProvincia(provincia);
        setCantones(cantonesData);
    };

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
            const leadCreado = await leadsService.create(idPublicacion, values);
            toast.success('¡Datos registrados! Ahora agenda tu cita.');
            onOpenChange(false);

            // Guardar datos del recurso en sessionStorage
            sessionStorage.setItem('recursoArchivo', recursoArchivo);
            sessionStorage.setItem('recursoNombre', recursoNombre);
            sessionStorage.setItem('recursoFormato', recursoFormato);

            // Encriptar el ID del lead
            const idEncriptado = encryptForUrl(leadCreado.id!.toString());

            // Redirigir con ID encriptado
            window.location.href = `/descarga?token=${idEncriptado}`;
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
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Por favor completa tus datos para acceder al recurso
                    </p>
                </DialogHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={leadSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
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

                            {/* Provincia y Ciudad en grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Provincia */}
                                <div className="space-y-2">
                                    <label htmlFor="provincia" className="text-sm font-medium">
                                        Provincia <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        as="select"
                                        id="provincia"
                                        name="provincia"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            handleProvinciaChange(e.target.value, setFieldValue);
                                        }}
                                    >
                                        <option value="">Seleccionar provincia...</option>
                                        {provincias.map((prov) => (
                                            <option key={prov.value} value={prov.value}>
                                                {prov.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="provincia"
                                        component="p"
                                        className="text-sm text-red-600"
                                    />
                                </div>

                                {/* Ciudad/Cantón */}
                                <div className="space-y-2">
                                    <label htmlFor="ciudad" className="text-sm font-medium">
                                        Ciudad <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        as="select"
                                        id="ciudad"
                                        name="ciudad"
                                        className="w-full px-3 py-2 border rounded-md"
                                        disabled={!selectedProvincia}
                                    >
                                        <option value="">
                                            {selectedProvincia ? 'Seleccionar ciudad...' : 'Seleccione una provincia'}
                                        </option>
                                        {cantones.map((canton) => (
                                            <option key={canton.value} value={canton.value}>
                                                {canton.label}
                                            </option>
                                        ))}
                                    </Field>
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
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                            Continuar
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