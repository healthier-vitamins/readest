import { HttpStatusCode } from "axios";
import { to } from "../../src/utils/promise";
import GoTrueLoader from "../../src/utils/goTrue/GoTrueLoader";

exports.handler = async function (event: any, _context: any) {
  const { token } = JSON.parse(event.body);

  const auth = new GoTrueLoader().getInitialisedAuth();

  const [err, data] = await to(auth.confirm(token, true));
  if (err) {
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
