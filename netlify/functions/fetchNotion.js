const { Client } = require("@notionhq/client");

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  try {
    const response = await notion.databases.query({
      // page_id: "25f5492dc2e74f618c923c1e58a3eb55", %3B%3Coc
      // page_id: "2ca52834-8db0-4595-bc9b-ed565deb1748",
      database_id: "473d8c52-4d47-4d13-b5d5-d2aee88ae5d0",
      // block_id: "25f5492dc2e74f618c923c1e58a3eb55",
      // query: "Words",
      // filter: {
      //   value: "database",
      //   property: "object",
      // },
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
