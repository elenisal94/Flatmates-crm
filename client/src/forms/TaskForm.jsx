import React from "react";
import { inject, observer } from "mobx-react";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import ViewTask from "./ViewTask";

const taskFields = [
  { name: "title", label: "Title", required: true, type: "text" },
  { name: "description", label: "Description", required: true, type: "text" },
  { name: "assignedTo", label: "Assigned to", required: true, type: "text" },
  { name: "dueDate", label: "Due Date", required: true, type: "date" },
  { name: "completed", label: "Completed?", required: true, type: "boolean" },
];

const TaskForm = ({ taskStore, mode, entityName }) => {
  switch (mode) {
    case "add":
      return (
        <AddTask
          taskStore={taskStore}
          mode={mode}
          entityName={entityName}
          taskFields={taskFields}
        />
      );
    case "edit":
      return (
        <EditTask
          taskStore={taskStore}
          mode={mode}
          entityName={entityName}
          taskFields={taskFields}
        />
      );
    case "view":
      return (
        <ViewTask
          taskStore={taskStore}
          mode={mode}
          entityName={entityName}
          taskFields={taskFields}
        />
      );
    default:
      return null;
  }
};

export default inject("taskStore")(observer(TaskForm));
