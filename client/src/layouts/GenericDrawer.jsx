import React from "react";
import Drawer from "@mui/joy/Drawer";
import Sheet from "@mui/joy/Sheet";
import ModalClose from "@mui/joy/ModalClose";
import { useMediaQuery, useTheme } from "@mui/material";

const DrawerComponent = ({ open, onClose, children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Drawer
      size={isSmallScreen ? "lg" : "md"}
      variant="plain"
      anchor={isSmallScreen ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      hideBackdrop={false}
      slotProps={{
        content: {
          sx: {
            bgcolor: "transparent",
            p: { md: 3, sm: 0 },
            boxShadow: "none",
            height: isSmallScreen ? "85vh" : "100%",
          },
        },
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "md",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        <ModalClose />
        {children}
      </Sheet>
    </Drawer>
  );
};

export default DrawerComponent;
