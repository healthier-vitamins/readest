import { userSchema } from "../../src/utils/userUtil";
import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";
// @ts-ignore
const moment = require("moment");
// @ts-ignore
const { to } = require("../../src/utils/promiseUtil");

const { NOTION_KEY, NOTION_DB_USER_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  console.log(event, context);
  const { email, name } = JSON.parse(event.body);
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  console.log(date);
  // let id;

  const [err, response] = await to(
    notion.pages.create({
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
          rich_text: [
            {
              text: {
                content: email,
              },
            },
          ],
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
          select: {
            name: "NO",
          },
        },
        [userSchema.STATUS]: {
          status: {
            name: "Live",
          },
        },
      },
    })
  );

  if (err) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.message,
    };
  }

  return {
    statusCode: HttpStatusCode.Ok,
    body: JSON.stringify(response),
  };
};
