import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@mui/joy";
import Select from "react-select";

const SelectField = ({
  name,
  label,
  required,
  options,
  isSearchable = true,
}) => {
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
            value={
              options.find((option) => option.value === field.value) || null
            }
            onChange={(selectedOption) => field.onChange(selectedOption.value)}
            isSearchable={isSearchable}
            placeholder="Select an option..."
          />
        )}
      />
      {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
