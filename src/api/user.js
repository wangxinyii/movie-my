import request from '@/utils/request'

export function login(phone, password) {
  return request({
    url: '/user/login',
    method: 'post',
    params: {
      user_phone: phone,
      user_pwd: password
    }
  })
}

export function getInfo(user_id) {
  return request({
    url: `/user/findHallById/` + 1,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function findAllUserInfos() {
  return request({
    url: '/user/findAllUserInfos',
    method: 'GET'
  })
}

export function findAllUserByPage(page, limit) {
  return request({
    url: '/user/findAllUserByPage',
    method: 'GET',
    params: {
      page,
      limit
    }
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'POST',
    data
  })
}

export function findUserLikeName(likeName) {
  return request({
    url: '/user/findUserLikeName',
    method: 'GET',
    params: {
      likeName
    }
  })
}

export function findAllUserBySplitPage(page, limit, likeName) {
  return request({
    url: '/user/findAllUserBySplitPage',
    method: 'GET',
    params: {
      page,
      limit,
      likeName
    }
  })
}
