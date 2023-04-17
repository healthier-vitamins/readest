import { current } from "@reduxjs/toolkit";
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

function isTokenExpired(token: string) {
  const currentTime = Date.now() / 1000;
  const decodedToken: _decodedToken = jwt_decode(token);
  if (decodedToken.exp > currentTime) {
    return false;
  }
  return true;
}

export { getEmailFromToken, isTokenExpired };
