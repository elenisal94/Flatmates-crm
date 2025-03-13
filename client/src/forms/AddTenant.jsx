import React from "react";
import { inject, observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import get from "lodash/get";
import TextField from "./formComponents/TextField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";

const AddTenant = ({ tenantStore, onClose }) => {
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

  // Initialize form with validation
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
          {/* First Name Field */}
          <div>
            <TextField
              {...register("firstName")}
              label="First Name"
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </div>

          {/* Last Name Field */}
          <div>
            <TextField
              {...register("lastName")}
              label="Last Name"
              required
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </div>

          {/* Email Field */}
          <div>
            <TextField
              {...register("email")}
              label="Email"
              required
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>

          {/* Phone Field */}
          <div>
            <TextField
              {...register("phone")}
              label="Phone"
              required
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </div>

          {/* Address Fields */}
          <div>
            <TextField
              {...register("address.flat")}
              label="Flat Number"
              required
              error={!!errors.address?.flat}
              helperText={errors.address?.flat?.message}
            />
          </div>
          <div>
            <TextField
              {...register("address.street")}
              label="Street"
              required
              error={!!errors.address?.street}
              helperText={errors.address?.street?.message}
            />
          </div>
          <div>
            <TextField
              {...register("address.city")}
              label="City"
              required
              error={!!errors.address?.city}
              helperText={errors.address?.city?.message}
            />
          </div>
          <div>
            <TextField
              {...register("address.postcode")}
              label="Postcode"
              required
              error={!!errors.address?.postcode}
              helperText={errors.address?.postcode?.message}
            />
          </div>
        </FormLayout>
        <FormActions onClose={onClose} onSubmitLabel="Add" />
      </form>
    </FormProvider>
  );
};

export default inject("tenantStore")(observer(AddTenant));
