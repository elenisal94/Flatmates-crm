import React from "react";
import FormLayout from "./formComponents/FormLayout";
import ViewField from "./formComponents/ViewField";
import FormActions from "./formComponents/FormActions";
import get from "lodash/get";

const ViewTask = ({ taskStore, taskFields }) => {
  const task = taskStore.selectedTask;

  return (
    <FormLayout title="View Entry">
      {task ? (
        taskFields.map(({ name, label }) => (
          <ViewField key={name} label={label} value={get(task, name, "N/A")} />
        ))
      ) : (
        <p>No task data available.</p>
      )}

      <FormActions onClose={() => taskStore.handleClose()} submit={false} />
    </FormLayout>
  );
};

export default ViewTask;
