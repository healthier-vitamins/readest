import OnClickOutsideComponent from "components/OnClickOutsideComponent";
import React, { createRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { changeActiveTab } from "../../store/slices/book.slice";
import {
  resetSuggestedWord,
  getWordDefinition,
  addChosenWordDefinition,
  resetUrlRedirectWord,
} from "../../store/slices/word.slice";
import "./SearchBar.scss";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  // const ref = createRef();
  const navigate = useNavigate();
  const [queriedWord, setQueriedWord] = useState("");
  const queriedWordRef = createRef<any>();
  const [touched, setTouched] = useState(false);
  const { suggestedWord, isLoading, urlRedirectWord } = useAppSelector(
    (store) => store.word
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (urlRedirectWord) {
      dispatch(resetSuggestedWord());
      setQueriedWord(urlRedirectWord);
      queriedWordRef.current.value = urlRedirectWord;
      setTouched(true);
      dispatch(getWordDefinition(urlRedirectWord));
      dispatch(resetUrlRedirectWord());
      console.log("hit");
    }
  }, [dispatch, queriedWordRef, urlRedirectWord]);

  function onClickOutsideFunc() {
    setTouched(false);
  }

  function handleOnChangeQuery(value: any) {
    setQueriedWord(value);
    dispatch(resetSuggestedWord());
    if (typeof value === "string" && value.length > 0) {
      dispatch(getWordDefinition(value));
    }
  }

  function handleWordWithoutDefObj(word: any) {
    if (typeof word === "string" && word.length > 0) {
      dispatch(getWordDefinition(word));
    }
    setQueriedWord(word.toLowerCase());
    queriedWordRef!.current!.value = word.toLowerCase();
    setTouched(true);
  }

  function RenderAbbreviations(props: any) {
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
    //? loading
    if (isLoading && touched && queriedWord.length > 0) {
      return (
        <React.Fragment>
          <p className="dropdown-list">Loading...</p>
        </React.Fragment>
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
      return (
        <>
          {suggestedWord
            ? suggestedWord.map((responseObject, index) => {
                return (
                  <React.Fragment key={index}>
                    <p
                      className="dropdown-list"
                      onClick={() => {
                        console.log("click");
                        dispatch(addChosenWordDefinition(responseObject));
                        dispatch(changeActiveTab(0));
                        setQueriedWord(responseObject.meta.id.toLowerCase());
                        queriedWordRef.current.value =
                          responseObject.meta.id.toLowerCase();
                        setTouched(false);
                        navigate(`/w/${queriedWordRef.current.value}`);
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
        <React.Fragment>
          {suggestedWord
            ? suggestedWord.map((word, index) => {
                return (
                  <React.Fragment key={index}>
                    <p
                      className="dropdown-list"
                      onClick={() => {
                        handleWordWithoutDefObj(word);
                      }}
                    >
                      {word.toLowerCase()}&nbsp;
                    </p>
                  </React.Fragment>
                );
              })
            : null}
        </React.Fragment>
      );

      //? single word + senses
    } else if (
      suggestedWord.length === 1 &&
      typeof suggestedWord[0] !== "string" &&
      queriedWord.length > 0 &&
      touched
    ) {
      return (
        <React.Fragment>
          {suggestedWord ? (
            <p
              className="dropdown-list"
              onClick={() => {
                console.log("clicked");
                dispatch(addChosenWordDefinition(suggestedWord[0]));
                dispatch(changeActiveTab(0));
                setQueriedWord(suggestedWord[0].meta.id.toLowerCase());
                queriedWordRef.current.value =
                  suggestedWord[0].meta.id.toLowerCase();
                navigate(`/w/${queriedWordRef.current.value}`);
                setTouched(false);
              }}
            >
              {suggestedWord[0].meta.id.toLowerCase()}&nbsp;
              <RenderAbbreviations
                wordObject={suggestedWord[0]}
              ></RenderAbbreviations>
            </p>
          ) : null}
        </React.Fragment>
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
            <p
              className="dropdown-list"
              onClick={() => {
                handleWordWithoutDefObj(suggestedWord[0]);
              }}
            >
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
    <OnClickOutsideComponent
      onClickOutsideFunc={onClickOutsideFunc}
      isShowing={touched}
    >
      <div className="searchbar-box">
        <input
          type="text"
          placeholder="Search word"
          onChange={(e) => {
            handleOnChangeQuery(e.target.value);
            setTouched(true);
          }}
          onFocus={() => {
            setTouched(true);
          }}
          ref={queriedWordRef}
        ></input>
        <div className="dropdown-box">
          <RenderSuggestedWord></RenderSuggestedWord>
        </div>
      </div>
    </OnClickOutsideComponent>
  );
}

export default SearchBar;
