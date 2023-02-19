import { HttpStatusCode } from "axios";
import { to } from "../../src/utils/promiseUtil";
const { default: GoTrue } = require("gotrue-js");

exports.handler = async function (event, context) {
  const auth = new GoTrue({
    APIUrl: "https://readest.netlify.app/.netlify/identity",
    audience: "",
    setCookie: "true",
  });
  let email = "audriancyk@gmail.com";
  let password = "testing";

  const [err, data] = await to(auth.login(email, password, true));
  if (err) {
    console.log(err);
    return {
      statusCode: err.status,
      body: err.json.error_description,
    };
  }
  return { statusCode: HttpStatusCode.Ok, body: JSON.stringify(data) };
};
