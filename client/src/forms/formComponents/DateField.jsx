import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@mui/joy";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DateField = ({ name, label, required, dueDate, helperText }) => {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (required && dueDate) {
      setValue(name, dayjs(dueDate).toISOString(), { shouldValidate: true });
    }
  }, [name, required, setValue, dueDate]);

  return (
    <FormControl error={!!errors[name]} fullWidth>
      <FormLabel>
        {label}
        {required && " *"}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) => {
            if (required && !value) return "This field is required";
            return true;
          },
        }}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...field}
              format="DD/MM/YYYY"
              value={field.value ? dayjs(field.value) : null} // Start as null
              onChange={(newValue) => {
                const value = newValue ? newValue.toISOString() : null;
                setValue(name, value, { shouldValidate: true });
                trigger(name);
              }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  fullWidth: true,
                  error: !!errors[name],
                  helperText: helperText,
                },
              }}
            />
          </LocalizationProvider>
        )}
      />
    </FormControl>
  );
};

export default DateField;
