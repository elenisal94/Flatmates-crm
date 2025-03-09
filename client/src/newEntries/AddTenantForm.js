import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { TextField, Button } from "@mui/joy"; // Ensure you're using the right Joy UI components

// Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .notRequired(),
  address: yup.object().shape({
    flat: yup.string().notRequired(),
    street: yup.string().notRequired(),
    city: yup.string().notRequired(),
    postcode: yup.string().required("Postcode is required"),
  }),
});

const AddTenantForm = ({ setTenants, setRefreshInfo }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched", // Use "onTouched" to validate when the field is touched
  });

  const onSubmit = async (data) => {
    console.log("Form data:", data); // Check if form data is coming correctly
    try {
      const response = await axios.post(
        "http://localhost:5001/api/tenants",
        data
      );
      setTenants((prevTenants) => [...prevTenants, response.data]);
      reset();
      setRefreshInfo(true);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div>
      <h2>Add New Tenant</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name Input */}
        <TextField
          label="First Name"
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message} // Display error message
        />

        {/* Last Name Input */}
        <TextField
          label="Last Name"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />

        {/* Email Input */}
        <TextField
          label="Email"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* Phone Input */}
        <TextField
          label="Phone"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />

        {/* Address Fields
        <TextField
          label="Flat"
          {...register("address.flat")}
          error={!!errors.address?.flat}
          helperText={errors.address?.flat?.message}
        />
        <TextField
          label="Street"
          {...register("address.street")}
          error={!!errors.address?.street}
          helperText={errors.address?.street?.message}
        />
        <TextField
          label="City"
          {...register("address.city")}
          error={!!errors.address?.city}
          helperText={errors.address?.city?.message}
        />
        <TextField
          label="Postcode"
          {...register("address.postcode")}
          error={!!errors.address?.postcode}
          helperText={errors.address?.postcode?.message}
        /> */}

        {/* Submit Button */}
        <Button type="submit" disabled={!isValid}>
          Add Tenant
        </Button>
      </form>
    </div>
  );
};

export default AddTenantForm;
