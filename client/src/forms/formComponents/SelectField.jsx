import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@mui/joy";
import Select from "react-select";

const SelectField = ({ name, label, required, options }) => {
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
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
            onChange={(selectedOption) => field.onChange(selectedOption.value)} // Update form value
            isSearchable
            placeholder="Search and select..."
          />
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
