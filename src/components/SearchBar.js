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

  function RenderAbbreviations(props) {
    const { wordObject } = props;
    if (
      Array.isArray(wordObject) &&
      wordObject.length === 1 &&
      Object.keys(wordObject).includes("fl")
    ) {
      return <span>[{wordObject[0].fl}]</span>;
    } else if (
      typeof wordObject === "object" &&
      Object.keys(wordObject).includes("fl")
    ) {
      return <span>[{wordObject.fl}]</span>;
    } else {
      return <span>[no abbreviation]</span>;
    }
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
                      {/* extract word render into a function to remove redundant/irrelevant words */}
                      {responseObject.meta.id}&nbsp;
                      <RenderAbbreviations
                        wordObject={responseObject}
                      ></RenderAbbreviations>
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
              {suggestedWord[0].meta.id}&nbsp;
              <RenderAbbreviations
                wordObject={suggestedWord[0]}
              ></RenderAbbreviations>
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
