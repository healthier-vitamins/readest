import WordDefinition from "components/wordDefinition/WordDefinition";
import "./WordDefinitionPage.scss";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "store/hooks";
import {
  addUrlRedirectWord,
  resetSuggestedWord,
} from "store/slices/word.slice";

function WordDefinitionPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

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
      <div className="word-def-page-definition-box">
        <WordDefinition></WordDefinition>
      </div>
    </div>
  );
}

export default WordDefinitionPage;
