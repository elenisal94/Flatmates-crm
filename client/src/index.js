import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { Provider } from "mobx-react";
import { Auth0Provider } from "@auth0/auth0-react";

import tenantStore from "./stores/TenantStore.jsx";
import taskStore from "./stores/TaskStore.jsx";
import billPaymentStore from "./stores/BillPaymentStore.jsx";
import rentPaymentStore from "./stores/RentPaymentStore.jsx";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5001";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      scope="openid profile email"
    >
      <Provider
        tenantStore={tenantStore}
        taskStore={taskStore}
        billPaymentStore={billPaymentStore}
        rentPaymentStore={rentPaymentStore}
      >
        <App />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
