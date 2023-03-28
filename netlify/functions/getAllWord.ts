// TODO fix this export {} by replacing notion client with a class instead
export {};
const { Client } = require("@notionhq/client");
const { HttpStatusCode } = require("axios");
const { wordSchema } = require("../../src/utils/schemas/wordSchema");

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { bookId } = JSON.parse(event.body);
  const databaseId = await getBookDatabase(bookId);
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: wordSchema.STATUS,
        select: {
          equals: "Live",
        },
      },
      sorts: [
        {
          property: wordSchema.CREATED_TIME,
          direction: "descending",
        },
      ],
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
};

async function getBookDatabase(bookId) {
  try {
    const response = await notion.blocks.children.list({
      block_id: bookId,
    });
    return response.results[0].id;
  } catch (err) {
    console.error(err);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
}
