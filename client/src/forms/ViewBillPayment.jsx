import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import FormLayout from "./formComponents/FormLayout";
import ViewField from "./formComponents/ViewField";
import FormActions from "./formComponents/FormActions";
import get from "lodash/get";
import TenantStore from "../stores/TenantStore";

const ViewBillPayment = ({ billPaymentStore }) => {
  const billPayment = billPaymentStore.selectedBillPayment;

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
    <FormLayout title="View Bill Payment">
      {billPayment ? (
        <>
          <ViewField
            label="Bill Type"
            value={get(billPayment, "billType", "N/A")}
          />
          <ViewField label="Tenant" value={getFullName(billPayment.tenant)} />
          <ViewField
            label="Amount"
            value={`$${get(billPayment, "amount", 0)}`}
          />
          <ViewField
            label="Due Date"
            value={
              billPayment.dueDate
                ? new Date(billPayment.dueDate).toLocaleDateString()
                : "N/A"
            }
          />
          <ViewField
            label="Date Paid"
            value={
              billPayment.datePaid
                ? new Date(billPayment.datePaid).toLocaleDateString()
                : "Not Paid"
            }
          />
          <ViewField
            label="Payment Made"
            value={billPayment.paymentMade ? "Yes" : "No"}
          />
        </>
      ) : (
        <p>No bill payment data available.</p>
      )}

      <FormActions
        className="form-actions"
        onClose={() => billPaymentStore.handleClose()}
        submit={false}
      />
    </FormLayout>
  );
};

export default inject("billPaymentStore")(observer(ViewBillPayment));
