import "./WordDefinition.scss";
import { AiOutlineSave } from "react-icons/ai";
import React, { useState } from "react";
import { toggleSaveWordModal } from "../../store/slices/state.slice";

import { MdDeleteOutline } from "react-icons/md";
import { AllWordsInBook, deleteWord } from "../../store/slices/word.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import protectedFunction from "../../utils/protectedFunc";
import DeleteConfirmationButton from "../button/DeleteConfirmationButton";
import { getWordsInBook } from "../../store/apis/word.api";

interface WordDefinitionProps extends AllWordsInBook {}

function WordDefinition({
  id,
  abbreviation,
  examples,
  shortDef,
  title,
}: WordDefinitionProps) {
  const dispatch = useAppDispatch();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state) => state.user);
  const { selectedTab } = useAppSelector((state) => state.book);
  const { isDeleteWordLoading } = useAppSelector((state) => state.word);

  interface RenderWithItalicsProps {
    text: string;
    isLast: boolean;
  }

  async function onConfirmDelete() {
    if (id) {
      const res = await dispatch(deleteWord({ wordId: id }));
      if (res) {
        dispatch(getWordsInBook(selectedTab.bookObj));
      }
    }
  }

  function RenderWithItalics({ text, isLast }: RenderWithItalicsProps) {
    const doubleQuoteRegex = /{ldquo}|{rdquo}/g;
    text = text.replace(doubleQuoteRegex, `"`);

    const italicsRegex = /{it}(.*?){\/it}/g;
    // only splits the {it} and {/it}, therefore return 3 elements
    const parts = text.split(italicsRegex);

    // matchAll has to be put in an array otherwise, returned as RegExpStringIterator
    // as an array, element returned as:
    /**
     * @type Array
     * @property [0] captured regex, ie: "{it}sad{/it}"
     * @property [1] matched word, ie: "sad"
     * @property [2] groups
     * @property [3] index: total number of index
     * @property [4] input: raw string
     *
     */
    const matches = [...text.matchAll(italicsRegex)].map((match) => match[1]);
    // console.log("parts ", parts);
    // console.log("matchAll ", [...text.matchAll(italicsRegex)]);
    // console.log("matches ", matches);

    const result: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      // matches is mapped containing the word only
      if (part !== matches[0]) {
        result.push(part);
      }
      // this works because of how parts is being split into 3 elements based on the regex.
      if (index < matches.length) {
        result.push(<em key={index}>{matches[index]}</em>);
      }
    });

    return (
      <span className="word-definition-examples">
        {result}
        {!isLast && `, `}
      </span>
    );
  }

  function renderShortDefLogic(): React.ReactElement[] | React.ReactElement {
    if (Array.isArray(shortDef)) {
      return shortDef.map((def, index) => {
        // if (typeof def === "object") {
        //   return (
        //     <React.Fragment key={index}>
        //       <p className="shortdef">{shortDef[0].cxl}</p>
        //       {shortDef[0]?.cxtis &&
        //         shortDef[0].cxtis.map((word: any, index: number) => {
        //           return (
        //             <React.Fragment key={index}>
        //               <p className="shortdef">
        //                 {++index}.&nbsp;{word.cxt}
        //               </p>
        //               <br />
        //             </React.Fragment>
        //           );
        //         })}
        //     </React.Fragment>
        //   );
        // } else {
        return (
          <React.Fragment key={index}>
            <p className="shortdef">
              {++index}.&nbsp;
              {def}
            </p>
          </React.Fragment>
        );
        // }
      });
    } else {
      return (
        <React.Fragment>
          <p className="shortdef">{shortDef}</p>
        </React.Fragment>
      );
    }
  }

  function renderExamples(): React.ReactElement | React.ReactElement[] | null {
    let isLast = false;
    if (examples.length) {
      return examples.map((ele, index) => {
        if (index === examples.length - 1) {
          isLast = true;
        }
        if (Array.isArray(ele)) {
          return (
            <React.Fragment key={index}>
              <RenderWithItalics text={ele} isLast={isLast}></RenderWithItalics>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={index}>
              <RenderWithItalics text={ele} isLast={isLast}></RenderWithItalics>
            </React.Fragment>
          );
        }
      });
    } else {
      return null;
    }
  }

  function renderWordDefinitionBox() {
    return (
      <div>
        <h5 className="title">
          {title}&nbsp;&nbsp;
          <span className="word-definition-abbreviation">
            {abbreviation ? abbreviation : "No abbreviation"}
          </span>
        </h5>
        {renderShortDefLogic()}
        {renderExamples()}
        <div className="box-footer">
          {/* only show save button if word hasn't been been saved */}
          {!id && (
            <AiOutlineSave
              className="save-btn"
              onClick={() => {
                isUserLoggedIn
                  ? dispatch(toggleSaveWordModal())
                  : protectedFunction(null);
              }}
            />
          )}

          {id && !confirmDelete && (
            <div
              className="word-definition-dlt-btn"
              onClick={() => setConfirmDelete(!confirmDelete)}
            >
              <MdDeleteOutline></MdDeleteOutline>
            </div>
          )}
          {id && confirmDelete && (
            <DeleteConfirmationButton
              isLoading={isDeleteWordLoading}
              onConfirmDelete={onConfirmDelete}
              setConfirmDelete={setConfirmDelete}
            ></DeleteConfirmationButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="word-definition-container">
      <div className="word-definition-box">{renderWordDefinitionBox()}</div>
    </div>
  );
}

export default WordDefinition;
