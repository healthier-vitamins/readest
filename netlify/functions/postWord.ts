import { wordSchema } from "../../src/utils/schemas/wordSchema";
const { Client } = require("@notionhq/client");
const { HttpStatusCode } = require("axios");

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { bookObj, wordDef } = JSON.parse(event.body);
  let bookDatabaseId;

  /**
   * @typedef {Object} wordDef
   * @property {string} title
   * @property {string} abbreviation
   * @property {Object} senseArr
   * @property {Object} shortDef
   */
  try {
    const response = await notion.blocks.children.list({
      block_id: bookObj.id,
    });
    bookDatabaseId = response.results[0].id;
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }

  try {
    // eslint-disable-next-line
    const response = await saveWord(wordDef, bookDatabaseId);
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(""),
    };
  } catch (err) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
};

async function saveWord(wordDef, bookDatabaseId) {
  const response = await notion.pages.create({
    parent: {
      database_id: bookDatabaseId,
      type: "database_id",
    },
    properties: {
      [wordSchema.TITLE]: [
        {
          text: {
            content: wordDef.title,
          },
        },
      ],
      [wordSchema.WORD]: [
        {
          text: {
            content: wordDef.title,
          },
        },
      ],
      [wordSchema.STATUS]: {
        name: "LIVE",
      },
      [wordSchema.DEFINITION]: [
        {
          text: {
            content: JSON.stringify(wordDef.shortDef),
          },
        },
      ],
      [wordSchema.ABBREVIATION]: [
        {
          text: {
            content: wordDef.abbreviation,
          },
        },
      ],
    },
  });
  return response;
}
