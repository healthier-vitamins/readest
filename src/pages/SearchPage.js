import SearchBar from "../components/searchBar/SearchBar";
import WordDefinition from "../components/wordDefinition/WordDefinition";

import "./SearchPage.css";

function SearchPage() {
  return (
    <div className="main-container">
      <div className="searchbar-container">
        <SearchBar></SearchBar>
      </div>
      <div className="word-definition-container">
        <WordDefinition></WordDefinition>
      </div>
    </div>
  );
}

export default SearchPage;
