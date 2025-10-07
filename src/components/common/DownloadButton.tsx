import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LeadModal } from './LeadModal';
import type { Recurso } from '@/types/recurso.types';

interface DownloadButtonProps {
    idPublicacion: number;
    nombrePublicacion: string;
    recurso: Recurso;
}

export function DownloadButton({ idPublicacion, nombrePublicacion, recurso }: DownloadButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = recurso.archivo;
        link.download = `${recurso.nombre}.${recurso.formato}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Button
                size="lg"
                className="text-base px-8 bg-[#7EB520] hover:bg-[#6DA018]"
                onClick={() => setIsModalOpen(true)}
            >
                Descargarla ahora
            </Button>

            <LeadModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                idPublicacion={idPublicacion}
                nombrePublicacion={nombrePublicacion}
                onSuccess={handleDownload}
            />
        </>
    );
}