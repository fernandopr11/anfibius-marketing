import CRUDManager from "@/components/common/CRUDManager.tsx";
import type {CRUDConfig} from '@/types/crud.types.ts';
import type {Prospecto} from "@/types/prospecto.types.ts";
import {prospectoSchema} from "@/schemas/prospecto.schema.ts";
import {prospectosService} from "@/services/prospectos.service.ts";
import {leadsService} from "@/services/leads.service.ts";


const prospectoConfig: CRUDConfig<Prospecto> = {
    title: 'Gestión de Prospectos',
    actionName: 'Nuevo',
    singularName: 'Prospecto',
    viewMode: 'table',
    columns: [
        {
            key: 'nombres',
            header: 'Nombres',
            accessor: (item: Prospecto) => item.persona?.nombres || 'N/A',
            className: 'font-medium',
        },
        {
            key: 'apellidos',
            header: 'Apellidos',
            accessor: (item: Prospecto) => item.persona?.apellidos || 'N/A',
            className: 'font-medium',
        },
        {
            key: 'celular',
            header: 'Celular',
            accessor: (item: Prospecto) => item.persona?.celular || 'N/A',
            className: 'font-medium',
        },
        {
            key: 'cedula',
            header: 'Cédula',
            accessor: (item: Prospecto) => item.persona?.cedula || 'N/A',
            className: 'font-medium',
        },
        {
            key: 'contacto',
            header: 'Método de Contacto',
            accessor: 'metodo',
            className: 'font-medium',
        },
        {
            key: 'empresa',
            header: 'Empresa',
            accessor: 'empresa',
            className: 'font-medium',
        },
        {
            key: 'empleados',
            header: 'Cantidad Empleados',
            accessor: 'empleados',
            className: 'text-center'
        },
        {
            key: 'negocio',
            header: 'Giro de negocio',
            accessor: 'giro',
            className: 'text-center'
        },
        {
            key: 'fecha',
            header: 'Fecha',
            accessor: 'fecha',
            className: 'text-center'
        }
    ],
    formFields: [],
    validationSchema: prospectoSchema,
    service: prospectosService,
    filters: [
        {
            name: 'persona',
            label: 'Filtrar por Persona',
            type: 'select',
            fetchOptions: async () => {
                try {
                    const leads = await leadsService.getAll();
                    return leads.map(lead => ({
                        value: lead.id!,
                        label: `${lead.nombres} ${lead.apellidos} (${lead.cedula})`
                    }));
                } catch (error) {
                    console.error('Error al cargar leads:', error);
                    return [];
                }
            }
        },
        {
            name: 'fecha',
            label: 'Filtrar por Fecha',
            type: 'date',
        },
    ]


};

export default function ProspectoComponent() {
    return (
        <CRUDManager<Prospecto>
            config={prospectoConfig}
            readOnly={true}
        />
    )
}