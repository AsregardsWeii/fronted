/**
 * @author 杨金刚
 * @date 2020/4/26 13:30
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { apiHost } from '@/constants/adminConstants';

// 查询所有用户
export async function apiQueryAllUsers(token) {
  return request(`${apiHost}/users`, {
    method: 'GET',
    headers: { 'authorization': token },
  });
}

// 查询所有用户详细信息
export async function apiQueryAllUserInfos(token) {
  return request(`${apiHost}/users/details`, {
    method: 'GET',
    headers: { 'authorization': token },
  });
}

// 通过条件查询用户详细信息
export async function apiQueryUserInfos(params) {
  return request(`${apiHost}/users/details`, {
    method: 'POST',
    body: params,
    headers: { 'authorization': params.token },
  });
}

// 获取所有角色
export async function apiQueryRoles(token) {
  return request(`${apiHost}/roles`, {
    method: 'GET',
    headers: { 'authorization': token },
  });
}

// 通过部门代码获取部门信息
export async function apiQueryUnit(params) {
  return request(`${apiHost}/units/${params.unit}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

// 保存用户
export async function apiSaveUser(params) {
  return request(`${apiHost}/users`, {
    method: 'POST',
    body: params.userinfo,
    headers: { 'authorization': params.token },
  });
}

// 通过ID删除用户
export async function apiDeleteUser(params) {
  return request(`${apiHost}/users/${params.id}`, {
    method: 'DELETE',
    headers: { 'authorization': params.token },
  });
}

// 批量删除选定的用户
export async function apiBatchDeleteUser(params) {
  return request(`${apiHost}/users/batch`, {
    method: 'DELETE',
    body: params.ids,
    headers: { 'authorization': params.token },
  });
}

//初始化用户口令
export async function apiInitPassword(params) {
  return request(`${apiHost}/users/password/initialization/${params.id}`, {
    method: 'PUT',
    headers: { 'authorization': params.token },
  });
}

// 验证用户名是否存在
export async function apiCheckUsername(params) {
  return request(`${apiHost}/users/validator/username?username=${params.username}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

// 验证上级部门是否存在
export async function apiCheckUnit(params) {
  return request(`${apiHost}/units/validator/owner?unit=${params.unit}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

// 验证原密码是否正确
export async function apiCheckOldPassword(params) {
  return request(`${apiHost}/users/validator/old-password?password=${params.password}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

// 修改用户口令
export async function apiChangePassword(params) {
  return request(`${apiHost}/users/password`, {
    method: 'PUT',
    body: params.values,
    headers: { 'authorization': params.token },
  });
}



