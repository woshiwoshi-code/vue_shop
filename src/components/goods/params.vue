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
                    <el-table :data="data.manyparamsList" row-key="attr_id" style="width: 100%" border stripe>
                        <el-table-column type='expand'>
                            <template #default="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item.index" closable
                                    @close="handleClose(index,scope.row)">{{item}}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="ml-1 w-20" v-if="scope.row.inputVisible" ref="InputRef"
                                    v-model="scope.row.inputValue" @keyup.enter="$event.target.blur()"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button v-else class="button-new-tag ml-1" @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type='index' />
                        <el-table-column label="参数名称" prop="attr_name" />
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" size="small" @click="showEditDialog(scope.row.attr_id)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>编辑
                                </el-button>
                                <el-button type="danger" size="small" @click="removeEditDialog(scope.row.attr_id)">
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
                    <el-table :data="data.onlyparamsList" row-key="attr_id" style="width: 100%" border stripe>
                        <el-table-column type='expand'>
                            <template #default="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item.index" closable
                                    @close="handleClose(index,scope.row)">{{item}}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="ml-1 w-20" v-if="scope.row.inputVisible" ref="InputRef"
                                    v-model="scope.row.inputValue" @keyup.enter="$event.target.blur()"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button v-else class="button-new-tag ml-1" @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type='index' />
                        <el-table-column label="参数名称" prop="attr_name" />
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" size="small" @click="showEditDialog(scope.row.attr_id)">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>编辑
                                </el-button>
                                <el-button type="danger" size="small" @click="removeEditDialog(scope.row.attr_id)">
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
        <el-dialog v-model="data.addDialogVisible" :title="'添加'+data.manyparamsTitle" width="30%"
            @close="addDialogClosed">
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

        <!-- 修改参数的对话框 -->
        <el-dialog v-model="data.editDialogVisible" :title="'修改'+data.manyparamsTitle" width="30%">
            <span>
                <el-form ref="editFormRef" :model="data.editruleForm" :rules="data.editrules" label-width="120px">
                    <el-form-item :label="data.manyparamsTitle" prop="attr_name">
                        <el-input v-model="data.editruleForm.attr_name" />
                    </el-form-item>
                </el-form>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="editParams">确认</el-button>
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
        ref,
        nextTick
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
        //控制修改对话框的显示与隐藏
        editDialogVisible: false,
        //修改的表单对象
        editruleForm: {},
        // 修改的表单验证规则
        editrules: {
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
            data.manyparamsList = []
            data.onlyparamsList = []
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
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                    //控制文本框的显示于隐藏
                    item.inputVisible = false
                    item.inputValue = ''
                })

                if (data.activeName === 'many') {
                    data.manyparamsList = res.data
                    data.manyparamsTitle = '动态参数'
                } else {
                    data.onlyparamsList = res.data
                    data.manyparamsTitle = '静态属性'

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
                    data.addDialogVisible = false
                    getparams()
                } else {
                    ElMessageBox.alert(res.meta.msg)
                }
            } catch (error) {
                console.log("-----error:", error);
            }
        })

    }
    //点击按钮，展示修改对话框
    const showEditDialog = async (id) => {
        data.editDialogVisible = true
        //查询当前参数的信息
        try {
            const {
                data: res
            } = await api.getEditParmas(data.selectedKeys[2], id, data.activeName)
            if (res.meta.status == 200) {
                data.editruleForm = res.data
            } else {
                ElMessageBox.alert(res.meta.msg)
            }
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //重置修改的表单
    const resetEditForm = () => {
        proxy.$refs.editFormRef.resetFields()
    }
    //点击按钮修改参数信息
    const editParams = () => {
        proxy.$refs.editFormRef.validate(async valid => {
            if (!valid) {
                return
            }
            try {
                const {
                    data: res
                } = await api.getPutEditParmas(data.selectedKeys[2], data.editruleForm
                    .attr_id, data.editruleForm.attr_name, data.activeName)
                if (res.meta.status == 200) {
                    getparams()
                    data.editDialogVisible = false
                } else {
                    ElMessageBox.alert(res.meta.msg)
                }
            } catch (error) {
                console.log("-----error:", error);
            }
        })

    }
    //展示删除对话框
    const removeEditDialog = async (id) => {
        ElMessageBox.confirm(
                '此操作将永久删除该参数，确认继续吗?',
                '删除参数', {
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
                    } = await api.getDeleteParmas(data.selectedKeys[2], id)
                    if (res.meta.status == 200) {
                        getparams()

                    } else {
                        ElMessageBox.alert(res.meta.msg)
                    }
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
    //文本框失去焦点或按下Enter键时触发
    const handleInputConfirm = (row, e) => {
        if (row.inputValue.trim().length === 0) {
            row.inputValue = ''
            row.inputVisible = false
        }
        //拿到当前行的输入的内容
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        saveAttrVals(row)

    }
    //点击按钮展示文本输入框
    const showInput = (row) => {
        row.inputVisible = true
        nextTick(() => {
            proxy.$refs.InputRef.focus()

        })
    }
    const saveAttrVals = async (row) => {
        try {
            const {
                data: res
            } = await api.getEdit(data.selectedKeys[2], row.attr_id, row.attr_name, row.attr_sel, row
                .attr_vals.join(','))
            if (res.meta.status == 200) {
                ElMessage({
                    showClose: true,
                    message: res.meta.msg,
                    type: 'success',
                })
                getparams()


            } else {
                ElMessageBox.alert(res.meta.msg)
            }
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //删除参数
    const handleClose = (index, row) => {
        row.attr_vals.splice(index, 1)
        saveAttrVals(row)
    }
</script>
<style lang='scss' scoped>
    .cat_opt {
        margin: 20px 0;
    }

    .el-tag {
        margin: 15px
    }

    .button-new-tag {
        margin: 15px;
    }

    .w-20 {
        margin: 15px;
        width: 120px;
    }
</style>