import request from '@/utils/request'

// 登录
export function AdminLogin (parameter) {
  return request({
    url: '/power/Admin/login',
    method: 'post',
    data: parameter
  })
}
