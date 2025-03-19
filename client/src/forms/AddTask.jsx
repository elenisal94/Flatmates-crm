import React from "react";
import { inject, observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "./formComponents/TextField";
import SelectField from "./formComponents/SelectField";
import DateField from "./formComponents/DateField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";
import TenantStore from "../stores/TenantStore";

const AddTask = ({ taskStore }) => {
  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    assignedTo: yup.string().required("Assigned to is required"),
    dueDate: yup.date().required("Due Date is required").nullable(),
    completed: yup.boolean().required("Completed status is required"),
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
    control,
    setValue,
    formState: { errors },
  } = methods;

  const tenants = TenantStore.fetchTenants();
  const tenantOptions = tenants.map((tenant) => ({
    value: tenant.id,
    label: tenant.firstName,
  }));

  const onSubmit = async (data) => {
    await taskStore.saveTask(data);
    taskStore.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Add Task">
          <div>
            <TextField
              {...register("title")}
              label="Title"
              required
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </div>
          <div>
            <TextField
              {...register("description")}
              label="Last Name"
              required
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </div>
          <div>
            <TextField
              {...register("assignedTo")}
              label="Assigned to"
              required
              type="assignedTo"
              error={!!errors.assignedTo}
              helperText={errors.assignedTo?.message}
            />
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
              helperText={errors.dueDate?.completed}
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
            />
          </div>
        </FormLayout>
        <FormActions
          onClose={() => taskStore.handleClose()}
          onSubmitLabel="Add"
        />
      </form>
    </FormProvider>
  );
};

export default inject("taskStore")(observer(AddTask));
