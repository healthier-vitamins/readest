const wordSchema: WordSchema = {
  TITLE: "Name",
  STATUS: "STATUS",
  WORD: "WORD",
  DEFINITION: "DEFINITION",
  ABBREVIATION: "ABBREVIATION",
  CREATED_TIME: "CREATED_TIME",
  LAST_EDITED_TIME: "LAST_EDITED_TIME",
  EXAMPLES: "EXAMPLES",
};

interface WordSchema {
  TITLE: string;
  STATUS: string;
  WORD: string;
  DEFINITION: string;
  ABBREVIATION: string;
  CREATED_TIME: string;
  LAST_EDITED_TIME: string;
  EXAMPLES: string;
}

export { wordSchema };
