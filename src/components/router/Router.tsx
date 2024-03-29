import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "../../pages/Layout";
import HomePage from "../../pages/homePage/HomePage";
import Protected from "../Protected";
import WordsPage from "../../pages/wordsPage/WordsPage";
import WordDefinitionPage from "../../pages/wordDefinitionPage/WordDefinitionPage";
import NotFoundPage from "../../pages/errorPages/notFoundPage/NotFoundPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
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
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/*" element={<Navigate to={"/404"} replace />}></Route>
    </Route>
  )
);
