import { getToken } from '@/utils/authority';
import { routerRedux } from 'dva/router';
import moment from 'moment';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    loadedAllNotices: false,
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const response = yield call(apiQueryUnreadNotice, getToken());
      if (response.code === 0) {
        const data = response.data.map(d => {
          return {
            ...d,
            datetime: moment(d.gmtCreate),
            read: false,
            type: 'notification',
          };
        });
        const loadedAllNotices = data && data.length && data[data.length - 1] === null;
        yield put({
          type: 'setLoadedStatus',
          payload: loadedAllNotices,
        });
        yield put({
          type: 'saveNotices',
          payload: data.filter(item => item),
        });
        const unreadCount = yield select(
          state => state.global.notices.filter(item => !item.read).length
        );
        yield put({
          type: 'user/changeNotifyCount',
          payload: {
            totalCount: data.length,
            unreadCount,
          },
        });
      }

    },
    *fetchMoreNotices({ payload }, { call, put, select }) {
      const data = yield call(queryNotices, payload);
      const loadedAllNotices = data && data.length && data[data.length - 1] === null;
      yield put({
        type: 'setLoadedStatus',
        payload: loadedAllNotices,
      });
      yield put({
        type: 'pushNotices',
        payload: data.filter(item => item),
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { call, put, select }) {
      const newPayload = { id: payload, token: getToken() };
      const response = yield call(apiChangeNoticeReadState, newPayload);
      if (response.code === 0) {
        const notices = yield select(state =>
          state.global.notices.map(item => {
            const notice = { ...item };
            if (notice.id === payload) {
              notice.read = true;
            }
            return notice;
          })
        );
        yield put({
          type: 'saveNotices',
          payload: notices,
        });
        yield put({
          type: 'user/changeNotifyCount',
          payload: {
            totalCount: notices.length,
            unreadCount: notices.filter(item => !item.read).length,
          },
        });
      }
    }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    pushNotices(state, { payload }) {
      return {
        ...state,
        notices: [...state.notices, ...payload],
      };
    },
    setLoadedStatus(state, { payload }) {
      return {
        ...state,
        loadedAllNotices: payload,
      };
    },
  },

  // subscriptions: {
  //   setup({ history }) {
  //     // Subscribe history(url) change, trigger `load` action if pathname is `/`
  //     return history.listen(({ pathname, search }) => {
  //       if (typeof window.ga !== 'undefined') {
  //         window.ga('send', 'pageview', pathname + search);
  //       }
  //     });
  //   },
  // },
};

