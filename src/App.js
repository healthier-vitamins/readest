import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SearchPage from "./pages/searchPage/SearchPage";
import Layout from "./pages/Layout";
import WordsPage from "./pages/WordsPage/WordsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<SearchPage></SearchPage>}></Route>
            <Route path="/words" element={<WordsPage></WordsPage>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
