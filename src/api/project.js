import request from '@/utils/request-nomock'

export function createProject(formData) {
  return request({
    url: 'v1/projects/create',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data;boundary =' + new Date().getTime() },
    data: formData
  })
}
export function getInfo(id) {
  return request({
    url: 'v1/projects/' + id,
    method: 'get'
  })
}
export function getList(formData) {
  return request({
    url: 'v1/projects/search',
    method: 'get',
    params: {
      'keyword': formData.get('keyword'),
      'page': formData.get('page'),
      'limit': formData.get('limit'),
      'operatingSystem': formData.get('operatingSystem'),
      'programmingLanguage': formData.get('programmingLanguage'),
      'naturalLanguage': formData.get('naturalLanguage'),
      'topic': formData.get('topic')
    }
  })
}
export function getIndex(page, limit) {
  return request({
    url: 'v1/projects/index',
    method: 'get',
    params: {
      'page': page,
      'limit': limit
    }
  })
}
