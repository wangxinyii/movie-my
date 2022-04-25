<template>
    <div class="setting_container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <!-- 面包屑 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>个人设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-row>
                <el-col :span="16">
                    <el-form
                            ref="form"
                            :model="user"
                            label-width="80px"
                            :rules="formRules"
                    >
                        <el-form-item label="用户名">
                            <el-input v-model="user.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="user.userPwd"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="user.userEmail"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                    type="primary"
                                    :disabled="isDisabled"
                                    @click="onUpdateInfo"
                            >保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :offset="2" :span="4">
                    <label for="file">
                        <el-avatar
                                shape="square"
                                :size="200"
                                fit="cover"
                                :src="user.userHeadimg"
                        ></el-avatar>
                        <p>点击修改图像</p>
                    </label>

                    <input
                            id="file"
                            type="file"
                            hidden
                            ref="file"
                            @change="onFileChange()"
                    >
                    </input>
                </el-col>
            </el-row>
            <el-dialog
                    title="修改头像"
                    :visible.sync="dialogVisible"
                    append-to-body
                    @opened="onDialogOpened"
                    @closed="onDialogClosed"
            >
                <div class="preview-image-wrap">
                    <img
                            class="preview-image"
                            :src="previewPhoto"
                            ref="preview-image"
                    >
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button
                            type="primary"
                            :loading="clickLoading"
                            @click="onUpdatePhoto"
                    >确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>

    import {
        getUserProfile,
        updateUserInfo,
        updateUserPhoto
    } from '@/api/user'
    import Vue from 'vue'
    import axios from 'axios';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    Vue.prototype.$axios = axios;
    import 'cropperjs/dist/cropper.css'
    import Cropper from 'cropperjs'
    import globalBus from '@/utils/global-bus'


    export default {
        name: "SettingIndex",
        data() {
            return {
                user: {
                    email: '',
                    id: null,
                    intro: '',
                    mobile: '',
                    name: '',
                    photo: ''
                },// 用户资料
                isDisabled: false,
                dialogVisible: false,
                previewPhoto: '',
                cropper: null,
                clickLoading: false,

                formRules: {
                    name: [
                        {required: true, message: '标题不能为空', trigger: 'blur'}
                    ],
                    intro: [
                        {required: true, message: '介绍不能为空', trigger: 'blur'}
                    ],
                    userEmail: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {pattern:"^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$",message:"请输入正确的邮箱格式", trigger: "change"}
                    ]
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            loadProfile(){

                var item = window.localStorage.getItem('user');
                this.user = JSON.parse(item);
                console.log(this.user);

                getUserProfile().then(res => {
                    // console.log(res);
                    this.user = res.data.data
                })
            },
            onUpdateInfo(){
                console.log(this.user);
                axios.put('/api/user/updateUser',this.user).then(res => {
                    this.isDisabled = true
                    this.$message({
                        type: 'success',
                        message: '修改信息成功,请重新登录'
                    })
                    this.isDisabled = false
                    this.$router.push({
                        name: 'login'
                    })
                })
            },
            onFileChange() {

                const file = this.$refs.file

                const blobData = window.URL.createObjectURL(file.files[0])
                // console.log(file.files[0]);
                this.previewPhoto = blobData

                this.dialogVisible = true
                // 解决重复文件不弹出问题
                this.$refs.file.value = ''
            },
            onDialogOpened() {
                const image = this.$refs['preview-image']

                this.cropper = new Cropper(image,{
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode:'none',
                    cropBoxResizable: false,
                    background: false,
                    movable: true,


                    crop (event) {
                        console.log(event.detail.x);
                        console.log(event.detail.y);
                        console.log(event.detail.width);
                        console.log(event.detail.height);
                        console.log(event.detail.rotate);
                        console.log(event.detail.scaleX);
                        console.log(event.detail.scaleY);
                    }
                })
            },
            onDialogClosed() { // 对话框关闭销毁裁截器
                this.cropper.destroy()
            },
            onUpdatePhoto() {
                this.cropper?.getCroppedCanvas().toBlob(file => {
                    this.clickLoading = true
                    const fd = new FormData()
                    fd.append('photo',file)
                    // 提交formData
                    axios.post('/api/user/uploadHeadImg',{
                        params: {
                            userId: this.user.userId,
                            userHeadimg: file
                        }
                    }
                        ).then(res => {
                        console.log('???');
                        console.log(res);
                    })
                    // updateUserPhoto(fd).then(res => {
                    //     // console.log(res);
                    //     this.user.photo = res.data.data.photo
                    //     this.$message({
                    //         type: 'success',
                    //         message: '更新成功'
                    //     })
                    //     this.dialogVisible = false
                    //     this.clickLoading = false
                    // })
                })
            }
        },
        created() {
            this.loadProfile()
        }
    }
</script>

<style scoped>

    .preview-image-wrap {

    }

    .preview-image {
        display: block;

        max-width: 100%;

        height: 200px;
    }

</style>