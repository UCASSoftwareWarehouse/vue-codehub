import request from '@/utils/request-nomock'

export function test() {
  return request({
    url: 'v1/test/ping_code_sim',
    method: 'get'
  })
}
