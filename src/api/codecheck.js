import request from '@/utils/request-nomock'

export function search(codeTypes, content, from, size, withSource) {
  return request({
    url: 'v1/source_code/search',
    method: 'get',
    params: {
      'codeTypes': codeTypes,
      'content': content,
      'from': from,
      'size': size,
      'withSource': withSource
    }
  })
}
