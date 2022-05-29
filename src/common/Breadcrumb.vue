<template>
    <div class=''>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item,index) in props.breadcrumb" :key="item.indedx"
                :to="{ path: `${item.path}` }">
                {{item.name}}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script setup>
    const props = defineProps({
        breadcrumb: {
            type: Array,
            required: true
        }
    })
</script>
<style lang='scss' scoped>
</style>