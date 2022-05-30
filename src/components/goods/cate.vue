<template>
    <div class=''>
        <!-- 面包屑导航数据 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片试图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" size="large">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="data.cateList" style="width: 100%; margin-bottom: 20px" row-key="cat_id" stripe border>
                <el-table-column type="index" label="#">
                    <template v-slot="scope">
                        {{scope.row.index}}
                    </template>
                </el-table-column>
                <el-table-column prop="cat_name" label="分类名称" sortable />
                <el-table-column label="是否有效" sortable>
                    <template v-slot="scope">
                        <el-button type="success" size='small' circle v-if="scope.row.cat_deleted ===false">
                            <el-icon>
                                <Check />
                            </el-icon>
                        </el-button>
                        <el-button type="danger" circle v-else size='small'>
                            <el-icon>
                                <CloseBold />
                            </el-icon>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="排序" sortable>
                    <template v-slot="scope">
                        <el-tag size="'mini" v-if="scope.row.cat_level===0">一级</el-tag>
                        <el-tag class="ml-2" type="success" size="'mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                        <el-tag class="ml-2" type="danger" size="'mini" v-else>三级</el-tag>
                    </template>

                </el-table-column>
                <el-table-column label="操作" sortable width="180">
                    <template v-slot="scope">
                        <el-button type="primary">
                            <el-icon>
                                <Edit />
                            </el-icon>编辑
                        </el-button>
                        <el-button type="danger">
                            <el-icon>
                                <Delete />
                            </el-icon>删除
                        </el-button>
                    </template>

                </el-table-column>

            </el-table>

            <!-- 分页 -->
            <el-pagination :currentPage="data.queryInfo.pagenum" :page-size="data.queryInfo.pagesize"
                :page-sizes="[3, 5, 10, 15]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" small />
        </el-card>
    </div>
</template>
<script setup>
    import breadcrumb from '../../common/Breadcrumb.vue';
    import * as api from "@/api/goodsHttp.js";
    import {
        onBeforeMount,
        reactive,
        getCurrentInstance,
        ref
    } from 'vue'
    import {
        ElMessage,
        ElMessageBox
    } from 'element-plus'
    const {
        proxy,
    } = getCurrentInstance()
    const data = reactive({
        //面包屑导航数据
        breadcrumb: [{
                path: '/home',
                name: '首页'
            },
            {
                path: '',
                name: '商品管理'
            },
            {
                path: '',
                name: '商品分类'
            }
        ],
        //商品列表
        cateList: [],
        //查询条件
        queryInfo: {
            pagenum: 1,
            pagesize: 5,
        },
        //总页数
        total: 0,
    });
    onBeforeMount(() => {
        getCateList()
    })
    //获取商品列表
    const getCateList = async () => {
        try {
            const {
                data: res
            } = await api.getCategories(data.queryInfo)
            if (res.meta.status == 200) {
                data.cateList = res.data.result
                data.total = res.data.total
                for (let i = 0; i < data.cateList.length; i++) {
                    data.cateList[i].index = i + 1;
                }
                console.log(data.cateList);
            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //监听pagesize事件
    const handleSizeChange = (NewSize) => {
        data.queryInfo.pagesize = NewSize
        getCateList()
    }
    //监听pagenum事件
    const handleCurrentChange = (NewPage) => {
        data.queryInfo.pagenum = NewPage
        getCateList()
    }
</script>
<style lang='scss' scoped>
</style>