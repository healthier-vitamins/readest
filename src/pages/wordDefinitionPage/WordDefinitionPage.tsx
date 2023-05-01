import WordDefinition from "components/wordDefinition/WordDefinition";
import "./WordDefinitionPage.scss";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addIsOriginatedFromUrlWord,
  resetSuggestedWord,
} from "store/slices/word.slice";

import YearTimer from "components/yearTimer/YearTimer";
import { changeActiveTab } from "store/slices/book.slice";

function WordDefinitionPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const {
    isWordChosen,
    chosenWordDefinition,
    isOriginatedFromUrl: { isFromSearchBar, word },
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


  //! this is not wrong. back should show dropdown list again unless suggestedWord[0] is correct (meta.id === params)
  // useEffect(() => {
  //   // const encodedUriWordTitle = encodeURIComponent(chosenWordDefinition.title)
  //   if (
  //     wordFromUrlParam &&
  //     chosenWordDefinition.title &&
  //     wordFromUrlParam.toUpperCase() !==
  //       chosenWordDefinition.title.toUpperCase()
  //   ) {
  //     console.log(wordFromUrlParam, chosenWordDefinition.title);
  //     // dispatch(getWordDefinition(wordFromUrlParam));
  //     // dispatch(addChosenWordDefinition(suggestedWord[0]));
  //     // dispatch(addIsOriginatedFromUrlWord(chosenWordDefinition.title));
  //     dispatch(addIsOriginatedFromUrlWord(wordFromUrlParam));
  //     dispatch(setIsFromSearchBar(false));
  //     // navigate(`/w/${wordFromUrlParam}`);
  //   }
  // }, [navigate, chosenWordDefinition.title, wordFromUrlParam, dispatch]);

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
