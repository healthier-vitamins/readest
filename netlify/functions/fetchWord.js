// 2ca52834-8db0-4595-bc9b-ed565deb1748
const { Client } = require("@notionhq/client");
const { HttpStatusCode } = require("axios");

const { NOTION_KEY, NOTION_DB_WORD_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  try {
    const response = await notion.pages.retrieve({
      page_id: "ecdf9105-b1e7-469e-a9be-06bdecced12a",
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify({ response }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
};
