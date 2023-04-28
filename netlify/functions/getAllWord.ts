import { AllWordsInBook } from "../../src/store/slices/word.slice";
import { BookRes } from "../../src/store/slices/book.slice";
import { HttpStatusCode } from "axios";
import { wordSchema } from "../../src/utils/schemas/wordSchema";

const { Client } = require("@notionhq/client");

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { id } = JSON.parse(event.body) as BookRes;
  const databaseId = await getBookDatabase(id);

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: wordSchema.STATUS,
        select: {
          equals: "LIVE",
        },
      },
      sorts: [
        {
          property: wordSchema.CREATED_TIME,
          direction: "descending",
        },
      ],
    });

    let allWordsFromBookResponse: AllWordsInBook[] = [];

    for (let word of response.results) {
      // let wordObj: ChosenWordDefinition = {
      //   abbreviation: "",
      //   examples: [],
      //   shortDef: "",
      //   title: "",
      //   transitive: [],
      // };
      // wordObj.title = word.properties[wordSchema.WORD].rich_text[0].plain_text;
      // wordObj.abbreviation =
      //   word.properties[wordSchema.ABBREVIATION].rich_text[0].plain_text;
      // wordObj.shortDef =
      //   word.properties[wordSchema.DEFINITION].rich_text[0].plain_text;
      // wordObj.examples =
      //   word.properties[wordSchema.EXAMPLES].rich_text[0].plain_text;
      // allWordsFromBookResponse.push(wordObj);
      let allWordsObj: AllWordsInBook = {
        id: word.id,
        abbreviation:
          word.properties[wordSchema.ABBREVIATION].rich_text[0].plain_text,
        examples: word.properties[wordSchema.EXAMPLES].rich_text[0].plain_text,
        shortDef:
          word.properties[wordSchema.DEFINITION].rich_text[0].plain_text,
        title: word.properties[wordSchema.WORD].rich_text[0].plain_text,
        transitive: [],
      };
      allWordsFromBookResponse.push(allWordsObj);
    }

    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(allWordsFromBookResponse),
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
};

async function getBookDatabase(bookId: string | number) {
  try {
    const response = await notion.blocks.children.list({
      block_id: bookId,
    });
    return response.results[0].id;
  } catch (err) {
    console.error(err);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
}
