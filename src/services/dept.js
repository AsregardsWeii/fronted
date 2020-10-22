/**
 * @author 杨金刚
 * @date 2020/8/14 13:25
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { apiHost } from '@/constants/adminConstants';

//验证部门是否存在
export async function apiCheckDept(params) {
  return request(`${apiHost}/depts/validator/dept?dept=${params.dept}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

//验证上级部门码是否存在
export async function apiCheckOwner(params) {
  return request(`${apiHost}/units/validator/owner?unit=${params.unit}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

//查询所有部门
export async function apiQueryDepts(token) {
  return request(`${apiHost}/depts`, {
    method: 'GET',
    headers: { 'authorization': token },
  });
}

// 通过关键字模糊检索部门信息
export async function apiQueryDeptsByKeyword(params) {
  return request(`${apiHost}/depts/${params.keyword}`, {
    method: 'GET',
    headers: { 'authorization': params.token },
  });
}

//通过ID删除部门
export async function apiDeleteDept(params) {
  return request(`${apiHost}/depts/${params.id}`, {
    method: 'DELETE',
    headers: { 'authorization': params.token },
  });
}

// 批量删除部门
export async function apiBatchDeleteDept(params) {
  return request(`${apiHost}/depts/batch/${params.ids}`, {
    method: 'DELETE',
    headers: { 'authorization': params.token },
  });
}

// 导出Excel
export async function apiExpDeptToExcel(token) {
  console.log(token);
  return request(`${apiHost}/depts/exp-excel`, {
    method: 'POST',
    body: { excelFileName: '部门' },
    headers: { 'authorization': token },
  });
}

// 修改部门
export async function apiUpdateDept(params) {
  return request(`${apiHost}/depts`, {
    method: 'PUT',
    body: params.dept,
    headers: { 'authorization': params.token },
  });
}

// 新增部门
export async function apiAddDept(params) {
  return request(`${apiHost}/depts`, {
    method: 'POST',
    body: params.dept,
    headers: { 'authorization': params.token },
  });
}

