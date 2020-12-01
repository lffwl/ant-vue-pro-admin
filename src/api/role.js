import request from '@/utils/request'

// 列表
export function List (parameter) {
  return request({
    url: '/power/Role/index',
    method: 'get',
    params: parameter
  })
}

// 添加角色
export function AddRole (parameter) {
  return request({
    url: '/power/Role/create',
    method: 'post',
    data: parameter
  })
}

// 修改角色
export function UpdateRole (id, parameter) {
  return request({
    url: '/power/Role/' + id + '/update',
    method: 'post',
    data: parameter
  })
}

// 删除角色
export function DeleteRole (id) {
  return request({
    url: '/power/Role/' + id + '/delete',
    method: 'delete'
  })
}

// 设置权限
export function SetPower (id, parameter) {
  return request({
    url: '/power/Role/' + id + '/setPower',
    method: 'post',
    data: parameter
  })
}
