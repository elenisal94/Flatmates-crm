import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomTextField from "./formComponents/CustomTextField";
import SelectField from "./formComponents/SelectField";
import DateField from "./formComponents/DateField";
import FormLayout from "./formComponents/FormLayout";
import FormActions from "./formComponents/FormActions";
import TenantStore from "../stores/TenantStore";

const AddBillPayment = ({ billPaymentStore }) => {
  const [tenantOptions, setTenantOptions] = useState([]);

  const schema = yup.object().shape({
    tenant: yup.string().required("Tenant is required"),
    billType: yup.string().required("Bill type is required"),
    amount: yup
      .number()
      .typeError("Please enter a valid number")
      .required("Amount is required")
      .positive("Amount must be positive"),
    dueDate: yup.date().required("Due Date is required").nullable(),
    datePaid: yup.date().nullable(),
    paymentMade: yup.boolean().required("Payment status is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tenant: "",
      billType: "",
      amount: "",
      dueDate: null,
      datePaid: null,
      paymentMade: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchTenants = async () => {
      const tenants = await TenantStore.fetchTenants();
      const options = tenants.map((tenant) => ({
        value: tenant._id,
        label: `${tenant.firstName} ${tenant.lastName}`,
      }));
      setTenantOptions(options);
    };

    fetchTenants();
  }, []);

  const onSubmit = async (data) => {
    await billPaymentStore.saveBillPayment(data);
    billPaymentStore.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Add Bill Payment">
          <div>
            <SelectField
              name="tenant"
              label="Tenant"
              required
              options={tenantOptions}
              helperText={errors.tenant?.message}
            />
          </div>
          <div>
            <SelectField
              name="billType"
              label="Bill Type"
              required
              options={[
                { value: "Water", label: "Water" },
                { value: "Electricity", label: "Electricity" },
                { value: "Gas", label: "Gas" },
                { value: "Internet", label: "Internet" },
                { value: "Council Tax", label: "Council Tax" },
              ]}
              helperText={errors.billType?.message}
            />
          </div>
          <div>
            <CustomTextField
              {...register("amount")}
              label="Amount"
              type="number"
              required
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          </div>
          <div>
            <DateField
              {...register("dueDate")}
              name="dueDate"
              label="Due Date"
              required
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
            />
          </div>
          <div>
            <DateField
              {...register("datePaid")}
              name="datePaid"
              label="Date Paid"
              error={!!errors.datePaid}
              helperText={errors.datePaid?.message}
              clearable
            />
          </div>
          <div>
            <SelectField
              {...register("paymentMade")}
              name="paymentMade"
              label="Payment Made?"
              required
              helperText={errors.paymentMade?.message}
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
              isSearchable={false}
            />
          </div>
        </FormLayout>
        <FormActions
          onClose={() => billPaymentStore.handleClose()}
          onSubmitLabel="Add"
        />
      </form>
    </FormProvider>
  );
};

export default inject("billPaymentStore")(observer(AddBillPayment));
