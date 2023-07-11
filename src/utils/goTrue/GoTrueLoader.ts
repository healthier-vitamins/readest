import GoTrue from "gotrue-js";

export default class GoTrueLoader {
  authObj: GoTrue | undefined | null;

  constructor() {
    if (!this.authObj) {
      this.initialiseAuth();
    }
  }

  initialiseAuth() {
    const NETLIFY_IDENTITY_URL = process.env.NETLIFY_IDENTITY_URL;

    this.authObj = new GoTrue({
      APIUrl: NETLIFY_IDENTITY_URL,
      audience: "",
      setCookie: true,
    });
  }

  getInitialisedAuth(): GoTrue {
    if (!this.authObj) this.initialiseAuth();
    if (!this.authObj) throw new Error("Unable to initialise GoTrue");
    return this.authObj;
  }
}
