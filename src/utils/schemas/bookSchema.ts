const bookSchema: BookSchema = {
  TITLE: "Name",
  STATUS: "STATUS",
  BOOK_NAME: "BOOK_NAME",
  CREATED_TIME: "CREATED_TIME",
  LAST_EDITED_TIME: "LAST_EDITED_TIME",
  WORDS: "WORDS",
};

interface BookSchema {
  TITLE: string;
  STATUS: string;
  BOOK_NAME: string;
  CREATED_TIME: string;
  LAST_EDITED_TIME: string;
  WORDS: string;
}

export { bookSchema };
