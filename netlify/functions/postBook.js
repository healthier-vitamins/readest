import axios from "axios";
import bookSchema from "../../src/utils/bookUtil";
const { Client } = require("@notionhq/client");

const { NOTION_KEY, NOTION_DB_BOOK_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { title } = JSON.parse(event.body);
  let url, id;
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
    // console.log(response);
    // url = response.url;
    // id = response.id;
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

  // const options = {
  //   method: "POST",
  //   url: "https://api.notion.com/v1/databases",
  //   headers: {
  //     Authorization: `Bearer ${NOTION_KEY}`,
  //     accept: "application/json",
  //     "Notion-Version": "2022-06-28",
  //     "content-type": "application/json",
  //   },
  // };

  // const body = {
  //   parent: {
  //     page_id: id,
  //     type: "page_id",
  //   },
  // };

  // axios({
  //   data: body,
  //   headers: options,
  // })
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
};
