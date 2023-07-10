/* eslint-disable @typescript-eslint/ban-ts-comment */
import { bookSchema } from "../../src/utils/schemas/bookSchema";
import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

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

    // console.log("response |||||||||||| ", response.results[0].properties);
    let simplifiedResponse: any;
    if (response.results.length > 0) {
      simplifiedResponse = response.results.map((obj) => {
        // const tempArr = [];
        const tempObj = {
          id: obj.id,
          //@ts-ignore
          bookName: obj.properties.BOOK_NAME.rich_text[0].plain_text,
        };
        // tempArr.push(tempObj)
        return tempObj;
      });
    } else {
      simplifiedResponse = [];
    }
    // console.log(simplifiedResponse);
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(simplifiedResponse),
    };

    // return {
    //   statusCode: HttpStatusCode.Ok,
    //   body: JSON.stringify(response),
    // };
  } catch (err: any) {
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
