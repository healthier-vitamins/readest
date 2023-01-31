// import { wordSchema } from "../../src/utils/wordUtil";
// const { Client } = require("@notionhq/client");
// const { HttpStatusCode } = require("axios");

// const { NOTION_KEY, NOTION_DB_WORD_KEY } = process.env;
// const notion = new Client({
//   auth: NOTION_KEY,
// });

// async function saveWord(wordDef) {
//   try {
//     const response = await notion.pages.create({
//       parent: {
//         database_id: NOTION_DB_WORD_KEY,
//         type: "database_id",
//       },
//       properties: {
//         [wordSchema.TITLE]: [
//           {
//             text: {
//               content: wordDef.title,
//             },
//           },
//         ],
//         [wordSchema.WORD]: [
//           {
//             text: {
//               content: "woooooo",
//             },
//           },
//         ],
//         [wordSchema.STATUS]: {
//           name: "Live",
//         },
//         [wordSchema.DEFINITION]: [
//           {
//             text: {
//               content: "wooo",
//             },
//           },
//         ],
//         [wordSchema.ABBREVIATION]: [
//           {
//             text: {
//               content: "wooooo abbreviation",
//             },
//           },
//         ],
//       },
//     });
//     // return {
//     //   statusCode: HttpStatusCode.Ok,
//     //   body: JSON.stringify(response),
//     // };
//     console.log("saved word res |||||||||||||||||||||||||||", response);
//     return response;
//   } catch (err) {
//     return {
//       statusCode: HttpStatusCode.InternalServerError,
//       body: err.toString(),
//     };
//   }
// }

// exports.handler = async function (event, context) {
//   const { selectedBookArr, wordDef } = JSON.parse(event.body);

//   /*
//    * @typedef {Object} wordDef
//    * @property {string} title
//    * @property {string} abbreviation
//    * @property {Object} senseArr
//    * @property {Object} shortDef
//    */

//   // function bookMapper(selectedBookArr) {
//   //   const tempArr = [];
//   //   selectedBookArr.forEach((bookId) => {
//   //     tempArr.push({
//   //       id: bookId,
//   //     });
//   //   });
//   //   // console.log(tempArr);
//   //   return tempArr;
//   // }
//   // create page to save word
//   const savedWordRes = saveWord(wordDef);

// };
