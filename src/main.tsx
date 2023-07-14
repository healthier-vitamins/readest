import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./components/router/Router.tsx";
import "./main.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>;
    </Provider>
  </React.StrictMode>
);
