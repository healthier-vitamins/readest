import { ChosenWordDefinition } from "./../../src/store/slices/word.slice";
import { BookRes } from "./../../src/store/slices/book.slice";
import moment from "moment-timezone";
import { wordSchema } from "../../src/utils/schemas/wordSchema";
import { HttpStatusCode } from "axios";
import notion from "../../src/utils/notion/notionLoader";

/**
 * @typedef {Object} wordDef
 * @property {string} title
 * @property {string} abbreviation
 * @property {Object} example
 * @property {Object} shortDef
 */

interface parsedObj {
  bookObj: BookRes;
  wordDef: ChosenWordDefinition;
}

exports.handler = async function (event: any, _context: any) {
  const { bookObj, wordDef } = JSON.parse(event.body) as parsedObj;

  let bookDatabaseId: string | null | undefined;

  moment.tz.setDefault("Asia/Singapore");
  // const date = moment().format("MMMM Do YYYY, h:mm:ss a");

  const currentDateIso = moment().toISOString(true);

  try {
    const response = await notion.blocks.children.list({
      block_id: bookObj.id,
    });
    bookDatabaseId = response.results[0].id;
  } catch (err: any) {
    console.error(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }

  try {
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
        [wordSchema.DEFINITION]: {
          rich_text: [
            {
              text: {
                content: JSON.stringify(wordDef.shortDef),
              },
            },
          ],
        },
        [wordSchema.ABBREVIATION]: {
          rich_text: [
            {
              text: {
                content: wordDef.abbreviation ? wordDef.abbreviation : "",
              },
            },
          ],
        },
        [wordSchema.EXAMPLES]: {
          rich_text: [
            {
              text: {
                content: wordDef.examples
                  ? JSON.stringify(wordDef.examples)
                  : "",
              },
            },
          ],
        },
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
  } catch (err: any) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
};
