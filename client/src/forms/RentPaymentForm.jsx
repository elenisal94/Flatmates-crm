import React from "react";
import { inject, observer } from "mobx-react";
import AddRentPayment from "./AddRentPayment";
import EditRentPayment from "./EditRentPayment";
import ViewRentPayment from "./ViewRentPayment";

const rentFields = [
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

const RentPaymentForm = ({ rentPaymentStore, mode, entityName }) => {
  switch (mode) {
    case "add":
      return (
        <AddRentPayment
          rentPaymentStore={rentPaymentStore}
          mode={mode}
          entityName={entityName}
          rentFields={rentFields}
        />
      );
    case "edit":
      return (
        <EditRentPayment
          rentPaymentStore={rentPaymentStore}
          mode={mode}
          entityName={entityName}
          rentFields={rentFields}
        />
      );
    case "view":
      return (
        <ViewRentPayment
          rentPaymentStore={rentPaymentStore}
          mode={mode}
          entityName={entityName}
          rentFields={rentFields}
        />
      );
    default:
      return null;
  }
};

export default inject("rentPaymentStore")(observer(RentPaymentForm));
