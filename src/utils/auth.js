import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const User_Id = 'User_Id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getUserId() {
  return Cookies.get(User_Id)
}

export function setUserId(userId) {
  return Cookies.set(User_Id, userId)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
