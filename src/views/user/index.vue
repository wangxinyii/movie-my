<template>
  <div class="dashboard-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="header">
          <el-button type="success" @click="dialogVisible = true">添加用户</el-button>
          <div class="header-lift">
            <el-input style="width: 230px" v-model="input" placeholder="请输入用户名"></el-input>
            <el-button icon="el-icon-search" @click="search">搜索</el-button>
          </div>
        </div>
      </div>
      <template>
        <el-table
          :data="userList"
          style="width: 100%"
          :default-sort = "{prop: 'userId'}"
        >
          <el-table-column
            prop="userId"
            label="用户ID"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="userPwd"
            label="密码">
          </el-table-column>
          <el-table-column
            prop="userPhone"
            label="手机号"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="userEmail"
            label="邮箱"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="userRole"
            label="用户权限"
            sortable
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                circle
                icon="el-icon-edit"
                type="primary"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                circle
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 列表分页 -->
        <el-pagination
          style="padding-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[10, 20,30, 40, 50]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          background
        >
        </el-pagination>
      </template>
      <el-dialog
        class="dialog-my"
        title="添加用户"
        append-to-body
        :visible.sync="dialogVisible"
        width="30%"
        @opened="onDialogOpened"
        @closed="onDialogClosed"
      >

        <el-form ref="formName" :model="user" label-width="80px" :rules="formRules">
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model="user.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="user.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPwd">
            <el-input v-model="user.userPwd"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model="user.userEmail"></el-input>
          </el-form-item>


        </el-form>

        <span slot="footer" class="dialog-footer">
    <el-button
      @click="dialogVisible = false"
    >取 消</el-button>
    <el-button
      type="primary"
      @click="onUpdateUser"
    >确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  findAllUserInfos,
  findAllUserByPage,
  addUser,
  findUserLikeName,
  findAllUserBySplitPage
} from '@/api/user'

export default {
  name: 'UserIndex',
  data() {
    return {
      userList: [],
      input: '',
      totalCount: 0,
      pageSize: 10,
      page: 1,
      loading: false,
      dialogVisible: false,
      user: {
        userPhone: '',
        userName: '',
        userPwd: '',
        userEmail: ''
      },
      formRules: {
        userPhone: [
          {required: true, message: '请输入手机号', trigger: 'change'},
          {pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change'}
        ],
        userName: [
          {required: true, message: '用户名不能为空', trigger: 'change'}
        ],
        userPwd: [
          {required: true, message: '密码不能为空', trigger: 'change'},
          {pattern: /^\w+\d+$/, message: '密码至少包含数字、字符', trigger: 'change'}
        ],
        userEmail: [
          {required: true, message: '邮箱不能为空', trigger: 'change'},
          {pattern: /^\w+@\w+.\w+$/, message: '邮箱格式不正确', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      findAllUserInfos().then(res => {
        this.totalCount = res.data.length
      })
      findAllUserByPage(this.page, this.pageSize).then(res => {
        const { data } = res
        this.userList = data
      })
    },
    handleSizeChange(size) {
      this.pageSize(size)
      findAllUserByPage(this.page, size).then(res => {
        const { data } = res
        this.userList = data
      })
    },
    handleCurrentChange(page) {
      this.page = page
      findAllUserByPage(page, this.pageSize).then(res => {
        const { data } = res
        this.userList = data
      })
    },
    onDialogOpened() {
      this.dialogVisible = true
    },
    onDialogClosed() {
      this.$refs['formName'].clearValidate()
      this.dialogVisible = false
    },
    onUpdateUser() {
      addUser(this.user).then(res => {
        const { mag } = res
        console.log(mag)
        if(mag === '添加成功') {
          this.$message("添加成功")
          this.dialogVisible = false
        }else {
          this.$message("添加失败")
        }
      })
    },
    search() {
      findAllUserBySplitPage(this.page, this.pageSize, this.input).then(res => {
        const { data } = res
        this.totalCount = data.length
        this.userList = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  .header-lift {
    display: flex;

  }
}
.dialog-my {
  width: 100%;
}
</style>
