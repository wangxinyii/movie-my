import request from '@/utils/request'

export function queryAllMovies() {
  return request({
    url: '/cinema/findAllCinemas',
    method: 'GET'
  })
}
