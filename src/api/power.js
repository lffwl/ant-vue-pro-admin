import request from '@/utils/request'

// 添加权限
export function AddPower (parameter) {
  return request({
    url: '/power/Power/create',
    method: 'post',
    data: parameter
  })
}

// 修改权限
export function UpdatePower (id, parameter) {
  return request({
    url: '/power/Power/' + id + '/update',
    method: 'post',
    data: parameter
  })
}

// 删除权限
export function DeletePower (id) {
  return request({
    url: '/power/Power/' + id + '/delete',
    method: 'delete'
  })
}

// 权限列表
export function ListPower (parameter) {
  return request({
    url: '/power/Power/index',
    method: 'get',
    params: parameter
  })
}
