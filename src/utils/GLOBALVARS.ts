export const GLOBALVARS = {
  MOBILE_MIN_WIDTH: 767,
  MOBILE_FOLD_WIDTH: 280,
  NAVBAR_HEIGHT: 96,
  POPOVER_LOGIN: "loginState" as const,
  POPOVER_SIGNUP: "signUpState" as const,
  POPOVER_CONFIRM_EMAIL: "emailConfirmState" as const,
  YEAR_TIMER_NUMBER_OF_BLOCKS: 18,

  // error codes
  ERROR_GENERAL_ERROR: "Something went wrong.",
  ERROR_BOOK_NAME_ALRDY_EXISTS: "Book already exists.",
  ERROR_TIMEOUT: "Please refresh the page.",
  ERROR_BOOK_DB_NOT_FOUND: "ERRx0001 Book database not found.",
  ERROR_ACCESSING_BOOK_DB: "ERRx0002 Trouble accessing book database.",
  ERROR_GETTING_WORDS_IN_BOOK: "ERRx0003 Trouble getting words in book.",
  ERROR_INVALID_URL: "Invalid Url.",
  ERROR_BOOK_DOES_NOT_EXIST: "Book does not exist.",

  // css classes
  DEFAULT_EMPTY_FONT_CLASS: "default-empty-font",
  DEFAULT_LINK_CLASS: "default-link",
  DEFAULT_SPAN_CLASS: "default-span",
};
