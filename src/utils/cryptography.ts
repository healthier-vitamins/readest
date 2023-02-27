import jwt_decode from "jwt-decode";

interface _decodedToken {
  app_metadata: { provider: string };
  email: string;
  exp: number;
  sub: string;
  user_metadata: any;
}

function getEmailFromToken(token: any) {
  const decodedToken: _decodedToken = jwt_decode(token);
  return decodedToken.email;
}

function isTokenExpired(token: any) {
  const currentTime = Date.now() / 1000;
  const decodedToken: _decodedToken = jwt_decode(token);
  if (decodedToken.exp < currentTime) {
    return true;
  }
  return false;
}

export { getEmailFromToken, isTokenExpired };
