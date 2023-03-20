import { bookSchema } from "../../src/utils/schemas/bookSchema.ts";
const { Client } = require("@notionhq/client");
const { HttpStatusCode } = require("axios");

const { NOTION_KEY, NOTION_DB_BOOK_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DB_BOOK_KEY,
      filter: {
        property: bookSchema.STATUS,
        select: {
          equals: "Live",
        },
      },
      sorts: [
        {
          property: bookSchema.CREATED_TIME,
          direction: "descending",
        },
      ],
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return {
      statusCode: HttpStatusCode.NotFound,
      body: err.toString(),
    };
  }
};
