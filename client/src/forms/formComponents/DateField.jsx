import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@mui/joy";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DateField = ({ name, label, required, defaultValue }) => {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (!defaultValue) {
      setValue(name, dayjs().toISOString(), { shouldValidate: true });
    } else {
      setValue(name, defaultValue, { shouldValidate: true });
    }
  }, [defaultValue, name, setValue]);

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
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                const formattedValue = newValue ? newValue.toISOString() : null;
                setValue(name, formattedValue, { shouldValidate: true });
                trigger(name);
              }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  fullWidth: true,
                  error: !!errors[name],
                },
              }}
            />
          </LocalizationProvider>
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
};

export default DateField;
