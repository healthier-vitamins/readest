import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSuggestedWord,
  getWordDefinition,
  addChosenWordDefinition,
} from "../../store/actions/wordDefinition.action";
import "./SearchBar.css";

function SearchBar() {
  const ref = useRef();
  const [queriedWord, setQueriedWord] = useState("");
  const queriedWordRef = createRef();
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
    if (value.length > 0) {
      dispatch(getWordDefinition(value));
    }
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
    // console.log("before all ", suggestedWord);
    // console.log("touched ", touched);
    // console.log("queried word ", queriedWord.length);

    //? loading
    if (
      isLoading &&
      touched &&
      suggestedWord.length < 1 &&
      queriedWord.length > 0
    ) {
      return (
        <>
          <p className="dropdown-list">Loading...</p>
        </>
      );

      //? multiple words + senses
    } else if (
      suggestedWord.length > 1 &&
      // to handle when searchbar is empty and suggestedWord still passes this conditional
      Object.keys(suggestedWord[0]).length > 4 &&
      // when api is searching for an unknown word, it returns an array of "string" words instead of object.
      typeof suggestedWord[0] !== "string" &&
      queriedWord.length > 0 &&
      touched
    ) {
      // console.log("if", suggestedWord[0], Object.keys(suggestedWord[0]));
      return (
        <>
          {suggestedWord
            ? suggestedWord.map((responseObject, index) => {
                return (
                  <React.Fragment key={index}>
                    <p
                      className="dropdown-list"
                      onClick={() => {
                        dispatch(addChosenWordDefinition(responseObject));
                        setQueriedWord(responseObject.meta.id.toLowerCase());
                        queriedWordRef.current.value =
                          responseObject.meta.id.toLowerCase();
                        setTouched(false);
                      }}
                    >
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

      //? multiple words only
    } else if (
      suggestedWord.length > 1 &&
      // when api is searching for an unknown word, it returns an array of "string" words instead of object.
      typeof suggestedWord[0] === "string" &&
      queriedWord.length > 0 &&
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

      //? single word + senses
    } else if (
      suggestedWord.length === 1 &&
      typeof suggestedWord[0] !== "string" &&
      queriedWord.length > 0 &&
      touched
    ) {
      // console.log("else if", suggestedWord);
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

      //? single word only
    } else if (
      suggestedWord.length === 1 &&
      typeof suggestedWord[0] === "string" &&
      queriedWord.length > 0 &&
      touched
    ) {
      return (
        <>
          {suggestedWord ? (
            <p className="dropdown-list">
              {suggestedWord[0].toLowerCase()}&nbsp;
            </p>
          ) : null}
        </>
      );
    }

    //? no matches found
    return touched && suggestedWord.length < 1 && queriedWord.length > 0 ? (
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
          ref={queriedWordRef}
        ></Form.Control>
      </div>
      <div className="dropdown-box">
        <RenderSuggestedWord></RenderSuggestedWord>
      </div>
    </div>
  );
}

export default SearchBar;