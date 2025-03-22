import React, { useState, useEffect } from "react";
import AppRoutes from "./appRoutes/AppRoutes";
import {
  extendTheme as materialExtendTheme,
  CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

const CRMSystem = () => {
  const materialTheme = materialExtendTheme();

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <div>
          <div className="main-content">
            <AppRoutes />;
          </div>
        </div>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
};

export default CRMSystem;
