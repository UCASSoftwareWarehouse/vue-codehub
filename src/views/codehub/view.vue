<template>
  <div class="app-container">
    <aside>
      <h1>源代码管理</h1>
    </aside>
    <div align="right" style="margin-bottom:15px;">
      <el-row v-if="username === 'admin'">
        <el-dropdown split-button type="primary" @click="dialogForm1Visible = true">
          <i class="el-icon-edit">
            上传文件
          </i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dialogForm1Visible = true">
              上传源代码
            </el-dropdown-item>
            <el-dropdown-item @click.native="dialogForm2Visible = true">
              上传二进制包
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown split-button type="primary">
          <i class="el-icon-edit">
            导入外部包
          </i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dialogForm3Visible = true">
              导入Pypi包
            </el-dropdown-item>
            <el-dropdown-item @click.native="dialogForm4Visible = true">
              导入APT包
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </div>
    <div id="uploadDialog">
      <el-dialog title="上传源代码" :visible.sync="dialogForm1Visible">
        <el-form ref="form1" :model="form1" :rules="uploadRules">
          <el-form-item label="选择文件：" :label-width="formLabelWidth" prop="file">
            <el-input v-model="form1.file" type="file" name="file" accept=".zip" placeholder="选择文件：" />
          </el-form-item>
          <el-form-item label="标签" :label-width="formLabelWidth" prop="description">
            <el-input v-model="form1.description" type="textarea" placeholder="请输入标签信息" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitSource( form1 )">确 定</el-button>
          <el-button @click="dialogForm1Visible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="上传二进制文件" :visible.sync="dialogForm2Visible">
        <el-form ref="form2" :model="form2" :rules="uploadRules">
          <el-form-item label="选择文件：" :label-width="formLabelWidth" prop="file">
            <el-input v-model="form2.file" type="file" name="file" accept=".zip" placeholder="选择文件：" />
          </el-form-item>
          <el-form-item label="标签" :label-width="formLabelWidth" prop="description">
            <el-input v-model="form2.description" type="textarea" placeholder="请输入标签信息" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitBinary( form2 )">确 定</el-button>
          <el-button @click="dialogForm2Visible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="importDialog">
      <el-dialog
        title="导入Pypi包"
        :visible.sync="dialogForm3Visible"
      >
        <el-form id="form3" ref="form3" label-position="top" :model="form3" :rules="importRules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="Pypi包名称" prop="package" placeholder="请输入Pypi包名称">
            <el-input v-model="form3.package" />
          </el-form-item>
          <el-form-item label="操作系统" prop="platform">
            <el-select v-model="form3.platform" placeholder="请选择操作系统">
              <el-option v-for="item in osOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="版本" prop="version">
            <el-input v-model="form3.version" type="textarea" placeholder="请输入包版本" />
          </el-form-item>
          <el-checkbox
            v-model="form3.deps"
            class="filter-item"
            style="margin-left:15px;margin-right:15px"
          >
            是否安装依赖
          </el-checkbox>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="imports( 1, 'form3' )">确 定</el-button>
          <el-button @click="dialogForm3Visible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="导入APT包" :visible.sync="dialogForm4Visible">
        <el-form id="form4" ref="form4" :model="form4" :rules="importRules">
          <el-form-item label="APT包名称" prop="package" placeholder="请输入APT包名称">
            <el-input v-model="form4.package" />
          </el-form-item>
          <el-form-item label="版本" prop="version">
            <el-input v-model="form4.version" type="textarea" placeholder="请输入包版本" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="imports( 2, 'form4' )">确 定</el-button>
          <el-button @click="dialogForm4Visible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="main" style="margin-bottom:15px;">
      <el-table
        v-loading="listLoading"
        :data="list"
        row-key="fid"
        :element-loading-text="loadingText"
        border
        fit
        highlight-current-row
        margin-bottom="15px"
        lazy
        :load="load"
        :tree-props="{ hasChildren: 'hasChildren'}"
      >
        <el-table-column label="文件名">
          <template slot-scope="scope">
            {{ scope.row.fileInfo.fileName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.fileInfo.fileType === 4"
              type="primary"
              plain
              icon="el-icon-download"
              circle
              @click="download(scope.row.fid, scope.row.fileInfo.fileName)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div align="center">
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

.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-button + .el-dropdown {
  margin-left: 15px;
}
</style>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import { uploadSource, uploadBinary, getCodeList, uploadFile, download, importPypi, importAPT } from '@/api/codehub'
import { getInfo } from '@/api/project'

export default {
  name: 'Dashboard',
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

      dialogForm1Visible: false, // 上传源码文件
      form1: {
        file: '',
        projectName: this.$route.params.id,
        description: ''
      },

      dialogForm2Visible: false, // 上传二进制包
      form2: {
        file: '',
        projectName: this.$route.params.id,
        description: ''
      },
      uploadRules: {
        file: [{ required: true, message: '请选择文件', trigger: 'blur' }],
        description: [{ required: true, message: '标签不能为空', trigger: 'blur' }]
      },

      dialogForm3Visible: false, // 导入Pypi
      form3: {
        userId: Cookies.get('username') === 'admin' ? 1 : 2,
        projectId: this.$route.query.id,
        package: '',
        platform: 'ubuntu',
        version: '',
        deps: false
      },
      osOptions: ['ubuntu', 'macosx_11_0_arm64', 'manylinux1', 'win_amd64'],

      dialogForm4Visible: false, // 导入APT
      form4: {
        userId: Cookies.get('username') === 'admin' ? 1 : 2,
        projectId: this.$route.query.id,
        package: '',
        version: ''
      },
      importRules: { package: [{ required: true, message: '包名不能为空', trigger: 'blur' }] },
      formLabelWidth: '120px',
      currentPage: 1,
      pageSize: 10,
      totalPage: 10,
      loadingText: 'Loading',
      addr: '',
      username: Cookies.get('username')
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      await this.getAddr(this.$route.query.id, this)
      if (typeof (this.addr) !== 'undefined') {
        const formData = new FormData()
        formData.append('id', this.$route.query.id)
        formData.append('fileId', this.addr)
        getCodeList(formData).then(response => {
          this.totalPage = response.data.length
        }).catch(err => {
          console.log(err)
        })
        formData.append('page', this.currentPage)
        formData.append('limit', this.pageSize)
        getCodeList(formData).then(response => {
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].hasChildren = response.data[i].fileInfo.fileType === 3
          }
          this.list = response.data
          this.listLoading = false
        }).catch(err => {
          console.log(err)
          this.listLoading = false
          return false
        })
      } else {
        this.list = []
        this.listLoading = false
      }
    },
    load(tree, treeNode, resolve) {
      const formData = new FormData()
      formData.append('id', this.$route.query.id)
      formData.append('fileId', tree.fid)
      getCodeList(formData).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].hasChildren = response.data[i].fileInfo.fileType === 3
        }
        resolve(response.data)
      }).catch(err => {
        console.log(err)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    uploadSource(formData, _this) {
      _this.dialogForm1Visible = false
      const fileObj = document.getElementsByName('file')[0].files[0]
      const params = new FormData()
      const flieArr = formData.file.split('.')
      const fileSuffix = flieArr[flieArr.length - 1]
      params.append('file', fileObj)
      params.append('projectName', formData.projectName)
      params.append('tag', formData.description)
      params.append('fileType', fileSuffix)
      _this.uploadFile(1, params, _this)
      // uploadSource(params).then(response => {
      //   _this.$message({
      //     type: 'success',
      //     message: '已上传'
      //   })
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    uploadBinary(formData, _this) {
      _this.dialogForm2Visible = false
      const fileObj = document.getElementsByName('file')[0].files[0]
      const params = new FormData()
      params.append('file', fileObj)
      params.append('projectName', formData.projectName)
      params.append('tag', formData.description)
      _this.uploadFile(2, params, _this)
      // uploadBinary(params).then(response => {
      //   _this.$message({
      //     type: 'success',
      //     message: '已上传'
      //   })
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    uploadFile(type, formData, _this) {
      const params = new FormData()
      params.append('id', _this.$route.query.id)
      params.append('file', formData.get('file'))
      params.append('fileName', formData.get('file').name)
      params.append('dtype', type)
      uploadFile(params).catch(err => {
        console.log(err)
      })
    },
    submitSource(formData) {
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          this.$options.methods.uploadSource(formData, this)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitBinary(formData) {
      this.$refs['form2'].validate((valid) => {
        if (valid) {
          this.$options.methods.uploadBinary(formData, this)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange(size) {
      const old = this.pageSize
      this.pageSize = size
      if (!this.fetchData()) {
        this.pageSize = old
      }
    },
    handleCurrentChange(page) {
      const old = this.currentPage
      this.currentPage = page
      if (!this.fetchData()) {
        this.currentPage = old
      }
    },
    download(fileId, name) {
      const params = new FormData()
      params.append('id', this.$route.query.id)
      params.append('name', name)
      params.append('fileId', fileId)
      params.append('dtype', 4)
      download(params).then(response => {
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
    },
    imports(type, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            this.loadingText = '导入中，时间较长，请稍候'
            this.listLoading = true
            importPypi(this.form3).then(response => {
              if (response.data.code !== '200') {
                alert(response.data.message)
              }
              console.log(response)
              this.fetchData()
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              this.listLoading = false
              this.loadingText = 'Loading'
            })
            this.dialogForm3Visible = false
          } else if (type === 2) {
            this.loadingText = '导入中，时间较长，请稍候'
            this.listLoading = true
            importAPT(this.form4).then(response => {
              if (response.data.code !== '200') {
                alert(response.data.message)
              }
              console.log(response)
              this.fetchData()
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              this.listLoading = false
              this.loadingText = 'Loading'
            })
            this.dialogForm4Visible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getAddr(id, _this) {
      await getInfo(id).then(response => {
        _this.addr = response.data.codeAddr
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
