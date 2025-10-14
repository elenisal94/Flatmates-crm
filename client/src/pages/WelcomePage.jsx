import React from "react";
import { Button, Typography, Box, Sheet, Stack } from "@mui/joy";
import { useAuth0 } from "@auth0/auth0-react";

const WelcomePage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.3)",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-80px",
          right: "-60px",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "50%",
        }}
      />

      <Sheet
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: "md",
          width: "100%",
          maxWidth: 800,
          textAlign: "center",
          boxShadow: "xl",
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={3}>
          <Typography
            level="h1"
            sx={{ fontSize: "3rem", fontWeight: "xl", color: "#333" }}
          >
            Welcome to Tenants CRM 🏠
          </Typography>

          <Typography level="body1" sx={{ fontSize: "1.2rem", color: "#555" }}>
            Manage tenants, tasks, bills, and rent easily — all in one place.
            Sign in to get started.
          </Typography>

          <Button
            size="lg"
            variant="solid"
            color="primary"
            onClick={() => loginWithRedirect()}
            sx={{
              background: "linear-gradient(45deg, #42a5f5, #478ed1)",
              color: "#fff",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            Log In / Sign Up
          </Button>

          <Typography level="body3" sx={{ fontSize: "0.9rem", color: "#777" }}>
            © {new Date().getFullYear()} Tenants CRM. All rights reserved.
          </Typography>
        </Stack>
      </Sheet>
    </Box>
  );
};

export default WelcomePage;
