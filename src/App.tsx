import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/homePage/HomePage";
import Layout from "./pages/Layout";
import WordsPage from "./pages/wordPage/WordPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.scss";
import Protected from "components/Protected";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index={true} element={<HomePage></HomePage>}></Route>
          <Route
            path="book/:bookName"
            element={
              <Protected>
                <WordsPage />
              </Protected>
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
