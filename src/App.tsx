import { RouterProvider } from "react-router-dom";
import "./main.scss";
import router from "./components/router/Router";

function App() {
  return (
    // <MemoryRouter>
    //   <Routes>
    //     <Route path="/" element={<Layout></Layout>}>
    //       <Route index={true} element={<HomePage></HomePage>}></Route>
    //       <Route
    //         path="b/:bookName"
    //         element={
    //           <Protected>
    //             <WordsPage />
    //           </Protected>
    //         }
    //       />
    //       <Route path="w/:wordFromUrlParam" element={<WordDefinitionPage />} />
    //     </Route>
    //     <Route path="*" element={<NotFoundPage />}></Route>
    //   </Routes>
    // </MemoryRouter>
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
