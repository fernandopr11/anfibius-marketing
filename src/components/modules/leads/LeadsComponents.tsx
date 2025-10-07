import CRUDManager from "@/components/common/CRUDManager.tsx";
import type {CRUDConfig} from '@/types/crud.types.ts';
import type {Lead} from '@/types/lead.types.ts';
import {leadSchema} from "@/schemas/lead.schema.ts";
import {leadsService} from "@/services/leads.service.ts";

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
};

export default function LeadsComponent() {
    return (
        <CRUDManager<Lead>
            config={leadConfig}
            readOnly={true}
        />
    )
}