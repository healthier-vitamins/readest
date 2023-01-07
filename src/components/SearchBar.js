import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSuggestedWord,
  getWordDefinition,
} from "../store/actions/wordDefinition";
import "./SearchBar.css";

function SearchBar() {
  const ref = useRef();
  const [queriedWord, setQueriedWord] = useState("");
  const [touched, setTouched] = useState(false);
  const { suggestedWord, isLoading } = useSelector((store) => {
    return store.wordDefinition;
  });
  const dispatch = useDispatch();

  const onClickOutside = useCallback(() => {
    setTouched(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  function handleChange(value) {
    setQueriedWord(value);
    dispatch(resetSuggestedWord);
    setTimeout(() => {
      dispatch(getWordDefinition(value));
    }, 300);
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
    console.log("touched ", touched);

    if (
      isLoading &&
      touched &&
      suggestedWord.length < 1 &&
      queriedWord.length > 1
    ) {
      return (
        <>
          <p className="dropdown-list">Loading...</p>
        </>
      );
    } else if (
      suggestedWord.length > 1 &&
      // to handle when searchbar is empty and suggestedWord still passes this conditional
      Object.keys(suggestedWord[0]).length > 4 &&
      // when api is searching for an unknown word, it returns an array of "string" words instead of object.
      typeof suggestedWord[0] !== "string" &&
      touched
    ) {
      console.log("if", suggestedWord[0], Object.keys(suggestedWord[0]));
      return (
        <>
          {suggestedWord
            ? suggestedWord.map((responseObject, index) => {
                return (
                  <React.Fragment key={index}>
                    <p className="dropdown-list">
                      {/* extract word render into a function to remove redundant/irrelevant words */}
                      {responseObject.meta.id.toLowerCase()}&nbsp;
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
    } else if (
      suggestedWord.length > 1 &&
      // when api is searching for an unknown word, it returns an array of "string" words instead of object.
      typeof suggestedWord[0] === "string" &&
      suggestedWord !== "Word is required." &&
      touched
    ) {
      return (
        <>
          {suggestedWord
            ? suggestedWord.map((word, index) => {
                return (
                  <React.Fragment key={index}>
                    <p className="dropdown-list">
                      {/* extract word render into a function to remove redundant/irrelevant words */}
                      {word.toLowerCase()}&nbsp;
                    </p>
                  </React.Fragment>
                );
              })
            : null}
        </>
      );
    } else if (suggestedWord.length === 1 && touched) {
      console.log("else if", suggestedWord);
      return (
        <>
          {suggestedWord ? (
            <p className="dropdown-list">
              {suggestedWord[0].meta.id.toLowerCase()}&nbsp;
              <RenderAbbreviations
                wordObject={suggestedWord[0]}
              ></RenderAbbreviations>
            </p>
          ) : null}
        </>
      );
    }
    return touched && suggestedWord.length < 1 && queriedWord.length > 1 ? (
      <p className="dropdown-list">No matches found</p>
    ) : null;
  }

  return (
    <div ref={ref}>
      <div>
        <Form.Control
          type="text"
          placeholder="Search word"
          onChange={(e) => {
            handleChange(e.target.value);
            setTouched(true);
          }}
          onFocus={() => {
            setTouched(true);
          }}
        ></Form.Control>
      </div>
      <div className="dropdown-box">
        <RenderSuggestedWord></RenderSuggestedWord>
      </div>
    </div>
  );
}

export default SearchBar;
