// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      // 仪表盘
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '数据汇总', keepAlive: true, permission: ['analysis'] }
          }
        ]
      },
      // 权限模块
      {
        path: '/power',
        component: RouteView,
        redirect: '/power/power',
        name: 'power',
        meta: { title: '权限模块', icon: 'gold', keepAlive: true, permission: ['power'] },
        children: [
          {
            path: '/power/power',
            name: 'powerPower',
            component: RouteView,
            meta: { title: '权限设置', icon: 'safety', keepAlive: true, permission: ['powerPower'] },
            redirect: '/power/power/list',
            children: [
              {
                path: '/power/power/list',
                name: 'powerPowerList',
                component: () => import('@/views/power/power/list'),
                meta: { title: '权限列表', keepAlive: true, permission: ['powerPowerList'] }
              }
            ]
          },
          {
            path: '/power/admin',
            name: 'powerAdmin',
            component: RouteView,
            meta: { title: '管理员设置', icon: 'user', keepAlive: true, permission: ['powerAdmin'] },
            redirect: '/power/admin/list',
            children: [
              {
                path: '/power/admin/list',
                name: 'powerAdminList',
                component: () => import('@/views/power/admin/list'),
                meta: { title: '管理员列表', keepAlive: true, permission: ['powerAdminList'] }
              }
            ]
          },
          {
            path: '/power/role',
            name: 'powerRole',
            component: RouteView,
            meta: { title: '角色设置', icon: 'team', keepAlive: true, permission: ['powerRole'] },
            redirect: '/power/role/list',
            children: [
              {
                path: '/power/role/list',
                name: 'powerRoleList',
                component: () => import('@/views/power/role/list'),
                meta: { title: '角色列表', keepAlive: true, permission: ['powerRoleList'] }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
