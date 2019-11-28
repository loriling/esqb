<template>
    <div>
        <OneCondition @add="conditionAdded"/>
        <hr class="divider"/>
        <OneCondition v-for="c in conditions" :key="c.conditionKey" :conditionKey="c.conditionKey" :conditionType="c.conditionType"
                      :queryType="c.queryType" :fieldName="c.fieldName" :fieldValue="c.fieldValue" :sortDirection="c.sortDirection"
                      :range="c.range"
                      @remove="conditionRemoved" @change="conditionChanged"/>
    </div>
</template>

<script>
    import OneCondition from "~/components/OneCondition";
    export default {
        name: 'Conditions',
        components: {OneCondition},
        props: {
            value: Array
        },
        methods: {
            conditionAdded(condition) {
                this.conditions.push(condition);
            },

            conditionRemoved(conditionKey) {
                let index = this.conditions.findIndex(c => {
                    return c.conditionKey === conditionKey
                });
                if (index >= 0) {
                    this.conditions.splice(index, 1);
                }
            },

            conditionChanged(condition) {
                this.conditions.splice([this.conditions.findIndex(c => {
                    return c.conditionKey === condition.conditionKey
                })], 1, condition);
            },

            close() {
                this.$emit('close', this.range);
            }
        },
        data() {
            return {
                conditions: this.value || []
            }
        }
    }
</script>
<style>
    .divider {
        height: 10px;
        border: none;
        border-top: 2px dashed #0066CC;
    }
</style>
