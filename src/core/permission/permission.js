export const PERMISSION_ENUM = {
  'add': { key: 'add', label: '新增' },
  'delete': { key: 'delete', label: '删除' },
  'edit': { key: 'edit', label: '修改' },
  'query': { key: 'query', label: '查询' },
  'get': { key: 'get', label: '详情' },
  'enable': { key: 'enable', label: '启用' },
  'disable': { key: 'disable', label: '禁用' },
  'import': { key: 'import', label: '导入' },
  'export': { key: 'export', label: '导出' }
}

/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param Vue
 */
function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        const _this = this
        return (permissions = {}) => {
          // if (_this.$store.getters.roles) {
            const [permission, action] = permissions.split('.')
            const permissionList = _this.$store.getters.roles.permissions
            var is = false
            for (var item of permissionList) {
              if (item.permissionId === permission) {
                if (item.actionList !== null) {
                  for (var aItem of item.actionList) {
                    if (aItem === action) {
                      is = true
                    }
                  }
                }
              }
            }
            return is
          // }
          // return permissionList.find((val) => {
          //   return val.permissionId === permission
          // }).actionList.findIndex((val) => {
          //   return val === action
          // }) > -1
        }
      }
    }
  })

  !Vue.prototype.$enum && Object.defineProperties(Vue.prototype, {
    $enum: {
      get () {
        // const _this = this;
        return (val) => {
          let result = PERMISSION_ENUM
          val && val.split('.').forEach(v => {
            result = result && result[v] || null
          })
          return result
        }
      }
    }
  })
}

export default plugin
