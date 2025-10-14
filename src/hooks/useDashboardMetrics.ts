import { useState, useEffect } from 'react';
import { leadsService } from '@/services/leads.service';
import { prospectosService } from '@/services/prospectos.service';
import { publicacionesService } from '@/services/publicaciones.service';
import type { Prospecto } from '@/types/prospecto.types';
import type { Lead } from '@/types/lead.types';

interface DashboardMetrics {
    totalPublicaciones: number;
    totalLeads: number;
    totalProspectos: number;
    tasaConversion: string;
    loading: boolean;
    leadsPorPublicacion: { nombre: string; cantidad: number }[];
    prospectosPorMes: { mes: string; cantidad: number }[];
    leadsPorProvincia: { provincia: string; cantidad: number }[];
}

export function useDashboardMetrics() {
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalPublicaciones: 0,
        totalLeads: 0,
        totalProspectos: 0,
        tasaConversion: '0%',
        loading: true,
        leadsPorPublicacion: [],
        prospectosPorMes: [],
        leadsPorProvincia: [],
    });

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        try {
            const [publicaciones, leads, prospectos] = await Promise.all([
                publicacionesService.getAll(),
                leadsService.getAll(),
                prospectosService.getAll(),
            ]);

            const tasaConversionValue = leads.length > 0
                ? (prospectos.length / leads.length) * 100
                : 0;

            // 1. Leads por Publicación
            const leadsPorPub = publicaciones.map(pub => {
                const count = leads.filter((lead: Lead) => lead.idPublicaciones === pub.id).length;
                return { nombre: pub.nombre, cantidad: count };
            }).filter(item => item.cantidad > 0)
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 5);

            // 2. Prospectos por Mes
            const now = new Date();
            const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const prospectosPorMes: { mes: string; cantidad: number }[] = [];

            for (let i = 5; i >= 0; i--) {
                const fecha = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const mesInicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
                const mesFin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59);

                const count = prospectos.filter((prospecto: Prospecto) => {
                    if (!prospecto.fecha) return false;
                    const prospectoFecha = new Date(prospecto.fecha);
                    return prospectoFecha >= mesInicio && prospectoFecha <= mesFin;
                }).length;

                prospectosPorMes.push({
                    mes: mesesNombres[fecha.getMonth()],
                    cantidad: count
                });
            }

            // 3. Leads por Provincia
            const provinciaCount = leads.reduce((acc: Record<string, number>, lead: Lead) => {
                const provincia = lead.provincia || 'Sin especificar';
                acc[provincia] = (acc[provincia] || 0) + 1;
                return acc;
            }, {});

            const leadsPorProv = Object.entries(provinciaCount)
                .map(([provincia, cantidad]) => ({ provincia, cantidad: cantidad as number }))
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 5);

            setMetrics({
                totalPublicaciones: publicaciones.length,
                totalLeads: leads.length,
                totalProspectos: prospectos.length,
                tasaConversion: `${tasaConversionValue.toFixed(1)}%`,
                loading: false,
                leadsPorPublicacion: leadsPorPub,
                prospectosPorMes: prospectosPorMes,
                leadsPorProvincia: leadsPorProv,
            });
        } catch (error) {
            console.error('Error al cargar métricas:', error);
            setMetrics(prev => ({ ...prev, loading: false }));
        }
    };

    return metrics;
}