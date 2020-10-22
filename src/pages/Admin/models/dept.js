/**
 * @author 杨金刚
 * @date 2020/8/10 14:35
 */

import {
    apiQueryDepts,
    apiQueryDeptsByKeyword,
    apiDeleteDept,
    apiBatchDeleteDept,
    apiExpDeptToExcel,
    apiUpdateDept,
    apiAddDept,
} from '@/services/dept';
import { message } from 'antd';
import { getToken } from '@/utils/authority';
import { compare } from '@/utils/sort';

export default {
    namespace: 'dept',

    state: {
        deptList: [],
        selectedRowKeys: [],
        editingDeptId: -1, 
    },

    effects: {
        // 获取所有部门
        *fetchDepts(_, { call, put }) {
            const response = yield call(apiQueryDepts, getToken());
            if (response.code === 0) {
                yield put({ type: 'saveDeptInfo', payload: response, });
            }
            else {
                message.error(response.data);
            }
        },
        // 根据关键字模糊检索部门信息
        *serachDeptsByKeyword({ payload }, { call, put }) {
            const newPayload = { keyword: payload, token: getToken() };
            const response = yield call(apiQueryDeptsByKeyword, newPayload);
            if (response.code === 0) {
                yield put({ type: 'saveDeptInfo', payload: response, });
            }
            else {
                message.error(response.data);
            }
        },
        // 根据部门ID删除
        *deleteDept({ payload }, { call, put }) {
            const newPayload = { id: payload, token: getToken() };
            const response = yield call(apiDeleteDept, newPayload);
            if (response.code === 0) {
                yield put({
                    type: 'saveDeletedDept',
                    payload: payload,
                });
                message.success(response.msg);
            }
            else {
                message.error(response.data);
            }
        },
        // 批量删除部门
        *batchDeleteDept(_, { call, put, select }) {
            const selectedIds = yield select((state) => state.dept.selectedRowKeys);
            const newPayload = { ids: selectedIds.join(','), token: getToken() };
            const response = yield call(apiBatchDeleteDept, newPayload);
            if (response.code === 0) {
                yield put({
                    type: 'saveBatchDeletedDept',
                    payload: { ids: selectedIds },
                });
                message.success(response.msg);
            }
            else {
                message.error(response.data);
            }
        },
        // 导出到Excel
        *expDeptToExcel(_, { call, put }) {
            const response = yield call(apiExpDeptToExcel, getToken());
            if (response.code === 0) {
                message.success("导出完成");
            }
            else {
                message.error(response.data);
            }
        },
        // 新增部门
        *addDept({ payload }, { call, put }) {
            const newPayload = { dept: payload, token: getToken() };
            const response = yield call(apiAddDept, newPayload);
            if (response.code === 0) {
                message.success(response.msg);
                const response1 = yield call(apiQueryDepts, getToken());
                if (response.code === 0) {
                    yield put({ type: 'saveDeptInfo', payload: response1, });
                }
            }
            else {
                message.error(response.data);
            }
        },
        // 修改部门
        *updateDept({ payload }, { call, put }) {
            const newPayload = { dept: payload, token: getToken() };
            const response = yield call(apiUpdateDept, newPayload);
            if (response.code === 0) {
                message.success(response.msg);
                const response1 = yield call(apiQueryDepts, getToken());
                if (response.code === 0) {
                    yield put({ type: 'saveDeptInfo', payload: response1, });
                }
            }
            else {
                message.error(response.msg);
            }
        },
    },

    reducers: {
        saveDeptInfo(state, { payload }) {
            const deptList = payload.data.map(d => {
                return { ...d, key: d.id };
            });
            return {
                ...state,
                deptList,
            };
        },
        saveSelectChangeDept(state, { payload }) {
            return {
                ...state,
                selectedRowKeys: payload.selectedRowKeys,
            };
        },
        saveDeletedDept(state, { payload }) {
            return {
                ...state,
                deptList: state.deptList.filter(item => item.id !== payload),
            };
        },
        saveBatchDeletedDept(state, { payload }) {
            return {
                ...state,
                selectedRowKeys: [],
                deptList: state.deptList.filter(item => !payload.ids.includes(item.id)),
            };
        },
        savaClearSelectedRowKeys(state, { payload }) {
            return {
                ...state,
                selectedRowKeys: [],
            };
        },
        savaChangeEditingDeptId(state, { payload }) {
            return {
                ...state,
                editingDeptId: payload,
            };
        },
    },
}