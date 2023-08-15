import { AllWordsInBook } from "../../src/store/slices/word.slice";
import { BookRes } from "../../src/store/slices/book.slice";
import { HttpStatusCode } from "axios";
import { wordSchema } from "../../src/utils/schemas/wordSchema";
import notion from "../../src/utils/notion/notionLoader";

exports.handler = async function (event: any, _context: any) {
  const { id } = event.queryStringParameters as BookRes;
  const databaseId = await getBookDatabase(String(id));

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
    // TODO response.has_more && response.next_cursor
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
          // @ts-expect-error
          word.properties[wordSchema.ABBREVIATION].rich_text[0].plain_text,
        // @ts-expect-error
        examples: word.properties[wordSchema.EXAMPLES].rich_text[0].plain_text,
        shortDef:
          // @ts-expect-error
          word.properties[wordSchema.DEFINITION].rich_text[0].plain_text,
        // @ts-expect-error
        title: word.properties[wordSchema.WORD].rich_text[0].plain_text,
      };
      allWordsFromBookResponse.push(allWordsObj);
    }

    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(allWordsFromBookResponse),
    };
  } catch (err: any) {
    console.error(err.message);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.toString(),
    };
  }
};

async function getBookDatabase(bookId: string) {
  try {
    const response = await notion.blocks.children.list({
      block_id: bookId,
    });
    return response.results[0].id;
  } catch (err: any) {
    console.error(err);
    // return {
    //   statusCode: HttpStatusCode.InternalServerError,
    //   body: err.toString(),
    // };
    throw new Error(err.toString());
  }
}
