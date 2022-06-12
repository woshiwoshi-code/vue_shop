<template>
    <div class=''>
        <!-- 面包屑导航数据 -->
        <breadcrumb :breadcrumb="data.breadcrumb"></breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
            <div id="main" style="width:750px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script setup>
    import * as echarts from 'echarts';
    import breadcrumb from '../../common/Breadcrumb.vue';
    import * as api from "@/api/reportHttp.js";
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
    import object from 'lodash-es/object';
    const {
        proxy
    } = getCurrentInstance()
    const data = reactive({ //面包屑导航数据
        breadcrumb: [{
                path: '/home',
                name: '首页'
            },
            {
                path: '',
                name: '数据统计'
            },
            {
                path: '',
                name: '数据报表'
            }
        ],
        //需要合并的数据
        options: {
            title: {
                text: '用户来源'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#E9EEF3'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                boundaryGap: false
            }],
            yAxis: [{
                type: 'value'
            }]
        }
    })
    onBeforeMount(() => {

        nextTick(async () => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('main'));
            try {
                const {
                    data: res
                } = await api.getReport()
                if (res.meta.status == 200) {
                    const result = object.assign(data.options, res.data);
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(result);
                } else {}
            } catch (error) {
                console.log("-----error:", error);
            }

        })
    })
</script>
<style lang='scss' scoped>
</style>