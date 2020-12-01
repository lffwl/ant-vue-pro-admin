<template>
  <div class="background-ffffff wl-main-div">
    <div class="table-operator">
      <a-button v-action:powerRoleListCreate type="primary" icon="plus" @click="handleAdd">新增角色</a-button>
      <a-button type="primary" icon="sync" @click="loadListRole({})" style="float: right">刷新</a-button>
    </div>
    <a-skeleton :loading="initLoading">
      <a-table v-if="data && data.length" :loading="loadingTable" :defaultExpandAllRows="true" :columns="columns"
               :data-source="data" :rowKey="rowKey" :pagination="paginationPage" @change="tableChange">
        <span slot="action" slot-scope="text, record">
          <template v-if="record.id !== 1">
            <a @click="handleEdit(record)" v-action:powerRoleListUpdate>编辑</a>
            <a-divider type="vertical" v-if="$auth('powerRoleList.powerRoleListUpdate')"/>
            <a-popconfirm title="确定要删除该行？" @confirm="handleDel(record)" v-action:powerRoleListDelete>
              <a-icon slot="icon" type="question-circle-o"/>
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" v-if="$auth('powerRoleList.powerRoleListSetPower')"/>
            <a @click="setPower(record)" v-action:powerRoleListSetPower>权限设置</a>
          </template>
        </span>
      </a-table>
    </a-skeleton>
    <create-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel"
                 @ok="handleOk"/>
  </div>
</template>
<script>
import CreateForm from '../modules/CreateRole'
import SetRolePower from '../modules/SetRolePower'
import { List, AddRole, UpdateRole, DeleteRole } from '@/api/role'
import moment from 'moment'

moment.locale('zh-cn')

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '170px'
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    customRender: (text) => {
      if (text) {
        return moment(text * 1000).format('YYYY-MM-DD')
      } else {
        return '暂无'
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'powerRoleList',
  components: {
    CreateForm, SetRolePower
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
      mdl: null
    }
  },
  created () {
    // 请求加载列表
    this.loadListRole({})
  },
  methods: {
    setPower (info) {
      var _this = this
      this.$dialog(SetRolePower,
        {
          record: info,
          on: {
            ok () {
              // 设置完成重载表格
              _this.loadListRole({})
            }
          }
        },
        {
          title: info.name + ' - 角色权限设置',
          width: 900,
          centered: true,
          maskClosable: false
        })
    },
    tableChange (pagination) {
      this.loadListRole({
        page: pagination.current,
        limit: pagination.pageSize
      })
    },
    loadListRole (data) {
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
            UpdateRole(values.id, values).then(res => {
              if (res.status === 'success') {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                _this.loadListRole()

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
            AddRole(values).then(res => {
              if (res.status === 'success') {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                _this.loadListRole()

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
      DeleteRole(record.id).then(res => {
        if (res.status === 'success') {
          // 刷新表格
          this.loadListRole()
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
