import type {ReactNode} from 'react';
import * as Yup from 'yup';

export interface BaseEntity {
    id?: number;
}

export interface Column<T> {
    key: string;
    header: string;
    accessor?: keyof T | ((item: T) => ReactNode);
    render?: (item: T) => ReactNode;
    sortable?: boolean;
    className?: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'email' | 'url' | 'number' | 'select' | 'image' | 'richtext';
    placeholder?: string;
    rows?: number;
    options?: { value: string; label: string }[];
    className?: string;
}

// NUEVO: Definición de filtros
export interface FilterField {
    name: string;
    label: string;
    type: 'select' | 'text' | 'number' | 'date';
    placeholder?: string;
    options?: { value: string | number; label: string }[];
    fetchOptions?: () => Promise<{ value: string | number; label: string }[]>;
}

export interface CRUDService<T extends BaseEntity> {
    getAll: () => Promise<T[]>;
    create: (data: any) => Promise<T>;
    update: (id: number, data: any) => Promise<T>;
    delete: (id: number) => Promise<void>;
    // NUEVO: Método opcional para filtrar
    getFiltered?: (filters: Record<string, any>) => Promise<T[]>;
}

export interface CRUDConfig<T extends BaseEntity> {
    title: string;
    actionName: string;
    singularName: string;
    columns: Column<T>[];
    formFields: FormField[];
    validationSchema: Yup.ObjectSchema<any>;
    service: CRUDService<T>;
    viewMode?: 'table' | 'cards';
    cardConfig?: {
        title: (item: T) => React.ReactNode;
        description: (item: T) => React.ReactNode;
    };
    filters?: FilterField[];
    customActions?: {
        canCreate?: boolean;
        canEdit?: boolean;
        canDelete?: boolean;
        canView?: boolean;
    };
}

export interface PaginationConfig {
    pageSize?: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
}