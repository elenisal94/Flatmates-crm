import React from "react";
import FormLayout from "./formComponents/FormLayout";
import ViewField from "./formComponents/ViewField";
import FormActions from "./formComponents/FormActions";
import get from "lodash/get";

const ViewTenant = ({ tenantStore, tenantFields }) => {
  const tenant = tenantStore.selectedTenant; // Get the selected tenant (should be an object)

  // Ensure tenant is defined before rendering the fields
  return (
    <FormLayout title="View Entry">
      {tenant ? (
        tenantFields // Only show fields that are not view-only
          .map(({ name, label }) => (
            <ViewField
              key={name}
              label={label}
              value={get(tenant, name, "N/A")} // Use lodash's get to safely access values
            />
          ))
      ) : (
        <p>No tenant data available.</p> // Fallback message if no tenant is selected
      )}

      <FormActions onClose={() => tenantStore.handleClose()} submit={false} />
    </FormLayout>
  );
};

export default ViewTenant;
