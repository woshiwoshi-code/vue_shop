<template>
    <div class=''>
        <!-- 面包屑导航 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="data.queryInfo.query" placeholder="Please Input" :suffix-icon="Search" clearable
                        change="RemoveInp" />
                </el-col>

            </el-row>


            <!-- 表格 -->
            <el-table :data="data.orderlist" style="width: 100%; margin-bottom: 20px" row-key="order_id" stripe border>
                <el-table-column type="index" label="#" />
                <el-table-column label="订单编号" prop="order_number" />
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间">
                    <template #default="scope">
                        {{dateFormat(scope.row.create_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template v-slot="scope">
                        <el-button type="primary" @click="showBox">
                            <el-icon>
                                <Edit />
                            </el-icon>
                        </el-button>
                        <el-button type="success" @click="showProgressBox">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </el-button>
                    </template>

                </el-table-column>

            </el-table>

            <!-- 分页 -->
            <el-pagination :currentPage="data.queryInfo.pagenum" :page-size="data.queryInfo.pagesize"
                :page-sizes="[5, 10, 15]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" small />
        </el-card>


        <!-- 修改地址对话框 -->
        <el-dialog v-model="data.addressDialogVisible" title="修改地址" width="30%" @close="addressDialogClose">
            <span>
                <el-form ref="addressFormRef" :model="data.addressruleForm" :rules="data.addressrules"
                    label-width="120px">
                    <el-form-item label="省市区/县" prop="address1">
                        <el-cascader :options="data.cityData" v-model="data.addressruleForm.address1" @change="">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="data.addressruleForm.address2" />
                    </el-form-item>
                </el-form>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.addressDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addressDialogVisible =false">确认</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 展示物流进度对话框 -->
        <el-dialog v-model="data.progressDialogVisible" title="物流进度" width="30%" @close="progressDialogClose">
            <span>
                <!-- 时间线 -->
                <el-timeline>
                    <el-timeline-item v-for="(item,index) in data.logistics" :key="index" :timestamp="item.time"
                        placement="top">
                        <el-card>
                            {{item.context}}
                        </el-card>
                    </el-timeline-item>
                </el-timeline>

            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.progressDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="progressDialogVisible =false">确认</el-button>
                </span>
            </template>
        </el-dialog>


    </div>
</template>
<script setup>
    import breadcrumb from '../../common/Breadcrumb.vue';
    import * as api from "@/api/orderHttp.js";
    import cityData from "@/utils/citydata.js";
    import {
        Search
    } from '@element-plus/icons-vue'
    import {
        onBeforeMount,
        reactive,
        getCurrentInstance,
        ref,
        nextTick,
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
                name: '订单管理'
            },
            {
                path: '',
                name: '订单列表'
            }
        ],
        //查询对象
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 10
        },
        //订单列表
        orderlist: [],
        //总页数
        total: 0,
        //修改地址对话框
        addressDialogVisible: false,
        progressDialogVisible: false,
        addressruleForm: {
            address1: [],
            address2: ''
        },
        //验证规则
        addressrules: {
            address1: [{
                required: true,
                message: '请选择省市区/县',
                trigger: 'blur'
            }],
            address2: [{
                required: true,
                message: '请填写详细地址',
                trigger: 'blur'
            }]
        },
        // 城市信息
        cityData,
        //物流信息
        logistics: [{
                "time": "2018-05-10 09:39:00",
                "ftime": "2018-05-10 09:39:00",
                "context": "已签收,感谢使用顺丰,期待再次为您服务",
                "location": ""
            },
            {
                "time": "2018-05-10 08:23:00",
                "ftime": "2018-05-10 08:23:00",
                "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                "location": ""
            },
            {
                "time": "2018-05-10 07:32:00",
                "ftime": "2018-05-10 07:32:00",
                "context": "快件到达 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-10 02:03:00",
                "ftime": "2018-05-10 02:03:00",
                "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-09 23:05:00",
                "ftime": "2018-05-09 23:05:00",
                "context": "快件到达 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 21:21:00",
                "ftime": "2018-05-09 21:21:00",
                "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 13:07:00",
                "ftime": "2018-05-09 13:07:00",
                "context": "顺丰速运 已收取快件",
                "location": ""
            },
            {
                "time": "2018-05-09 12:25:03",
                "ftime": "2018-05-09 12:25:03",
                "context": "卖家发货",
                "location": ""
            },
            {
                "time": "2018-05-09 12:22:24",
                "ftime": "2018-05-09 12:22:24",
                "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                "location": ""
            },
            {
                "time": "2018-05-08 21:36:04",
                "ftime": "2018-05-08 21:36:04",
                "context": "商品已经下单",
                "location": ""
            }
        ],
    })
    onBeforeMount(() => {
        getOrderList()
    })
    const getOrderList = async () => {
        try {
            const {
                data: res
            } = await api.getOrderList(data.queryInfo)
            if (res.meta.status == 200) {
                data.orderlist = res.data.goods
                data.total = res.data.total
                console.log(res);
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
    //分页改变
    const handleSizeChange = (val) => {
        data.queryInfo.pagesize = val
        getOrderList()
    }
    const handleCurrentChange = (val) => {
        data.queryInfo.pagenum = val
        getOrderList()
    }
    //查询
    const RemoveInp = () => {
        getOrderList()
    }
    //修改地址对话框
    const showBox = () => {
        data.addressDialogVisible = true
    }
    const showProgressBox = async () => {
        data.progressDialogVisible = true
    }
    //关闭清空对话框
    const addressDialogClose = () => {

        proxy.$refs.addressFormRef.resetFields()
    }
</script>
<style lang='scss' scoped>
</style>