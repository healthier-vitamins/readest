import { HttpStatusCode } from "axios";
import { Client } from "@notionhq/client";
import { userSchema } from "utils/schemas/userSchema";

const { NOTION_KEY, NOTION_DB_USER_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  const { email } = JSON.parse(event.body);
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
