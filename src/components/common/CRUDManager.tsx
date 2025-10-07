import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Plus} from 'lucide-react';
import {toast} from 'sonner';
import DataTable from './DataTable';
import DynamicForm from './DynamicForm';
import ConfirmDialog from '@/components/ui/confirm-dialog.tsx';
import type {BaseEntity, CRUDConfig} from '@/types/crud.types';

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

    const fetchData = async () => {
        try {
            const result = await config.service.getAll();
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
            toast.success(`${config.singularName} eliminado correctamente`);
            await fetchData();
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
                await config.service.update(selectedItem.id, values);
                toast.success(`${config.singularName} actualizado correctamente`);
            } else {
                await config.service.create(values);
                toast.success(`${config.singularName} creado correctamente`);
            }
            setIsModalOpen(false);
            await fetchData();
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
                {!readOnly && (
                    <Button onClick={handleCreate} className="bg-[#005873] hover:bg-[#7EB520]">
                        <Plus className="w-4 h-4 mr-2"/>
                        {config.actionName} {config.singularName}
                    </Button>
                )}
            </div>

            <DataTable
                data={data}
                columns={config.columns}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={ViewComponent ? handleView : undefined}
                onManageFiles={!readOnly && FileManageComponent ? handleManageFiles : undefined}
                emptyMessage={`No hay ${config.title.toLowerCase()}. ${!readOnly ? 'Crea uno nuevo.' : ''}`}
                viewMode={config.viewMode}
                cardConfig={config.cardConfig}
                readOnly={readOnly}
            />

            {/* Modal de edición/creación */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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