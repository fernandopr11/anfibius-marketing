import CRUDManager from "@/components/common/CRUDManager.tsx";
import type {CRUDConfig} from '@/types/crud.types.ts';
import type {Publicacion} from '@/types/publicacion.types.ts';
import {publicacionSchema} from '@/schemas/publicacion.schema.ts';
import {publicacionesService} from '@/services/publicaciones.service.ts';
import {PublicationModal} from "@/components/admin/publications/publication-modal.tsx";
import {RecursoModal} from "@/components/admin/publications/recurso-modal.tsx";

const publicacionesConfig: CRUDConfig<Publicacion> = {
    title: 'Gestión de Publicaciones',
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
        },
        {
            name: 'url',
            label: 'URL',
            type: 'text',
        },
        {
            name: 'titulo1',
            label: 'Título 1',
            type: 'text',
        },
        {
            name: 'texto1',
            label: 'Texto 1',
            type: 'richtext',
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
        },
        {
            name: 'texto2',
            label: 'Texto 2',
            type: 'richtext',
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
            FileManageComponent={RecursoModal}
        />
    )
}