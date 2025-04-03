import React from "react";
import { Box, Button } from "@mui/joy/";
import Typography from "@mui/joy/Typography";

const FormActions = ({ onClose, onSubmitLabel = "Submit", submit = true }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="body2"
        color="danger"
        sx={{ mb: 1, fontStyle: "italic", fontSize: "0.75rem" }}
      >
        * Please do not enter real data as this is an open project accessible to
        everyone.
      </Typography>
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
