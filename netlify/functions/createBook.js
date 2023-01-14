const { Client } = require("@notionhq/client");

const { NOTION_KEY, NOTION_DB_BOOK_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DB_BOOK_KEY,
        type: "database_id",
      },
      properties: {
        "Book Name": {
          rich_text: [
            {
              text: {
                content: "Created from here",
              },
            },
          ],
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
