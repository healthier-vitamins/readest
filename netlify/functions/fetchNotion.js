const { Client } = require("@notionhq/client");

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  try {
    const response = await notion.databases.query({
      // page_id: "25f5492dc2e74f618c923c1e58a3eb55",
      // page_id: "2ca52834-8db0-4595-bc9b-ed565deb1748",

      database_id: "4a3666d6-6287-4211-8fc7-9cbbe213a161",
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
