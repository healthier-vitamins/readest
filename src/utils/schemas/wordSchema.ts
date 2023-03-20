const wordSchema: WordSchema = {
  TITLE: "Name",
  STATUS: "STATUS",
  WORD: "WORD",
  DEFINITION: "DEFINITION",
  ABBREVIATION: "ABBREVIATION",
  CREATED_TIME: "CREATED_TIME",
  LAST_EDITED_TIME: "LAST_EDITED_TIME",
  PARENT_BOOK: "PARENT_BOOK",
};

interface WordSchema {
  TITLE: string;
  STATUS: string;
  WORD: string;
  DEFINITION: string;
  ABBREVIATION: string;
  CREATED_TIME: string;
  LAST_EDITED_TIME: string;
  PARENT_BOOK: string;
}

export { wordSchema, WordSchema };
