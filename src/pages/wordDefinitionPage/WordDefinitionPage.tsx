import WordDefinition from "components/wordDefinition/WordDefinition";
import "./WordDefinitionPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addIsOriginatedFromUrlWord,
  resetSuggestedWord,
  setIsFromSearchBar,
} from "store/slices/word.slice";

import YearTimer from "components/yearTimer/YearTimer";
import { changeActiveTab } from "store/slices/book.slice";
import { Spinner } from "react-bootstrap";

function WordDefinitionPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    isWordChosen,
    chosenWordDefinition,
    isOriginatedFromUrl: { isFromSearchBar, word },
    isLoading,
  } = useAppSelector((state) => state.word);
  const { wordFromUrlParam } = params;

  useEffect(() => {
    if (!isFromSearchBar && !word) {
      dispatch(resetSuggestedWord());
      if (typeof wordFromUrlParam === "string" && wordFromUrlParam.length > 0) {
        dispatch(addIsOriginatedFromUrlWord(wordFromUrlParam));
      }
      console.log("word ", word, !!word);
    }
  });

  useEffect(() => {
    dispatch(changeActiveTab(0));
  }, [dispatch, wordFromUrlParam]);

  // for back functionality
  useEffect(() => {
    if (
      wordFromUrlParam &&
      chosenWordDefinition.title &&
      wordFromUrlParam.toLowerCase() !==
        chosenWordDefinition.title.toLowerCase()
    ) {
      console.log(wordFromUrlParam, chosenWordDefinition.title);
      // dispatch(getWordDefinition(wordFromUrlParam));
      // dispatch(addChosenWordDefinition(suggestedWord[0]));
      // dispatch(addIsOriginatedFromUrlWord(chosenWordDefinition.title));
      dispatch(addIsOriginatedFromUrlWord(wordFromUrlParam));
      dispatch(setIsFromSearchBar(false));
    }
  }, [chosenWordDefinition.title, wordFromUrlParam, dispatch, navigate]);

  function LoadingSpinnerHandler(): React.ReactElement {
    // basically anythting
    if (
      isFromSearchBar ||
      !word ||
      chosenWordDefinition.title.length < 1 ||
      // !isFromSearchBar ||
      isWordChosen
    ) {
      if (chosenWordDefinition.title.length > 0) {
        return (
          <div className="word-def-page-definition-box">
            <WordDefinition
              id={null}
              abbreviation={chosenWordDefinition.abbreviation}
              examples={chosenWordDefinition.examples}
              shortDef={chosenWordDefinition.shortDef}
              title={chosenWordDefinition.title}
              transitive={chosenWordDefinition.transitive}
            ></WordDefinition>
          </div>
        );
      } else {
        if (!isLoading) {
          return (
            <div className="word-def-page-definition-box">
              <WordDefinition
                id={null}
                abbreviation={chosenWordDefinition.abbreviation}
                examples={chosenWordDefinition.examples}
                shortDef={chosenWordDefinition.shortDef}
                title={chosenWordDefinition.title}
                transitive={chosenWordDefinition.transitive}
              ></WordDefinition>
            </div>
          );
        } else {
          return (
            <div className="all-words-page-loading-page">
              <Spinner
                animation="border"
                id="all-words-page-loading-spinner"
              ></Spinner>
            </div>
          );
        }
      }
    } else {
      return (
        <div className="homepage-timer">
          <YearTimer></YearTimer>
        </div>
      );
    }
  }

  return (
    <div className="word-def-page">
      {/* {isWordChosen ? (
        <div className="word-def-page-definition-box">
          <WordDefinition
            id={null}
            abbreviation={chosenWordDefinition.abbreviation}
            examples={chosenWordDefinition.examples}
            shortDef={chosenWordDefinition.shortDef}
            title={chosenWordDefinition.title}
            transitive={chosenWordDefinition.transitive}
          ></WordDefinition>
        </div>
      ) : (
        <div className="homepage-timer">
          <YearTimer></YearTimer>
        </div>
      )} */}
      <LoadingSpinnerHandler></LoadingSpinnerHandler>
    </div>
  );
}

export default WordDefinitionPage;
