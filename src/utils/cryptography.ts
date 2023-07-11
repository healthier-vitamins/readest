import jwt_decode from "jwt-decode";

interface _decodedToken {
  app_metadata: { provider: string };
  email: string;
  exp: number;
  sub: string;
  user_metadata: any;
}

function getEmailFromToken(token: string) {
  if (isTokenExpired(token)) {
    return null;
  }
  const decodedToken: _decodedToken = jwt_decode(token);
  return decodedToken.email;
}

function isTokenExpired(token: string) {
  const currentTime = Date.now() / 1000;
  const decodedToken: _decodedToken = jwt_decode(token);

  if (decodedToken.exp >= Number(currentTime.toFixed(0))) {
    return false;
  }
  return true;
}

export { getEmailFromToken, isTokenExpired };
