<template>
  <div class="background-ffffff wl-main-div">
    <div class="table-operator">
      <a-button v-action:powerAdminListCreate type="primary" icon="plus" @click="handleAdd">新增管理员</a-button>
      <a-button type="primary" icon="sync" @click="loadListAdmin({})" style="float: right">刷新</a-button>
    </div>
    <a-skeleton :loading="initLoading">
      <a-table v-if="data && data.length" :loading="loadingTable" :defaultExpandAllRows="true" :columns="columns"
               :data-source="data" :rowKey="rowKey" :pagination="paginationPage" @change="tableChange">
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" v-action:powerAdminListUpdate>编辑</a>
            <a-divider type="vertical" v-if="$auth('powerAdminList.powerAdminListUpdate')" />
            <a-popconfirm title="确定要删除该行？" @confirm="handleDel(record)" v-action:powerAdminListDelete>
              <a-icon slot="icon" type="question-circle-o" />
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" v-if="$auth('powerAdminList.powerAdminListSetRole')" />
            <a @click="setRole(record)" v-action:powerAdminListSetRole>角色设置</a>
          </template>
        </span>
      </a-table>
    </a-skeleton>
    <create-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel"
                 @ok="handleOk" />
  </div>
</template>
<script>
import CreateForm from '../modules/CreateAdmin'
import { List, AddAdmin, UpdateAdmin, DeleteAdmin } from '@/api/admin'
import moment from 'moment'
import SetAdminRole from '@/views/power/modules/SetAdminRole'

moment.locale('zh-cn')

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '100px'
  },
  {
    title: '用户名',
    dataIndex: 'user_name',
    key: 'user_name'
  },
  {
    title: '管理员姓名',
    dataIndex: 'nick_name',
    key: 'nick_name'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    customRender: (text) => {
      return moment(text * 1000).format('YYYY-MM-DD')
    }
  },
  {
    title: '最后登录时间',
    dataIndex: 'last_login_time',
    key: 'last_login_time',
    customRender: (text) => {
      if (text) {
        return moment(text * 1000).format('YYYY-MM-DD HH:mm')
      } else {
        return '暂未登录'
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'PowerAdminList',
  components: {
    CreateForm
  },
  data () {
    return {
      initLoading: true,
      // Table
      loadingTable: true,
      paginationPage: {},
      data: [],
      rowKey: 'id',
      columns: columns,
      // 新增管理员
      visible: false,
      confirmLoading: false,
      menuType: {},
      mdl: null
    }
  },
  created () {
    // 请求加载列表
    this.loadListAdmin({})
  },
  methods: {
    setRole (info) {
      var _this = this
      this.$dialog(SetAdminRole,
        {
          record: info,
          on: {
            ok () {
              // 设置完成重载表格
              _this.loadListAdmin({})
            }
          }
        },
        {
          title: info.nick_name + ' - 管理员角色设置',
          width: 600,
          centered: true,
          maskClosable: false
        })
    },
    tableChange (pagination) {
      this.loadListAdmin({
        page: pagination.current,
        limit: pagination.pageSize
      })
    },
    loadListAdmin (data) {
      this.loadingTable = true
      List(data).then(res => {
        if (res.status === 'success') {
          this.data = res.data
          res.pagination.showSizeChanger = true
          res.pagination.pageSizeOptions = this.Global.pageSizeOptions
          res.pagination.showTotal = () => {
            return '共 ' + res.pagination.total + ' 条'
          }
          this.paginationPage = res.pagination
          this.loadingTable = false
          this.initLoading = false
        } else {
          this.loadingTable = false
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loadingTable = false
        this.$message.error('网络错误')
      })
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      record.data = this.data
      record.menuType = this.menuType
      this.mdl = { ...record }
    },
    handleOk () {
      var _this = this
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            UpdateAdmin(values.id, values).then(res => {
              if (res.status === 'success') {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                _this.loadListAdmin()

                this.$message.success('修改成功')
              } else {
                this.confirmLoading = false
                this.$message.error(res.msg)
              }
            }).catch(() => {
              this.confirmLoading = false
              this.$message.error('网络错误')
            })
          } else {
            AddAdmin(values).then(res => {
              if (res.status === 'success') {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                _this.loadListAdmin()

                this.$message.success('新增成功')
              } else {
                this.confirmLoading = false
                this.$message.error(res.msg)
              }
            }).catch(() => {
              this.confirmLoading = false
              this.$message.error('网络错误')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleDel (record) {
      this.loadingTable = true
      DeleteAdmin(record.id).then(res => {
        if (res.status === 'success') {
          // 刷新表格
          this.loadListAdmin()
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.msg)
          this.loadingTable = false
        }
      }).catch(() => {
        this.loadingTable = false
        this.$message.error('网络错误')
      })
    }
  }
}
</script>
