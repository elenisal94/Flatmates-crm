import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import FormLayout from "./formComponents/FormLayout";
import ViewField from "./formComponents/ViewField";
import FormActions from "./formComponents/FormActions";
import get from "lodash/get";
import TenantStore from "../stores/TenantStore";

const ViewRentPayment = ({ rentPaymentStore }) => {
  const rentPayment = rentPaymentStore.selectedRentPayment;

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
    <FormLayout title="View Rent Payment">
      {rentPayment ? (
        <>
          <ViewField label="Tenant" value={getFullName(rentPayment.tenant)} />
          <ViewField
            label="Amount"
            value={`$${get(rentPayment, "amount", 0)}`}
          />
          <ViewField
            label="Due Date"
            value={
              rentPayment.dueDate
                ? new Date(rentPayment.dueDate).toLocaleDateString()
                : "N/A"
            }
          />
          <ViewField
            label="Date Paid"
            value={
              rentPayment.datePaid
                ? new Date(rentPayment.datePaid).toLocaleDateString()
                : "Not Paid"
            }
          />
          <ViewField
            label="Payment Made"
            value={rentPayment.paymentMade ? "Yes" : "No"}
          />
        </>
      ) : (
        <p>No rent payment data available.</p>
      )}

      <FormActions
        className="form-actions"
        onClose={() => rentPaymentStore.handleClose()}
        submit={false}
      />
    </FormLayout>
  );
};

export default inject("rentPaymentStore")(observer(ViewRentPayment));
