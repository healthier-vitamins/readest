import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import YearTimer from "./components/yearTimer/YearTimer";
import bookSlice from "./store/slices/book.slice";
import miscSlice from "./store/slices/misc.slice";
import stateSlice from "./store/slices/state.slice";
import userSlice from "./store/slices/user.slice";
import wordSlice from "./store/slices/word.slice";

test("quote should be rendered", () => {
  // render(<YearTimer />);
  // const quoteEl = screen.getByTestId("homepage-quote");
  // console.log("🚀 ~ file: main.test.tsx:7 ~ test ~ quoteEl:", quoteEl);
  //   expect(quoteEl).toBeEmptyDOMElement();
  const store = configureStore({
    reducer: {
      word: wordSlice.reducer,
      book: bookSlice.reducer,
      state: stateSlice.reducer,
      user: userSlice.reducer,
      misc: miscSlice.reducer,
    },
  });
  const helloRender = render(
    <Provider store={store}>
      <YearTimer />
    </Provider>
  );
  console.log("🚀 ~ file: main.test.tsx:27 ~ test ~ helloRender:", helloRender);
});

describe("App", () => {
  it("should work", () => {
    expect(1 + 1).toBe(2);
  });
});
