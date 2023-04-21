import WordDefinition from "components/wordDefinition/WordDefinition";
import "./WordDefinitionPage.scss";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addUrlRedirectWord,
  resetSuggestedWord,
} from "store/slices/word.slice";
import YearTimer from "components/yearTimer/YearTimer";

function WordDefinitionPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { isWordChosen } = useAppSelector((state) => state.word);

  // useEffect(() => {
  //   dispatch(changeActiveTab(0));
  // }, [dispatch]);

  useEffect(() => {
    console.log(params);
    const { word } = params;

    dispatch(resetSuggestedWord());
    if (typeof word === "string" && word.length > 0) {
      dispatch(addUrlRedirectWord(word));
    }
  }, [dispatch, params]);

  return (
    <div className="word-def-page">
      {/* // TODO standardise margin top with HomePage */}
      <div className="word-def-page-definition-box">
        {isWordChosen ? (
          <WordDefinition></WordDefinition>
        ) : (
          <YearTimer></YearTimer>
        )}
      </div>
    </div>
  );
}

export default WordDefinitionPage;
