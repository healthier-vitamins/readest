import { useSelector } from "react-redux";
import "./WordDefinition.css";
import { AiOutlineSave } from "react-icons/ai";

function wordDefinition() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { chosenWordDefinition, isWordChosen } = useSelector((state) => {
    return state.wordDefinition;
  });

  function RenderWordDefinitionBox() {
    return (
      <div>
        <h5 className="title">
          {chosenWordDefinition.title}{" "}
          <span className="abbreviation">
            {chosenWordDefinition.abbreviation}
          </span>
        </h5>
        <p className="shortdef">{chosenWordDefinition.shortDef}</p>
        <div className="box-footer">
          <AiOutlineSave className="save-btn" />
          {/* <AiTwotoneSave /> */}
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

export default wordDefinition;
