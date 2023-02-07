import { wordSchema } from "../../src/utils/wordUtil.ts";
import { bookSchema } from "../../src/utils/bookUtil";
const { Client } = require("@notionhq/client");

const { NOTION_KEY, NOTION_DB_BOOK_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { title } = JSON.parse(event.body);
  let id;
  // first create page in book database
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DB_BOOK_KEY,
        type: "database_id",
      },
      properties: {
        [bookSchema.BOOK_NAME]: {
          rich_text: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        [bookSchema.TITLE]: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        [bookSchema.STATUS]: {
          select: {
            name: "Live",
          },
        },
      },
    });
    id = response.id;
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
  // create block child database
  try {
    const response = await notion.databases.create({
      parent: {
        page_id: id,
      },
      is_inline: true,
      title: [
        {
          type: "text",
          text: {
            content: "WORDS",
          },
        },
      ],
      properties: {
        [wordSchema.TITLE]: {
          type: "title",
          title: {},
        },
        [wordSchema.WORD]: {
          type: "rich_text",
          rich_text: {},
        },
        [wordSchema.STATUS]: {
          type: "select",
          select: {
            options: [
              {
                name: "Live",
              },
            ],
          },
        },
        [wordSchema.DEFINITION]: {
          type: "rich_text",
          rich_text: {},
        },
        [wordSchema.ABBREVIATION]: {
          type: "rich_text",
          rich_text: {},
        },
        [wordSchema.CREATED_TIME]: {
          type: "created_time",
          created_time: {},
        },
        [wordSchema.LAST_EDITED_TIME]: {
          type: "created_time",
          created_time: {},
        },
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.err(err);
    console.log(err);
    console.log(err.message);
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};
