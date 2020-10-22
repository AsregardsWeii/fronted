/**
 * @author 杨金刚
 * @date 2020/4/20 16:10
 */

import { stringify } from 'qs';
import request from '@/utils/request';
import { apiHost } from '@/constants/adminConstants';

// 用户登录
export async function apiLogin(params) {
    return request(`${apiHost}/login`, {
      method: 'POST',
      body: params,
    });
}

// 用户登出
export async function apiLogout(token) {
    return request(`${apiHost}/logout`, {
      method: 'DELETE',
      headers: {'authorization': token},
    });
}


// 获取当前用户信息
export async function apiQueryCurrentUser(token) {
  return request(`${apiHost}/current-user`, {
    method: 'GET',
    headers: {'authorization': token},
  });
}




