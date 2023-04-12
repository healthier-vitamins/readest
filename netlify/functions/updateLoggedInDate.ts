import { HttpStatusCode } from "axios";
import { Client } from "@notionhq/client";
import { userSchema } from "../../src/utils/schemas/userSchema";
import moment from "moment";

const { NOTION_KEY, NOTION_DB_USER_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  const { email } = JSON.parse(event.body);
  // const dateNow = new Date().toLocaleString("en-sg", {
  //   hour12: false,
  //   timeZone: "Asia/Singapore",
  // });
  // const date = moment(dateNow).format("MMMM Do YYYY, h:mm:ss a");
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  console.log(moment());

  const dateISO = moment().toISOString(true);
  console.log("ISO STRING ||||||||||||||  ", dateISO);

  let accountId: string | null = null;
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
  } finally {
    if (accountId !== null) {
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
            DATE: {
              date: {
                start: dateISO,
              },
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
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: "Something went wrong. Please contact Audrian on this issue.",
    };
  }
};
