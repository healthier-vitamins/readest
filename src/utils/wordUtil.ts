const wordSchema = {
  TITLE: "Name",
  STATUS: "STATUS",
  WORD: "WORD",
  DEFINITION: "DEFINITION",
  ABBREVIATION: "ABBREVIATION",
  CREATED_TIME: "CREATED_TIME",
  LAST_EDITED_TIME: "LAST_EDITED_TIME",
  PARENT_BOOK: "PARENT_BOOK",
};

// export default wordSchema;

module.exports = {
  wordSchema,
};
// interface wordSchemaIdInterface {
//   TITLE: { id: string; type: string };
//   STATUS: { id: string; type: string };
//   WORD: { id: string; type: string };
//   DEFINITION: { id: string; type: string };
//   ABBREVIATION: { id: string; type: string };
//   CREATED_TIME: { id: string; type: string };
//   LAST_EDITED_TIME: { id: string; type: string };
//   PARENT_BOOK: { id: string; type: string };
//   WORDS_IN_BOOK: { id: string; type: string };
// }

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
