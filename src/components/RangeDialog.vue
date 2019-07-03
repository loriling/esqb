<template>
    <el-dialog
            title="Range"
            :visible.sync="visible"
            width="30%"
            :before-close="close">
        <el-form ref="form" :model="range" label-width="120px">
            <el-form-item label="小于">
                <el-input v-model="range.lt"></el-input>
            </el-form-item>
            <el-form-item label="小于等于">
                <el-input v-model="range.lte"></el-input>
            </el-form-item>
            <el-form-item label="大于">
                <el-input v-model="range.gt"></el-input>
            </el-form-item>
            <el-form-item label="大于等于">
                <el-input v-model="range.gte"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            value: Object,
            visible: Boolean
        },
        methods: {
            close() {
                this.$emit('close', this.range);
            }
        },
        data() {
            return {
                range : this.value || {}
            }
        }
    }
</script>
<style>

</style>

