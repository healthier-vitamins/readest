import { HttpStatusCode } from "axios";
import GoTrue from "gotrue-js";
import { to } from "../../src/utils/promiseUtil";

exports.handler = async function (event, context) {
  const { email, password } = JSON.parse(event.body);

  const auth = new GoTrue({
    APIUrl: "https://readest.netlify.app/.netlify/identity",
    audience: "",
    setCookie: "true",
  });
  // const auth = new GoTrue({
  //   APIUrl: "https://localhost:8888/.netlify/identity",
  //   audience: "",
  //   setCookie: "true",
  // });

  const [err, data] = await to(auth.signup(email, password));
  if (err) {
    return {
      statusCode: err.json.code,
      body: err.json?.msg ? err.json.msg : err.json.error_description,
    };
  }
  return {
    statusCode: HttpStatusCode.Ok,
    body: JSON.stringify(data),
  };
};
