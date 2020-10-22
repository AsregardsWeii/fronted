/**
 * @author 杨金刚
 * @date 2020/8/10 14:35
 */

import {
    apiQueryRoles,
    apiQueryRolesByKeyword,
    apiDeleteRole,
    apiBatchDeleteRole,
    apiExpRoleToExcel,
    apiUpdateRole,
    apiAddRole,
} from '@/services/role';
import { message } from 'antd';
import { getToken } from '@/utils/authority';
import { compare } from '@/utils/sort';

export default {
    namespace: 'role',

    state: {
        roleList: [],
        selectedRowKeys: [],
        editingRoleId: -1, 
    },

    effects: {
        // 获取所有角色
        *fetchRoles(_, { call, put }) {
            const response = yield call(apiQueryRoles, getToken());
            if (response.code === 0) {
                yield put({ type: 'saveRoleInfo', payload: response, });
            }
            else {
                message.error(response.data);
            }
        },
        // 根据关键字模糊检索角色信息
        *serachRolesByKeyword({ payload }, { call, put }) {
            const newPayload = { keyword: payload, token: getToken() };
            const response = yield call(apiQueryRolesByKeyword, newPayload);
            if (response.code === 0) {
                yield put({ type: 'saveRoleInfo', payload: response, });
            }
            else {
                message.error(response.data);
            }
        },
        // 根据角色ID删除
        *deleteRole({ payload }, { call, put }) {
            const newPayload = { id: payload, token: getToken() };
            const response = yield call(apiDeleteRole, newPayload);
            if (response.code === 0) {
                yield put({
                    type: 'saveDeletedRole',
                    payload: payload,
                });
                message.success(response.msg);
            }
            else {
                message.error(response.data);
            }
        },
        // 批量删除角色
        *batchDeleteRole(_, { call, put, select }) {
            const selectedIds = yield select((state) => state.role.selectedRowKeys);
            const newPayload = { ids: selectedIds.join(','), token: getToken() };
            const response = yield call(apiBatchDeleteRole, newPayload);
            if (response.code === 0) {
                yield put({
                    type: 'saveBatchDeletedRole',
                    payload: { ids: selectedIds },
                });
                message.success(response.msg);
            }
            else {
                message.error(response.data);
            }
        },
        // 导出到Excel
        *expRoleToExcel(_, { call, put }) {
            const response = yield call(apiExpRoleToExcel, getToken());
            if (response.code === 0) {
                message.success("导出完成");
            }
            else {
                message.error(response.data);
            }
        },
        // 新增角色
        *addRole({ payload }, { call, put }) {
            const newPayload = { role: payload, token: getToken() };
            const response = yield call(apiAddRole, newPayload);
            if (response.code === 0) {
                message.success(response.msg);
                const response1 = yield call(apiQueryRoles, getToken());
                if (response.code === 0) {
                    yield put({ type: 'saveRoleInfo', payload: response1, });
                }
            }
            else {
                message.error(response.data);
            }
        },
        // 修改角色
        *updateRole({ payload }, { call, put }) {
            const newPayload = { role: payload, token: getToken() };
            const response = yield call(apiUpdateRole, newPayload);
            if (response.code === 0) {
                message.success(response.msg);
                const response1 = yield call(apiQueryRoles, getToken());
                if (response.code === 0) {
                    yield put({ type: 'saveRoleInfo', payload: response1, });
                }
            }
            else {
                message.error(response.msg);
            }
        },
    },

    reducers: {
        saveRoleInfo(state, { payload }) {
            const roleList = payload.data.map(d => {
                return { ...d, key: d.id };
            });
            return {
                ...state,
                roleList,
            };
        },
        saveSelectChangeRole(state, { payload }) {
            return {
                ...state,
                selectedRowKeys: payload.selectedRowKeys,
            };
        },
        saveDeletedRole(state, { payload }) {
            return {
                ...state,
                roleList: state.roleList.filter(item => item.id !== payload),
            };
        },
        saveBatchDeletedRole(state, { payload }) {
            return {
                ...state,
                selectedRowKeys: [],
                roleList: state.roleList.filter(item => !payload.ids.includes(item.id)),
            };
        },
        savaClearSelectedRowKeys(state, { payload }) {
            return {
                ...state,
                selectedRowKeys: [],
            };
        },
        savaChangeEditingRoleId(state, { payload }) {
            return {
                ...state,
                editingRoleId: payload,
            };
        },
    },
}