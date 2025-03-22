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

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  assignedTo: yup.string().required("Assigned to is required"),
  dueDate: yup.date().required("Due Date is required").nullable(),
  completed: yup.boolean().required("Completed status is required"),
});

const EditTask = ({ taskStore }) => {
  const [tenantOptions, setTenantOptions] = useState([]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: taskStore.selectedTask || {
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
        <FormLayout title="Edit Task">
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
              defaultValue={taskStore.selectedTask?.dueDate}
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
        <FormActions
          onClose={() => taskStore.handleClose()}
          onSubmitLabel="Save Changes"
        />
      </form>
    </FormProvider>
  );
};

export default inject("taskStore")(observer(EditTask));
