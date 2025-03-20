import React from "react";
import { useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Box from "@mui/joy/Box";

const CustomTextField = ({ name, label, required, placeholder }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl error={!!errors[name]} fullWidth>
      {" "}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <FormLabel sx={{ typography: "title-sm" }}>
          {label}
          {required && "*"}
        </FormLabel>
        <TextField
          size="small"
          sx={{ typography: "body-sm" }}
          {...register(name, { required })}
          placeholder={placeholder}
        />
        {errors[name]?.message && (
          <FormHelperText>{errors[name]?.message}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
};

export default CustomTextField;
