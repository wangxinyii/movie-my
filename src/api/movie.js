import request from '@/utils/request'

export function queryAllCinema() {
  return request({
    url: '/cinema/findAllCinemas',
    method: 'GET'
  })
}
