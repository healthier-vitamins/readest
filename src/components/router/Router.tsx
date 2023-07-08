import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../../pages/Layout";
import HomePage from "../../pages/homePage/HomePage";
import Protected from "../Protected";
import WordsPage from "../../pages/wordsPage/WordsPage";
import WordDefinitionPage from "../../pages/wordDefinitionPage/WordDefinitionPage";
import NotFoundPage from "../../pages/notFoundPage/NotFoundPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout></Layout>}>
      <Route index={true} element={<HomePage></HomePage>} />
      <Route
        path="b/:bookName"
        element={
          <Protected>
            <WordsPage />
          </Protected>
        }
      />
      <Route
        path="w/:wordFromUrlParam"
        element={<WordDefinitionPage />}
      ></Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default router;
