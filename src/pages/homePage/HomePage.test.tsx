import { render, screen } from "@testing-library/react";
import YearTimer from "../../components/yearTimer/YearTimer";

test("quote should be rendered", () => {
  render(<YearTimer />);
  const quoteEl = screen.getByTestId("homepage-quote");
  expect(quoteEl).toBeTruthy();
});
