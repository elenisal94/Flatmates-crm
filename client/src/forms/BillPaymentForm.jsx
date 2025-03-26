import React from "react";
import { inject, observer } from "mobx-react";
import AddBillPayment from "./AddBillPayment";
import EditBillPayment from "./EditBillPayment";
import ViewBillPayment from "./ViewBillPayment";

const billFields = [
  { name: "billType", label: "Bill Type", required: true, type: "text" },
  { name: "tenant", label: "Tenant", required: true, type: "text" },
  { name: "amount", label: "Amount", required: true, type: "number" },
  { name: "dueDate", label: "Due Date", required: true, type: "date" },
  { name: "datePaid", label: "Date Paid", required: false, type: "date" },
  {
    name: "paymentMade",
    label: "Payment Made",
    required: true,
    type: "boolean",
  },
];

const BillPaymentForm = ({ billPaymentStore, mode, entityName }) => {
  switch (mode) {
    case "add":
      return (
        <AddBillPayment
          billPaymentStore={billPaymentStore}
          mode={mode}
          entityName={entityName}
          billFields={billFields}
        />
      );
    case "edit":
      return (
        <EditBillPayment
          billPaymentStore={billPaymentStore}
          mode={mode}
          entityName={entityName}
          billFields={billFields}
        />
      );
    case "view":
      return (
        <ViewBillPayment
          billPaymentStore={billPaymentStore}
          mode={mode}
          entityName={entityName}
          billFields={billFields}
        />
      );
    default:
      return null;
  }
};

export default inject("billPaymentStore")(observer(BillPaymentForm));
