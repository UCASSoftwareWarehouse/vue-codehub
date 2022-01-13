<template>
  <div class="app-container">
    <aside>
      <h1>项目管理</h1>
    </aside>
    <div align="right" style="margin-bottom:15px;">
      <el-input v-model="listQuery.keyword" placeholder="项目名" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.os" placeholder="操作系统" style="margin-left: 10px">
        <el-option v-for="item in osOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.code_type" placeholder="编程语言" style="margin-left: 10px">
        <el-option v-for="item in codeTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.language" placeholder="语种" style="margin-left: 10px">
        <el-option v-for="item in languageOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.topic" placeholder="话题标签" style="margin-left: 10px">
        <el-option v-for="item in topicOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData" style="margin-left: 10px">
        Search
      </el-button>
      <el-button v-if="username === 'admin'" align="center" icon="el-icon-edit" type="primary">
        <router-link to="/create">
          新建项目
        </router-link>
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="项目ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称">
        <template slot-scope="scope">
          <router-link
            class="content"
            :to="{path: '/codehub/'+scope.row.id,
                  query: {id: scope.row.id}}"
            tag="div"
          >
            <el-link type="primary" :underline="false">{{ scope.row.projectName }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="项目所有者" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="操作系统" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.operatingSystem }}
        </template>
      </el-table-column>
      <el-table-column label="编程语言" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.programmingLanguage }}
        </template>
      </el-table-column>
      <el-table-column label="自然语言" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.naturalLanguage }}
        </template>
      </el-table-column>
      <el-table-column label="话题标签" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.topic }}
        </template>
      </el-table-column>
      <el-table-column label="版本号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tags }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件协议" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.license }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="110" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
            :content="scope.row.projectDescription"
          >
            <el-button slot="reference">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ new Date(scope.row.updatetime.seconds * 1000).toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="50" align="center">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-s-tools" />
            </span>
            <el-dropdown-menu slot="dropdown" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="下载中，请稍候">
              <el-dropdown-item
                :disabled="(typeof(scope.row.codeAddr) == 'undefined') || (typeof(scope.row.binaryAddr) == 'undefined')"
                @click.native="download(0, scope.row.id, scope.row.projectName, 0)"
              >下载项目</el-dropdown-item>
              <el-dropdown-item
                :disabled="typeof(scope.row.codeAddr) == 'undefined'"
                @click.native="download(1, scope.row.id, scope.row.projectName, scope.row.codeAddr)"
              >下载代码</el-dropdown-item>
              <el-dropdown-item
                :disabled="typeof(scope.row.binaryAddr) == 'undefined'"
                @click.native="download(2, scope.row.id, scope.row.projectName, scope.row.binaryAddr)"
              >下载二进制文件</el-dropdown-item>
              <el-dropdown-item v-if="username === 'admin'" @click.native="deletes(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div align="center" style="margin-top:15px;">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="totalPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>

<script>
import Cookies from 'js-cookie'
import { getList, getIndex } from '@/api/project'
import { download, deletes } from '@/api/codehub'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      totalPage: 10,
      pageSize: 10,
      currentPage: 1,
      osOptions: ['Null', 'Android', 'Windows', 'Ubuntu', 'Others'],
      codeTypeOptions: ['Null', 'Python', 'Go', 'Java', 'Others'],
      languageOptions: ['Null', 'Chinese', 'English', 'Others'],
      topicOptions: ['Null', 'AdativeTechnologies', 'ArtisticSoftware', 'Others'],
      listQuery: {
        keyword: null,
        os: null,
        code_type: null,
        language: null,
        topic: null
      },
      fullscreenLoading: false,
      username: Cookies.get('username'),
      projectNameList: []
    }
  },
  created() {
    this.getIndex(this.currentPage, this.pageSize, this)
  },
  methods: {
    getIndex(oldPage, oldSize, _this) {
      _this.listLoading = true
      getIndex().then(response => {
        _this.totalPage = response.data.length
      })
      getIndex(_this.currentPage, _this.pageSize).then(response => {
        _this.list = response.data
        _this.list.sort(function(a, b) {
          return a.id - b.id
        })
        _this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.currentPage = oldPage
        this.pageSize = oldSize
        _this.listLoading = false
      })
    },
    fetchData() {
      this.listLoading = true
      const formData = new FormData()
      if (this.listQuery.keyword !== null) {
        formData.append('keyword', this.listQuery.keyword)
      }
      formData.append('page', this.currentPage)
      formData.append('limit', this.pageSize)
      formData.append('operatingSystem', this.listQuery.os)
      formData.append('programmingLanguage', this.listQuery.code_type)
      formData.append('naturalLanguage', this.listQuery.language)
      formData.append('topic', this.listQuery.topic)
      getList(new FormData()).then(response => {
        this.totalPage = response.data.length
      })
      getList(formData).then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleSizeChange(size) {
      const oldSize = this.pageSize
      this.pageSize = size
      this.getIndex(this.currentPage, oldSize, this)
    },
    handleCurrentChange(page) {
      const oldPage = this.currentPage
      this.currentPage = page
      this.getIndex(oldPage, this.pageSize, this)
    },
    download(dtype, id, name, addr) {
      const params = new FormData()
      params.append('id', id)
      params.append('name', name)
      params.append('fileId', addr)
      params.append('dtype', dtype)
      this.fullscreenLoading = true
      download(params).then(response => {
        console.log(response)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    deletes(projectId) {
      const params = new FormData()
      params.append('id', projectId)
      params.append('dtype', 0)
      deletes(params).then(response => {
        this.$message({
          type: 'success',
          message: '已删除'
        })
        this.fetchData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
