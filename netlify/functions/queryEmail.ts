import { HttpStatusCode } from "axios";
import { userSchema } from "../../src/utils/schemas/userSchema";
import notion from "../../src/utils/notion/notionLoader";

const { VITE_NOTION_DB_USER_KEY } = process.env;

exports.handler = async function (event: any, _context: any) {
  const { email } = JSON.parse(event.body);
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
};
