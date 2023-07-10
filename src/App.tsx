import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/homePage/HomePage";
import Protected from "./components/Protected";
import WordsPage from "./pages/wordsPage/WordsPage";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";
import WordDefinitionPage from "./pages/wordDefinitionPage/WordDefinitionPage";
import "./main.scss";

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
