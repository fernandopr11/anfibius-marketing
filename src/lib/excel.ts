import * as XLSX from 'xlsx';

/**
 * Exporta datos a un archivo Excel
 * @param data Array de objetos con los datos a exportar
 * @param filename Nombre del archivo (sin extensión)
 * @param sheetName Nombre de la hoja
 */
export function exportToExcel<T extends Record<string, any>>(
    data: T[],
    filename: string = 'export',
    sheetName: string = 'Sheet1'
): void {
    try {
        // Crear un nuevo libro de trabajo
        const workbook = XLSX.utils.book_new();

        // Convertir los datos a una hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Generar el archivo y descargarlo
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        throw new Error('Error al generar el archivo Excel');
    }
}

/**
 * Exporta datos con columnas personalizadas
 * @param data Array de objetos con los datos originales
 * @param columns Mapeo de columnas (key: nombre de la columna, accessor: función o key para obtener el valor)
 * @param filename Nombre del archivo
 * @param sheetName Nombre de la hoja
 */
export function exportToExcelWithColumns<T>(
    data: T[],
    columns: { header: string; accessor: keyof T | ((item: T) => any) }[],
    filename: string = 'export',
    sheetName: string = 'Sheet1'
): void {
    try {
        // Transformar los datos según las columnas especificadas
        const transformedData = data.map(item => {
            const row: Record<string, any> = {};
            columns.forEach(col => {
                const value = typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : item[col.accessor];
                row[col.header] = value ?? '';
            });
            return row;
        });

        exportToExcel(transformedData, filename, sheetName);
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        throw new Error('Error al generar el archivo Excel');
    }
}
