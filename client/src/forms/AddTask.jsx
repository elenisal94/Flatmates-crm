import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomTextField from "./formComponents/CustomTextField";
import SelectField from "./formComponents/SelectField";
import DateField from "./formComponents/DateField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";
import TenantStore from "../stores/TenantStore";
import DOMPurify from "dompurify";
import SensitiveDataWarning from "./formComponents/SensitiveDataWarning";

const AddTask = ({ taskStore }) => {
  const [tenantOptions, setTenantOptions] = useState([]);

  const schema = yup.object().shape({
    title: yup
      .string()
      .max(500, "Field cannot exceed 500 characters")
      .transform((value) => DOMPurify.sanitize(value)) // Sanitize input
      .required("Title is required"),

    description: yup
      .string()
      .max(500, "Field cannot exceed 500 characters")
      .transform((value) => DOMPurify.sanitize(value)) // Sanitize input
      .required("Description is required"),

    assignedTo: yup
      .string()
      .transform((value) => DOMPurify.sanitize(value)) // Sanitize input
      .required("Assigned to is required"),

    dueDate: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("Due date is required"),

    completed: yup
      .mixed()
      .oneOf([true, false, "true", "false"])
      .transform((value) =>
        value === "true" ? true : value === "false" ? false : value
      )
      .required("Completed status is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      dueDate: null,
      completed: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchTenants = async () => {
      const tenants = await TenantStore.fetchTenants();
      const options = tenants.map((tenant) => ({
        value: tenant._id,
        label: `${tenant.firstName} ${tenant.lastName}`,
      }));

      setTenantOptions(options);
    };

    fetchTenants();
  }, []);

  const onSubmit = async (data) => {
    await taskStore.saveTask(data);
    taskStore.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Add Task">
          <div>
            <CustomTextField
              {...register("title")}
              label="Title"
              required
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("description")}
              label="Description"
              required
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </div>
          <div>
            <SelectField
              name="assignedTo"
              label="Assigned to"
              required
              options={tenantOptions}
              helperText={errors.assignedTo?.message}
            />
          </div>
          <div>
            <DateField
              {...register("dueDate")}
              name="dueDate"
              label="Due Date"
              required
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
            />
          </div>
          <div>
            <SelectField
              {...register("completed")}
              name="completed"
              label="Completed?"
              required
              helperText={errors.completed?.message}
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              isSearchable={false}
            />
          </div>
        </FormLayout>
        <SensitiveDataWarning />
        <FormActions
          onClose={() => taskStore.handleClose()}
          onSubmitLabel="Add"
        />
      </form>
    </FormProvider>
  );
};

export default inject("taskStore")(observer(AddTask));
