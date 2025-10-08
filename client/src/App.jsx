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
import { useAuth0 } from "@auth0/auth0-react";

import { setTokenGetter } from "./helpers/apiRequest";

const materialTheme = materialExtendTheme();

function App() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  React.useEffect(() => {
    setTokenGetter(async () => {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });
    });
  }, [getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <div className="main-content">
          <ToastContainer
            position="top-center"
            autoClose={3000}
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
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

export default App;
