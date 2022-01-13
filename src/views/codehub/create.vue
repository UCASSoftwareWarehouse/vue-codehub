<template>
  <div class="app-container">
    <aside>
      <h1 v-if="$route.query.type == 1">导入Pypi包</h1>
      <h1 v-else-if="$route.query.type == 2">导入APT包</h1>
    </aside>
    <el-form v-if="$route.query.type == 1" ref="ruleForm" label-position="top" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="Pypi包名称" prop="name" placeholder="请输入Pypi包名称">
        <el-input v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="操作系统" prop="os">
        <el-select v-model="ruleForm.os" placeholder="请选择操作系统">
          <el-option v-for="item in osOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="ruleForm.version" type="textarea" placeholder="请输入包版本" />
      </el-form-item>
      <el-checkbox
        v-model="ruleForm.deps"
        class="filter-item"
        style="margin-left:15px;margin-right:15px"
      >
        是否安装依赖
      </el-checkbox>
      <el-form-item style="margin-top: 15px">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.demo-ruleForm {
  width: 50% !important;
  margin: 0 auto;
  }
</style>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        os: 'ubuntu',
        version: '',
        deps: ''
      },
      rules: {
        name: [
          { required: true, message: '包名不能为空', trigger: 'blur' },
        ]
      },
      osOptions: ['ubuntu', 'macosx_11_0_arm64', 'manylinux1', 'win_amd64']
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
