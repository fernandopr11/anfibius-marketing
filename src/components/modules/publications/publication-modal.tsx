import {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {ExternalLink, Download, FileText, Loader2} from "lucide-react";
import type {Publicacion} from '@/types/publicacion.types.ts';
import type {Recurso} from '@/types/recurso.types.ts';
import {recursosService} from '@/services/recursos.service';

interface PublicationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Publicacion;
}

export function PublicationModal({open, onOpenChange, data}: PublicationModalProps) {
    const [recurso, setRecurso] = useState<Recurso | null>(null);
    const [loadingRecurso, setLoadingRecurso] = useState(false);

    useEffect(() => {
        if (open && data.id) {
            loadRecurso();
        }
    }, [open, data.id]);

    const loadRecurso = async () => {
        try {
            setLoadingRecurso(true);
            const data_recurso = await recursosService.getByPublicacion(data.id!);
            setRecurso(data_recurso);
        } catch (error) {
            console.error('Error al cargar recurso:', error);
        } finally {
            setLoadingRecurso(false);
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[65vw] !w-[65vw] !h-auto max-h-[90vh] p-0 gap-0">
                <DialogHeader className="border-b border-border px-8 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-1">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">{data.nombre}</DialogTitle>
                            {data.url && (
                                <a
                                    href={data.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ExternalLink className="h-3.5 w-3.5"/>
                                    <span className="hover:underline">{data.url}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid lg:grid-cols-[45%_55%] gap-0 overflow-hidden max-h-[calc(95vh-160px)]">
                    {/* Left Side - Images */}
                    <div className="bg-muted/30 p-8 overflow-y-auto">
                        <div className="space-y-6">
                            <div className="grid gap-5">
                                {[data.imagen1, data.imagen2].map(
                                    (img, i) =>
                                        img && (
                                            <div key={i}
                                                 className="relative h-[180px] rounded-xl overflow-hidden bg-muted shadow-lg">
                                                <img
                                                    src={img}
                                                    alt={`Imagen ${i + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                />
                                            </div>
                                        )
                                )}
                            </div>

                            {/* Recurso/Archivo */}
                            {loadingRecurso ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400"/>
                                </div>
                            ) : recurso ? (
                                <div className="pt-2">
                                    <div
                                        className="flex items-center justify-between p-5 rounded-xl border border-border bg-card hover:bg-accent transition-colors shadow-sm">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                                                <FileText className="h-5 w-5 text-primary"/>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-base truncate">{recurso.nombre}</p>
                                                <p className="text-sm text-muted-foreground uppercase">{recurso.formato}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="default"
                                            className="ml-3 shrink-0"
                                            onClick={handleDownload}
                                        >
                                            <Download className="h-4 w-4 mr-2"/>
                                            Descargar
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="overflow-y-auto">
                        <div className="p-8 space-y-8">
                            {/* Content Section 1 */}
                            <div className="space-y-4">
                                <Badge variant="secondary" className="mb-2 text-xs">
                                    Sección 1
                                </Badge>
                                <h2 className="text-2xl font-semibold tracking-tight text-balance leading-tight">{data.titulo1}</h2>
                                <p className="text-base leading-relaxed text-muted-foreground text-pretty">{data.texto1}</p>
                            </div>

                            <Separator/>

                            {/* Content Section 2 */}
                            <div className="space-y-4">
                                <Badge variant="secondary" className="mb-2 text-xs">
                                    Sección 2
                                </Badge>
                                <h2 className="text-2xl font-semibold tracking-tight text-balance leading-tight">{data.titulo2}</h2>
                                <p className="text-base leading-relaxed text-muted-foreground text-pretty">{data.texto2}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}