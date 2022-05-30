<template>
    <div class=''>
        <!-- 面包屑导航 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-table :data="data.rightsList" stripe border style="width: 100%" highlight-current-row>
                <el-table-column type="index" />
                <el-table-column prop="authName" label="权限名称" />
                <el-table-column prop="path" label="路径" />
                <el-table-column prop="level" label="权限等级">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
                        <el-tag v-else="scope.row.level==='2'" type="danger">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script setup>
    import * as api from "@/api/rolesHttp.js";

    import breadcrumb from '../../common/Breadcrumb.vue';
    import {
        onBeforeMount,
        reactive,
        getCurrentInstance
    } from 'vue'
    const {
        proxy
    } = getCurrentInstance()
    //生命周期钩子函数
    onBeforeMount(() => {
        getRightsList()
    })
    const data = reactive({
        //面包屑导航数据
        breadcrumb: [{
                path: '/home',
                name: '首页'
            },
            {
                path: '',
                name: '权限管理'
            },
            {
                path: '',
                name: '权限列表'
            }
        ],
        //权限列表
        rightsList: [],
    });
    //获取权限列表
    const getRightsList = async () => {
        try {
            const {
                data: res
            } = await api.getRightsList('list')
            if (res.meta.status == 200) {
                data.rightsList = res.data
            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }

    }
</script>
<style lang='scss' scoped>
</style>