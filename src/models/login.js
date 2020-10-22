import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { apiLogin, apiJobDate, apiLogout } from "@/services/base";
import { setAuthority, setToken, clearLocalStorage, getToken } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
import moment from 'moment';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    jobDate: undefined,
    currentUser: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(apiLogin, payload);
      console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        reloadAuthorized();
        window.location.href = '/';
      }
      else {
        message.error(response.data);
      }
    },

    *getJobDate(_, { call, put }) {
      const response = yield call(apiJobDate)
      yield put({
        type: 'changeJobDate',
        payload: response.data,
      });
    },

    *logout(_, { call, put }) {
      const response = yield call(apiLogout, getToken())
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      clearLocalStorage();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload) {
        const role = payload.data.role;
        clearLocalStorage();
        setAuthority(role);
        setToken(payload.data.jwtToken);
      }

      return {
        ...state,
        status: payload.code ? payload.code === 0 : false,
      };
    },
    changeJobDate(state, { payload }) {
      return {
        ...state,
        jobDate: moment(payload),
      };
    }
  },
};
