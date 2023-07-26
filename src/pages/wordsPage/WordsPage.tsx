import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import "./WordsPage.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { BookRes, addBookSelection } from "../../store/slices/book.slice";
import { AllWordsInBook } from "../../store/slices/word.slice";
import { GLOBALVARS } from "../../utils/GLOBALVARS";
import WordDefinition from "../../components/wordDefinition/WordDefinition";
import { getWordsInBook } from "../../store/apis/word.api";
import { setBookDoesNotExistRedirector } from "../../store/slices/state.slice";

function WordsPage() {
  const { selectedTab } = useAppSelector((state) => state.book);
  const { allWordsFromBook, isGetWordLoading } = useAppSelector(
    (state) => state.word
  );
  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state) => state.user);

  const { bookRes } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (isUserLoggedIn && bookRes.length > 0) {
      // const [bookName, id] = params.bookName!.split("--");
      const bookName = params.bookName;
      const bookExists = bookRes.filter((book: BookRes) => {
        return book.bookName === bookName;
      });

      if (bookExists.length > 0) {
        const payload = {
          id: bookExists[0].id,
          bookName: bookExists[0].bookName,
        };
        dispatch(addBookSelection(payload));
        dispatch(getWordsInBook(payload));
      } else {
        console.error("Book does not exist.");
        dispatch(setBookDoesNotExistRedirector(true));
        navigate("/");
      }
    }
  }, [params, isUserLoggedIn, bookRes, selectedTab.bookObj]);

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
              ></WordDefinition>
            </div>
          ))
        )
      ) : (
        <div className="all-words-page-loading-page">
          <Spinner animation="border" id="all-words-page-loading-spinner" />
        </div>
      )}
    </div>
  );
}

export default WordsPage;
