import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

export default function RichTextEditor({
                                           value,
                                           onChange,
                                           label,
                                           placeholder = 'Escribe aquí...'
                                       }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !editorRef.current) return;

        // Importar Quill dinámicamente para evitar problemas con SSR
        import('quill').then((Quill) => {
            if (quillRef.current) return; // Ya inicializado

            const editor = new Quill.default(editorRef.current!, {
                theme: 'snow',
                placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link'],
                        ['clean']
                    ]
                }
            });

            // Establecer contenido inicial
            if (value) {
                editor.root.innerHTML = value;
            }

            // Escuchar cambios
            editor.on('text-change', () => {
                const html = editor.root.innerHTML;
                onChange(html);
            });

            quillRef.current = editor;
        });

        // Cleanup
        return () => {
            if (quillRef.current) {
                quillRef.current = null;
            }
        };
    }, []);
    
    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            const selection = quillRef.current.getSelection();
            quillRef.current.root.innerHTML = value;
            if (selection) {
                quillRef.current.setSelection(selection);
            }
        }
    }, [value]);

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium">{label}</label>
            )}
            <div
                ref={editorRef}
                className="bg-white border rounded-md min-h-[200px]"
            />
        </div>
    );
}