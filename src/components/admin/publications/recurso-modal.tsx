import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Trash2, Download, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FileUpload from '@/components/common/FileUpload.tsx';
import { recursosService } from '@/services/recursos.service.ts';
import { recursoSchema } from '@/schemas/recurso.schema.ts';
import type { Recurso } from '@/types/recurso.types.ts';
import type { Publicacion } from '@/types/publicacion.types.ts';
import ConfirmDialog from '@/components/ui/confirm-dialog.tsx';

interface RecursoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    publicacion: Publicacion;
}

export function RecursoModal({ open, onOpenChange, publicacion }: RecursoModalProps) {
    const [recurso, setRecurso] = useState<Recurso | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (open && publicacion.id) {
            loadRecurso();
        }
    }, [open, publicacion.id]);

    const loadRecurso = async () => {
        try {
            setLoading(true);
            const data = await recursosService.getByPublicacion(publicacion.id!);
            setRecurso(data);
        } catch (error) {
            console.error('Error al cargar recurso:', error);
            toast.error('Error al cargar el recurso');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            if (recurso?.id) {
                await recursosService.update(recurso.id, values);
                toast.success('Recurso actualizado correctamente');
            } else {
                await recursosService.create(publicacion.id!, values);
                toast.success('Recurso creado correctamente');
            }
            await loadRecurso();
        } catch (error) {
            console.error('Error al guardar recurso:', error);
            toast.error('Error al guardar el recurso');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!recurso?.id) return;

        try {
            await recursosService.delete(recurso.id);
            toast.success('Recurso eliminado correctamente');
            setRecurso(null);
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error al eliminar recurso:', error);
            toast.error('Error al eliminar el recurso');
        }
    };

    const handleDownload = () => {
        if (!recurso) return;
        const link = document.createElement('a');
        link.href = recurso.archivo;
        link.download = `${recurso.nombre}.${recurso.formato}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const initialValues = {
        nombre: recurso?.nombre || '',
        formato: recurso?.formato || 'pdf',
        archivo: recurso?.archivo || '',
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {recurso ? 'Editar Recurso' : 'Nuevo Recurso'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {publicacion.nombre}
                            </p>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                {/* Preview del archivo actual */}
                                {recurso && (
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-700 mb-3">
                                            Archivo actual:
                                        </p>
                                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="p-2 rounded-lg bg-blue-100 shrink-0">
                                                        <FileText className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-sm text-gray-900 truncate">
                                                            {recurso.nombre}
                                                        </p>
                                                        <p className="text-xs text-gray-500 uppercase mt-0.5">
                                                            {recurso.formato}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleDownload}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shrink-0 flex items-center gap-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Descargar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Formulario */}
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={recursoSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ isSubmitting, setFieldValue, values }) => (
                                        <Form className="space-y-5">
                                            {/* Nombre del recurso */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nombre del recurso
                                                </label>
                                                <Field
                                                    name="nombre"
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005873] focus:border-transparent"
                                                    placeholder="Ej: Guía completa de contabilidad"
                                                />
                                                <ErrorMessage
                                                    name="nombre"
                                                    component="p"
                                                    className="text-sm text-red-600 mt-1"
                                                />
                                            </div>

                                            {/* Upload de archivo */}
                                            <div>
                                                <FileUpload
                                                    value={values.archivo}
                                                    onChange={(base64, fileName, formato) => {
                                                        setFieldValue('archivo', base64);
                                                        setFieldValue('formato', formato);
                                                        if (!values.nombre) {
                                                            setFieldValue('nombre', fileName.replace(/\.[^/.]+$/, ''));
                                                        }
                                                    }}
                                                    label={recurso ? "Cambiar archivo" : "Subir archivo"}
                                                />
                                                <ErrorMessage
                                                    name="archivo"
                                                    component="p"
                                                    className="text-sm text-red-600 mt-1"
                                                />
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                                {/* Botón eliminar */}
                                                <div>
                                                    {recurso && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsDeleteDialogOpen(true)}
                                                            disabled={isSubmitting}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Botones cancelar y guardar */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => onOpenChange(false)}
                                                        disabled={isSubmitting}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-[#005873] rounded-lg hover:bg-[#7EB520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Guardando...
                                                            </>
                                                        ) : (
                                                            'Guardar'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar recurso"
                description="¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer."
            />
        </>
    );
}