import request from '@/utils/request-nomock'

export function uploadBinary(formData) {
  return request({
    url: 'v1/binary/local',
    method: 'patch',
    headers: { 'Content-Type': 'multipart/form-data;boundary =' + new Date().getTime() },
    data: formData
  })
}
export function uploadSource(formData) {
  return request({
    url: 'v1/source_code/local',
    method: 'patch',
    headers: { 'Content-Type': 'multipart/form-data;boundary =' + new Date().getTime() },
    data: formData
  })
}
export function uploadFile(formData) { // 这里似乎有点那啥，上传文件其实做了两个版本的API，没整合，商量的结果是我调两次
  return request({
    url: '/v1/projects/' + formData.get('id') + '/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data;boundary =' + new Date().getTime() },
    data: formData
  })
}
export function getCodeList(formData) {
  return request({
    url: 'v1/projects/' + formData.get('id') + '/codes/',
    method: 'get',
    params: {
      'fileId': formData.get('fileId'),
      'dtype': 3,
      'page': formData.get('page'),
      'limit': formData.get('limit')
    }
  })
}
export function download(formData) {
  return request({
    url: 'v1/projects/' + formData.get('id') + '/download',
    method: 'get',
    responseType: 'blob',
    timeout: 600000,
    headers: {
      'Content-Type': 'application/json; application/octet-stream',
    },
    params: {
      'fileId': formData.get('fileId'),
      'dtype': formData.get('dtype')
    }
  }).then(response => {
    const blob = new Blob([response], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a') // 创建a标签
    link.href = url
    link.download = formData.get('name') // 设置下载的文件名
    link.click() // 执行下载
    URL.revokeObjectURL(url) // 释放内存
  })
    .catch((error) => {
      console.log(error)
    })
}
export function deletes(formData) {
  return request({
    url: 'v1/projects/' + formData.get('id') + '/delete/',
    method: 'get',
    params: {
      'dtype': formData.get('dtype')
    }
  })
}
export function importPypi(formData) {
  return request({
    url: 'v1/source_code/pypi',
    method: 'get',
    timeout: 600000,
    params: {
      'userId': formData.userId,
      'projectId': formData.projectId,
      'package': formData.package,
      'platform': formData.platform,
      'version': formData.version,
      'no_deps': !formData.deps
    }
  })
}
export function importAPT(formData) {
  return request({
    url: 'v1/source_code/pypi',
    method: 'get',
    timeout: 600000,
    params: {
      'userId': formData.userId,
      'projectId': formData.projectId,
      'package': formData.package,
      'type': 'deb',
      'version': formData.version,
    }
  })
}
