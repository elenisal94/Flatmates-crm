import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import TextField from './formComponents/TextField';
import FormLayout from './formComponents/FormLayout';
import FormActions from './formComponents/FormActions';

const EditForm = ({ entityData, onSave, onClose, formFields }) => {
    const methods = useForm({
        defaultValues: entityData,
    });

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <FormLayout title="Edit Record">
                    {formFields
                        .filter(field => !field.viewOnly)
                        .map(({ name, label, required, type, disabled }) => (
                            <TextField
                                key={name}
                                name={name}
                                label={label}
                                required={required}
                                type={type}
                                disabled={disabled}
                            />
                        ))}
                </FormLayout>
                <FormActions onClose={onClose} onSubmitLabel="Save Changes" />
            </form>
        </FormProvider>
    );
};

export default EditForm;
