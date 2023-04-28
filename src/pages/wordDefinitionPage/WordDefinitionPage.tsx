import WordDefinition from "components/wordDefinition/WordDefinition";
import "./WordDefinitionPage.scss";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addIsOriginatedFromUrlWord,
  resetSuggestedWord,
  setIsFromSearchBar,
} from "store/slices/word.slice";

import YearTimer from "components/yearTimer/YearTimer";

function WordDefinitionPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const {
    isWordChosen,
    chosenWordDefinition,
    isOriginatedFromUrl: { isFromSearchBar },
  } = useAppSelector((state) => state.word);

  // useEffect(() => {
  //   dispatch(changeActiveTab(0));
  // }, [dispatch]);

  useEffect(() => {
    if (!isFromSearchBar) {
      const { word } = params;
      dispatch(resetSuggestedWord());
      if (typeof word === "string" && word.length > 0) {
        dispatch(addIsOriginatedFromUrlWord(word));
        dispatch(setIsFromSearchBar(false));
      }
    }
  }, [dispatch, params, isFromSearchBar]);

  return (
    <div className="word-def-page">
      {isWordChosen ? (
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
      )}
    </div>
  );
}

export default WordDefinitionPage;
