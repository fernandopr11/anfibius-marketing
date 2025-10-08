import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
    value: string;
    onChange: (base64: string, fileName: string, formato: 'pdf' | 'docx' | 'xlsx' | 'pptx') => void;
    label?: string;
    maxSizeInMB?: number;
}

export default function FileUpload({
                                       value,
                                       onChange,
                                       label = 'Subir archivo',
                                       maxSizeInMB = 10,
                                   }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mapeo de MIME types a formato
    const getFormatoFromMimeType = (mimeType: string): 'pdf' | 'docx' | 'xlsx' | 'pptx' => {
        const mimeToFormato: Record<string, 'pdf' | 'docx' | 'xlsx' | 'pptx'> = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        };
        return mimeToFormato[mimeType] || 'pdf';
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFile = async (file: File) => {
        // Validar tipo de archivo
        const validMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ];

        if (!validMimeTypes.includes(file.type)) {
            alert('Solo se permiten archivos PDF, DOCX, XLSX o PPTX');
            return;
        }

        // Validar tamaño
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            alert(`El archivo no debe superar ${maxSizeInMB}MB`);
            return;
        }

        try {
            const base64 = await convertToBase64(file);
            const formato = getFormatoFromMimeType(file.type);
            setFileName(file.name);
            onChange(base64, file.name, formato);
        } catch (error) {
            console.error('Error al convertir archivo:', error);
            alert('Error al procesar el archivo');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = () => {
        setFileName('');
        onChange('', '', 'pdf');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            {value && fileName ? (
                <div className="relative group">
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fileName}</p>
                            <p className="text-xs text-gray-500">
                                Archivo cargado
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleRemove}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                        transition-colors
                        ${
                        isDragging
                            ? 'border-[#005873] bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                    }
                    `}
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                        Arrastra un archivo aquí o haz click para seleccionar
                    </p>
                    <p className="text-xs text-gray-400">
                        PDF, DOCX, XLSX, PPTX hasta {maxSizeInMB}MB
                    </p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.xlsx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={handleFileInput}
                className="hidden"
            />
        </div>
    );
}