import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AddTenant from "./AddTenant"; // AddTenant Component
import EditTenant from "./EditTenant"; // EditTenant Component
import ViewTenant from "./ViewTenant"; // ViewTenant Component

// Define validation schema using Yup with nested validation for address
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

// Define form fields (including nested fields like address)
const tenantFields = [
  { name: "firstName", label: "First Name", required: true, type: "text" },
  { name: "lastName", label: "Last Name", required: true, type: "text" },
  { name: "email", label: "Email", required: true, type: "email" },
  { name: "phone", label: "Phone", required: true, type: "tel" },
  { name: "address.flat", label: "Flat", required: true, type: "text" },
  { name: "address.street", label: "Street", required: true, type: "text" },
  { name: "address.city", label: "City", required: true, type: "text" },
  { name: "address.postcode", label: "Postcode", required: true, type: "text" },

  // Rent information (view-only fields)
  { name: "rentPaid", label: "Rent Paid", type: "checkbox", viewOnly: true },
  {
    name: "totalRentPayments",
    label: "Total Rent Payments",
    type: "number",
    viewOnly: true,
  },
  {
    name: "completedRentPayments",
    label: "Completed Rent Payments",
    type: "number",
    viewOnly: true,
  },
  {
    name: "pendingRentPayments",
    label: "Pending Rent Payments",
    type: "number",
    viewOnly: true,
  },
  {
    name: "lateRentPayments",
    label: "Late Rent Payments",
    type: "number",
    viewOnly: true,
  },

  // Bill information (view-only fields)
  { name: "billsPaid", label: "Bills Paid", type: "checkbox", viewOnly: true },
  {
    name: "totalBillPayments",
    label: "Total Bill Payments",
    type: "number",
    viewOnly: true,
  },
  {
    name: "completedBillPayments",
    label: "Completed Bill Payments",
    type: "number",
    viewOnly: true,
  },
  {
    name: "pendingBillPayments",
    label: "Pending Bill Payments",
    type: "number",
    viewOnly: true,
  },
  {
    name: "lateBillPayments",
    label: "Late Bill Payments",
    type: "number",
    viewOnly: true,
  },

  // Task information (view-only fields)
  { name: "totalTasks", label: "Total Tasks", type: "number", viewOnly: true },
  {
    name: "completedTasks",
    label: "Completed Tasks",
    type: "number",
    viewOnly: true,
  },
  {
    name: "pendingTasks",
    label: "Pending Tasks",
    type: "number",
    viewOnly: true,
  },
  {
    name: "overdueTasks",
    label: "Overdue Tasks",
    type: "number",
    viewOnly: true,
  },
];

const TenantForm = ({
  entityData,
  mode,
  onSave,
  onClose,
  entityName,
  handleEdit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: entityData,
  });

  const onSubmit = (data) => {
    onSave(data); // Pass data to onSave for saving
  };

  // Conditionally render the right component based on `mode`
  switch (mode) {
    case "add":
      return (
        <AddTenant
          entityData={entityData}
          mode={mode}
          onSave={handleSubmit(onSubmit)}
          onClose={onClose}
          entityName={entityName}
          control={control}
          errors={errors}
          setValue={setValue}
          tenantFields={tenantFields}
        />
      );
    case "edit":
      return (
        <EditTenant
          entityData={entityData}
          mode={mode}
          onSave={handleSubmit(onSubmit)}
          onClose={onClose}
          entityName={entityName}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      );
    case "view":
      return (
        <ViewTenant
          entityData={entityData}
          mode={mode}
          onClose={onClose}
          entityName={entityName}
        />
      );
    default:
      return null;
  }
};

export default TenantForm;
