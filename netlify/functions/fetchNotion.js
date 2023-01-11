const { Client } = require("@notionhq/client");

const { NOTION_KEY, NOTION_DB_BOOK_KEY } = process.env;

const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DB_BOOK_KEY,
      filter: {
        property: "Status",
        select: {
          equals: "Live",
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};
