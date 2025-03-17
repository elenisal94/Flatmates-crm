import React from "react";
import { Box, Button } from "@mui/joy/";

const FormActions = ({ onClose, onSubmitLabel = "Submit", submit = true }) => {
  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
      {/* Close button */}
      <Button onClick={onClose} variant="soft">
        Close
      </Button>

      {/* Submit button (conditionally rendered based on 'submit' prop) */}
      {submit && <Button type="submit">{onSubmitLabel}</Button>}
    </Box>
  );
};

export default FormActions;
