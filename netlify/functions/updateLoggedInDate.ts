import { HttpStatusCode } from "axios";
import { userSchema } from "../../src/utils/schemas/userSchema";
import moment from "moment-timezone";
import notion from "../../src/utils/notion/notionLoader";

const { VITE_NOTION_DB_USER_KEY } = process.env;

exports.handler = async function (event: any, _context: any) {
  const { email } = JSON.parse(event.body);
  // const dateNow = new Date().toLocaleString("en-sg", {
  //   hour12: false,
  //   timeZone: "Asia/Singapore",
  // });
  // const date = moment(dateNow).format("MMMM Do YYYY, h:mm:ss a");
  moment.tz.setDefault("Asia/Singapore");
  const currentDateIso = moment().toISOString(true);

  let accountId: string | null = null;
  try {
    const response = await notion.databases.query({
      database_id: VITE_NOTION_DB_USER_KEY ? VITE_NOTION_DB_USER_KEY : "",
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
              date: {
                start: currentDateIso,
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
      body: "Something went wrong.",
    };
  }
};
