import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import TextField from "./formComponents/TextField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";

const EditTenant = ({ entityData, onSave, onClose, formFields }) => {
  // Initialize the form methods
  const methods = useForm({
    defaultValues: entityData, // Set default values from entityData
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = (data) => {
    onSave(data); // Handle save when form is submitted
  };

  return (
    <FormProvider {...methods}>
      {" "}
      {/* Provide methods to all child components */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Edit Record">
          {formFields
            .filter((field) => !field.viewOnly) // Only render fields that are not view-only
            .map(({ name, label, required, type, disabled }) => (
              <div key={name}>
                <Controller
                  name={name}
                  control={control} // Pass control to each input field
                  render={({ field }) => (
                    <TextField
                      {...field} // Spread field to TextField to handle input value and onChange
                      label={label}
                      required={required}
                      type={type}
                      disabled={disabled}
                      error={!!errors[name]} // Display error if it exists
                      helperText={errors[name]?.message} // Display error message
                    />
                  )}
                />
              </div>
            ))}
        </FormLayout>
        <FormActions onClose={onClose} onSubmitLabel="Save Changes" />
      </form>
    </FormProvider>
  );
};

export default EditTenant;
