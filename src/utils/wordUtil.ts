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

// module.exports = {
//   wordSchema,
// };

export { wordSchema, WordSchema };

// export const wordSchemaId: wordSchemaIdInterface = {
//   TITLE: { id: "title", type: "title" },
//   STATUS: {
//     id: "Moqg",
//     type: "select",
//   },
//   WORD: { id: "Hq%40p", type: "rich_text" },
//   DEFINITION: { id: "X%7BkV", type: "rich_text" },
//   ABBREVIATION: { id: "xFpJ", type: "rich_text" },
//   CREATED_TIME: { id: "%5Bmeh", type: "created_time" },
//   LAST_EDITED_TIME: { id: "vwi%3C", type: "last_edited_time" },
//   PARENT_BOOK: { id: "IhOn", type: "relation" },
//   WORDS_IN_BOOK: { id: "DMaY", type: "rich_text" },
// };
