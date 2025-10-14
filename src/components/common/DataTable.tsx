import {type ReactNode, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
import {Pencil, Trash2, Eye, MoreVertical, FolderOpen} from 'lucide-react';
import type {BaseEntity, Column} from '@/types/crud.types';

type ViewMode = 'table' | 'cards';

interface DataTableProps<T extends BaseEntity> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (id: number) => void;
    onView?: (item: T) => void;
    onManageFiles?: (item: T) => void;
    emptyMessage?: string;
    pageSize?: number;
    className?: string;
    viewMode?: ViewMode;
    cardConfig?: {
        title: (item: T) => ReactNode;
        description: (item: T) => ReactNode;
    };
    readOnly?: boolean;
}

export default function DataTable<T extends BaseEntity>({
                                                            data,
                                                            columns,
                                                            onEdit,
                                                            onDelete,
                                                            onView,
                                                            onManageFiles,
                                                            emptyMessage = 'No hay datos disponibles',
                                                            pageSize = 10,
                                                            className = '',
                                                            viewMode = 'table',
                                                            cardConfig,
                                                            readOnly
                                                        }: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

    const getCellValue = (item: T, column: Column<T>) => {
        if (column.render) {
            return column.render(item);
        }
        if (typeof column.accessor === 'function') {
            return column.accessor(item);
        }
        if (column.accessor) {
            return item[column.accessor] as ReactNode;
        }
        return null;
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className={
                                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>

                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className={
                                    currentPage === totalPages
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        );
    };

    // Verificar si hay alguna acción disponible
    const hasActions = !readOnly && (onView || onManageFiles || onEdit || onDelete);

    const renderCards = () => {
        if (!cardConfig) return null;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentData.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        {emptyMessage}
                    </div>
                ) : (
                    currentData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {cardConfig.title(item)}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {cardConfig.description(item)}
                                    </p>
                                </div>
                                {hasActions && (
                                    <div className="flex gap-1 ml-4">
                                        <TooltipProvider>
                                            {onView && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onView(item)}
                                                            className="h-8 w-8 p-0 hover:bg-blue-50"
                                                        >
                                                            <Eye className="w-4 h-4 text-blue-600"/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Ver detalles</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            {onManageFiles && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onManageFiles(item)}
                                                            className="h-8 w-8 p-0 hover:bg-green-50"
                                                        >
                                                            <FolderOpen className="w-4 h-4 text-green-600"/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Gestionar recursos</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            {onEdit && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onEdit(item)}
                                                            className="h-8 w-8 p-0 hover:bg-yellow-50"
                                                        >
                                                            <Pencil className="w-4 h-4 text-yellow-600"/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Editar</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            {onDelete && item.id && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => onDelete(item.id!)}
                                                            className="h-8 w-8 p-0 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600"/>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Eliminar</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    };

    const renderTable = () => {
        return (
            <div className="bg-white rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key} className={column.className}>
                                    {column.header}
                                </TableHead>
                            ))}
                            {hasActions && <TableHead className="text-right">Acciones</TableHead>}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (hasActions ? 1 : 0)}
                                    className="text-center py-8 text-gray-500"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentData.map((item, index) => (
                                <TableRow key={item.id || index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key} className={column.className}>
                                            {getCellValue(item, column)}
                                        </TableCell>
                                    ))}
                                    {hasActions && (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {onView && (
                                                        <DropdownMenuItem onClick={() => onView(item)}>
                                                            <Eye className="mr-2 h-4 w-4 text-blue-600"/>
                                                            Ver
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onManageFiles && (
                                                        <DropdownMenuItem onClick={() => onManageFiles(item)}>
                                                            <FolderOpen className="mr-2 h-4 w-4 text-green-600"/>
                                                            Recursos
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onEdit && (
                                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                                            <Pencil className="mr-2 h-4 w-4 text-yellow-600"/>
                                                            Editar
                                                        </DropdownMenuItem>
                                                    )}
                                                    {onDelete && item.id && (
                                                        <DropdownMenuItem
                                                            onClick={() => onDelete(item.id!)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4 text-red-600"/>
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {viewMode === 'table' ? renderTable() : renderCards()}
            {renderPagination()}
        </div>
    );
}