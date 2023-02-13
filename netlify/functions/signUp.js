import { HttpStatusCode } from "axios";
import GoTrue from "gotrue-js";

exports.handler = async function (event, context) {
  console.log("event ||||||||||||||||||| ", event);
  console.log("context ||||||||||||||||||| ", context);
  const { email, password } = JSON.parse(event.body);

  const auth = new GoTrue({
    APIUrl: "https://readest.netlify.app/.netlify/identity",
    audience: "",
    setCookie: "true",
  });

  //   const [err, data] = await to(auth.signup(email, password));
  //   if (err) {
  //     return {
  //       statusCode: HttpStatusCode.InternalServerError,
  //       body: err.message,
  //     };
  //   }
  //   return {
  //     statusCode: HttpStatusCode.Ok,
  //     body: JSON.stringify(data),
  //   };

  try {
    const data = await auth.signup(email, password);
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: err.message,
    };
  }
};
