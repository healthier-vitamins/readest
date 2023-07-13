import { RouterProvider } from "react-router-dom";
import "./main.scss";
import { router } from "./components/router/Router";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
