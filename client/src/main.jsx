import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";

// Import Material UI ThemeProvider and createTheme
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Import react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a custom theme with primary color #ab00fa and white contrast
const theme = createTheme({
  palette: {
    primary: {
      main: "#ab00fa",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
    },
    text: {
      primary: "#000000",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
