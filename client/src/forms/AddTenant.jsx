import React from "react";
import { inject, observer } from "mobx-react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import get from "lodash/get";
import TextField from "./formComponents/TextField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";

const AddTenant = ({ tenantStore, tenantFields, onClose }) => {
  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    address: yup.object().shape({
      flat: yup.string().notRequired(),
      street: yup.string().notRequired(),
      city: yup.string().required("City is required"),
      postcode: yup.string().required("Postcode is required"),
    }),
  });

  // Initialize form with validation
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: { flat: "", street: "", city: "", postcode: "" },
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  // Save the tenant using the store's addTenant method
  const onSubmit = async (data) => {
    await tenantStore.saveTenant(data); // Call addTenant from tenantStore
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Add Tenant">
          {tenantFields
            ?.filter((field) => !field.viewOnly) // Only show editable fields
            ?.map(({ name, label, required, type, disabled }) => (
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
                      error={!!get(errors, name)} // Get nested error safely
                      helperText={get(errors, name)?.message} // Display correct error message
                    />
                  )}
                />
              </div>
            ))}
        </FormLayout>
        <FormActions onClose={onClose} onSubmitLabel="Add" />
      </form>
    </FormProvider>
  );
};

export default inject("tenantStore")(observer(AddTenant));
