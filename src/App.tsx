import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/homePage/HomePage";
import Layout from "./pages/Layout";
import WordsPage from "./pages/allWordsPage/AllWordsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.scss";
import Protected from "components/Protected";
import WordDefinitionPage from "pages/wordDefinitionPage/WordDefinitionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index={true} element={<HomePage></HomePage>}></Route>
          <Route
            path="b/:bookName"
            element={
              <Protected>
                <WordsPage />
              </Protected>
            }
          />
          <Route path="w/:word" element={<WordDefinitionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
