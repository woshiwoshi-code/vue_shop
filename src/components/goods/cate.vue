<template>
    <div class=''>
        <!-- 面包屑导航数据 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片试图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" size="large" @click="showAddCateDialog">添加分类</el-button>
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
                        <el-tag size="small" v-if="scope.row.cat_level===0">一级</el-tag>
                        <el-tag class="ml-2" type="success" size="small" v-else-if="scope.row.cat_level===1">二级
                        </el-tag>
                        <el-tag class="ml-2" type="danger" size="small" v-else>三级</el-tag>
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


        <!-- 添加分类的对话框 -->
        <el-dialog v-model="data.addCateDialogVisible" title="添加分类" width="30%" @close="addCateDialogClose">
            <span>
                <el-form ref="addCateFormRef" :model="data.addCateForm" :rules="data.addCaterules">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="data.addCateForm.cat_name" />
                    </el-form-item>
                    <el-form-item label="父级分类：">
                        <!-- props用来指定配置对象 -->
                        <el-cascader v-model="data.selectedKeys" :options="data.parentCateList"
                            :props="data.cascaderProps" @change="parentCateChanged" clearable />

                    </el-form-item>

                </el-form>

            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.addCateDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addCate">确认</el-button>
                </span>
            </template>
        </el-dialog>
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
        //控制添加分类对话框的显示
        addCateDialogVisible: false,
        //添加分类的表单数据对象
        addCateForm: {
            cat_name: '',
            cat_pid: 0,
            cat_level: 0,
        },
        //添加分类的表单验证规则
        addCaterules: {
            cat_name: [{
                required: true,
                message: '请输入分类名称',
                trigger: 'blur'
            }]
        },
        // 父级分类的列表
        parentCateList: [],
        //指定级联选择器的配置对象
        cascaderProps: {
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
        },
        //级联选择框双向绑定的数据
        selectedKeys: [],

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
    //对话框的显示
    const showAddCateDialog = () => {
        getParentCateList()
        data.addCateDialogVisible = true
    }
    //获取父级分类的数据列表
    const getParentCateList = async () => {
        try {
            const {
                data: res
            } = await api.getCategories({
                type: 2
            })
            if (res.meta.status == 200) {
                data.parentCateList = res.data

            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //监听父级分类的变化
    const parentCateChanged = () => {
        if (data.selectedKeys && data.selectedKeys.length > 0) {
            data.addCateForm.cat_pid = data.selectedKeys[data.selectedKeys.length - 1]
            data.addCateForm.cat_level = data.selectedKeys.length
            return
        } else {
            data.addCateForm.cat_pid = 0
            data.addCateForm.cat_level = 0
        }


    }
    //点击按钮添加新的分类
    const addCate = async () => {
        try {
            const {
                data: res
            } = await api.getAddCategories(data.addCateForm)
            if (res.meta.status == 201) {
                data.addCateDialogVisible = false
                getCateList()
                ElMessage.success('添加成功')
            } else {
                ElMessage.error(res.meta.msg)
            }
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //关闭对话框重置表单数据
    const addCateDialogClose = () => {
        proxy.$refs.addCateFormRef.resetFields()
        data.selectedKeys = []
        data.addCateForm.cat_pid = 0
        data.addCateForm.cat_level = 0
    }
</script>
<style lang='scss'>
    .el-cascader {
        width: 100%;
    }
</style>