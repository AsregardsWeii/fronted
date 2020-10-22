/**
 * @author 杨金刚
 * @date 2020/8/14 13:25
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { apiHost } from '@/constants/adminConstants';

//验证角色是否存在
export async function apiCheckRole(params) {
  return request(`${apiHost}/roles/validator/role?role=${params.role}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

//验证上级角色码是否存在
export async function apiCheckOwner(params) {
  return request(`${apiHost}/units/validator/owner?unit=${params.unit}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

//查询所有角色
export async function apiQueryRoles(token) {
  return request(`${apiHost}/roles`, {
    method: 'GET',
    headers: { 'authorization': token },
  });
}

// 通过关键字模糊检索角色信息
export async function apiQueryRolesByKeyword(params) {
  return request(`${apiHost}/roles/${params.keyword}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

//通过ID删除角色
export async function apiDeleteRole(params) {
  return request(`${apiHost}/roles/${params.id}`, {
    method: 'DELETE',
    headers: { 'authorization': params.token },
  });
}

// 批量删除角色
export async function apiBatchDeleteRole(params) {
  return request(`${apiHost}/roles/batch/${params.ids}`, {
    method: 'DELETE',
    headers: { 'authorization': params.token },
  });
}

// 导出Excel
export async function apiExpRoleToExcel(token) {
  console.log(token);
  return request(`${apiHost}/roles/exp-excel`, {
    method: 'POST',
    body: { excelFileName: '角色' },
    headers: { 'authorization': token },
  });
}

// 修改角色
export async function apiUpdateRole(params) {
  return request(`${apiHost}/roles`, {
    method: 'PUT',
    body: params.role,
    headers: { 'authorization': params.token },
  });
}

// 新增角色
export async function apiAddRole(params) {
  return request(`${apiHost}/roles`, {
    method: 'POST',
    body: params.role,
    headers: { 'authorization': params.token },
  });
}

