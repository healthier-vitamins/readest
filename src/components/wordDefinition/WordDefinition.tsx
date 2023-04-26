import "./WordDefinition.scss";
import { AiOutlineSave } from "react-icons/ai";
import React from "react";
import { toggleSaveWordModal } from "../../store/slices/state.slice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import protectedFunction from "utils/protectedFunc";
import { ChosenWordDefinition } from "store/slices/word.slice";

function WordDefinition({
  abbreviation,
  examples,
  shortDef,
  title,
  transitive,
}: ChosenWordDefinition) {
  const dispatch = useAppDispatch();

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);

  interface RenderWithItalicsProps {
    text: string;
    isLast: boolean;
  }

  function RenderWithItalics({ text, isLast }: RenderWithItalicsProps) {
    const italicsRegex = /{it}(.*?){\/it}/g;
    const parts = text.split(italicsRegex);
    const matches = [...text.matchAll(italicsRegex)].map((match) => match[1]);
    console.log("parts ", parts);
    console.log("matches ", matches);

    const result: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      console.log("part ", part);
      console.log("index ", index);
      if (part !== matches[0]) {
        result.push(part);
      }
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
    let isLast: boolean = false;
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
          <AiOutlineSave
            className="save-btn"
            onClick={() => {
              isUserLoggedIn
                ? dispatch(toggleSaveWordModal())
                : protectedFunction(null);
            }}
          />
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
