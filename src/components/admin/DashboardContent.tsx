import {FileText, Users, UserCheck, TrendingUp, Download} from 'lucide-react';
import {useDashboardMetrics} from '@/hooks/useDashboardMetrics';
import {cn} from '@/lib/utils';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';
import {useCallback, useRef, useState} from 'react';

export default function DashboardContent() {
    const metrics = useDashboardMetrics();
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const exportToPDF = useCallback(async () => {
        if (!contentRef.current) return;

        setIsExporting(true);

        try {
            const [{default: html2canvas}, {default: jsPDF}] = await Promise.all([
                import('html2canvas-pro'),
                import('jspdf')
            ]);

            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: contentRef.current.scrollWidth,
                windowHeight: contentRef.current.scrollHeight,
                onclone: (clonedDoc) => {
                    // Asegurar que los gráficos SVG se capturen correctamente
                    const clonedContent = clonedDoc.querySelector('[data-export-content]');
                    if (clonedContent) {
                        (clonedContent as HTMLElement).style.display = 'block';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgWidth = 297;
            const pageHeight = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let finalWidth = imgWidth;
            let finalHeight = imgHeight;

            if (imgHeight > pageHeight) {
                finalHeight = pageHeight;
                finalWidth = (canvas.width * pageHeight) / canvas.height;
            }

            const xOffset = (imgWidth - finalWidth) / 2;
            const yOffset = (pageHeight - finalHeight) / 2;

            pdf.addImage(
                imgData,
                'PNG',
                xOffset,
                yOffset,
                finalWidth,
                finalHeight,
                undefined,
                'FAST'
            );
            pdf.save(`dashboard-reporte-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error al exportar PDF:', error);
            alert('Error al generar el PDF. Por favor, intenta de nuevo.');
        } finally {
            setIsExporting(false);
        }
    }, []);

    if (metrics.loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005873]"></div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Publicaciones',
            value: metrics.totalPublicaciones.toString(),
            icon: FileText,
            iconBgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            description: 'Total de publicaciones activas',
        },
        {
            title: 'Leads',
            value: metrics.totalLeads.toString(),
            icon: Users,
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            description: 'Total de leads registrados',
        },
        {
            title: 'Prospectos',
            value: metrics.totalProspectos.toString(),
            icon: UserCheck,
            iconBgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            description: 'Total de prospectos',
        },
        {
            title: 'Tasa de Conversión',
            value: metrics.tasaConversion,
            icon: TrendingUp,
            iconBgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            description: 'Leads → Prospectos',
        },
    ];

    const barChartOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: metrics.leadsPorPublicacion.map(item => item.nombre),
            axisLabel: {
                interval: 0,
                rotate: 45,
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Leads',
                type: 'bar',
                data: metrics.leadsPorPublicacion.map(item => item.cantidad),
                itemStyle: {
                    color: '#3b82f6',
                    borderRadius: [8, 8, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        color: '#2563eb'
                    }
                }
            }
        ]
    };

    const lineChartOption = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: metrics.prospectosPorMes.map(item => item.mes),
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Prospectos',
                type: 'line',
                data: metrics.prospectosPorMes.map(item => item.cantidad),
                smooth: true,
                lineStyle: {
                    color: '#f97316',
                    width: 3
                },
                itemStyle: {
                    color: '#f97316'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(249, 115, 22, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(249, 115, 22, 0.05)'
                            }
                        ]
                    }
                },
                emphasis: {
                    focus: 'series'
                }
            }
        ]
    };

    const pieChartOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Leads',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}: {c}'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                data: metrics.leadsPorProvincia.map((item, index) => ({
                    value: item.cantidad,
                    name: item.provincia,
                    itemStyle: {
                        color: ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#f59e0b'][index]
                    }
                }))
            }
        ]
    };

    return (
        <>
            {/* Botón de exportación */}
            <div className="mb-6 flex justify-end">
                <button
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#005873] text-white rounded-md hover:bg-[#004860] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {isExporting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generando PDF...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4"/>
                            <span>Exportar a PDF</span>
                        </>
                    )}
                </button>
            </div>

            {/* Contenido a exportar */}
            <div ref={contentRef} data-export-content className="space-y-6 p-6 rounded-lg">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="border-border/50 hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-foreground mb-2">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                    </div>
                                    <div className={cn("rounded-lg p-3", stat.iconBgColor)}>
                                        <stat.icon className={cn("w-6 h-6", stat.iconColor)}/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Leads por Publicación</CardTitle>
                            <CardDescription>Top 5 publicaciones con más leads</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReactECharts
                                option={barChartOption}
                                style={{height: '300px'}}
                                opts={{renderer: 'svg'}}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Tendencia de Prospectos</CardTitle>
                            <CardDescription>Últimos 6 meses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReactECharts
                                option={lineChartOption}
                                style={{height: '300px'}}
                                opts={{renderer: 'svg'}}
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Distribución Geográfica</CardTitle>
                        <CardDescription>Top 5 provincias con más leads</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ReactECharts
                            option={pieChartOption}
                            style={{height: '350px'}}
                            opts={{renderer: 'svg'}}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
