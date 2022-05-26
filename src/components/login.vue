<template>
    <div class='login_container'>

        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区域 -->
            <el-form ref="loginRef" :model="loginform" :rules="loginrules" label-width="0px" class="login_form">
                <el-form-item prop="username">
                    <el-input :prefix-icon="UserFilled" v-model="loginform.username" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon=" Unlock" v-model="loginform.password" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button :plain="true" type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetloginFrom">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>
<script setup>
    import {
        UserFilled,
        Unlock
    } from '@element-plus/icons-vue'
    import {
        reactive,
        ref,
        getCurrentInstance
    } from 'vue'
    import * as api from "@/api/loginHttp.js";
    import {
        ElMessage
    } from 'element-plus'
    import {
        useRouter
    } from 'vue-router';
    //定义数据
    const loginform = reactive({
        username: 'admin',
        password: '123456',
    })

    //验证用户名和密码是否合法
    const loginrules = reactive({
        username: [{
                required: true,
                message: '请输入登录名称',
                trigger: 'blur'
            },
            {
                min: 3,
                max: 5,
                message: '长度在3到10个字符之间',
                trigger: 'blur'
            },
        ],
        password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        }, {
            min: 6,
            max: 10,
            message: '长度在6到10个字符之间',
            trigger: 'blur'
        }, ],
    })

    //定义路由
    const router = useRouter();

    //表单重置
    const loginRef = ref()
    const resetloginFrom = () => {
        loginRef.value.resetFields();
    }

    //登录预验证
    const login = async () => {
        loginRef.value.validate(async (valid) => {
            if (!valid) return
            try {
                const {
                    data: res
                } = await api.getLogin(loginform);
                if (res.meta.status == 200) {
                    ElMessage({
                        message: res.meta.msg,
                        type: "success",
                    });
                    window.sessionStorage.setItem("token", res.data.token)
                    router.push("/home")
                } else {}
            } catch (error) {
                console.log("-----error:", error);
            }
        })
    };
</script>
<style lang='scss'>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .el-form-item__content {
        display: flex;
        justify-content: flex-end;
    }
</style>