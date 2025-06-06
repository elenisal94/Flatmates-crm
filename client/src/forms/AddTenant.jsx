import React from "react";
import { inject, observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomTextField from "./formComponents/CustomTextField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";
import DOMPurify from "dompurify";
import SensitiveDataWarning from "./formComponents/SensitiveDataWarning";

const AddTenant = ({ tenantStore }) => {
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .max(500, "Field cannot exceed 500 characters")
      .transform((value) => DOMPurify.sanitize(value))
      .required("First name is required"),

    lastName: yup
      .string()
      .max(500, "Field cannot exceed 500 characters")
      .transform((value) => DOMPurify.sanitize(value))
      .required("Last name is required"),

    email: yup
      .string()
      .max(500, "Field cannot exceed 500 characters")
      .transform((value) => DOMPurify.sanitize(value))
      .email("Invalid email")
      .required("Email is required"),

    phone: yup
      .string()
      .transform((value) => DOMPurify.sanitize(value))
      .matches(/^\d{11}$/, "Phone number must be 11 digits")
      .required("Phone number is required"),

    address: yup.object().shape({
      flat: yup
        .string()
        .max(500, "Field cannot exceed 500 characters")
        .transform((value) => DOMPurify.sanitize(value))
        .required("Flat number is required"),

      street: yup
        .string()
        .max(500, "Field cannot exceed 500 characters")
        .transform((value) => DOMPurify.sanitize(value))
        .required("Street name and number is required"),

      city: yup
        .string()
        .max(500, "Field cannot exceed 500 characters")
        .transform((value) => DOMPurify.sanitize(value))
        .required("City is required"),

      postcode: yup
        .string()
        .max(500, "Field cannot exceed 500 characters")
        .transform((value) => DOMPurify.sanitize(value))
        .required("Postcode is required"),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
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
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    await tenantStore.saveTenant(data);
    tenantStore.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Add Tenant">
          <div>
            <CustomTextField
              {...register("firstName")}
              label="First Name"
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("lastName")}
              label="Last Name"
              required
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("email")}
              label="Email"
              required
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("phone")}
              label="Phone"
              required
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("address.flat")}
              label="Flat Number"
              required
              error={!!errors.address?.flat}
              helperText={errors.address?.flat?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("address.street")}
              label="Street"
              required
              error={!!errors.address?.street}
              helperText={errors.address?.street?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("address.city")}
              label="City"
              required
              error={!!errors.address?.city}
              helperText={errors.address?.city?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("address.postcode")}
              label="Postcode"
              required
              error={!!errors.address?.postcode}
              helperText={errors.address?.postcode?.message}
            />
          </div>
        </FormLayout>
        <SensitiveDataWarning />
        <FormActions
          onClose={() => tenantStore.handleClose()}
          onSubmitLabel="Add"
        />
      </form>
    </FormProvider>
  );
};

export default inject("tenantStore")(observer(AddTenant));
