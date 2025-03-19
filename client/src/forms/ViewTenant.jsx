import React from "react";
import FormLayout from "./formComponents/FormLayout";
import ViewField from "./formComponents/ViewField";
import FormActions from "./formComponents/FormActions";
import get from "lodash/get";

const ViewTenant = ({ tenantStore, tenantFields }) => {
  const tenant = tenantStore.selectedTenant;

  return (
    <FormLayout title="View Entry">
      {tenant ? (
        tenantFields.map(({ name, label }) => (
          <ViewField
            key={name}
            label={label}
            value={get(tenant, name, "N/A")}
          />
        ))
      ) : (
        <p>No tenant data available.</p>
      )}

      <FormActions onClose={() => tenantStore.handleClose()} submit={false} />
    </FormLayout>
  );
};

export default ViewTenant;
