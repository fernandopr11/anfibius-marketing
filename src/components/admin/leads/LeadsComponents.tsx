import { useState, useEffect } from 'react';
import CRUDManager from "@/components/common/CRUDManager.tsx";
import type {CRUDConfig} from '@/types/crud.types.ts';
import type {Lead} from '@/types/lead.types.ts';
import {leadSchema} from "@/schemas/lead.schema.ts";
import {leadsService} from "@/services/leads.service.ts";
import {publicacionesService} from "@/services/publicaciones.service.ts";
import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {exportToExcelWithColumns} from "@/lib/excel";
import {toast} from "sonner";

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
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isExporting, setIsExporting] = useState(false);

    // Cargar leads al montar el componente
    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const data = await leadsService.getAll();
            setLeads(data);
        } catch (error) {
            console.error('Error al cargar leads:', error);
        }
    };

    const handleExportToExcel = () => {
        try {
            setIsExporting(true);

            if (leads.length === 0) {
                toast.warning('No hay datos para exportar');
                return;
            }

            // Definir las columnas para la exportación
            const columns = [
                { header: 'Publicación', accessor: (lead: Lead) => lead.publicacion?.nombre || 'N/A' },
                { header: 'Nombres', accessor: 'nombres' as keyof Lead },
                { header: 'Apellidos', accessor: 'apellidos' as keyof Lead },
                { header: 'Cédula', accessor: 'cedula' as keyof Lead },
                { header: 'Celular', accessor: 'celular' as keyof Lead },
                { header: 'Provincia', accessor: 'provincia' as keyof Lead },
                { header: 'Ciudad', accessor: 'ciudad' as keyof Lead },
            ];

            // Generar el nombre del archivo con la fecha actual
            const fecha = new Date().toISOString().split('T')[0];
            const filename = `leads_${fecha}`;

            // Exportar
            exportToExcelWithColumns(leads, columns, filename, 'Leads');

            toast.success('Archivo Excel generado correctamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            toast.error('Error al generar el archivo Excel');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    onClick={handleExportToExcel}
                    disabled={isExporting || leads.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? 'Exportando...' : 'Descargar Excel'}
                </Button>
            </div>

            <CRUDManager<Lead>
                config={leadConfig}
                readOnly={true}
            />
        </div>
    );
}