<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
           @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="管理员ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item label="登录名">
          <a-input v-decorator="['user_name', {rules: [{required: true, message: '登录名不能为空！'}]}]" placeholder="请输入登录名"/>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['nick_name', {rules: [{required: true, message: '姓名不能为空！'}]}]" placeholder="请输入姓名"/>
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            v-decorator="['password', {rules: [(model && model.id > 0) ? {} : {required: true, message: '密码不能为空！'}]}]"
            :placeholder="(model && model.id > 0) ? '不修改密码请留空' : '请输入密码'"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'user_name', 'nick_name', 'password']

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
      title: '新增管理员'
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      if (this.model) {
        if (this.model.id) {
          this.title = '修改管理员'
        }
        this.form.setFieldsValue(pick(this.model, fields))
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
