import wordSchema from "../../src/utils/wordUtil";
const { Client } = require("@notionhq/client");
const { HttpStatusCode } = require("axios");

const { NOTION_KEY, NOTION_DB_WORD_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  //   const { selectedBooks, wordDefinition } = JSON.parse(event.body);
  //   selectedBooks.forEach(async (book) => {
  //     console.log("individual bookies: ", book);
  //     console.log("word def in api: ", wordDefinition);

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DB_WORD_KEY,
        type: "database_id",
      },
      properties: {
        [wordSchema.TITLE]: [
          {
            text: {
              content: "woooooo",
            },
          },
        ],
        [wordSchema.WORD]: [
          {
            text: {
              content: "woooooo",
            },
          },
        ],
        [wordSchema.STATUS]: {
          name: "Live",
        },
        [wordSchema.DEFINITION]: [
          {
            text: {
              content: "wooo",
            },
          },
        ],
        [wordSchema.ABBREVIATION]: [
          {
            text: {
              content: "wooooo abbreviation",
            },
          },
        ],
        [wordSchema.PARENT_BOOK]: [
          {
            id: "25f5492d-c2e7-4f61-8c92-3c1e58a3eb55",
          },
        ],
      },
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
  //   });
};
