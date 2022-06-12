<template>
    <div class=''>
        <!-- 面包屑导航数据 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon />
            <!-- 步骤条区域 -->
            <el-steps :active="data.activeIndex - 0" align-center finish-status="success">
                <el-step title="基本信息" description="Some description" />
                <el-step title="商品参数" description="Some description" />
                <el-step title="商品属性" description="Some description" />
                <el-step title="商品图片" description="Some description" />
                <el-step title="商品内容" description="Some description" />
                <el-step title="完成" description="Some description" />
            </el-steps>
            <!-- 标签页 -->
            <el-form ref="ruleFormRef" :model="data.addForm" :rules="data.addrules" label-width="120px" status-icon
                label-position="top">
                <el-tabs v-model="data.activeIndex" tab-position="left" :before-leave="beforeTabLeave"
                    @tab-click="tabClickChange">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="data.addForm.goods_name" />
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="data.addForm.goods_price" type="number" />
                        </el-form-item>
                        <el-form-item label="商品库存" prop="goods_number">
                            <el-input v-model="data.addForm.goods_number" />
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="data.addForm.goods_weight" type="number" />
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="data.addForm.goods_cat" :options="data.cateList"
                                :props="data.cateprops" @change="handleChange" />
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in data.paramsList" :key="item.attr_id" :label="item.attr_name"
                            prop="goods_param">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border v-for="(item1,index) in item.attr_vals" :key="item.index"
                                    :label="item1" />
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="(item,index) in data.paramsList" :key="item.attr_id"
                            :label="item.attr_name">
                            <el-input v-model="item.attr_vals" />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload :action="data.upload" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture-card" :headers="data.headersObj" :on-success="handleSuccess">
                            <el-button type="primary">上传图片</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    jpg/png files with a size less than 500kb
                                </div>
                            </template>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <vue3-tinymce v-model="data.addForm.goods_introduce" :setting="data.setting" />
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

        </el-card>


        <!-- 图片预览 -->
        <el-dialog v-model="data.previewDialogVisible" title="图片预览">
            <img :src="data.previewPath" alt="" class="previewImg">
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
                name: '商品管理'
            },
            {
                path: '',
                name: '添加商品'
            }
        ],
        activeIndex: "0",
        //添加商品表单数据
        addForm: {
            goods_name: '',
            goods_price: 0,
            goods_number: 0,
            goods_weight: 0,
            //商品所属的分类数组
            goods_cat: [],
            pics: [],
            //商品详情描述
            goods_introduce: '',
            attrs: []
        },
        //验证规则
        addrules: {
            goods_name: [{
                required: true,
                message: '请输入商品名称',
                trigger: 'blur'
            }],
            goods_price: [{
                required: true,
                message: '请输入商品价格',
                trigger: 'blur'
            }],
            goods_number: [{
                required: true,
                message: '请输入商品库存',
                trigger: 'blur'
            }],
            goods_weight: [{
                required: true,
                message: '请输入商品重量',
                trigger: 'blur'
            }],
            goods_cat: [{
                required: true,
                message: '请选择商品分类',
                trigger: 'blur'
            }],

        },
        //商品分类列表
        cateList: [],
        //级联选择器的配置
        cateprops: {
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
        },
        //动态参数列表
        paramsList: [],
        //商品参数传参数
        manyList: '',
        //上传图片的路径
        upload: 'http://127.0.0.1:8888/api/private/v1/upload',
        headersObj: {
            Authorization: window.sessionStorage.getItem('token')
        },
        previewPath: '',
        previewDialogVisible: false,
        // 富文本 editor 配置项
        setting: {
            height: 190,
            toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
            toolbar_drawer: 'sliding',
            quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
            plugins: 'link image media table lists fullscreen quickbars',
            fontsize_formats: '12px 14px 16px 18px',
            default_link_target: '_blank',
            link_title: false,
            nonbreaking_force_tab: true,
            // 以中文简体为例
            language: 'zh_CN',
            language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js'
        },
    })
    onBeforeMount(() => {
        getCateList()
    })
    //获取商品分类列表
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
    //级联选择器的改变事件
    const handleChange = () => {
        if (data.addForm.goods_cat && data.addForm.goods_cat.length !== 3) {
            data.addForm.goods_cat = []
        }
    }
    //切换Tab
    const beforeTabLeave = (activeName, oldActiveName) => {
        if (oldActiveName === '0' && data.addForm.goods_cat.length !== 3) {
            ElMessage({
                message: '请选择商品分类',
                type: 'warning'
            })
            return false
        }

    }
    //点击获取参数列表
    const tabClickChange = () => {
        if (data.activeIndex === '1') {
            data.manyList = 'many'
            getParamsList()
        } else if (data.activeIndex === '2') {
            data.manyList = 'only'
            getParamsList()
        }

    }
    //获取商品参数列表
    const getParamsList = async () => {
        try {
            const {
                data: res
            } = await api.getParamsList(data.addForm.goods_cat[2], data.manyList)
            if (res.meta.status == 200) {
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                })
                data.paramsList = res.data

            } else {}
        } catch (error) {
            console.log("-----error:", error);
        }
    }
    //处理图片预览效果
    const handlePreview = (file) => {
        data.previewPath = file.response.data.url
        data.previewDialogVisible = true
    }
    //处理移除图片
    const handleRemove = (file) => {
        const filePath = file.response.data.tmp_path
        data.addForm.pics.splice(data.addForm.pics.findIndex(x => x.pic === filePath), 1)
    }
    //监听图片上传成功的事件
    const handleSuccess = (res) => {
        const picInfo = {
            pic: res.data.tmp_path,
        }
        data.addForm.pics.push(picInfo)
    }
    //监听富文本
    const add = () => {
        proxy.$refs.ruleFormRef.validate(async valid => {
            if (!valid) {
                ElMessage({
                    message: '请填写完整信息',
                    type: 'warning'
                })
            }

            //执行添加的业务逻辑
            const from = JSON.parse(JSON.stringify(data.addForm))
            from.goods_cat = from.goods_cat.join(',')
            //处理动态参数
            data.paramsList.forEach(item => {
                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals.join(',')
                }
                from.attrs.push(newInfo)

            })
            //处理静态属性
            data.paramsList.forEach(item => {
                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
                from.attrs.push(newInfo)

            })

            // console.log(from);
            //添加商品的请求
            try {
                const {
                    data: res
                } = await api.getGoods(from)
                if (res.meta.status == 201) {
                    ElMessage({
                        message: res.meta.msg,
                        type: 'success'
                    })
                    const {
                        $router
                    } = proxy
                    $router.push({
                        path: '/goods'
                    })
                    console.log(1);
                } else {}
            } catch (error) {
                console.log("-----error:", error);
            }
        })
    }
</script>
<style lang='scss' scoped>
    .el-steps {
        margin: 15px 0;
    }

    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .previewImg {
        width: 100%;
        height: 100%;
    }

    .btnAdd {
        margin-top: 15px
    }
</style>