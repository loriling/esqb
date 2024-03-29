<template>
    <el-row class="one-condition">
        <el-col :span="2" v-show="false">
            <el-input
                    v-model="condition.conditionKey"
                    :disabled="true" >
            </el-input>
        </el-col>
        <el-col :span="5">
            <el-select v-model="condition.conditionType" placeholder="条件类型" @change="conditionTypeChange">
                <el-option
                        v-for="item in conditionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="5" v-show="queryTypeShow">
            <el-select v-model="condition.queryType" placeholder="查询类型" @change="queryTypeChange">
                <el-option
                        v-for="item in queryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-col>

        <el-col :span="5" v-show="fieldNameShow">
            <el-input placeholder="字段" v-model="condition.fieldName" @change="commonChange"></el-input>
        </el-col>

        <el-col :span="5" v-show="fieldValueShow">
            <el-input placeholder="值" v-model="condition.fieldValue" @change="commonChange" @focus="fieldValueFocus"></el-input>
        </el-col>
        <el-col :span="5"  v-show="sortDirectionShow">
            <el-select v-model="condition.sortDirection" placeholder="排序类型" @change="commonChange" >
                <el-option
                        v-for="item in sortDirectionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-col>

        <RangeDialog :visible="rangeDialogShow" :value="range" @close="rangeDialogClose"/>
        <NestedConditionDialog :visible="nestedConditionDialogShow" :value="nested" @close="nestedConditionDialogClose"/>

        <el-col :span="2">
            <el-button v-if="this.conditionKey === undefined" @click="add" type="primary"><i class="el-icon-circle-plus-outline"></i>添加</el-button>
            <el-button v-else @click="remove" type="danger"><i class="el-icon-delete"></i>删除</el-button>
        </el-col>
    </el-row>
</template>

<script>
    import uuid from 'uuid/v4';
    import RangeDialog from "~/components/RangeDialog";
    import NestedConditionDialog from "~/components/NestedConditionDialog";
    export default {
        components: {
            RangeDialog,
            NestedConditionDialog
        },
        props: {
            conditionKey: String,
            conditionType: String,
            queryType: String,
            fieldName: String,
            fieldValue: String,
            sortDirection: String,
            range: Object,
            nested: Object
        },
        methods: {
            conditionTypeChange(conditionType) {
                if (conditionType === 'sort') {
                    this.queryTypeShow = false;
                    this.fieldValueShow = false;
                    this.sortDirectionShow = true;
                } else if (conditionType === 'rawOption') {
                    this.queryTypeShow = false;
                    this.fieldValueShow = true;
                    this.sortDirectionShow = false;
                } else {
                    this.queryTypeShow = true;
                    this.fieldValueShow = true;
                    this.sortDirectionShow = false;
                }
                this.commonChange();
            },

            queryTypeChange(queryType) {
                if (queryType === 'match_all') {
                    this.fieldNameShow = false;
                    this.fieldValueShow = false;
                } else if (queryType === 'nested') {
                    this.fieldNameShow = false;
                    this.fieldValueShow = true;
                } else {
                    this.fieldNameShow = true;
                    this.fieldValueShow = true;
                }
                this.commonChange();
            },

            commonChange() {
                this.calculateExp(this.condition);
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
                if (['sort', 'rawOption'].includes(this.condition.conditionType)) {

                } else {
                    if (!this.condition.queryType) {
                        this.$message({
                            showClose: true,
                            message: '查询类型不能为空',
                            type: 'error'
                        });
                        return;
                    }
                }

                this.calculateExp(this.condition);
                this.$emit('add', Object.assign({}, this.condition, {
                    conditionKey: uuid()
                }));
            },

            remove() {
                this.$emit('remove', this.condition.conditionKey);
            },

            calculateExp(condition) {
                let exp = condition.conditionType;
                if (condition.conditionType === 'sort') {
                    exp += '("' + condition.fieldName + '"';
                    if (condition.sortDirection) {
                        exp += ', "' + condition.sortDirection + '"';
                    }
                    exp += ')';
                } else if (condition.conditionType === 'rawOption') {
                    if (condition.fieldName !== undefined && condition.fieldValue !== undefined) {
                        exp += '("' + condition.fieldName + '", ' + condition.fieldValue + ')';
                    }
                } else {
                    exp += '("' + condition.queryType + '"';

                    if (condition.queryType === 'nested'){
                        let nested = JSON.parse(condition.fieldValue);
                        if (nested.path) {
                            exp += ', { path: ' + nested.path + ' }, q => { return q';
                            nested.conditions.forEach(c => {
                                exp += '.' + this.calculateExp(c)
                            });
                            exp += '; }';
                        }
                    } else {
                        if (condition.queryType !== 'match_all') {
                            if (condition.fieldName !== undefined) {
                                exp += ', "' + condition.fieldName + '",';
                            }
                            if (condition.fieldValue !== undefined) {
                                if (condition.queryType === 'range') {
                                    exp += condition.fieldValue;
                                } else {
                                    exp += '"' + condition.fieldValue + '"';
                                }
                            }
                        }
                    }
                    exp += ')';
                }
                condition.exp = exp;
                return exp;
            },

            fieldValueFocus(e) {
                if (this.condition.queryType === 'range') {
                    this.rangeDialogShow = true;
                } else if (this.condition.queryType === 'nested') {
                    this.nestedConditionDialogShow = true;
                }
            },

            rangeDialogClose(e) {
                this.rangeDialogShow = false;
                this.condition.range = e;
                let value = {};
                if (e.lt && !isNaN(e.lt))
                    value.lt = e.lt;
                if (e.lte && !isNaN(e.lte))
                    value.lte = e.lte;
                if (e.gt && !isNaN(e.gt))
                    value.gt = e.gt;
                if (e.gte && !isNaN(e.gte))
                    value.gte = e.gte;
                this.condition.fieldValue = JSON.stringify(value);
                this.commonChange();
            },

            nestedConditionDialogClose(e) {
                this.nestedConditionDialogShow = false;
                this.condition.nested = e;
                this.condition.fieldValue = JSON.stringify(e);
                this.commonChange();
            }
        },
        data() {
            return {
                conditionOptions: [{
                    value: 'andQuery',
                    label: '必须满足'
                }, {
                    value: 'orQuery',
                    label: '应该满足'
                }, {
                    value: 'notQuery',
                    label: '必须不是'
                }, {
                    value: 'andFilter',
                    label: '必须满足（不记分）'
                }, {
                    value: 'orFilter',
                    label: '应该满足（不记分）'
                }, {
                    value: 'notFilter',
                    label: '必须不是（不记分）'
                }, {
                    value: 'sort',
                    label: '排序'
                }, {
                    value: 'rawOption',
                    label: '自定义'
                }],
                queryTypeShow: true,
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
                    conditionKey : this.conditionKey,
                    conditionType: this.conditionType,
                    queryType: this.queryType,
                    fieldName: this.fieldName,
                    fieldValue: this.fieldValue,
                    sortDirection: this.sortDirection,
                    range: this.range,
                    nested: this.nested
                },

                sortDirectionShow: false,
                sortDirectionOptions: [{
                    value: 'asc',
                    label: '顺序'
                }, {
                    value: 'desc',
                    label: '倒叙'
                }],

                rangeDialogShow: false,
                nestedConditionDialogShow: false
            }
        },

        beforeMount() {
            if (this.conditionType === 'sort') {
                this.queryTypeShow = false;
                this.fieldValueShow = false;
                this.sortDirectionShow = true;
            } else if (this.conditionType === 'rawOption') {
                this.queryTypeShow = false;
            }
            if (this.queryType === 'match_all') {
                this.fieldNameShow = false;
                this.fieldValueShow = false;
            } else if (this.queryType === 'nested') {
                this.fieldNameShow = false;
            }
        }
    }
</script>
<style>

</style>
