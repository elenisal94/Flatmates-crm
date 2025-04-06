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
import DOMPurify from "dompurify";
import SensitiveDataWarning from "./formComponents/SensitiveDataWarning";

const AddRentPayment = ({ rentPaymentStore }) => {
  const [tenantOptions, setTenantOptions] = useState([]);

  const schema = yup.object().shape({
    tenant: yup
      .string()
      .transform((value) => DOMPurify.sanitize(value))
      .required("Tenant is required"),

    amount: yup
      .number()
      .typeError("Please enter a valid number")
      .required("Amount is required")
      .positive("Amount must be positive"),

    dueDate: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("Due date is required"),

    datePaid: yup.date().nullable(),

    paymentMade: yup.boolean().required("Payment status is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tenant: "",
      amount: "",
      dueDate: null,
      datePaid: null,
      paymentMade: false,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const paymentMade = watch("paymentMade");

  useEffect(() => {
    if (paymentMade) {
      setValue("datePaid", new Date().toISOString().split("T")[0]); // Set current date in YYYY-MM-DD format
    } else {
      setValue("datePaid", null);
    }
  }, [paymentMade, setValue]);

  const onSubmit = async (data) => {
    await rentPaymentStore.saveRentPayment(data);
    rentPaymentStore.handleClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout title="Add Rent Payment">
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

          {/* Hidden DatePaid Field */}
          <input type="hidden" {...register("datePaid")} />

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
        <SensitiveDataWarning />
        <FormActions
          onClose={() => rentPaymentStore.handleClose()}
          onSubmitLabel="Add"
        />
      </form>
    </FormProvider>
  );
};

export default inject("rentPaymentStore")(observer(AddRentPayment));
