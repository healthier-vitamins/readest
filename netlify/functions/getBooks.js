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
        property: "Status",
        select: {
          equals: "Live",
        },
      },
      sorts: [
        {
          property: "Created time",
          direction: "descending",
        },
      ],
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return {
      statusCode: HttpStatusCode.NotFound,
      body: err.toString(),
    };
  }
};
