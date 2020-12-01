import request from '@/utils/request'

// 详情
export function Info () {
  return request({
    url: '/power/Admin/info',
    method: 'get'
  })
}

// 列表
export function List (parameter) {
  return request({
    url: '/power/Admin/index',
    method: 'get',
    params: parameter
  })
}

// 添加管理员
export function AddAdmin (parameter) {
  return request({
    url: '/power/Admin/create',
    method: 'post',
    data: parameter
  })
}

// 修改管理员
export function UpdateAdmin (id, parameter) {
  return request({
    url: '/power/Admin/' + id + '/update',
    method: 'post',
    data: parameter
  })
}

// 删除管理员
export function DeleteAdmin (id) {
  return request({
    url: '/power/Admin/' + id + '/delete',
    method: 'delete'
  })
}

// 设置角色
export function SetRole (id, parameter) {
  return request({
    url: '/power/Admin/' + id + '/setRole',
    method: 'post',
    data: parameter
  })
}
