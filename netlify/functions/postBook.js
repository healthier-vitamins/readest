import bookSchema from "../../src/utils/bookUtil";
const { Client } = require("@notionhq/client");

const { NOTION_KEY, NOTION_DB_BOOK_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { title } = JSON.parse(event.body);
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
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};
