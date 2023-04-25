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

  // const { chosenWordDefinition } = useAppSelector((state) => {
  //   console.log("chosen word definition ", state.word.chosenWordDefinition);
  //   return state.word;
  // });

  const {
    authentication: { isUserLoggedIn },
  } = useAppSelector((state: any) => state.user);

  function renderShortDefLogic(): React.ReactElement[] | React.ReactElement {
    // const { shortDef } = chosenWordDefinition;
    // const { shortDef } = props;

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

  function renderExamples(): React.ReactElement | React.ReactElement[] | null {
    if (examples.length) {
      if(examples.some(ele => Array.isArray(ele))) {
        
      }
      return examples.map((ele, index) => {
        if (Array.isArray(ele)) {
          return (
            <React.Fragment key={index}>
              <div>{ele}</div>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={index}>
              <div>{ele}</div>
            </React.Fragment>
          );
        }
      });
    } else {
      return null;
    }
  }

  function renderWordDefinitionBox() {
    console.log(abbreviation, title, examples, shortDef, transitive);
    return (
      <div>
        <h5 className="title">
          {/* {chosenWordDefinition.title}&nbsp;&nbsp; */}
          {/* {props.title}&nbsp;&nbsp; */}
          {title}&nbsp;&nbsp;
          <span className="abbreviation">
            {/* {props.abbreviation ? props.abbreviation : "No abbreviation"} */}
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
                : protectedFunction("");
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
