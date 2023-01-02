import axios from "axios";
import React from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addWords, resetWords } from "../features/suggestedWordsSlice";

function SearchBar() {
  // const [definitions, setDefinitions] = useState([]);
  const { suggestedWords } = useSelector((store) => {
    return store;
  });
  const dispatch = useDispatch();

  async function searchQuery(query) {
    return await axios
      .get(
        `https://dictionaryapi.com/api/v3/references/sd4/json/${query}?key=${process.env.REACT_APP_DICTIONARY_KEY}`
      )
      .then((response) => {
        if (response.status !== 200) {
          console.log(response.data);
          alert("Merriam Webster API is down.");
        } else {
          // setDefinitions(response.data);
          response.data.forEach((def) => {
            console.log(def);
            //! throw in the entire object
            //! add abbreviations after dropdown list word
            dispatch(addWords(def.hwi.hw.toLowerCase().replaceAll("*", "")));
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleChange(value) {
    dispatch(resetWords());
    searchQuery(value);
    // console.log(suggestedWords);
  }

  return (
    <div>
      <div>
        <Form.Control
          type="text"
          placeholder="Search word"
          onChange={(e) => handleChange(e.target.value)}
        ></Form.Control>
      </div>
      <div>
        {suggestedWords.map((word, index) => {
          return (
            <React.Fragment key={index}>
              <p>{word}</p>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;
