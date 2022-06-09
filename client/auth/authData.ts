/* eslint-disable max-classes-per-file */
import { observable, makeObservable, action } from "mobx";

const ENV = process.env.ENV || "";

export default class AuthData {
  profile: string = null;

  expiresAt: number = null;

  access_token: string = null;

  refresh_token: string = null;

  duration: number = null;

  isAuth: boolean = false;

  location: string = "/";

  constructor() {
    makeObservable(this, {
      profile: observable,
      expiresAt: observable,
      access_token: observable,
      refresh_token: observable,
      duration: observable,
      isAuth: observable,
      location: observable,
      setAuth: action,
      setProfile: action,
      cancelAuth: action,
      checkAuth: action,
    });
  }

  setProfile(profile: string) {
    this.profile = profile;
  }

  setLocation(location: string) {
    this.location = location;
  }

  setAuth(
    profile: string,
    expiresAt: number,
    accessToken: string,
    refreshToken: string,
    duration: number
  ) {
    this.profile = profile;
    this.expiresAt = expiresAt;
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
    this.duration = duration;
    this.isAuth = true;
    this.location = "/";
  }

  cancelAuth() {
    this.profile = null;
    this.expiresAt = null;
    this.access_token = null;
    this.refresh_token = null;
    this.duration = null;
    this.isAuth = false;
    this.location = "/";
  }

  checkAuth() {
    const time = Date.now();
    if (ENV === "dev") {
      this.isAuth = true;
      console.log("auth: dev env");
      return;
    }
    // console.info(time, this.expiresAt);
    /* if (time > this.expiresAt - this.duration / 2) {
      this.handleRefresh();
    } */
    if (time < this.expiresAt) {
      this.isAuth = true;
    } else {
      this.cancelAuth();
    }
  }

  login() {
    //        console.log('login');
    window.location.replace(
      "https://met-hub.auth.eu-central-1.amazoncognito.com/login?client_id=vn2mg0efils48lijdpc6arvl9&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=https://www.met-hub.com/callback"
    );
  }

  logout() {
    // clear id token and expiration
    this.cancelAuth();
    window.location.reload();
  }
}