import CRUDManager from "@/components/common/CRUDManager.tsx";
import type {CRUDConfig} from '@/types/crud.types.ts';
import type {Lead} from '@/types/lead.types.ts';
import {leadSchema} from "@/schemas/lead.schema.ts";
import {leadsService} from "@/services/leads.service.ts";
import {publicacionesService} from "@/services/publicaciones.service.ts";

const leadConfig: CRUDConfig<Lead> = {
    title: 'Gestión de Leads',
    actionName: 'Nuevo',
    singularName: 'Lead',
    viewMode: 'table',
    columns: [
        {
            key: 'publicacion',
            header: 'Publicación',
            accessor: (item: Lead) => item.publicacion?.nombre || 'N/A',
            className: 'font-medium',
        },
        {
            key: 'nombre',
            header: 'Nombres',
            accessor: 'nombres',
            className: 'font-medium',
        },
        {
            key: 'apellidos',
            header: 'Apellidos',
            accessor: 'apellidos',
        },
        {
            key: 'cedula',
            header: 'Cédula',
            accessor: 'cedula',
        },
        {
            key: 'celular',
            header: 'Celular',
            accessor: 'celular',
        },
        {
            key: 'provincia',
            header: 'Provincia',
            accessor: 'provincia',
        },
        {
            key: 'ciudad',
            header: 'Ciudad',
            accessor: 'ciudad',
        },
    ],
    formFields: [],
    validationSchema: leadSchema,
    service: leadsService,
    filters: [
        {
            name: 'publicacion',
            label: 'Filtrar por Publicación',
            type: 'select',
            fetchOptions: async () => {
                try {
                    const publicaciones = await publicacionesService.getAll();
                    return publicaciones.map(pub => ({
                        value: pub.id!,
                        label: pub.nombre
                    }));
                } catch (error) {
                    console.error('Error al cargar publicaciones:', error);
                    return [];
                }
            }
        },
        {
            name: 'cedula',
            label: 'Cedula',
            type: 'text',
            placeholder: 'Buscar por cedula...'
        },
    ]
};

export default function LeadsComponent() {
    return (
        <CRUDManager<Lead>
            config={leadConfig}
            readOnly={true}
        />
    )
}