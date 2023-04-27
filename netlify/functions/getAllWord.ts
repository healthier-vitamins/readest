import { ChosenWordDefinition } from "../../src/store/slices/word.slice";
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

    const allWordsFromBookResponse: ChosenWordDefinition[] = [];

    for (let word of response.results) {
      let tempObj: ChosenWordDefinition = {
        abbreviation: "",
        examples: [],
        shortDef: "",
        title: "",
        transitive: [],
      };
      tempObj.title = word.properties[wordSchema.WORD].rich_text[0].plain_text;
      tempObj.abbreviation =
        word.properties[wordSchema.ABBREVIATION].rich_text[0].plain_text;
      tempObj.shortDef =
        word.properties[wordSchema.DEFINITION].rich_text[0].plain_text;
      tempObj.examples =
        word.properties[wordSchema.EXAMPLES].rich_text[0].plain_text;
      allWordsFromBookResponse.push(tempObj);
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
