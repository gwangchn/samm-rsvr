<template>
    <div class="followbox" ref="tableheight">
        <Table :height="listheight" :columns="columns1" :data="followList"></Table>
    </div>
</template>
<script>
    import expandRow from './table-expand.vue';
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        name: 'follow',
        components: { 
            expandRow 
        },
        data() {
            return {
                listheight:'',
                columns1: [
                    {
                        type: 'expand',
                        width: 30,
                        key: 'name',
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '洪水量级',
                        key: 'ennm',
                        width: 120,
                        align: "center",
                    },
                    {
                        title: '下泄流量(m³/s)',
                        key: '',
                        align: "center",
                        renderHeader: (h) => {
                            return h('p', [
                                h('span', null, '下泄流量'),
                                h('br'),
                                h('span', null, '(m³/s)')
                            ])
                        }
                    },
                    {
                        title: '淹没面积',
                        key: '',
                        align: "center",
                        renderHeader: (h) => {
                            return h('p', [
                                h('span', null, '淹没面积'),
                                h('br'),
                                h('span', null, '(km²)')
                            ])
                        }
                    }
                ]
            }
        },
        computed: {
            ...mapGetters('risk', ['followList'])
        },
        mounted() {
            this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
        },
        methods: {}
    }
</script>
<style lang="scss" scoped>
.followbox{
  height: calc(100vh - 75px - #{$header-height});
}
</style>
<style lang="scss">
.followbox {
    .ivu-table-tbody{
        .ivu-table-cell-with-expand{
        height: 30px; 
        line-height: 30px; 
        }
        td.ivu-table-expanded-cell{
        padding: 5px 0 5px 30px;
        }
        .ivu-col-span-8{
        text-align:center;
        }
    } 
}
</style>