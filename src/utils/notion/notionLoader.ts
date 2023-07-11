import { Client } from "@notionhq/client";

const { VITE_NOTION_KEY } = process.env;
const notion = new Client({
  auth: VITE_NOTION_KEY,
});

export default notion;
