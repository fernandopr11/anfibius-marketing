import {useState} from 'react';
import {Button} from "@/components/ui/button";
import {LeadModal} from './LeadModal';
import type {Recurso} from '@/types/recurso.types';

interface DownloadButtonProps {
    idPublicacion: number;
    nombrePublicacion: string;
}

export function DownloadButton({idPublicacion, nombrePublicacion}: DownloadButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

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