import moment from "moment-timezone";
import { wordSchema } from "../../src/utils/schemas/wordSchema";
import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

/**
 * @typedef {Object} wordDef
 * @property {string} title
 * @property {string} abbreviation
 * @property {Object} senseArr
 * @property {Object} shortDef
 */
exports.handler = async function (event: any, context: any) {
  const { bookObj, wordDef } = JSON.parse(event.body);
  let bookDatabaseId: string | null | undefined;

  moment.tz.setDefault("Asia/Singapore");
  // const date = moment().format("MMMM Do YYYY, h:mm:ss a");

  const currentDateIso = moment().toISOString(true);

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
    // const response = await saveWord(wordDef, bookDatabaseId);
    const response = await notion.pages.create({
      parent: {
        database_id: bookDatabaseId,
        type: "database_id",
      },
      properties: {
        [wordSchema.TITLE]: {
          title: [
            {
              text: {
                content: wordDef.title,
              },
            },
          ],
        },
        [wordSchema.WORD]: {
          rich_text: [
            {
              text: {
                content: wordDef.title,
              },
            },
          ],
        },
        // [wordSchema.WORD]: [
        //   {
        //     text: {
        //       content: wordDef.title,
        //     },
        //   },
        // ],
        [wordSchema.DEFINITION]: {
          rich_text: [
            {
              text: {
                content: JSON.stringify(wordDef.shortDef),
              },
            },
          ],
        },
        // [wordSchema.DEFINITION]: [
        //   {
        //     text: {
        //       content: JSON.stringify(wordDef.shortDef),
        //     },
        //   },
        // ],
        [wordSchema.ABBREVIATION]: {
          rich_text: [
            {
              text: {
                content: wordDef.abbreviation,
              },
            },
          ],
        },
        // [wordSchema.ABBREVIATION]: [
        //   {
        //     text: {
        //       content: wordDef.abbreviation,
        //     },
        //   },
        // ],
        [wordSchema.SENTENCE]: {
          rich_text: [
            {
              text: {
                content: "PLACEHOLDER SENTENCE",
              },
            },
          ],
        },
        // [wordSchema.SENTENCE]: [
        //   {
        //     text: {
        //       content: "PLACEHOLDER SENTENCE",
        //     },
        //   },
        // ],
        [wordSchema.CREATED_TIME]: {
          date: {
            start: currentDateIso,
          },
        },
        [wordSchema.LAST_EDITED_TIME]: {
          date: {
            start: currentDateIso,
          },
        },
        [wordSchema.STATUS]: {
          select: {
            name: "LIVE",
          },
        },
      },
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response.id),
    };
  } catch (err) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
};
