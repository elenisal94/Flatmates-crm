import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormLabel } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CustomTextField from "./CustomTextField";

const SelectField = ({
  name,
  label,
  required,
  options,
  helperText,
  isSearchable = true,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name];

  return (
    <FormControl error={hasError} fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedOption =
            options.find((option) => option.value === field.value) || null;

          return (
            <Autocomplete
              options={options}
              value={selectedOption}
              onChange={(e, newValue) => {
                field.onChange(newValue ? newValue.value : null);
              }}
              isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
              }
              disablePortal
              freeSolo={!isSearchable}
              size="small"
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  name={name}
                  label={label}
                  required={required}
                  helperText={helperText}
                  error={hasError}
                  placeholder="Select an option..."
                />
              )}
            />
          );
        }}
      />
    </FormControl>
  );
};

export default SelectField;
