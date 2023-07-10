import { MemoryRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/homePage/HomePage";
import Layout from "./pages/Layout";
import WordsPage from "./pages/wordsPage/WordsPage";
import "bootstrap/dist/css/bootstrap.min.css";
//@ts-ignore
import * as bootstrap from "bootstrap";
import "./main.scss";
import Protected from "components/Protected";
import WordDefinitionPage from "pages/wordDefinitionPage/WordDefinitionPage";
import NotFoundPage from "pages/notFoundPage/NotFoundPage";

function App() {
  return (
    <MemoryRouter>
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
          <Route path="w/:wordFromUrlParam" element={<WordDefinitionPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
