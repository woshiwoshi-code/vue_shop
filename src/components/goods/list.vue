<template>
    <div class=''>
        <!-- 面包屑导航数据 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="data.queryInfo.query" placeholder="Please Input" :suffix-icon="Search" clearable
                        @change='removeInp' />
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <el-table :data="data.goodsList" border style="width: 100%">
                <el-table-column type="index" />
                <el-table-column prop="goods_name" label="商品名称">
                </el-table-column>
                <el-table-column prop="goods_price" label="商品价格">
                </el-table-column>
                <el-table-column prop="goods_weight" label="商品重量">
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间">
                    <template #default="scope">
                        {{dateFormat(scope.row.add_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary">
                            <el-icon>
                                <Edit />
                            </el-icon>编辑
                        </el-button>
                        <el-button type="danger" @click="removeById(scope.row.goods_id)">
                            <el-icon>
                                <Delete />
                            </el-icon>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination v-model:currentPage="data.queryInfo.pagenum" v-model:page-size="data.queryInfo.pagesize"
                :page-sizes="[3, 5, 10, 15]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>
<script setup>
    import breadcrumb from '../../common/Breadcrumb.vue';
    import * as api from "@/api/goodsHttp.js";
    import {
        Search
    } from '@element-plus/icons-vue'
    import {
        onBeforeMount,
        reactive,
        getCurrentInstance,
        ref,
        nextTick,
        computed,
    } from 'vue'
    import {
        ElMessage,
        ElMessageBox,
    } from 'element-plus'
    const {
        proxy
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
                name: '商品列表'
            }
        ],
        //查询参数对象
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 5,
        },
        //总页数
        total: 0,
        //商品列表
        goodsList: []
    })
    onBeforeMount(() => {
        getGoodsList()
    })

    //获取商品列表
    const getGoodsList = async () => {
        try {
            const {
                data: res
            } = await api.getGoodsList(data.queryInfo)
            if (res.meta.status == 200) {
                data.goodsList = res.data.goods
                data.total = res.data.total

            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //时间格式化
    const dateFormat = (originVal) => {
        const dt = new Date(originVal)

        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        const d = (dt.getDate() + 1 + '').padStart(2, '0')

        const hh = (dt.getHours() + '').padStart(2, '0')
        const mm = (dt.getMinutes() + '').padStart(2, '0')
        const ss = (dt.getSeconds() + '').padStart(2, '0')

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    //监听pagesize事件
    const handleSizeChange = (NewSize) => {
        data.queryInfo.pagesize = NewSize
        getGoodsList()
    }
    //监听pagenum事件
    const handleCurrentChange = (NewPage) => {
        data.queryInfo.pagenum = NewPage
        getGoodsList()
    }
    //离开搜索框
    const removeInp = () => {
        getGoodsList()
    }
    //删除商品
    const removeById = (id) => {
        ElMessageBox.confirm('确定删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            try {
                const {
                    data: res
                } = await api.getRemoveGoods(id)
                if (res.meta.status == 200) {
                    ElMessage({
                        type: 'success',
                        message: res.meta.msg
                    })
                    getGoodsList()
                } else {}
            } catch (error) {
                console.log("-----error:", error);
            }
        }).catch(() => {
            ElMessage.info('已取消删除')
        })
    }
    //添加商品
    const goAddpage = () => {
        const {
            $router
        } = proxy
        $router.push({
            path: '/goods/add'
        })
    }
</script>
<style lang='scss' scoped>
</style>