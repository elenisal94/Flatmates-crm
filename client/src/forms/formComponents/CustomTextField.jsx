import React, { forwardRef } from "react";
import { TextField, FormHelperText } from "@mui/material";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Box from "@mui/joy/Box";

const CustomTextField = forwardRef(
  (
    {
      name,
      label,
      required,
      placeholder,
      error,
      helperText,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <FormControl error={error} fullWidth>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <FormLabel sx={{ typography: "title-sm" }}>
            {label}
            {required && "*"}
          </FormLabel>
          <TextField
            size="small"
            sx={{ typography: "body-sm" }}
            name={name}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            inputRef={ref}
            value={value}
            onChange={onChange}
            {...props}
          />
        </Box>
      </FormControl>
    );
  }
);

export default CustomTextField;
