import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

function WordsPage() {
  async function getBook() {
    await axios.get(`/api/fetchNotion`).then((res) => {
      console.log(res.data);
    });
  }

  async function createBook() {
    const test = {
      title: "created title",
      definition: "created def",
    };
    await axios.post(`/api/createBook`, test).then((res) => {
      console.log(res);
    });
  }

  return <Link onClick={createBook}>Ffuck you</Link>;
}

export default WordsPage;
