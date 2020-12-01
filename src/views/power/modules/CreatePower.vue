<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
           @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="权限ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '名称不能为空！'}]}]" placeholder="请输入权限名称"/>
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-decorator="['url', {rules: []}]" placeholder="请输入权限地址"/>
        </a-form-item>
        <a-form-item label="权限唯一键">
          <a-input v-decorator="['permission', {rules: [{required: true, message: '权限唯一键不能为空！'}]}]"
                   placeholder="请输入权限唯一键"/>
        </a-form-item>
        <a-form-item label="上级权限">
          <a-tree-select style="width: 100%" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                         :tree-data="upData"
                         :replaceFields="{children:'children', title:'name', key:'id', value: 'id'}"
                         placeholder="请选择上级权限" v-model="selectPid" @change="pidChange" tree-default-expand-all>
            <span slot="title" slot-scope="{ key, value }">
              {{ value }}
            </span>
          </a-tree-select>
          <a-input name="pid" type="hidden" v-decorator="['pid', {rules: []}]"/>
        </a-form-item>
        <a-form-item label="菜单类型">
          <a-select placeholder="菜单类型" v-decorator="[ 'menu_type', {rules: []} ]">
            <a-select-option v-for="(value, key) in menuType" :key="key" :value="key">{{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="菜单排序">
          <a-input v-decorator="['sort', {rules: []}]" placeholder="请输入菜单排序"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name', 'url', 'pid', 'menu_type', 'sort', 'permission']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      title: '新增权限',
      upData: null,
      selectPid: null,
      menuType: {}
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      if (this.model) {
        if (this.model.menuType) {
          this.menuType = this.model.menuType
        }
        if (this.model.id) {
          this.title = '修改权限'
        }
        if (this.model.pid === 0) {
          this.model.pid = null
        }
        this.form.setFieldsValue(pick(this.model, fields))
        this.upData = this.model.data
        this.selectPid = this.model.pid
      }
    })
  },
  methods: {
    pidChange (value) {
      this.form.setFieldsValue({ pid: value })
    }
  }
}
</script>
