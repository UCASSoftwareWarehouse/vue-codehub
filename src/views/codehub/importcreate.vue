<template>
  <div class="app-container">
    <aside>
      <h1>导入外部仓库</h1>
    </aside>
    <el-steps :active="active" align-center>
      <el-step title="填写外部仓库信息" />
      <el-step title="创建仓库" />
    </el-steps>
    <div v-show="active == 1">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item label="源仓库路径" prop="path">
          <el-input v-model="ruleForm.path" :placeholder="holder" class="input-with-select">
            <el-select slot="prepend" v-model="ruleForm.select" placeholder="请选择" style="width: 100px">
              <el-option label="Git" value="1" />
              <el-option label="SVN" value="2" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="源仓库访问权限" prop="sourceAuthority">
          <el-radio-group v-model="ruleForm.sourceAuthority">
            <el-radio label="不需要用户名/密码" value="1" />
            <el-radio label="需要用户名/密码" value="2" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.sourceAuthority=='需要用户名/密码'" label="用户名" prop="user">
          <el-input v-model="ruleForm.user" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="ruleForm.sourceAuthority=='需要用户名/密码'" label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="active == 2">
      <el-form ref="ruleForm" label-position="top" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="代码仓库名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请以字母、数字或下划线开头，名称还可以包含点和连字符" />
        </el-form-item>
        <el-form-item label="归属项目" prop="project">
          <el-select v-model="ruleForm.project" placeholder="请选择归属项目">
            <el-option label="项目1" value="project1" />
            <el-option label="项目2" value="project2" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleForm.description" type="textarea" placeholder="请简要描述代码仓库" />
        </el-form-item>
        <el-form-item label="权限设置" prop="authority">
          <el-checkbox-group v-model="ruleForm.authority">
            <el-checkbox label="允许项目内人员访问仓库" name="authority" />
            <el-checkbox label="自动创建代码检查任务" name="authority" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否公开" prop="visible">
          <el-radio-group v-model="ruleForm.visible">
            <el-radio label="私有" />
            <el-radio label="公开只读" />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="prev">上一步</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      active: 1,
      holder: '',
      ruleForm: {
        path: '',
        select: '',
        sourceAuthority: '',
        user: '',
        password: '',
        name: '',
        project: '',
        description: '',
        authority: [],
        visible: ''
      },
      rules: {
        path: [
          { required: true, min: 10, max: 100, message: '源仓库地址不能少于10个字符', trigger: 'blur' }
        ],
        select: [
          { required: true, message: '请选择源仓库路径', trigger: 'blur' }
        ],
        sourceAuthority: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ],
        user: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '代码仓库名不能为空', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '代码仓库必须挂到项目下', trigger: 'blur' }
        ],
        authority: [
          { type: 'array' }
        ],
        visible: [
          { required: true, message: '请选择是否公开', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    select: function() {
      if (this.option === '1') {
        this.holder = '以（http://）或（https://）开头，以（.git）结尾'
      } else {
        this.holder = '以（http://）开头'
      }
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
    },
    prev() {
      --this.active
      if (this.active < 1) this.active = 1
    },
    next() {
      ++this.active
      if (this.active > 2) this.active = 2
    }
  }
}
</script>
