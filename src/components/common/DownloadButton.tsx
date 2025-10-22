import {useState} from 'react';
import {Button} from "@/components/ui/button";
import {LeadModal} from './LeadModal';
import type {Recurso} from '@/types/recurso.types';

interface DownloadButtonProps {
    idPublicacion: number;
    nombrePublicacion: string;
    recurso?: Recurso | null;
}

export function DownloadButton({idPublicacion, nombrePublicacion, recurso}: DownloadButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // No mostrar el botón si no hay recurso
    if (!recurso) return null;

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

            />
        </>
    );
}