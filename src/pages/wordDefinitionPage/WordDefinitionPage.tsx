import WordDefinition from "components/wordDefinition/WordDefinition";
import "./WordDefinitionPage.scss";

function WordDefinitionPage() {
  return (
    <div className="word-def-page">
        <div className="word-def-page-definition-box">

      <WordDefinition></WordDefinition>
        </div>
    </div>
  );
}

export default WordDefinitionPage;
