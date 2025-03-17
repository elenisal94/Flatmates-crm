import React from "react";
import { Box, Typography, Divider } from "@mui/joy";

const ViewField = ({ label, value }) => {
  const displayValue =
    typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
      <Typography level="body2" fontWeight="bold" color="neutral.600">
        {label}
      </Typography>
      <Typography level="body1" sx={{ mt: 0.5 }}>
        {displayValue}
      </Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
    </Box>
  );
};

export default ViewField;
