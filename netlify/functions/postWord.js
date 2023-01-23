const { Client } = require("@notionhq/client");
const { HttpStatusCode } = require("axios");
const { wordSchema } = require("../../src/utils/wordTemplate");

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
          select: {
            name: "Live",
          },
        },
        [wordSchema.DEFINITION]: {
          rich_text: [
            {
              text: {
                content: "wooooo definition",
              },
            },
          ],
        },
        [wordSchema.ABBREVIATION]: {
          rich_text: [
            {
              text: {
                content: "wooooo abbreviation",
              },
            },
          ],
        },
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
