const { Client } = require("@notionhq/client");

const { NOTION_KEY, NOTION_DB_BOOK_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  try {
    const response = await notion.pages.retrieve({
      page_id: "490181b3-45f5-477f-a631-8a73cd41cb71",
    });
    
    // console.log(event);
    // console.log(context);
    // console.log(response.results[0].properties.Words);
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
