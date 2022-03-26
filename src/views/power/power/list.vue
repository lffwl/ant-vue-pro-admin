<template>
  <div class="background-ffffff wl-main-div">
    <div class="table-operator" style="overflow: hidden">
      <a-button type="primary" icon="plus" @click="handleAdd" v-action:powerPowerListCreate>新增权限</a-button>
      <a-button type="primary" icon="sync" @click="loadListPower" style="float: right">刷新</a-button>
    </div>
    <a-skeleton :loading="initLoading">
      <a-table v-if="data && data.length" :loading="loadingTable" :defaultExpandAllRows="true" :columns="columns"
               :data-source="data" :rowKey="rowKey" :pagination="paginationPage">
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)" v-action:powerPowerListUpdate>编辑</a>
            <a-divider type="vertical" v-if="$auth('powerPowerList.powerPowerListUpdate')" />
            <a-popconfirm title="确定要删除该行？" @confirm="handleDel(record)" v-action:powerPowerListDelete>
              <a-icon slot="icon" type="question-circle-o" />
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
    </a-skeleton>
    <create-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel"
                 @ok="handleOk" />
  </div>
</template>
<script>
import CreateForm from '../modules/CreatePower'
import { AddPower, ListPower, UpdatePower, DeletePower } from '@/api/power'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '170px'
  },
  {
    title: '接口名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '权限唯一键',
    dataIndex: 'permission',
    key: 'permission'
  },
  {
    title: '接口地址',
    dataIndex: 'url',
    key: 'url'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'PowerPowerList',
  components: {
    CreateForm
  },
  data () {
    return {
      initLoading: true,
      // Table
      loadingTable: true,
      paginationPage: false,
      data: [],
      rowKey: 'id',
      columns: columns,
      // 新增权限
      visible: false,
      confirmLoading: false,
      menuType: {},
      mdl: null
    }
  },
  created () {
    // 请求加载列表
    this.loadListPower()
  },
  methods: {
    loadListPower () {
      this.loadingTable = true
      ListPower({}).then(res => {
        if (res.status === 'success') {
          this.data = res.data.list
          this.menuType = res.data.config
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
      this.mdl = { ...{ data: this.data, menuType: this.menuType } }
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
            UpdatePower(values.id, values).then(res => {
              if (res.status === 'success') {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                _this.loadListPower()

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
            AddPower(values).then(res => {
              if (res.status === 'success') {
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                _this.loadListPower()

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
      DeletePower(record.id).then(res => {
        if (res.status === 'success') {
          // 刷新表格
          this.loadListPower()
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
