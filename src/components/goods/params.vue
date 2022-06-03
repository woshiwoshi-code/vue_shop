<template>
    <div class=''>
        <!-- 面包屑导航数据 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <el-card>
            <!-- 头部警告区域 -->
            <el-alert title="注意：只允许为第三分类设置相关参数" :closable="false" show-icon type="warning" />

            <!-- 选择商品区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>商品分类：</span>
                    <el-cascader v-model="data.selectedKeys" :options="data.cateList" :props="data.cateProps"
                        @change="CateChanged" clearable />
                </el-col>
            </el-row>

            <!-- 标签页 -->
            <el-tabs v-model="data.activeName" class="demo-tabs" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled='data.disabled' @click="data.addDialogVisible=true">动态参数
                    </el-button>
                    <!-- 动态表格 -->
                    <el-table :data="data.manyparamsList" style="width: 100%" border stripe>
                        <el-table-column type='expand' />
                        <el-table-column type='index' />
                        <el-table-column label="参数名称" prop="attr_name" />
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" size="small">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>编辑
                                </el-button>
                                <el-button type="danger" size="small">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled='data.disabled' @click="data.addDialogVisible=true">静态属性
                    </el-button>
                    <!-- 静态表格 -->
                    <el-table :data="data.onlyparamsList" style="width: 100%" border stripe>
                        <el-table-column type='expand' />
                        <el-table-column type='index' />
                        <el-table-column label="参数名称" prop="attr_name" />
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" size="small" @click="showEditDialog">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>编辑
                                </el-button>
                                <el-button type="danger" size="small">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                </el-tab-pane>

            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog v-model="data.addDialogVisible" :title="data.manyparamsTitle" width="30%" @close="addDialogClosed">
            <span>
                <el-form ref="addFormRef" :model="data.addruleForm" :rules="data.addrules" label-width="120px">
                    <el-form-item :label="data.manyparamsTitle" prop="attr_name">
                        <el-input v-model="data.addruleForm.attr_name" />
                    </el-form-item>
                </el-form>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.addDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addParams">确认</el-button>
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
                name: '参数列表'
            }
        ],
        //商品列表
        cateList: [],
        // 级联选择框的配置项
        cateProps: {
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
        },
        //级联选择框双向绑定的数据
        selectedKeys: [],
        //被激活页签的名称
        activeName: 'many',
        //是否禁用按钮
        disabled: true,
        //动态many数据
        manyparamsList: [],
        //静态only数据
        onlyparamsList: [],
        //添加参数的对话框
        addDialogVisible: false,
        //动态标题为文本框
        manyparamsTitle: '',
        //添加参数的表单对象
        addruleForm: {
            attr_name: ''
        },
        //表单对象的验证规则
        addrules: {
            attr_name: [{
                required: true,
                message: '请输入分类名称',
                trigger: 'blur'
            }]
        },

    });
    onBeforeMount(() => {
        getCateList()
    })
    //获取商品列表
    const getCateList = async () => {
        try {
            const {
                data: res
            } = await api.getCategories()
            if (res.meta.status == 200) {
                data.cateList = res.data

            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //级联选择框的值改变时触发
    const CateChanged = () => {
        if (data.selectedKeys && data.selectedKeys.length !== 3) {
            data.selectedKeys = []
            data.disabled = true
        } else {
            data.disabled = false
            if (data.selectedKeys === null) {
                data.disabled = true
                data.manyparamsList = []
                data.onlyparamsList = []
            }
        }
        if (data.selectedKeys && data.selectedKeys.length === 3) {
            getparams()
        }

    }
    //Tab点击事件的处理函数
    const handleTabClick = () => {
        getparams()

    }
    const getparams = async () => {
        try {
            const {
                data: res
            } = await api.getParamsList(data.selectedKeys[2], data.activeName)
            if (res.meta.status == 200) {
                if (data.activeName === 'many') {
                    data.manyparamsList = res.data
                    data.manyparamsTitle = '添加动态参数'
                } else {
                    data.onlyparamsList = res.data
                    data.manyparamsTitle = '添加静态属性'

                }

            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //关闭对话框触发的事件
    const addDialogClosed = () => {
        proxy.$refs.addFormRef.resetFields()
    }
    //点击按钮添加分类参数
    const addParams = () => {
        proxy.$refs.addFormRef.validate(async valid => {
            if (!valid) {
                return
            }
            try {
                const {
                    data: res
                } = await api.getAddParams(data.selectedKeys[2], data.addruleForm
                    .attr_name, data.activeName)
                if (res.meta.status == 201) {
                    console.log(res.data);
                    getparams()
                } else {
                    ElMessageBox.alert(res.meta.msg)
                }
            } catch (error) {
                console.log("-----error:", error);
            }
        })

    }
</script>
<style lang='scss' scoped>
    .cat_opt {
        margin: 20px 0;
    }
</style>