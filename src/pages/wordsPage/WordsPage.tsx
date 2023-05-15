import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import "./WordsPage.scss";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { AllWordsInBook, getWordsInBook } from "store/slices/word.slice";
import { useNavigate, useParams } from "react-router-dom";
import { BookRes, addBookSelection } from "store/slices/book.slice";
import { GLOBALVARS } from "utils/GLOBALVARS";
import WordDefinition from "components/wordDefinition/WordDefinition";
import ApiError from "classes/ApiError";

function WordsPage() {
  const { selectedTab } = useAppSelector((state) => state.book);
  const { allWordsFromBook, isGetWordLoading } = useAppSelector(
    (state) => state.word
  );
  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);

  const { bookRes } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // eslint-disable-next-line
  const [apiError, setApiError] = useState(new ApiError());

  useEffect(() => {
    getAllWordsForBookTrigger();
    // eslint-disable-next-line
  }, [selectedTab.bookObj]);

  useEffect(() => {
    if (isUserLoggedIn) {
      const [bookName, id] = params!.bookName!.split("--");
      const bookExists = bookRes.some(
        (book) => book.bookName.toLowerCase() === bookName.toLowerCase()
      );
      if (bookExists) {
        const payload = {
          id: id,
          bookName: bookName,
        };
        dispatch(addBookSelection(payload));
      } else {
        apiError.dispatchErrorNotification(
          GLOBALVARS.ERROR_BOOK_DOES_NOT_EXIST,
          null
        );
        navigate("/");
      }
    }
    // eslint-disable-next-line
  }, [params, dispatch, isUserLoggedIn]);

  async function getAllWordsForBookTrigger() {
    const [bookName, id] = params!.bookName!.split("--");
    const bookExists = bookRes.some(
      (book) => book.bookName.toLowerCase() === bookName.toLowerCase()
    );
    if (bookExists) {
      const payload: BookRes = {
        // bookId: selectedTab.bookObj.id,
        id: id,
        bookName: bookName,
      };
      dispatch(getWordsInBook(payload));
    } else {
      apiError.dispatchErrorNotification(
        GLOBALVARS.ERROR_BOOK_DOES_NOT_EXIST,
        null
      );
      navigate("/");
    }
  }

  // function renderShortDefLogic(
  //   shortDef: any
  // ): React.ReactElement[] | React.ReactElement {
  //   shortDef = JSON.parse(shortDef);
  //   if (Array.isArray(shortDef)) {
  //     return shortDef.map((def, index) => {
  //       if (typeof def === "object") {
  //         return (
  //           <React.Fragment key={index}>
  //             <p className="shortdef">{shortDef[0].cxl}</p>
  //             {shortDef[0]?.cxtis &&
  //               shortDef[0].cxtis.map((word: any, index: number) => {
  //                 return (
  //                   <React.Fragment key={index}>
  //                     <p className="shortdef">
  //                       {++index}.&nbsp;{word.cxt}
  //                     </p>
  //                     <br />
  //                   </React.Fragment>
  //                 );
  //               })}
  //           </React.Fragment>
  //         );
  //       } else {
  //         return (
  //           <React.Fragment key={index}>
  //             <p className="shortdef">
  //               {++index}.&nbsp;
  //               {def}
  //             </p>
  //           </React.Fragment>
  //         );
  //       }
  //     });
  //   } else {
  //     return (
  //       <React.Fragment>
  //         <p className="shortdef">{shortDef}</p>
  //       </React.Fragment>
  //     );
  //   }
  // }

  // function renderWordDef(wordObj: any, index: number) {
  //   const title = wordObj.properties[wordSchema.WORD].rich_text[0].plain_text;
  //   const abbreviation =
  //     wordObj.properties[wordSchema.ABBREVIATION].rich_text[0].plain_text;
  //   const shortDef =
  //     wordObj.properties[wordSchema.DEFINITION].rich_text[0].plain_text;
  //   return (
  //     <React.Fragment key={index}>
  //       <div className="word-page-definition-box">
  //         <h5 className="title">{title}</h5>
  //         <span className="abbreviation">{abbreviation}</span>
  //         {renderShortDefLogic(shortDef)}
  //       </div>
  //     </React.Fragment>
  //   );
  // }

  return (
    <div className="all-words-page-container">
      {!isGetWordLoading ? (
        allWordsFromBook?.length < 1 ? (
          <div className={GLOBALVARS.DEFAULT_EMPTY_FONT_CLASS}>
            No words saved
          </div>
        ) : (
          allWordsFromBook?.length > 0 &&
          allWordsFromBook?.map((wordObj: AllWordsInBook, index: number) => (
            <div className="all-words-page-word-def" key={index}>
              <WordDefinition
                id={wordObj.id}
                abbreviation={wordObj.abbreviation}
                examples={wordObj.examples}
                shortDef={wordObj.shortDef}
                title={wordObj.title}
                transitive={wordObj.transitive}
              ></WordDefinition>
            </div>
          ))

          // allWordsFromBook?.results.map((wordObj: any, index: number) =>
          //   renderWordDef(wordObj, index)
          // )
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

export default WordsPage;
