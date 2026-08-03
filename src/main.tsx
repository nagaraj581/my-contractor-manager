import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import { CompaniesProvider } from "./contexts/CompaniesContext";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <CompaniesProvider>

          <CompanyProvider>

            <App />

          </CompanyProvider>

        </CompaniesProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
);