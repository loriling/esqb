<template>
    <div class="one-condition">
        <el-input
                v-model="condition.conditionKey"
                :disabled="true" v-show="false">
        </el-input>
        <el-select v-model="condition.conditionType" placeholder="条件类型" @change="conditionTypeChange">
            <el-option
                    v-for="item in conditionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="condition.queryType" placeholder="查询类型" @change="queryTypeChange">
            <el-option
                    v-for="item in queryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-input placeholder="字段" v-model="condition.fieldName" v-show="fieldNameShow" @change="fieldNameChange"></el-input>
        <el-input placeholder="值" v-model="condition.fieldValue" v-show="fieldValueShow" @change="fieldValueChange"></el-input>

        <el-button v-if="this.conditionKey === undefined" @click="add" type="primary"><i class="el-icon-circle-plus-outline"></i>添加</el-button>
        <el-button v-else @click="remove" type="danger"><i class="el-icon-delete"></i>删除</el-button>
    </div>
</template>

<script>
    import uuid from 'uuid/v4';
    export default {
        props: {
            conditionKey: String,
            conditionType: String,
            queryType: String,
            fieldName: String,
            fieldValue: String
        },
        methods: {
            conditionTypeChange(conditionType) {
                if (conditionType === '') {

                }
                this.condition.conditionType = conditionType;
                this.calculateExp();
                this.$emit('change', this.condition);
            },

            queryTypeChange(queryType) {
                if (queryType === 'match_all') {
                    this.fieldNameShow = false;
                    this.fieldValueShow = false;
                } else {
                    this.fieldNameShow = true;
                    this.fieldValueShow = true;
                }
                this.condition.queryType = queryType;
                this.calculateExp();
                this.$emit('change', this.condition);
            },

            fieldNameChange() {
                this.calculateExp();
                this.$emit('change', this.condition);
            },

            fieldValueChange() {
                this.calculateExp();
                this.$emit('change', this.condition);
            },


            add() {
                if (!this.condition.conditionType) {
                    this.$message({
                        showClose: true,
                        message: '条件类型不能为空',
                        type: 'error'
                    });
                    return;
                }
                if (!this.condition.queryType) {
                    this.$message({
                        showClose: true,
                        message: '查询类型不能为空',
                        type: 'error'
                    });
                    return;
                }
                this.calculateExp();
                this.$emit('add', Object.assign({}, this.condition));
                this.condition.conditionKey = uuid();
            },

            remove() {
                this.$emit('remove', this.condition.conditionKey);
            },

            calculateExp() {
                let exp = this.condition.conditionType + '("' + this.condition.queryType + '"';
                if (this.condition.fieldName !== undefined) {
                    exp += ', "' + this.condition.fieldName + '",';
                }
                if (this.condition.fieldValue !== undefined) {
                    exp +=  '"' + this.condition.fieldValue + '"';
                }
                exp += ')';
                this.condition.exp = exp;
            }
        },
        data() {
            return {
                conditionOptions: [{
                    value: 'andQuery',
                    label: 'andQuery'
                }, {
                    value: 'orQuery',
                    label: 'orQuery'
                }, {
                    value: 'notQuery',
                    label: 'notQuery'
                }, {
                    value: 'andFilter',
                    label: 'andFilter'
                }, {
                    value: 'orFilter',
                    label: 'orFilter'
                }, {
                    value: 'notFilter',
                    label: 'notFilter'
                }],
                queryOptions: [{
                    value: 'match_all',
                    label: 'match_all'
                }, {
                    value: 'match',
                    label: 'match'
                }, {
                    value: 'term',
                    label: 'term'
                }, {
                    value: 'terms',
                    label: 'terms'
                }, {
                    value: 'nested',
                    label: 'nested'
                }, {
                    value: 'range',
                    label: 'range'
                }],
                fieldNameShow: true,
                fieldValueShow: true,
                condition: {
                    conditionKey : this.conditionKey || uuid(),
                    conditionType: this.conditionType,
                    queryType: this.queryType,
                    fieldName: this.fieldName,
                    fieldValue: this.fieldValue,
                }
            }
        }
    }
</script>
<style>
    .el-input {
        width: auto;
    }
</style>
