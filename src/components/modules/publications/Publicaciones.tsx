import CRUDManager from "@/components/common/CRUDManager.tsx";
import type {CRUDConfig} from '@/types/crud.types.ts';
import type {Publicacion} from '@/types/publicacion.types.ts';
import {publicacionSchema} from '@/schemas/publicacion.schema.ts';
import {publicacionesService} from '@/services/publicaciones.service.ts';
import {PublicationModal} from "@/components/modules/publications/publication-modal.tsx";

const publicacionesConfig: CRUDConfig<Publicacion> = {
    title: 'Publicaciones',
    actionName: 'Nueva',
    singularName: 'Publicación',
    viewMode: 'cards',
    cardConfig: {
        title: (item) => item.nombre,
        description: (item) => item.url,
    },
    columns: [
        {
            key: 'nombre',
            header: 'Nombre',
            accessor: 'nombre',
            className: 'font-medium',
        },
        {
            key: 'url',
            header: 'URL',
            accessor: 'url',
        },
        {
            key: 'titulo1',
            header: 'Título 1',
            accessor: 'titulo1',
        },
        {
            key: 'titulo2',
            header: 'Título 2',
            accessor: 'titulo2',
        },
    ],

    formFields: [
        {
            name: 'nombre',
            label: 'Nombre',
            type: 'text',
            placeholder: 'Guía de restaurantes',
        },
        {
            name: 'url',
            label: 'URL',
            type: 'text',
            placeholder: '/restaurantes',
        },
        {
            name: 'titulo1',
            label: 'Título 1',
            type: 'text',
            placeholder: 'Cómo promocionar tu restaurante',
        },
        {
            name: 'texto1',
            label: 'Texto 1',
            type: 'textarea',
            placeholder: 'Descubre las mejores estrategias...',
            rows: 3,
        },
        {
            name: 'imagen1',
            label: 'Imagen 1',
            type: 'image',
        },
        {
            name: 'titulo2',
            label: 'Título 2',
            type: 'text',
            placeholder: 'Casos de Éxito',
        },
        {
            name: 'texto2',
            label: 'Texto 2',
            type: 'textarea',
            placeholder: 'Conoce casos reales...',
            rows: 3,
        },
        {
            name: 'imagen2',
            label: 'Imagen 2',
            type: 'image',
        },
    ],

    validationSchema: publicacionSchema,
    service: publicacionesService,
};

export default function PublicacionesComponent() {
    return (
        <CRUDManager<Publicacion>
            config={publicacionesConfig}
            ViewComponent={PublicationModal}
        />
    )
}