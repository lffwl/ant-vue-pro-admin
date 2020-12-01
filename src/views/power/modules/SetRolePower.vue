<template>
  <a-spin :spinning="spinning" size="large">
    <a-skeleton :loading="initLoading">
      <a-table v-if="data && data.length" :loading="false" :defaultExpandAllRows="true" :columns="columns"
               :data-source="data" :rowKey="rowKey" :pagination="false" :rowSelection="rowSelection" :scroll="{y:550}">
      </a-table>
    </a-skeleton>
  </a-spin>
</template>

<script>
import { ListPower } from '@/api/power'
import { SetPower } from '@/api/role'

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
      selectedRowKeys: []
    }
  },
  mounted () {
    // 请求加载列表
    this.loadListPower()
    // 设置默认选中
    this.selectedRowKeys = this.record.power
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
    onOk () {
      if (this.spinning === false) {
        this.spinning = true
        var _this = this
        return new Promise(resolve => {
          SetPower(_this.record.id, { power: _this.selectedRowKeys }).then(res => {
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
    loadListPower () {
      this.loadingTable = true
      ListPower({}).then(res => {
        if (res.status === 'success') {
          this.data = res.data.list
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
