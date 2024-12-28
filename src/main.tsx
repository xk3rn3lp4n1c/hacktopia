import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CookiesProvider } from "react-cookie";
import ReduxProvider from "./providers/redux-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CookiesProvider>
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
);
