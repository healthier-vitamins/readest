const { HttpStatusCode } = require("axios");
const { default: GoTrue } = require("gotrue-js");
const { to } = require("../../src/utils/promiseUtil");

exports.handler = async function (event, context) {
  const { token } = JSON.parse(event.body);
  const auth = new GoTrue({
    APIUrl: "https://readest.netlify.app/.netlify/identity",
    audience: "",
    setCookie: "true",
  });

  // try {
  //   const data = await auth.confirm(token, true);
  //   console.log("confirm data ||||||||||||||||||| ", data);
  //   return {
  //     statusCode: HttpStatusCode.Ok,
  //     body: JSON.stringify(data),
  //   };
  // } catch (err) {
  //   console.log(typeof err, "here |||||||| ", err.json);
  //   return {
  //     statusCode: err.json.code,
  //     body: err.json.msg,
  //   };
  // }
  const [err, data] = await to(auth.confirm(token, true));
  if (!!err) {
    console.log(typeof err, "here |||||||| ", err);
    return {
      statusCode: err.status,
      body: err.message,
    };
  }

  return {
    statusCode: HttpStatusCode.Ok,
    body: JSON.stringify(data),
  };
};
