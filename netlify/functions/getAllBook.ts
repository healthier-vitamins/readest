/* eslint-disable @typescript-eslint/ban-ts-comment */
import { bookSchema } from "../../src/utils/schemas/bookSchema";
import { HttpStatusCode } from "axios";
import notion from "../../src/utils/notion/notionLoader";

exports.handler = async function (event: any, _context: any) {
  const { userId } = event.queryStringParameters;

  let booksDbId: string;
  try {
    const response = await notion.blocks.children.list({
      block_id: userId,
    });
    booksDbId = response.results[0].id;
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: HttpStatusCode.NotFound,
      body: "Books database not found.",
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
        ],
      },
      // sorts: [
      //   {
      //     property: "CREATED_TIME",
      //     direction: "descending"
      //   }
      // ]
    });

    let simplifiedResponse: any;
    if (response.results.length > 0) {
      simplifiedResponse = response.results.map((obj) => {
        const tempObj = {
          id: obj.id,
          //@ts-ignore
          bookName: obj.properties.BOOK_NAME.rich_text[0].plain_text,
        };
        return tempObj;
      });
    } else {
      simplifiedResponse = [];
    }
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(simplifiedResponse),
    };
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: "Books database found but books not found. Please contact Audrian.",
    };
  }
};
