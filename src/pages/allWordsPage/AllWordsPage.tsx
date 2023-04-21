import React, { useEffect } from "react";
import { wordSchema } from "../../utils/schemas/wordSchema";
import { Spinner } from "react-bootstrap";
import "./AllWordsPage.scss";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getWordForBook } from "store/slices/word.slice";
import { useParams } from "react-router-dom";
import { addBookSelection } from "store/slices/book.slice";
import { GLOBALVARS } from "utils/GLOBALVARS";

function WordPage() {
  const { selectedTab } = useAppSelector((state) => state.book);
  const { allBookWord, isGetWordLoading } = useAppSelector(
    (state) => state.word
  );
  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    getAllWordsForBookTrigger();
    // eslint-disable-next-line
  }, [selectedTab.bookObj]);

  useEffect(() => {
    if (isUserLoggedIn) {
      const [bookName, id] = params!.bookName!.split("--");
      const payload = {
        id: id,
        bookName: bookName,
      };
      dispatch(addBookSelection(payload));
    }
  }, [params, dispatch, isUserLoggedIn]);

  async function getAllWordsForBookTrigger() {
    const [bookName, id] = params!.bookName!.split("--");

    const payload = {
      // bookId: selectedTab.bookObj.id,
      bookId: id,
      bookName: bookName,
    };
    dispatch(getWordForBook(payload));
  }

  function renderShortDefLogic(
    shortDef: any
  ): React.ReactElement[] | React.ReactElement {
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
  }

  function renderWordDef(wordObj: any, index: number) {
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
          {renderShortDefLogic(shortDef)}
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="word-container">
      {!isGetWordLoading ? (
        allBookWord?.results.length < 1 ? (
          <div className={GLOBALVARS.DEFAULT_EMPTY_FONT_CLASS}>
            No words saved
          </div>
        ) : (
          allBookWord?.results.length > 0 &&
          allBookWord?.results.map((wordObj: any, index: number) =>
            renderWordDef(wordObj, index)
          )
        )
      ) : (
        <div className="all-words-page-loading-page">
          <Spinner
            animation="border"
            id="all-words-page-loading-spinner"
          ></Spinner>
        </div>
      )}
    </div>
  );
}

export default WordPage;
