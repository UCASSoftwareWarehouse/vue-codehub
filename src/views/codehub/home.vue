<template>
  <div class="app-container">
    <aside>
      <h1 v-if="$route.query.type === 1">代码管理</h1>
    </aside>
    <div align="right" style="margin-bottom:15px;">
      <el-dropdown split-button type="primary">
        <i class="el-icon-edit">
          <router-link to="/codehub/create">
            普通新建
          </router-link>
        </i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/codehub/create">
              普通新建
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/codehub/importcreate">
              导入外部仓库
            </router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="代码仓">
        <template slot-scope="scope">
          <router-link class="content" :to="'/codehub/'+scope.$index" tag="div">
            {{ scope.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最近更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-s-tools" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.reviewStatus == 101">编辑</el-dropdown-item> <!-- @click.native="handleDetails(scope.$index,scope.row)" -->
              <el-dropdown-item v-else>详情</el-dropdown-item> <!--  @click.native="handleDetails(scope.$index,scope.row)" -->
              <el-dropdown-item>删除</el-dropdown-item> <!--  @click.native="deletes(scope.$index,scope.row)" -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div align="center">
      <el-pagination background layout="prev, pager, next" :total="1000" />
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
import { getCodeList } from '@/api/codehub'
import { getBinaryList } from '@/api/codehub'

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
      total: 100,
      pageSize: 50,
      currentPage: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = new FormData()
      params.append('id', this.$route.query.id)
      params.append('page', this.currentPage)
      params.append('limit', this.pageSize)
      params.append('field', this.$route.query.codeAddr)
      getCodeList().then(response => {
        this.list = this.list.concat(response.data)
      }).catch(err => {
        console.log(err)
      })
      params['field'] = this.$route.query.binaryAddr
      getBinaryList().then(response => {
        this.list = this.list.concat(response.data)
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
