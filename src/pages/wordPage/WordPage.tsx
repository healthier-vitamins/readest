import React, { useEffect, useState } from "react";
import { getWordForBook } from "../../store/slices/word.slice";
import { wordSchema } from "../../utils/schemas/wordSchema";
import { Spinner } from "react-bootstrap";
import "./WordPage.scss";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getAllWordsForBook } from "utils/apis/wordApis";
import axios from "axios";
// import useWindowDimension, {
//   setDynamicHeight,
// } from "../../utils/useWindowDimension";

function WordPage() {
  const { selectedTab } = useAppSelector((state) => state.book);
  const { allBookWord, isGetWordLoading } = useAppSelector(
    (state) => state.word
  );
  const dispatch = useAppDispatch();
  const [abortController, setAbortController] = useState<any>(null);

  // let { height } = useWindowDimension();

  useEffect(() => {
    getAllWordsForBookTrigger();
    // eslint-disable-next-line
  }, [selectedTab.bookObj]);

  async function getAllWordsForBookTrigger() {
    if (abortController) abortController.abort();

    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    const payload = {
      bookId: selectedTab.bookObj.id,
      abortController: abortController,
    };
    // dispatch(getWordForBook(payload));
    getAllWordsForBook(payload);
    // const resp = await axios.post("/api/getAllWord", payload, {
    //   signal: abortController,
    // });
  }

  useEffect(() => {
    if (!isGetWordLoading) setAbortController(null);
    console.log(
      `isGetWordLoading |||||||||| ${isGetWordLoading} \n abortControllerState |||||||||| ${abortController}`
    );
  }, [isGetWordLoading]);

  const RenderShortDefLogic: Function = ({
    shortDef,
  }: any): React.ReactElement[] | React.ReactElement => {
    shortDef = JSON.parse(shortDef);
    if (Array.isArray(shortDef)) {
      return shortDef.map((def, index) => {
        if (typeof def === "object") {
          return (
            <React.Fragment key={index}>
              <p className="shortdef">{shortDef[0].cxl}</p>
              {shortDef[0]?.cxtis &&
                shortDef[0].cxtis.map((word: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <p className="shortdef">
                        {++index}.&nbsp;{word.cxt}
                      </p>
                      <br />
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={index}>
              <p className="shortdef">
                {++index}.&nbsp;
                {def}
              </p>
            </React.Fragment>
          );
        }
      });
    } else {
      return (
        <React.Fragment>
          <p className="shortdef">{shortDef}</p>
        </React.Fragment>
      );
    }
  };

  function RenderWordDef(wordObj: any, index: number) {
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
      // style={{ height: setDynamicHeight(height) }}
    >
      {!isGetWordLoading ? (
        allBookWord.results.length < 1 ? (
          <div className="no-words">No words saved</div>
        ) : (
          allBookWord.results.map((wordObj: any, index: number) =>
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
