import { GLOBALVARS } from "../../src/utils/GLOBALVARS";
import { bookSchema } from "../../src/utils/schemas/bookSchema";
import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, _context: any) {
  const { userId, bookName } = event.queryStringParameters;

  let booksDbId: string;
  try {
    const response = await notion.blocks.children.list({
      block_id: userId,
    });
    booksDbId = response.results[0].id;
  } catch (err: any) {
    console.log(err);
    console.log(err.message);
    return {
      statusCode: HttpStatusCode.NotFound,
      body: GLOBALVARS.ERROR_BOOK_DB_NOT_FOUND,
    };
  }

  try {
    const response = await notion.databases.query({
      database_id: booksDbId,
      filter: {
        and: [
          {
            property: bookSchema.STATUS,
            select: {
              equals: "LIVE",
            },
          },
          {
            property: bookSchema.BOOK_NAME,
            rich_text: {
              equals: bookName,
            },
          },
        ],
      },
      // sorts: [
      //   {
      //     property: "CREATED_TIME",
      //     direction: "descending"
      //   }
      // ]
    });

    if (
      // response.results[0].properties[bookSchema.BOOK_NAME].rich_text[0]
      //   .plain_text
      response.results.length > 0
    ) {
      return {
        statusCode: HttpStatusCode.Conflict,
        body: GLOBALVARS.ERROR_BOOK_NAME_ALRDY_EXISTS,
      };
    } else {
      return {
        statusCode: HttpStatusCode.Ok,
        body: "",
      };
    }
  } catch (err: any) {
    console.log(err);
    console.log(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: GLOBALVARS.ERROR_ACCESSING_BOOK_DB,
    };
  }
};
