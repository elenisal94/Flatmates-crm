import React from "react";
import AppRoutes from "./appRoutes/AppRoutes";
import {
  extendTheme as materialExtendTheme,
  CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";

const CRMSystem = () => {
  const materialTheme = materialExtendTheme();

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <div>
          <div className="main-content">
            <ToastContainer
              position="top-center"
              autoClose={6000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ fontSize: "16px" }}
            />
            <AppRoutes />
          </div>
        </div>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
};

export default CRMSystem;
