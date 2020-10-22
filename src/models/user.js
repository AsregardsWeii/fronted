import { apiQueryCurrentUser } from '@/services/base';
import { getToken, setCurrentUser } from '@/utils/authority';
import { apiChangePassword } from '@/services/user';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(apiQueryCurrentUser, getToken());
      if (response.code === 0) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
    *changePassword({ payload }, { call, put }) {
      const newPayload = { values: payload, token: getToken() };
      const response = yield call(apiChangePassword, newPayload);
      if (response.code === 0) {
        message.success(response.msg);
      }
      else {
        message.error(response.msg);
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      setCurrentUser(action.payload.data);
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};