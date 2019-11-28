<template>
    <el-dialog
            title="Nested Condition"
            :visible.sync="visible"
            width="60%"
            :before-close="close">
        <el-row>
            <el-col :span="10">
                <el-input v-model="path" placeholder="path"></el-input>
            </el-col>
        </el-row>

        <Conditions :value="conditions" />

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            value: Array,
            visible: Boolean
        },
        methods: {
            close() {
                this.$emit('close', {
                    path: this.path,
                    conditions: this.conditions
                });
            }
        },
        data() {
            let val = this.value || {};
            return {
                conditions: val.conditions || [],
                path: val.path || ''
            }
        },
        beforeCreate() {
            this.$options.components.Conditions = () => import ("~/components/Conditions");
        }
    }
</script>
<style>

</style>
