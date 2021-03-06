import {Auth} from 'aws-amplify';
import {put, takeLatest} from 'redux-saga/effects';
import * as auth from './constant.auth';
import Session from '../../utils/Session';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* getdata({}) {
  try {
    let sessionisValid;
    let accessToken = yield AsyncStorage.getItem('@Token');
   yield Auth.currentSession().then(res => {
     sessionisValid = res.isValid();
     if (sessionisValid && accessToken === null || accessToken == undefined)
     {
       accessToken=res.getAccessToken();
       }
   }).catch(() => {
     AsyncStorage.clear();
    })
    if (accessToken!=null || undefined )
    {
      yield put({
        type: auth.GET_AUTHRECIEVED,
        payload:accessToken
      });
    }
    else{
      yield put({
        type: auth.AUTH_ERROR,
        error: err,
      });
    }
 
      } catch (err) {
        yield put({
          type: auth.AUTH_ERROR,
          error: err,
        });
}
}
function* Login({ payload }) {
  try {
    const email = payload.email;
    const password = payload.password;
    const user = yield Auth.signIn(email, password);
    payload.userId = user.attributes.sub;
    console.log('Refresh Token =', user.signInUserSession.refreshToken.token);
    console.log(payload);
    yield Session();

  
   
    yield put({
      type: auth.SIGN_IN_RECIEVED,
      payload: payload,
    });
  
   
  } catch (err) {
    yield put({
      type: auth.AUTH_ERROR,
      error: err,
    });
    if (err.code === 'UserNotConfirmedException') {
      yield Auth.resendSignUp(payload.email);
      console.log('code resent successfully');
    }
  }
}

function* Register({payload}) {
  const username = payload.email;
  const password = payload.password;
  const name = payload.Fullname;
  try {
    //kiyorah205@logodez.com
    //00000000
    const Response = yield Auth.signUp({
      username,
      password,
      attributes: {
        name,
      },
    });z``
    payload.userId = Response.userSub;
    yield put({
      type: auth.SIGN_UP_RECIEVED,
      payload: payload,
    });

    console.log(Response);
  } catch (err) {
    yield put({type: auth.AUTH_ERROR, error: err});
  }
}
function* ConfirmUserAccount({payload}) {
  const username = payload.username;
  const code = payload.Code;
  try {
    const res = yield Auth.confirmSignUp(username, code);
    if (res == '200')
    {
      yield put({
        type: auth.ACCOUNT_CONFIRMED,
        payload: res,
      });
    }
    else{
      yield put({
        type: auth.AUTH_ERROR,
        error: res,
      });
    }

  
  } catch (err) {
    yield put({
      type: auth.AUTH_ERROR,
      error: err,
    });
  }
}

function* signoutUser({payload}) {
  try {
    yield Auth.signOut();
    yield AsyncStorage.clear();
 
    yield put({
      type: auth.SIGN_OUT_SUCCESS,
      payload: payload,
    });
  } catch (err) {
    yield put({
      type: auth.AUTH_ERROR,
      error: err,
    });
  }
}

function* watchmanoflogin() {
  yield takeLatest(auth.SIGN_IN, Login);
}
function* watchmanofsignn() {
  yield takeLatest(auth.SIGN_UP, Register);
}
function* watchmanofgetAuth() {
  yield takeLatest(auth.GET_AUTH, getdata);
}
function* watchmanofsignout() {
  yield takeLatest(auth.SIGN_OUT, signoutUser);
}
function* watchmanofConfirmation() {
  yield takeLatest(auth.CONFIRM_ACCOUNT, ConfirmUserAccount);
}

export const authsaga = [
  watchmanoflogin(),
  watchmanofsignn(),
  watchmanofgetAuth(),
  watchmanofsignout(),
  watchmanofConfirmation(),
];
