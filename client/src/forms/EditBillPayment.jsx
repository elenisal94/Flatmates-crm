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

const schema = yup.object().shape({
  billType: yup.string().required("Bill Type is required"),
  tenant: yup.string().required("Tenant is required"),
  amount: yup
    .number()
    .typeError("Please enter a valid number")
    .required("Amount is required")
    .positive("Amount must be positive"),
  dueDate: yup.date().required("Due Date is required").nullable(),
  datePaid: yup.date().nullable(),
  paymentMade: yup.boolean().required("Payment status is required"),
});

const EditBillPayment = ({ billPaymentStore }) => {
  const [tenantOptions, setTenantOptions] = useState([]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: billPaymentStore.selectedBillPayment || {
      billType: "",
      tenant: "",
      amount: 0,
      dueDate: null,
      datePaid: null,
      paymentMade: false,
    },
  });

  console.log("selectedBillPayment", billPaymentStore.selectedBillPayment);

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

  //   useEffect(() => {
  //     if (billPaymentStore.selectedBillPayment?.tenant) {
  //       methods.setValue("tenant", billPaymentStore.selectedBillPayment.tenant);
  //     }
  //   }, [tenantOptions, methods]);

  const onSubmit = async (data) => {
    await billPaymentStore.saveBillPayment(data);
    billPaymentStore.handleClose();
  };

  console.log("Rendering SelectField with options:", tenantOptions);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Edit Bill Payment">
          <div>
            <CustomTextField
              {...register("billType")}
              label="Bill Type"
              required
              error={!!errors.billType}
              helperText={errors.billType?.message}
            />
          </div>
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
            <CustomTextField
              {...register("amount")}
              label="Amount"
              required
              type="number"
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          </div>
          <div>
            <DateField
              {...register("dueDate")}
              name="dueDate"
              label="Due Date"
              defaultValue={billPaymentStore.selectedBillPayment?.dueDate}
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
              defaultValue={billPaymentStore.selectedBillPayment?.datePaid}
              error={!!errors.datePaid}
              helperText={errors.datePaid?.message}
            />
          </div>
          {/* <div>
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
          </div> */}
        </FormLayout>
        <FormActions
          onClose={() => billPaymentStore.handleClose()}
          onSubmitLabel="Save Changes"
        />
      </form>
    </FormProvider>
  );
};

export default inject("billPaymentStore")(observer(EditBillPayment));
