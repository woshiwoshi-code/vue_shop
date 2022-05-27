<template>
    <div class=''>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' }">用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="mt-4">
                        <el-input v-model="data.queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable
                            @clear="getUserList">
                            <template #append>
                                <el-button type="primary" @click="getUserList">
                                    <el-icon style="vertical-align: middle">
                                        <Search />
                                    </el-icon>
                                    <span style="vertical-align: middle"> 搜索 </span>
                                </el-button>
                            </template>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="data.addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="data.userList" stripe border tyle="width: 100%">
                <el-table-column type="index" />

                <el-table-column prop="username" label="姓名" width="180" />
                <el-table-column prop="mobile" label="手机号" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="role_name" label="角色" width="180" />
                <el-table-column label="状态" width="180">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                            @change="userStateChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="190">
                    <template v-slot="scope">
                        <el-tooltip class="box-item" effect="dark" content="修改角色" placement="top" :enterable="false">
                            <el-button type="primary" size="small" @click="showEditDialog(scope.row.id)">
                                <el-icon style="vertical-align: middle">
                                    <Edit />
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="删除角色" placement="top" :enterable="false">
                            <el-button type="danger" size="small" @click="deleteDialog(scope.row.id)">
                                <el-icon style="vertical-align: middle">
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" size="small">
                                <el-icon style="vertical-align: middle">
                                    <Setting />
                                </el-icon>
                            </el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination :currentPage="data.queryInfo.pagenum" :page-size="data.queryInfo.pagesize"
                :page-sizes="[5, 7, 9, 11]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" small />
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog v-model="data.addDialogVisible" title="添加用户" width="50%" @close="handleClose">
            <span>
                <el-form ref="addFormRef" :model="data.addForm" :rules="data.addFromRules" label-width="120px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="data.addForm.username" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="data.addForm.password" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="data.addForm.email" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile" number>
                        <el-input v-model="data.addForm.mobile" />
                    </el-form-item>
                </el-form>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.addDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="addUser">确认</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog v-model="data.editdialogVisible" title="修改用户" width="30%" @close="editDialogClose">
            <span>
                <el-form ref="editFromRef" :model="data.editFrom" :rules="data.addFromRules" label-width="100px">
                    <el-form-item label="用户名">
                        <el-input v-model="data.editFrom.username" disabled />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="data.editFrom.email" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="data.editFrom.mobile" />
                    </el-form-item>
                </el-form>

            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.editdialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="editUserInfo()">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
    import * as api from "@/api/loginHttp.js";
    import {
        onBeforeMount,
        reactive,
        ref
    } from 'vue'
    import {
        ElMessage,
        ElMessageBox
    } from 'element-plus'
    onBeforeMount(() => {
        getUserList()
    });
    //自定义校验规则
    //验证邮箱的校验规则
    const checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
        if (regEmail.test(value)) {
            return callback()
        }
        callback(new Error('请输入合法的邮箱'))
    }
    //验证手机号的校验规则
    const checkMobile = (rule, value, callback) => {
        const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (!value) {
            return callback()
        }
        if (regMobile.test(value)) {
            return callback()
        }
        callback(new Error('请输入合法的手机号'))
    }
    const data = reactive({
        //数据列表
        queryInfo: {
            query: '',
            //当前的页数
            pagenum: 1,
            //当前每页显示的数据
            pagesize: 2
        },
        userList: [],
        total: 0,
        //控制添加用户对话框的显示和隐藏
        addDialogVisible: false,
        //添加用户的表单数据
        addForm: {
            username: '',
            password: '',
            email: '',
            mobile: ''
        },
        //添加表单数据的验证规则
        addFromRules: {
            username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                },
                {
                    min: 3,
                    max: 10,
                    message: '用户名的长度在3-10个字符之间',
                    trigger: 'blur'
                },
            ],
            password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                },
                {
                    min: 6,
                    max: 15,
                    message: '密码的长度在6-15个字符之间',
                    trigger: 'blur'
                },
            ],
            email: [{
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                },
                {
                    validator: checkEmail,
                    trigger: 'blur'
                }
            ],
            mobile: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                },
                {
                    validator: checkMobile,
                    trigger: 'blur'
                }
            ],
        },
        //展示修改编辑用户的对话框
        editdialogVisible: false,
        //查询到的用户信息
        editFrom: {}
    })
    //获取角色数据列表
    const getUserList = async () => {
        try {
            const {
                data: res
            } = await api.getUserList({
                params: data.queryInfo
            })
            if (res.meta.status == 200) {

                data.userList = res.data.users
                data.total = res.data.total
            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //监听pagesize改变的事件
    const handleSizeChange = (newSize) => {
        data.queryInfo.pagesize = newSize
        getUserList()
    }
    //监听页码值改变得事件
    const handleCurrentChange = (newPage) => {
        data.queryInfo.pagenum = newPage
        getUserList()
    }
    //用户状态的修改
    const userStateChange = async (userInfo) => {
        try {
            const {
                data: res
            } = await api.getUserStateChange(userInfo)
            if (res.meta.status == 200) {
                ElMessage({
                    message: res.meta.msg,
                    type: "success",
                });

            } else {
                userInfo.mg_state = !userInfo.mg_state
            }
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //重置表单项
    const addFormRef = ref()
    const editFromRef = ref()
    const handleClose = () => {
        addFormRef.value.resetFields()
    }
    const editDialogClose = () => {
        editFromRef.value.resetFields()
    }
    //点击按钮添加新用户
    const addUser = () => {
        addFormRef.value.validate(async valid => {
            if (!valid) return
            //发起添加用户的网络请求
            try {
                const {
                    data: res
                } = await api.getAddUser(data.addForm)
                if (res.meta.status == 201) {
                    ElMessage({
                        message: res.meta.msg,
                        type: "success",
                    });
                    //关闭添加用户对话框
                    data.addDialogVisible = false
                    //重新调用用户列表
                    getUserList()
                } else {}
            } catch (error) {
                console.log("-----error:", error);
            }
        })
    }
    //修改角色
    const showEditDialog = async (id) => {
        data.editdialogVisible = true
        try {
            const {
                data: res
            } = await api.getSearchUser(id)
            if (res.meta.status == 200) {
                data.editFrom = res.data
            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //确认修改
    const editUserInfo = () => {
        editFromRef.value.validate(async valid => {
            if (!valid) return
            //发起修改用户的网络请求
            try {
                const {
                    data: res
                } = await api.getChangeUser(data.editFrom.id, {
                    email: data.editFrom.email,
                    mobile: data.editFrom.mobile,
                })
                if (res.meta.status == 200) {
                    ElMessage({
                        message: res.meta.msg,
                        type: "success",
                    });
                    data.editFrom = res.data
                    //关闭添加用户对话框
                    data.editdialogVisible = false
                    //重新调用用户列表
                    getUserList()
                } else {}
            } catch (error) {
                console.log("-----error:", error);
            }
        })
    }
    //删除角色
    const deleteDialog = async (id) => {
        // const config = await ElMessageBox.confirm(
        //     '此操作将永久删除该用户，确认继续吗',
        //     '删除角色', {
        //         confirmButtonText: '确认',
        //         cancelButtonText: '取消',
        //         type: 'warning',
        //         center: true,
        //     },
        // ).catch(err => err)
        // if (config !== 'confirm') {
        //     ElMessage({
        //         type: 'info',
        //         message: '已取消删除',
        //     })
        // } else {
        //     try {
        //         const {
        //             data: res
        //         } = await api.getDeleteUser(id)
        //         if (res.meta.status == 200) {
        //             ElMessage({
        //                 message: res.meta.msg,
        //                 type: "success",
        //             });
        //             getUserList()
        //         } else {}
        //     } catch (error) {
        //         console.log("-----error:", error);
        //     }
        // }

        ElMessageBox.confirm(
                '此操作将永久删除该用户，确认继续吗?',
                '删除角色', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true,
                },
            )
            .then(async () => {
                try {
                    const {
                        data: res
                    } = await api.getDeleteUser(id)
                    if (res.meta.status == 200) {
                        ElMessage({
                            message: res.meta.msg,
                            type: "success",
                        });
                        getUserList()
                        console.log(res);
                    } else {}
                } catch (error) {
                    console.log("-----error:", error);
                }
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消删除',
                })
            })
    }
</script>
<style lang='scss' scoped>
</style>