import React from "react";
import { Box, Button } from "@mui/joy/";
import Typography from "@mui/joy/Typography";

const FormActions = ({ onClose, onSubmitLabel = "Submit", submit = true }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onClose} variant="soft">
          Close
        </Button>

        {submit && <Button type="submit">{onSubmitLabel}</Button>}
      </Box>
    </Box>
  );
};

export default FormActions;
