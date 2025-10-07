import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FileUpload from '@/components/common/FileUpload';
import { recursosService } from '@/services/recursos.service';
import { recursoSchema } from '@/schemas/recurso.schema';
import type { Recurso } from '@/types/recurso.types';
import type { Publicacion } from '@/types/publicacion.types';
import ConfirmDialog from '@/components/ui/confirm-dialog';

interface RecursoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    publicacion: Publicacion;
}

export function RecursoModal({ open, onOpenChange, publicacion }: RecursoModalProps) {
    const [recurso, setRecurso] = useState<Recurso | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Cargar el recurso cuando se abre el modal
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
                // Actualizar recurso existente
                await recursosService.update(recurso.id, values);
                toast.success('Recurso actualizado correctamente');
            } else {
                // Crear nuevo recurso
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

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {recurso ? 'Editar Recurso' : 'Nuevo Recurso'} - {publicacion.nombre}
                        </DialogTitle>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <>
                            {/* Preview del archivo existente */}
                            {recurso && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Archivo actual:</p>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="p-2 rounded-lg bg-blue-50">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">{recurso.nombre}</p>
                                                <p className="text-xs text-gray-500 uppercase">{recurso.formato}</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleDownload}
                                            className="ml-3"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Descargar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Formik
                                initialValues={initialValues}
                                validationSchema={recursoSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {({ isSubmitting, setFieldValue, values }) => (
                                    <Form className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nombre del recurso</label>
                                            <Field
                                                name="nombre"
                                                type="text"
                                                className="w-full px-3 py-2 border rounded-md"
                                                placeholder="Ej: Guía completa de contabilidad"
                                            />
                                            <ErrorMessage
                                                name="nombre"
                                                component="p"
                                                className="text-sm text-red-600"
                                            />
                                        </div>

                                        <FileUpload
                                            value={values.archivo}
                                            onChange={(base64, fileName, formato) => {
                                                setFieldValue('archivo', base64);
                                                setFieldValue('formato', formato);
                                                // Si no hay nombre, usar el nombre del archivo
                                                if (!values.nombre) {
                                                    setFieldValue('nombre', fileName.replace(/\.[^/.]+$/, ''));
                                                }
                                            }}
                                            label={recurso ? "Cambiar archivo" : "Subir archivo"}
                                        />
                                        <ErrorMessage
                                            name="archivo"
                                            component="p"
                                            className="text-sm text-red-600"
                                        />

                                        <div className="flex gap-3 justify-between pt-4">
                                            <div>
                                                {recurso && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => setIsDeleteDialogOpen(true)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
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
                                                    className="bg-[#005873] hover:bg-[#7EB520]"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Guardando...
                                                        </>
                                                    ) : (
                                                        'Guardar'
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </>
                    )}
                </DialogContent>
            </Dialog>

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