import { useSelector } from "react-redux";
import "./WordDefinition.css";

function wordDefinition() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { chosenWordDefinition, isWordChosen } = useSelector((state) => {
    return state.wordDefinition;
  });

  function RenderWordDefinitionBox() {
    return (
      <div>
        <div className="title-line">
          <h5 className="title">
            {chosenWordDefinition.title}{" "}
            <span className="abbreviation">
              {chosenWordDefinition.abbreviation}
            </span>
          </h5>
        </div>
        <p className="shortdef">{chosenWordDefinition.shortDef}</p>
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
