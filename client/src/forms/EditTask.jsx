import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { inject, observer } from "mobx-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "./formComponents/TextField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  assignedTo: yup.string().required("Assigned to is required"),
  dueDate: yup.date().required("Due Date is required").nullable(),
  completed: yup.boolean().required("Completed status is required"),
});

const EditTask = ({ taskStore, taskFields }) => {
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
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = async (data) => {
    await taskStore.saveTask(data);
    taskStore.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Edit Record">
          {taskFields
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
          onClose={() => taskStore.handleClose()}
          onSubmitLabel="Save Changes"
        />
      </form>
    </FormProvider>
  );
};

export default inject("taskStore")(observer(EditTask));
