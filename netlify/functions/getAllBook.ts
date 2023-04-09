import { bookSchema } from "../../src/utils/schemas/bookSchema";
import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { userId } = event.queryStringParameters;

  let booksDbId: string;
  try {
    const response = await notion.blocks.children.list({
      block_id: userId,
    });
    booksDbId = response.results[0].id;
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return {
      statusCode: HttpStatusCode.NotFound,
      body: "Books database not found. Please contact Audrian.",
    };
  }

  try {
    const response = await notion.databases.query({
      database_id: booksDbId,
      filter: {
        and: [
          {
            property: bookSchema.STATUS,
            status: {
              equals: "LIVE",
            },
          },
        ],
      },
    });
    // TODO filter book response to only contain book name and book id
    // @ts-ignore
    console.log("response |||||||||||| ", response.results[0].properties);
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.log(err);
    console.log(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: "Books database found but books not found. Please contact Audrian.",
    };
  }

  // try {
  //   const response = await notion.databases.query({
  //     database_id: NOTION_DB_BOOK_KEY ? NOTION_DB_BOOK_KEY : "",
  //     filter: {
  //       property: bookSchema.STATUS,
  //       select: {
  //         equals: "Live",
  //       },
  //     },
  //     sorts: [
  //       {
  //         property: bookSchema.CREATED_TIME,
  //         direction: "descending",
  //       },
  //     ],
  //   });
  //   return {
  //     statusCode: HttpStatusCode.Ok,
  //     body: JSON.stringify(response),
  //   };
  // } catch (err) {
  //   console.log(err);
  //   console.log(err.message);
  //   return {
  //     statusCode: HttpStatusCode.NotFound,
  //     body: err.toString(),
  //   };
  // }
};
