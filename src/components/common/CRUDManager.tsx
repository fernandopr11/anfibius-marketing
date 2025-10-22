import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import DataTable from './DataTable';
import DynamicForm from './DynamicForm';
import Filters from "@/components/common/Filter.tsx";
import ConfirmDialog from '@/components/ui/confirm-dialog.tsx';
import type { BaseEntity, CRUDConfig } from '@/types/crud.types';

interface CRUDManagerProps<T extends BaseEntity> {
    config: CRUDConfig<T>;
    className?: string;
    ViewComponent?: React.ComponentType<{ data: T; open: boolean; onOpenChange: (open: boolean) => void }>;
    FileManageComponent?: React.ComponentType<{ publicacion: T; open: boolean; onOpenChange: (open: boolean) => void }>;
    readOnly?: boolean;
}

export default function CRUDManager<T extends BaseEntity>({
                                                              config,
                                                              className = '',
                                                              ViewComponent,
                                                              FileManageComponent,
                                                              readOnly = false,
                                                          }: CRUDManagerProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isFileManageModalOpen, setIsFileManageModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [viewItem, setViewItem] = useState<T | null>(null);
    const [fileManageItem, setFileManageItem] = useState<T | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

    // Determinar qué acciones están habilitadas
    const actions = readOnly
        ? { canCreate: false, canEdit: false, canDelete: false, canView: true }
        : {
            canCreate: config.customActions?.canCreate ?? true,
            canEdit: config.customActions?.canEdit ?? true,
            canDelete: config.customActions?.canDelete ?? true,
            canView: config.customActions?.canView ?? !!ViewComponent,
        };

    const fetchData = async (filters?: Record<string, any>) => {
        try {
            setLoading(true);
            let result;

            // Si hay filtros y el servicio soporta filtrado
            if (filters && Object.keys(filters).length > 0 && config.service.getFiltered) {
                result = await config.service.getFiltered(filters);
            } else {
                result = await config.service.getAll();
            }

            setData(result);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error(`Error al cargar ${config.title.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterChange = (filters: Record<string, any>) => {
        setActiveFilters(filters);
        fetchData(filters);
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: T) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleView = (item: T) => {
        setViewItem(item);
        setIsViewModalOpen(true);
    };

    const handleManageFiles = (item: T) => {
        setFileManageItem(item);
        setIsFileManageModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        try {
            await config.service.delete(itemToDelete);

            // Actualizar el estado local removiendo el item eliminado sin recargar toda la tabla
            setData(prevData => prevData.filter(item => item.id !== itemToDelete));

            toast.success(`${config.singularName} eliminado correctamente`);
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error(`Error al eliminar ${config.singularName.toLowerCase()}`);
        } finally {
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (selectedItem?.id) {
                // Actualizar item existente
                const updatedItem = await config.service.update(selectedItem.id, values);

                // Actualizar el estado local sin recargar toda la tabla
                setData(prevData =>
                    prevData.map(item =>
                        item.id === selectedItem.id ? updatedItem : item
                    )
                );

                toast.success(`${config.singularName} actualizado correctamente`);
            } else {
                // Crear nuevo item
                const newItem = await config.service.create(values);

                // Agregar el nuevo item al estado local sin recargar toda la tabla
                setData(prevData => [...prevData, newItem]);

                toast.success(`${config.singularName} creado correctamente`);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al guardar:', error);
            toast.error(`Error al guardar ${config.singularName.toLowerCase()}`);
        }
    };

    const getInitialValues = () => {
        if (selectedItem) {
            return selectedItem;
        }
        return config.formFields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {} as Record<string, any>);
    };

    if (loading) {
        return <div className="text-center py-8">Cargando...</div>;
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{config.title}</h2>
                {actions.canCreate && (
                    <Button onClick={handleCreate} className="bg-[#005873] hover:bg-[#7EB520]">
                        <Plus className="w-4 h-4 mr-2" />
                        {config.actionName} {config.singularName}
                    </Button>
                )}
            </div>

            {/* Filtros */}
            {config.filters && config.filters.length > 0 && (
                <Filters
                    filters={config.filters}
                    onFilterChange={handleFilterChange}
                />
            )}

            <DataTable
                data={data}
                columns={config.columns}
                onEdit={actions.canEdit ? handleEdit : undefined}
                onDelete={actions.canDelete ? handleDeleteClick : undefined}
                onView={actions.canView ? handleView : undefined}
                onManageFiles={actions.canEdit && FileManageComponent ? handleManageFiles : undefined}
                emptyMessage={`No hay ${config.title.toLowerCase()}. ${actions.canCreate ? 'Crea uno nuevo.' : ''}`}
                viewMode={config.viewMode}
                cardConfig={config.cardConfig}
                readOnly={readOnly}
            />

            {/* Modal de edición/creación */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedItem ? `Editar ${config.singularName}` : `Nuevo ${config.singularName}`}
                        </DialogTitle>
                    </DialogHeader>
                    <DynamicForm
                        fields={config.formFields}
                        initialValues={getInitialValues()}
                        validationSchema={config.validationSchema}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Modal de vista personalizado */}
            {ViewComponent && viewItem && (
                <ViewComponent
                    data={viewItem}
                    open={isViewModalOpen}
                    onOpenChange={setIsViewModalOpen}
                />
            )}

            {/* Modal de gestión de archivos/recursos */}
            {FileManageComponent && fileManageItem && (
                <FileManageComponent
                    publicacion={fileManageItem}
                    open={isFileManageModalOpen}
                    onOpenChange={setIsFileManageModalOpen}
                />
            )}

            {/* Dialog de confirmación de eliminación */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={`Eliminar ${config.singularName.toLowerCase()}`}
                description={`Esta accion no se puede deshacer. Se eliminara permanentemente este ${config.singularName.toLowerCase()}.`}
            />
        </div>
    );
}