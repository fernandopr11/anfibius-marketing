import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import type { FilterField } from '@/types/crud.types';

interface FiltersProps {
    filters: FilterField[];
    onFilterChange: (filters: Record<string, any>) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [showFilters, setShowFilters] = useState(false);
    const [filterOptions, setFilterOptions] = useState<Record<string, { value: string | number; label: string }[]>>({});

    useEffect(() => {
        filters.forEach(async (filter) => {
            if (filter.fetchOptions) {
                const options = await filter.fetchOptions();
                setFilterOptions((prev) => ({
                    ...prev,
                    [filter.name]: options,
                }));
            }
        });
    }, [filters]);

    const handleFilterChange = (name: string, value: any) => {
        const newFilters = { ...filterValues, [name]: value };
        setFilterValues(newFilters);
    };

    const applyFilters = () => {
        // Filtrar valores vacíos
        const activeFilters = Object.entries(filterValues).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, any>);

        onFilterChange(activeFilters);
    };

    const clearFilters = () => {
        setFilterValues({});
        onFilterChange({});
    };

    const hasActiveFilters = Object.values(filterValues).some(
        (value) => value !== '' && value !== null && value !== undefined
    );

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-2 text-red-600 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                        Limpiar filtros
                    </Button>
                )}
            </div>

            {showFilters && (
                <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {filters.map((filter) => (
                            <div key={filter.name} className="space-y-2">
                                <label className="text-sm font-medium">{filter.label}</label>

                                {filter.type === 'select' && (
                                    <select
                                        value={filterValues[filter.name] || ''}
                                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md bg-white"
                                    >
                                        <option value="">Todos</option>
                                        {(filter.options || filterOptions[filter.name] || []).map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {filter.type === 'text' && (
                                    <input
                                        type="text"
                                        value={filterValues[filter.name] || ''}
                                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                        placeholder={filter.placeholder}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                )}

                                {filter.type === 'number' && (
                                    <input
                                        type="number"
                                        value={filterValues[filter.name] || ''}
                                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                        placeholder={filter.placeholder}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                )}

                                {filter.type === 'date' && (
                                    <input
                                        type="date"
                                        value={filterValues[filter.name] || ''}
                                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={applyFilters}
                            className="bg-[#005873] hover:bg-[#7EB520]"
                            size="sm"
                        >
                            Aplicar filtros
                        </Button>
                        <Button
                            onClick={clearFilters}
                            variant="outline"
                            size="sm"
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}