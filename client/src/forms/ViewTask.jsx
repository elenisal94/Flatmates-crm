import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import FormLayout from "./formComponents/FormLayout";
import ViewField from "./formComponents/ViewField";
import FormActions from "./formComponents/FormActions";
import get from "lodash/get";
import TenantStore from "../stores/TenantStore";

const ViewTask = ({ taskStore }) => {
  const task = taskStore.selectedTask;

  useEffect(() => {
    TenantStore.fetchTenants();
  }, []);

  const getFullName = (tenantId) => {
    const tenants = TenantStore.tenants;
    const tenant = tenants.find(
      (t) => t._id.toString() === tenantId.toString()
    );
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unassigned"; // ✅ Fallback
  };

  return (
    <FormLayout title="View Task">
      {task ? (
        <>
          <ViewField label="Title" value={get(task, "title", "N/A")} />
          <ViewField
            label="Description"
            value={get(task, "description", "N/A")}
          />
          <ViewField label="Assigned To" value={getFullName(task.assignedTo)} />
          <ViewField
            label="Due Date"
            value={
              task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"
            }
          />
          <ViewField label="Completed" value={task.completed ? "Yes" : "No"} />
        </>
      ) : (
        <p>No task data available.</p>
      )}

      <FormActions
        className="form-actions"
        onClose={() => taskStore.handleClose()}
        submit={false}
      />
    </FormLayout>
  );
};

export default inject("taskStore")(observer(ViewTask));
