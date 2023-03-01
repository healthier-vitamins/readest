import { useDispatch, useSelector } from "react-redux";
import "./WordDefinition.scss";
import { AiOutlineSave } from "react-icons/ai";
import React from "react";
import { toggleSaveWordModal } from "../../store/slices/state.slice";

function WordDefinition() {
  const dispatch = useDispatch();

  const { chosenWordDefinition, isWordChosen } = useSelector((state) => {
    console.log("chosen word definition ", state.word.chosenWordDefinition);
    return state.word;
  });

  function RenderShortDefLogic() {
    const { shortDef } = chosenWordDefinition;
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

  function RenderWordDefinitionBox() {
    return (
      <div>
        <h5 className="title">
          {chosenWordDefinition.title}&nbsp;&nbsp;
          <span className="abbreviation">
            {chosenWordDefinition.abbreviation}
          </span>
        </h5>
        <RenderShortDefLogic></RenderShortDefLogic>
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
