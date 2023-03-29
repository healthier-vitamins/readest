import "./WordDefinition.scss";
import { AiOutlineSave } from "react-icons/ai";
import React from "react";
import { toggleSaveWordModal } from "../../store/slices/state.slice";
import { useAppDispatch, useAppSelector } from "store/hooks";

function WordDefinition() {
  const dispatch = useAppDispatch();

  const { chosenWordDefinition, isWordChosen } = useAppSelector((state) => {
    console.log("chosen word definition ", state.word.chosenWordDefinition);
    return state.word;
  });

  const RenderShortDefLogic: Function = ():
    | React.ReactElement[]
    | React.ReactElement => {
    const { shortDef } = chosenWordDefinition;
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

  function RenderWordDefinitionBox() {
    return (
      <div>
        <h5 className="title">
          {chosenWordDefinition.title}&nbsp;&nbsp;
          <span className="abbreviation">
            {chosenWordDefinition.abbreviation
              ? chosenWordDefinition.abbreviation
              : "No abbreviation"}
          </span>
        </h5>
        <RenderShortDefLogic />
        <div className="box-footer">
          <AiOutlineSave
            className="save-btn"
            onClick={() => {
              dispatch(toggleSaveWordModal());
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {isWordChosen && (
        <div className="word-definition-box">
          <RenderWordDefinitionBox></RenderWordDefinitionBox>
        </div>
      )}
    </>
  );
}

export default WordDefinition;
