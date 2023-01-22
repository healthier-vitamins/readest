const { Client } = require("@notionhq/client");
const { HttpStatusCode } = require("axios");

const { NOTION_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  const { selectedBooks, wordDefinition } = JSON.parse(event.body);
  selectedBooks.forEach(async (book) => {
    console.log("individual bookies: ", book);
    console.log("word def in api: ", wordDefinition);
    try {
      const response = await notion.pages.create({
        parent: {
          page_id: book.id,
        },
        properties: {
          Word: {
            title: [
              {
                text: {
                  content: wordDefinition.title,
                },
              },
            ],
          },
        },
      });
      return {
        statusCode: HttpStatusCode.Ok,
        body: JSON.stringify(response),
      };
    } catch (err) {
      return {
        statusCode: HttpStatusCode.InternalServerError,
        body: err.toString(),
      };
    }
  });
};
