import React from "react";
import FormLayout from "./formComponents/FormLayout";
import ViewField from "./formComponents/ViewField";
import FormActions from "./formComponents/FormActions";
import get from "lodash/get";

const ViewTenant = ({ entityData, onClose, formFields }) => {
  return (
    <FormLayout title="View Entry">
      {formFields?.map(({ name, label }) => (
        <ViewField
          key={name}
          label={label}
          value={get(entityData, name, "N/A")}
        />
      ))}

      <FormActions onClose={onClose} submit={false} />
    </FormLayout>
  );
};

export default ViewTenant;
