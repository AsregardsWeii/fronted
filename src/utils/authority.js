/**
 * @author 杨金刚
 * @date 2020/4/20 16:02
 */

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function setToken(token) {
  return localStorage.setItem('token', JSON.stringify(token));
}

export function setCurrentUser(currentUser) {
  if(!localStorage.getItem('current-user')) {
    return localStorage.setItem('current-user', JSON.stringify(currentUser));
  }
}

export function getCurrentUser() {
  let currentUser;
  try {
    currentUser = JSON.parse(localStorage.getItem('current-user'));
  } catch (e) {
    currentUser = null;
  }
  
  return currentUser;
}

export function getToken() {
  let token;
  try {
    token = JSON.parse(localStorage.getItem('token'));
  } catch (e) {
    token = "";
  }
  
  return token;
}

export function clearLocalStorage() {
  try {
    localStorage.clear();
  } catch (e) {
    
  }
}

