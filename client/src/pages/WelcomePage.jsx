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
        backgroundColor: "background.level1",
        p: 2,
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: "md",
          width: "100%",
          maxWidth: 800,
          textAlign: "center",
          boxShadow: "sm",
          bgcolor: "background.body",
        }}
      >
        <Stack spacing={3}>
          <Typography level="h1" sx={{ fontSize: "3rem", fontWeight: "xl" }}>
            Welcome to Tenants CRM
          </Typography>

          <Typography level="body1" sx={{ fontSize: "1.2rem" }}>
            Manage tenants, tasks, bills, and rent easily — all in one place.
            Sign in to get started.
          </Typography>

          <Button
            size="lg"
            variant="solid"
            color="primary"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </Button>

          <Typography
            level="body3"
            sx={{ fontSize: "0.9rem", color: "text.tertiary" }}
          >
            © {new Date().getFullYear()} Tenants CRM. All rights reserved.
          </Typography>
        </Stack>
      </Sheet>
    </Box>
  );
};

export default WelcomePage;
