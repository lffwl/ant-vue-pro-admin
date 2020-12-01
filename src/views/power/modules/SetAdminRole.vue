<template>
  <a-spin :spinning="spinning" size="large">
    <a-skeleton :loading="initLoading">
      <a-table v-if="data && data.length" :loading="false" :defaultExpandAllRows="true" :columns="columns"
               :data-source="data" :rowKey="rowKey" :pagination="paginationPage" :rowSelection="rowSelection"
               :scroll="{y:550}" @change="tableChange">
      </a-table>
    </a-skeleton>
  </a-spin>
</template>

<script>
import { List } from '@/api/role'
import { SetRole } from '@/api/admin'

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
  }
]

export default {
  name: 'SetRolePower',
  props: {
    title: {
      type: String,
      default: ''
    },
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      spinning: false,
      initLoading: true,
      // Table
      data: [],
      rowKey: 'id',
      columns: columns,
      paginationPage: {},
      selectedRowKeys: []
    }
  },
  mounted () {
    // 请求加载列表
    this.loadListAdmin()
    // 设置默认选中
    this.selectedRowKeys = this.record.role
  },
  computed: {
    rowSelection () {
      return {
        type: 'checkbox',
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    tableChange (pagination) {
      this.loadListAdmin({
        page: pagination.current,
        limit: pagination.pageSize
      })
    },
    onOk () {
      if (this.spinning === false) {
        this.spinning = true
        var _this = this
        return new Promise(resolve => {
          SetRole(_this.record.id, { role: _this.selectedRowKeys }).then(res => {
            if (res.status === 'success') {
              _this.spinning = false
              this.$message.success('设置成功')
              resolve(true)
            } else {
              _this.spinning = false
              this.$message.error(res.msg)
            }
          }).catch(() => {
            _this.spinning = false
            this.$message.error('网络错误')
          })
        })
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    loadListAdmin (data = {}) {
      List(data).then(res => {
        if (res.status === 'success') {
          this.data = res.data
          res.pagination.showSizeChanger = true
          res.pagination.pageSizeOptions = this.Global.pageSizeOptions
          res.pagination.showTotal = () => {
            return '共 ' + res.pagination.total + ' 条'
          }
          this.paginationPage = res.pagination
          this.initLoading = false
        } else {
          this.initLoading = false
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.initLoading = false
        this.$message.error('网络错误')
      })
    }
  }
}
</script>
