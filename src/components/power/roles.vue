<template>
    <div class=''>
        <!-- 面包屑导航数据 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片列表 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-button size="large" type="primary">添加角色 </el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table row-key="'id" :data="data.rolesList" stripe border style="width: 100%" highlight-current-row>
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row :class="['bdbottom',index === 0 ? 'bdtop' :'', 'vcenter','ccenter']"
                            v-for="(item,index) in scope.row.children" :key="item.id">
                            <!-- 一级权限 -->
                            <el-col :span="5" :push="1">
                                <el-tag size="large" closable @close="removeRightId(scope.row,item.id)">
                                    {{item.authName}}</el-tag>
                                <el-icon>
                                    <CaretRight />
                                </el-icon>
                            </el-col>
                            <!-- 二，三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[index1 === 0 ? '' :'bdtop','vcenter']"
                                    v-for="(item1,index1) in item.children" :key="item1.id">
                                    <el-col :span="6">
                                        <el-tag size="large" type="success" closable
                                            @close="removeRightId(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                        <el-icon>
                                            <CaretRight />
                                        </el-icon>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag :class="[index2 === 0 ? '' :'bdtop']"
                                            v-for="(item2,index2) in item1.children" :key="item2.id" size="large"
                                            type="warning" closable @close="removeRightId(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" />
                <el-table-column prop="roleName" label="角色名称" />
                <el-table-column prop="roleDesc" label="角色描述" />
                <el-table-column label="操作" width="300px">
                    <template v-slot="scope">
                        <el-button type="primary" size="small">
                            <el-icon style="vertical-align: middle">
                                <Edit />
                            </el-icon>编辑
                        </el-button>
                        <el-button type="danger" size="small">
                            <el-icon style="vertical-align: middle">
                                <Delete />
                            </el-icon>删除
                        </el-button>
                        <el-button type="warning" size="small" @click="showSetRightDialog(scope.row)">
                            <el-icon style="vertical-align: middle">
                                <Setting />
                            </el-icon>分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限的弹窗 -->
        <el-dialog v-model="data.setRightDialog" title="分配权限" width="30%" @close="setRightDialogClosed">
            <span>
                <!-- 树形控件 -->
                <el-tree :data="data.rightsList" :props="data.treeProps" show-checkbox node-key="id" default-expand-all
                    :default-checked-keys="data.defKey" ref="treeRef" />
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.setRightDialog = true">取消</el-button>
                    <el-button type="primary" @click="allotRights">确认</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>
<script setup>
    import breadcrumb from '../../common/Breadcrumb.vue';
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
                name: '权限管理'
            },
            {
                path: '',
                name: '角色列表'
            }
        ],
        //角色列表
        rolesList: [],
        //控制分配权限的对话框是否显示
        setRightDialog: false,
        //所有权限的数据
        rightsList: [],
        //树形控件的属性绑定对象
        treeProps: {
            children: 'children',
            label: 'authName',
        },
        defKey: [],
        // 当前即将分配角色权限的id
        roleId: '',
    });
    //生命周期钩子函数
    onBeforeMount(() => {
        getRolesList()

    })
    //获取角色列表
    const getRolesList = async () => {
        try {
            const {
                data: res
            } = await proxy.$api.getRolesList()
            if (res.meta.status == 200) {
                data.rolesList = res.data

            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //根据id删除权限
    const removeRightId = (role, rightid) => {
        //弹框提示
        ElMessageBox.confirm(
                '此操作将永久删除该权限，是否继续?',
                '操作权限', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(async () => {
                try {
                    const {
                        data: res
                    } = await proxy.$api.getRolesRights(role.id, rightid)
                    if (res.meta.status == 200) {
                        ElMessage({
                            message: res.meta.msg,
                            type: "success",
                        });
                        role.children = res.data
                    } else {}
                } catch (error) {
                    console.log("-----error:", error);
                }
            })
            .catch((res) => {
                ElMessage({
                    type: 'info',
                    message: '已取消删除该权限',
                })
                console.log(res);

            })
    }
    //展示分配权限的弹框
    const showSetRightDialog = async (role) => {
        data.roleId = role.id
        data.setRightDialog = true
        try {
            const {
                data: res
            } = await proxy.$api.getRightsList('tree')
            if (res.meta.status == 200) {
                data.rightsList = res.data
                // 递归获取到的三级节点
                getLeafKey(role, data.defKey)
            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }

    }
    //通过递归的形式，获取角色下三级权限的id并保存到 defKey中
    const getLeafKey = (node, arr) => {
        //如果当前节点不包含children属性,则是三级节点
        if (!node.children) {
            return arr.push(node.id)

        }
        node.children.forEach(item => {
            getLeafKey(item, arr)
        });
    }
    //关闭对话框
    const setRightDialogClosed = () => {
        data.defKey = []
    }
    //点击为角色列表中的分配权限按钮
    const allotRights = async () => {
        //获取角色分配的权限id
        const keys = [
            ...proxy.$refs.treeRef.getCheckedKeys(),
            ...proxy.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        try {
            const {
                data: res
            } = await proxy.$api.getAllotRights(data.roleId, idStr)
            if (res.meta.status == 200) {
                ElMessage({
                    message: res.meta.msg,
                    type: "success",
                });
                getRolesList()
                data.setRightDialog = false

            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
        console.log(data.roleId);


    }
</script>
<style lang='scss' scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }

    .ccenter {
        display: flex;
        justify-content: center;
    }
</style>