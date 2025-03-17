import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { inject, observer } from "mobx-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "./formComponents/TextField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  address: yup.object({
    flat: yup.string().required("Flat number is required"),
    street: yup.string().required("Street name and number is required"),
    city: yup.string().required("City is required"),
    postcode: yup.string().required("Postcode is required"),
  }),
});

const EditTenant = ({ tenantStore, tenantFields }) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: tenantStore.selectedTenant || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        flat: "",
        street: "",
        city: "",
        postcode: "",
      },
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data) => {
    await tenantStore.saveTenant(data);
    tenantStore.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Edit Record">
          {tenantFields
            .filter((field) => !field.viewOnly)
            .map(({ name, label, required, type, disabled }) => (
              <div key={name}>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      required={required}
                      type={type}
                      disabled={disabled}
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                    />
                  )}
                />
              </div>
            ))}
        </FormLayout>
        <FormActions
          onClose={() => tenantStore.handleClose()}
          onSubmitLabel="Save Changes"
        />
      </form>
    </FormProvider>
  );
};

export default inject("tenantStore")(observer(EditTenant));
