import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@mui/joy";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DateField = ({ name, label, required }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl error={!!errors[name]} fullWidth>
      <FormLabel>
        {label}
        {required && " *"}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              isRequired="true"
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) =>
                field.onChange(newValue ? newValue.toISOString() : null)
              }
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  fullWidth: true,
                  error: !!errors[name],
                  helperText: errors[name]?.message || "",
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
