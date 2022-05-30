<template>
    <div class="common-layout">
        <el-container class="home-container">
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <img src="../assets/logo.png" alt="">
                    <span>电商后台管理系统</span>
                </div>
            </el-header>
            <el-container>
                <!-- 左边栏 -->
                <el-aside :width="data.isCollapse? '64px' :'200px'">
                    <!-- 侧边栏区域 -->
                    <div class="toggle-button" @click="toggleCollap">|||</div>
                    <el-menu background-color="#545c64" class="el-menu-vertical-demo" text-color="#fff" unique-opened
                        :collapse="data.isCollapse" :collapse-transition='false' router
                        :default-active="data.activePath">
                        <!-- 一级菜单 -->
                        <el-sub-menu :index="item.id.toString()" v-for="item in data.menulist" :key="item.id">
                            <!-- 一级菜单的模板 -->
                            <template #title>
                                <!-- <el-icon>
                                    <Fold />
                                </el-icon> -->
                                <el-icon>
                                    <component :is="data.iconObj[item.id]" />
                                </el-icon>
                                <span>{{item.authName}}

                                </span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="items.path" v-for="items in item.children" :key="items.id"
                                @click="saveNavState(items.path)">
                                <template #title>
                                    <el-icon>
                                        <Fold />
                                    </el-icon>
                                    <span>{{items.authName}}
                                    </span>
                                </template>
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <!-- 主体区域 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>
<script setup>
    import * as api from "@/api/homeHttp.js";
    import {
        onBeforeMount,
        reactive,
        getCurrentInstance
    } from 'vue'
    import {
        ElMessage
    } from 'element-plus'
    const {
        proxy
    } = getCurrentInstance()
    onBeforeMount(() => {
        getMenuList()
        data.activePath = window.sessionStorage.getItem('activePath')
    });
    //数据
    const data = reactive({
        //左侧菜单数据
        menulist: [],
        iconObj: {
            '125': 'user',
            '103': 'avatar',
            '101': 'platform',
            '102': 'postcard',
            '145': 'opportunity',
        },
        //是否折叠
        isCollapse: false,
        //保存连接的激活状态
        activePath: ''
    })
    //获取左侧菜单的数据
    const getMenuList = async () => {
        try {
            const {
                data: res
            } = await api.getMenuList();
            if (res.meta.status == 200) {
                data.menulist = res.data
            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //点击按钮，切换菜单的折叠展开
    const toggleCollap = () => {
        data.isCollapse = !data.isCollapse
    }
    //保存连接的激活状态
    const saveNavState = (activePath) => {
        window.sessionStorage.setItem('activePath', activePath)
        data.activePath = activePath
    }
</script>
<style lang='scss' scoped>
    .common-layout {
        height: 100%;
    }

    .home-container {
        height: 100%;

    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        color: #fff;
        font-size: 20px;

        div {
            display: flex;
            align-items: center;
            color: #ccc;

            img {
                width: 45px;
                height: 45px;
            }

            span {
                padding-left: 15px;
            }
        }


    }

    .el-aside {
        background-color: #333744;
        transition: 0.5s;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .toggle-button {
        background-color: #4A5064;
        text-align: center;
        color: #fff;
        font-size: 10px;
        letter-spacing: 0.2em;
        cursor: pointer;
        height: 25px;
        line-height: 25px;
    }
</style>