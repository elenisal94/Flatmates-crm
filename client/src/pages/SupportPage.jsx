import React from "react";
import { observer } from "mobx-react-lite";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Header from "./tableUtils/Header";

const SupportPage = observer(() => {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header />
      <Box
        className="topbox"
        sx={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 }, pt: 3 }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="sm" />}
            sx={{ pl: 0 }}
          >
            <Link underline="none" color="neutral" href="#" aria-label="Home">
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              href="#"
              fontSize={12}
              fontWeight={500}
            >
              Dashboard
            </Link>
            <Typography color="primary" fontWeight={500} fontSize={12}>
              Support
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 2 }}>
            Support
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <Typography level="body1" component="p">
            If you need any support with the website, please email
            <br />
            <strong>elenisalamouri@gmail.com</strong>
          </Typography>
        </Box>
      </Box>
    </CssVarsProvider>
  );
});

export default SupportPage;
