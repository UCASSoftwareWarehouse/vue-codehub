<template>
  <div id="interfaceCorrection" class="app-container">
    <aside>
      <h1 class="dashboard-text">代码检索</h1>
    </aside>
    <div class="filter-container">
      <el-input v-model="listQuery.content" placeholder="检索内容" style="width: 200px;margin-right: 20px" class="filter-item" />
      将检索内容解释为：
      <el-select v-model="listQuery.codeTypes" multiple placeholder="代码类型" style="width: 220px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item[0]" :label="item[0]" :value="item[1]" />
      </el-select>
      <el-checkbox
        v-model="listQuery.withSource"
        class="filter-item"
        style="margin-left:15px;margin-right:15px"
      >
        显示源代码
      </el-checkbox>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter( listQuery )">
        Search
      </el-button>
    </div>
    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column v-if="listQuery.withSource === true && totalPage > 0" type="expand">
          <template slot-scope="scope">
            <codemirror :value="scope.row.Content" :options="cmOptions" />
          </template>
        </el-table-column>
        <el-table-column label="项目名" width="180" prop="projectName">
          <template slot-scope="scope">
            {{ scope.row.project_name }}
          </template>
        </el-table-column>
        <el-table-column label="标签" width="180">
          <template slot-scope="scope">
            {{ scope.row.tag }}
          </template>
        </el-table-column>
        <el-table-column label="路径" prop="path">
          <template slot-scope="scope">
            {{ scope.row.RelPath }}
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: center; margin-top: 15px">
        <el-pagination
          background
          :page-size="listQuery.size"
          :page-sizes="[10, 20, 30, 40]"
          layout="sizes, prev, pager, next"
          :total="totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 引入组件
import { codemirror } from 'vue-codemirror'
import { search } from '@/api/codecheck'
// 引入高亮样式
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
// 引入语言
import 'codemirror/mode/vue/vue.js'
export default {
  // 设置组件
  components: {
    codemirror
  },
  data() {
    return {
      list: [],
      totalPage: 10,
      listLoading: false,
      listQuery: {
        codeTypes: [],
        content: '',
        from: 0,
        size: 10,
        withSource: false
      },
      importanceOptions: [['text', 0], ['python', 1], ['golang', 2]],
      downloadLoading: false,
      cmOptions: {
        mode: 'text/x-python',
        theme: 'base16-dark'
      }
    }
  },
  methods: {
    handleFilter(formData) {
      this.listLoading = true
      this.listQuery.page = 1
      search(formData.codeTypes, formData.content, 0, 1000, false).then(response => {
        this.totalPage = response.data['project_files'].length
      }).catch(err => {
        console.log(err)
      })
      search(formData.codeTypes, formData.content, 0, formData.size, true).then(response => {
        this.list = response.data['project_files']
        this.listLoading = false
        console.log(this.list)
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },
    handleSizeChange(size) {
      const formData = this.listQuery
      search(formData.codeTypes, formData.content, formData.from, size, true).then(response => {
        this.list = response.data['project_files']
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    },
    handleCurrentChange(Page) {
      const formData = this.listQuery
      search(formData.codeTypes, formData.content, (Page - 1) * formData.size, formData.size, true).then(response => {
        this.list = response.data['project_files']
        this.listLoading = false
        console.log(this.list)
      }).catch(err => {
        this.listLoading = false
        console.log(err)
      })
    }
  }
}

</script>
