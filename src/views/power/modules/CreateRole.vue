<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
           @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="角色ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled/>
        </a-form-item>
        <a-form-item label="角色名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '角色名称不能为空！'}]}]" placeholder="请输入角色名称"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name']

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
      title: '新增角色'
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      if (this.model) {
        if (this.model.id) {
          this.title = '修改角色'
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
