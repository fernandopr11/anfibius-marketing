import {Formik, Form, Field, ErrorMessage} from 'formik';
import {Button} from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import type {FormField} from '@/types/crud.types';
import * as Yup from 'yup';

interface DynamicFormProps {
    fields: FormField[];
    initialValues: Record<string, any>;
    validationSchema: Yup.ObjectSchema<any>;
    onSubmit: (values: any) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
    cancelLabel?: string;
}

export default function DynamicForm({
                                        fields,
                                        initialValues,
                                        validationSchema,
                                        onSubmit,
                                        onCancel,
                                        submitLabel = 'Guardar',
                                        cancelLabel = 'Cancelar',
                                    }: DynamicFormProps) {
    const renderField = (field: FormField, setFieldValue: any, values: any) => {
        const baseClassName = field.className || 'w-full px-3 py-2 border rounded-md';

        if (field.type === 'image') {
            return (
                <ImageUpload
                    value={values[field.name] || ''}
                    onChange={(base64) => setFieldValue(field.name, base64)}
                    label={field.label}
                />
            );
        }

        switch (field.type) {
            case 'textarea':
                return (
                    <Field
                        as="textarea"
                        name={field.name}
                        rows={field.rows || 3}
                        className={baseClassName}
                        placeholder={field.placeholder}
                    />
                );

            case 'select':
                return (
                    <Field as="select" name={field.name} className={baseClassName}>
                        <option value="">Seleccionar...</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Field>
                );

            default:
                return (
                    <Field
                        type={field.type}
                        name={field.name}
                        className={baseClassName}
                        placeholder={field.placeholder}
                    />
                );
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                await onSubmit(values);
                setSubmitting(false);
            }}
            enableReinitialize
        >
            {({isSubmitting, setFieldValue, values}) => (
                <Form className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            {field.type !== 'image' && (
                                <label className="text-sm font-medium">{field.label}</label>
                            )}
                            {renderField(field, setFieldValue, values)}
                            <ErrorMessage
                                name={field.name}
                                component="p"
                                className="text-sm text-red-600"
                            />
                        </div>
                    ))}

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#005873] hover:bg-[#7EB520]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : submitLabel}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}