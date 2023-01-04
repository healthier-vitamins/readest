import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  // addSuggestedWord,
  resetSuggestedWord,
  getWordDefinition,
} from "../store/actions/wordDefinition";

function SearchBar() {
  const [touched, setTouched] = useState(false);
  const { suggestedWord } = useSelector((store) => {
    return store.wordDefinition;
  });
  const dispatch = useDispatch();

  function handleChange(value) {
    dispatch(resetSuggestedWord);
    dispatch(getWordDefinition(value));
    // console.log(suggestedWord);
  }

  function RenderSuggestedWord() {
    console.log("before all ", suggestedWord);

    if (
      suggestedWord.length > 1 &&
      Object.keys(suggestedWord[0]).length > 4 &&
      typeof suggestedWord[0] !== "string"
    ) {
      console.log("if", suggestedWord[0], Object.keys(suggestedWord[0]));
      return (
        <>
          {suggestedWord
            ? suggestedWord.map((responseObject, index) => {
                return (
                  <React.Fragment key={index}>
                    <p>
                      {responseObject.hwi.hw}&nbsp;&nbsp;
                      <span>[{responseObject.fl}]</span>
                    </p>
                  </React.Fragment>
                );
              })
            : null}
        </>
      );
    } else if (suggestedWord.length === 1) {
      console.log("else if", suggestedWord);
      return (
        <>
          {suggestedWord ? (
            <p>
              {suggestedWord[0].hwi.hw}&nbsp;&nbsp;
              <span>[{suggestedWord[0].fl}]</span>
            </p>
          ) : null}
        </>
      );
    }
    return touched ? <p>No matches found</p> : null;
  }

  return (
    <div>
      <div>
        <Form.Control
          type="text"
          placeholder="Search word"
          onChange={(e) => {
            handleChange(e.target.value);
            setTouched(true);
          }}
        ></Form.Control>
      </div>
      <div>
        <RenderSuggestedWord></RenderSuggestedWord>
      </div>
    </div>
  );
}

export default SearchBar;
