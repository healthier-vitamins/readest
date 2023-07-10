import { HandlerContext, HandlerEvent } from "@netlify/functions";
import { HttpStatusCode } from "axios";
import { wordSchema } from "../../src/utils/schemas/wordSchema";

import { Client } from "@notionhq/client";

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (
  event: HandlerEvent,
  _context: HandlerContext
) {
  const { wordId } = JSON.parse(event.body!);

  try {
    await notion.pages.update({
      page_id: wordId,
      properties: {
        [wordSchema.STATUS]: {
          select: { name: "DELETED" },
        },
      },
    });

    return {
      statusCode: HttpStatusCode.Ok,
      body: "Word deleted.",
    };
  } catch (err: any) {
    console.error(err.message);
    return {
      statusCode: HttpStatusCode.NotFound,
      body: err.toString(),
    };
  }
};
