import { userSchema } from "../../src/utils/schemas/userSchema";
import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";
import { bookSchema } from "utils/schemas/bookSchema";
const moment = require("moment");
// const { to } = require("../../src/utils/promiseUtil");

const { NOTION_KEY, NOTION_DB_USER_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  moment.locale("en-sg");
  const { email, name } = JSON.parse(event.body);
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  let parentId;

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DB_USER_KEY ? NOTION_DB_USER_KEY : "",
        type: "database_id",
      },
      properties: {
        [userSchema.TITLE]: {
          title: [
            {
              text: {
                content: email,
              },
            },
          ],
        },
        [userSchema.EMAIL]: {
          email: email,
        },
        [userSchema.NAME]: {
          rich_text: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        [userSchema.CREATED_TIME]: {
          rich_text: [
            {
              text: {
                content: date,
              },
            },
          ],
        },
        [userSchema.LAST_EDITED_TIME]: {
          rich_text: [
            {
              text: {
                content: "",
              },
            },
          ],
        },
        [userSchema.IS_DELETED]: {
          rich_text: [
            {
              text: {
                content: "N",
              },
            },
          ],
        },
        [userSchema.LAST_LOGGED_IN]: {
          rich_text: [
            {
              text: {
                content: date,
              },
            },
          ],
        },
        [userSchema.STATUS]: {
          status: {
            name: "Live",
          },
        },
      },
    });
    parentId = response.id;
  } catch (err: any) {
    console.log("notion's err ", err);
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }

  try {
    const response = await notion.databases.create({
      parent: {
        page_id: parentId,
        type: "page_id",
      },
      is_inline: true,
      title: [
        {
          type: "text",
          text: {
            content: "BOOKS",
          },
        },
      ],
      properties: {
        [bookSchema.TITLE]: {
          type: "title",
          title: {},
        },
        [bookSchema.STATUS]: {
          type: "select",
          select: {
            options: [
              {
                name: "Live",
              },
            ],
          },
        },
        [bookSchema.BOOK_NAME]: {
          type: "rich_text",
          rich_text: {},
        },
        [bookSchema.WORDS]: {
          type: "rich_text",
          rich_text: {},
        },
        [bookSchema.CREATED_TIME]: {
          type: "created_time",
          created_time: {},
        },
        [bookSchema.LAST_EDITED_TIME]: {
          type: "created_time",
          created_time: {},
        },
      },
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.log("notion's ERROR ", err);
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }
};
