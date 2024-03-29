import notion from "../../src/utils/notion/notionLoader";

exports.handler = async function (_event: any, _context: any) {
  try {
    const response = await notion.blocks.children.list({
      //? user account page id
      block_id: "552976822f714655a049d60dc8462368",

      //? user account child database id
      // block_id: "f5fd916a-a5d5-4867-956d-b2bd8c53c3c7",

      // page_id: "2ca52834-8db0-4595-bc9b-ed565deb1748",
      // database_id: "473d8c52-4d47-4d13-b5d5-d2aee88ae5d0",
      // block_id: "25f5492dc2e74f618c923c1e58a3eb55",
      // query: "Words",
      // filter: {
      //   value: "database",
      //   property: "object",
      // },
      //   is_inline: true,
      //   parent: {
      //     page_id: "25f5492dc2e74f618c923c1e58a3eb55",
      //   },
      //   title: [
      //     {
      //       type: "text",
      //       text: {
      //         content: "lolest",
      //       },
      //     },
      //   ],
      //   properties: {
      //     LOLEST: {
      //       title: {},
      //       type: "title",
      //     },
      //   },
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }

  // const options = {
  //   method: "POST",
  //   url: "https://api.notion.com/v1/databases",
  //   headers: {
  //     Authorization: `Bearer ${NOTION_KEY}`,
  //     accept: "application/json",
  //     "Notion-Version": "2022-06-28",
  //     "content-type": "application/json",
  //   },
  // };

  // axios({
  //   headers: options,
  //   data: {
  //     parent: {
  //       page_id: "25f5492dc2e74f618c923c1e58a3eb55"
  //     },
  //   },
  // })
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
};
