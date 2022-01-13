<template>
  <div class="app-container">
    <aside>
      <h1>新建项目</h1>
    </aside>
    <el-form ref="ruleForm" label-position="top" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="版本号" prop="tags">
        <el-input v-model="ruleForm.tags" type="textarea" placeholder="请输入版本号" />
      </el-form-item>
      <el-form-item label="软件协议" prop="license">
        <el-input v-model="ruleForm.license" type="textarea" placeholder="请输入软件协议" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="ruleForm.description" type="textarea" placeholder="请简要描述该项目" />
      </el-form-item>
      <el-form-item label="操作系统" prop="OS">
        <el-select v-model="ruleForm.os" placeholder="-- 请选择 --">
          <el-option v-for="item in osOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="编程语言" prop="code_type">
        <el-select v-model="ruleForm.code_type" placeholder="-- 请选择 --">
          <el-option v-for="item in codeTypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="语种" prop="language">
        <el-select v-model="ruleForm.language" placeholder="-- 请选择 --">
          <el-option v-for="item in languageOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="话题标签" prop="topic">
        <el-select v-model="ruleForm.topic" placeholder="-- 请选择 --">
          <el-option v-for="item in topicOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item>
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
import { createProject, getIndex } from '@/api/project'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        tags: '',
        license: '',
        description: '',
        os: '',
        code_type: '',
        language: '',
        topic: ''
      },
      rules: {
        name: [
          { required: true, message: '项目名不能为空', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ]
      },
      userId: Cookies.get('username') === 'admin' ? 1 : 2,
      osOptions: ['Null', 'Android', 'Windows', 'Ubuntu', 'Others'],
      codeTypeOptions: ['Null', 'Python', 'Go', 'Java', 'Others'],
      languageOptions: ['Null', 'Chinese', 'English', 'Others'],
      topicOptions: ['Null', 'AdativeTechnologies', 'ArtisticSoftware', 'Others'],
      projectId: undefined,
      projectList: []
    }
  },
  created() {
    this.getIndex()
  },
  methods: {
    getIndex() {
      getIndex().then(response => {
        this.projectList = []
        for (var i = 0; i < response.data.length; i++) {
          this.projectList.push(response.data[i].projectName)
        }
      })
    },
    isExisted(name, _this) {
      return _this.projectList.indexOf(name) > -1
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (await this.isExisted(this.ruleForm.name, this)) {
            Message('项目名已存在')
            return false
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const formData = new FormData()
          formData.append('projectName', this.ruleForm.name)
          formData.append('userId', this.userId)
          formData.append('tags', this.ruleForm.tags)
          formData.append('license', this.ruleForm.license)
          formData.append('projectDescription', this.ruleForm.description)
          formData.append('operationSystem', this.ruleForm.os)
          formData.append('programmingLanguage', this.ruleForm.code_type)
          formData.append('naturalLanguage', this.ruleForm.language)
          formData.append('topic', this.ruleForm.topic)
          createProject(formData).then(response => {
            this.projectId = response.data.id
            loading.close()
            this.$router.push({ path: '/' })
            Message.success('创建成功')
          }).catch(err => {
            loading.close()
            console.log(err)
          })
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
