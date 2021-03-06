import {
  SIGN_IN,
  SIGN_UP,
  SIGN_OUT,
  GET_AUTH,
  AUTH_ERROR,
  CONFIRM_ACCOUNT,
} from './constant.auth.js';

export const SignIn = payload => {
  return {
    type: SIGN_IN,
    payload: payload,
  };
};

export const SignUp = payload => {
  return {
    type: SIGN_UP,
    payload: payload,
  };
};
export const confirmUser = payload => {
  return {
    type: CONFIRM_ACCOUNT,
    payload: payload,
  };
};

export const GetData = payload => {
  return {
    type: GET_AUTH  ,
    payload: payload,
  };
};
export const SignOut = payload => {
  return {
    type: SIGN_OUT,
    payload: payload,
  };
};

export const authError = err => {
  return {
    type: AUTH_ERROR,
    payload: err,
  };
};
