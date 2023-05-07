import { wordSchema } from "../../src/utils/schemas/wordSchema";
import { bookSchema } from "../../src/utils/schemas/bookSchema";
import { HttpStatusCode } from "axios";
import { Client } from "@notionhq/client";
import moment from "moment-timezone";

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  const { bookName, userId } = JSON.parse(event.body);

  let booksDbId, createdBookId;
  try {
    const response = await notion.blocks.children.list({
      block_id: userId,
    });
    booksDbId = response.results[0].id;
  } catch (err: any) {
    return {
      statusCode: HttpStatusCode.NotFound,
      body: JSON.stringify("Book database not found in email account."),
    };
  }

  // const dateNow = new Date().toLocaleString("en-sg", {
  //   hour12: false,
  //   timeZone: "Asia/Singapore",
  // });
  // const date = moment(dateNow).format("MMMM Do YYYY, h:mm:ss a");

  moment.tz.setDefault("Asia/Singapore");
  // const date = moment().format("MMMM Do YYYY, h:mm:ss a");

  const currentDateIso = moment().toISOString(true);

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: booksDbId,
        type: "database_id",
      },
      properties: {
        [bookSchema.TITLE]: {
          title: [
            {
              text: {
                content: bookName,
              },
            },
          ],
        },
        [bookSchema.BOOK_NAME]: {
          rich_text: [
            {
              text: {
                content: bookName,
              },
            },
          ],
        },
        [bookSchema.CREATED_TIME]: {
          date: {
            start: currentDateIso,
          },
        },
        [bookSchema.LAST_EDITED_TIME]: {
          date: {
            start: currentDateIso,
          },
        },
        [bookSchema.STATUS]: {
          select: {
            name: "LIVE",
          },
        },
      },
    });
    createdBookId = response.id;
  } catch (err: any) {
    console.log(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: JSON.stringify("Something went wrong creating book entry."),
    };
  }

  try {
    const response = await notion.databases.create({
      parent: {
        page_id: createdBookId,
      },
      is_inline: true,
      title: [
        {
          type: "text",
          text: {
            content: "WORDS",
          },
        },
      ],
      properties: {
        [wordSchema.TITLE]: {
          type: "title",
          title: {},
        },
        [wordSchema.WORD]: {
          type: "rich_text",
          rich_text: {},
        },
        [wordSchema.STATUS]: {
          type: "select",
          select: {
            options: [
              {
                name: "LIVE",
                color: "blue",
              },
              {
                name: "DELETED",
                color: "red",
              },
            ],
          },
        },
        [wordSchema.DEFINITION]: {
          type: "rich_text",
          rich_text: {},
        },
        [wordSchema.ABBREVIATION]: {
          type: "rich_text",
          rich_text: {},
        },
        [wordSchema.CREATED_TIME]: {
          type: "created_time",
          created_time: {},
        },
        [wordSchema.LAST_EDITED_TIME]: {
          type: "date",
          date: {},
        },
        [wordSchema.EXAMPLES]: {
          type: "rich_text",
          rich_text: {},
        },
      },
    });
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.error(err);
    console.log(err);
    console.log(err.message);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};

//! probably redundant already
// let id;
// first create page in book database
// try {
//   const response = await notion.pages.create({
//     parent: {
//       database_id: NOTION_DB_BOOK_KEY,
//       type: "database_id",
//     },
//     properties: {
//       [bookSchema.BOOK_NAME]: {
//         rich_text: [
//           {
//             text: {
//               content: title,
//             },
//           },
//         ],
//       },
//       [bookSchema.TITLE]: {
//         title: [
//           {
//             text: {
//               content: title,
//             },
//           },
//         ],
//       },
//       [bookSchema.STATUS]: {
//         select: {
//           name: "Live",
//         },
//       },
//     },
//   });
//   id = response.id;
// } catch (err) {
//   console.error(err);
//   return {
//     statusCode: 500,
//     body: err.toString(),
//   };
// }

//! this creates word database for each book.
// create block child database
// try {
//   const response = await notion.databases.create({
//     parent: {
//       page_id: id,
//     },
//     is_inline: true,
//     title: [
//       {
//         type: "text",
//         text: {
//           content: "WORDS",
//         },
//       },
//     ],
//     properties: {
//       [wordSchema.TITLE]: {
//         type: "title",
//         title: {},
//       },
//       [wordSchema.WORD]: {
//         type: "rich_text",
//         rich_text: {},
//       },
//       [wordSchema.STATUS]: {
//         type: "select",
//         select: {
//           options: [
//             {
//               name: "Live",
//             },
//           ],
//         },
//       },
//       [wordSchema.DEFINITION]: {
//         type: "rich_text",
//         rich_text: {},
//       },
//       [wordSchema.ABBREVIATION]: {
//         type: "rich_text",
//         rich_text: {},
//       },
//       [wordSchema.CREATED_TIME]: {
//         type: "created_time",
//         created_time: {},
//       },
//       [wordSchema.LAST_EDITED_TIME]: {
//         type: "created_time",
//         created_time: {},
//       },
//     },
//   });
//   return {
//     statusCode: HttpStatusCode.Ok,
//     body: JSON.stringify(response),
//   };
// } catch (err) {
//   console.err(err);
//   console.log(err);
//   console.log(err.message);
//   return {
//     statusCode: 500,
//     body: err.toString(),
//   };
// }
