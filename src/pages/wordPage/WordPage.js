import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWordForBook } from "../../store/slices/word.slice";
import { wordSchema } from "../../utils/wordUtil.ts";
import { Spinner } from "react-bootstrap";
import "./WordPage.scss";
import useWindowDimension, {
  setDynamicHeight,
} from "../../utils/useWindowDimension";

function WordPage() {
  const { selectedTab } = useSelector((state) => state.book);
  const { allBookWord, isGetWordLoading } = useSelector((state) => state.word);
  const dispatch = useDispatch();

  let { height } = useWindowDimension();

  useEffect(() => {
    const payloadObj = {
      bookId: selectedTab.bookObj.id,
    };
    dispatch(getWordForBook(payloadObj));
    // eslint-disable-next-line
  }, [selectedTab.bookObj]);

  function RenderShortDefLogic({ shortDef }) {
    shortDef = JSON.parse(shortDef);
    if (Array.isArray(shortDef)) {
      return shortDef.map((def, index) => {
        return (
          <React.Fragment key={index}>
            <p className="shortdef">
              {++index}.&nbsp;
              {def}
            </p>
          </React.Fragment>
        );
      });
    } else {
      return <p className="shortdef">{shortDef}</p>;
    }
  }

  function RenderWordDef(wordObj, index) {
    const title = wordObj.properties[wordSchema.WORD].rich_text[0].plain_text;
    const abbreviation =
      wordObj.properties[wordSchema.ABBREVIATION].rich_text[0].plain_text;
    const shortDef =
      wordObj.properties[wordSchema.DEFINITION].rich_text[0].plain_text;
    return (
      <React.Fragment key={index}>
        <div className="word-page-definition-box">
          <h5 className="title">{title}</h5>
          <span className="abbreviation">{abbreviation}</span>
          <RenderShortDefLogic shortDef={shortDef}></RenderShortDefLogic>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div
      className="word-container"
      style={{ height: setDynamicHeight(height) }}
    >
      {!isGetWordLoading ? (
        allBookWord.results.length < 1 ? (
          <div className="no-words">No words saved</div>
        ) : (
          allBookWord.results.map((wordObj, index) =>
            RenderWordDef(wordObj, index)
          )
        )
      ) : (
        <div className="loading-spinner">
          <Spinner animation="border" variant="secondary"></Spinner>
        </div>
      )}
    </div>
  );
}

export default WordPage;
