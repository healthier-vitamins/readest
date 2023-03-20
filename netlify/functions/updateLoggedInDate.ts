import { HttpStatusCode } from "axios";
import { Client } from "@notionhq/client";
import { userSchema } from "utils/schemas/userSchema";
const moment = require("moment");

const { NOTION_KEY, NOTION_DB_USER_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  const { email } = JSON.parse(event.body);
  moment.locale("en-sg");
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  let accountId;
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DB_USER_KEY ? NOTION_DB_USER_KEY : "",
      filter: {
        and: [
          {
            property: userSchema.EMAIL,
            rich_text: { equals: email },
          },
        ],
      },
    });
    if (response.results.length > 0) {
      accountId = response.results[0].id;
    }
  } catch (err: any) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.message,
    };
  }
  if (accountId) {
    try {
      const response = await notion.pages.update({
        page_id: accountId,
        properties: {
          [userSchema.LAST_LOGGED_IN]: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: date,
                },
              },
            ],
          },
        },
      });
      return {
        statusCode: HttpStatusCode.Ok,
        body: JSON.stringify(response),
      };
    } catch (err: any) {
      return {
        statusCode: HttpStatusCode.InternalServerError,
        body: err.message,
      };
    }
  }
};
