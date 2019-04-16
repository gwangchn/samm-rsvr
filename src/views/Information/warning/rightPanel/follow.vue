<template>
    <div class="warnfollowbox" ref="tableheight">
        <Table :height="listheight" :columns="columns1" :data="followList"></Table>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    let option = {
    '1': 'blue',
    '2': 'gold',
    '3': 'red'
    }
    export default {
        name: 'follow',
        data() {
            return {
                baseUrl: process.env.BASE_URL,
                columns1: [{
                        title: '库名',
                        key: 'ennm',
                        align: 'center',
                        render: (h, params) => {
                        return h('div', [
                            h('span', {
                            style: {
                                display: 'block',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            },
                            domProps: {
                                title:params.row.ennm
                            }
                            }, params.row.ennm)
                        ]);
                        }
                    },
                        {
                        title: '行政区',
                        key: 'dsnm1',
                        render: (h, params) => {
                        return h('div', [
                            h('span', {
                            style: {
                                display: 'block',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            },
                            domProps: {
                                title:params.row.dsnm1
                            }
                            }, params.row.dsnm1)
                        ]);
                        }
                    },
                    {
                        title: '时间',
                        key: 'ftm',
                        align: "center",
                        render: (h, params) => {
                        return h('div', [
                            h('span', {
                            style: {
                                display: 'block',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            },
                            domProps: {
                                title:params.row.ftm.toDate().formatDate('MM-dd HH:mm')
                            }
                            }, params.row.ftm.toDate().formatDate('MM-dd HH:mm'))
                        ]);
                        }
                    },
                    {
                        title: '水位(m)',
                        key: 'rz',
                        align: "center"
                    },
                    {
                        title: '超警(m)',
                        key: 'warn',
                        render: (h, params) => {
                        let { baseUrl } = this
                        let item = params.row 
                        return h('div', {
                        attrs: {
                            class: 'table-name-wrap'
                        }
                        }, [
                        h('img', {
                            attrs: {
                            src: `${baseUrl}img/${option[item.m]}.png`,
                            class: 'table-name-img'
                            }
                        }),
                        h('span', {
                            attrs: {
                            class: 'table-name-text'
                            }
                        }, item.warn)
                        ])
                    }
                    },
                ],
                listheight:''
            }
        },
        computed: {
            ...mapGetters('warning', ['followList'])
        },
        mounted() {
            this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
        },
        methods: {}
    }
</script>
<style lang="scss" scoped>
.warnfollowbox{
  height: calc(100vh - 75px - #{$header-height});  
}
</style>
<style lang="scss">
.warnfollowbox{
    .ivu-table-cell{
      padding-left:0px; 
      padding-right: 0px; 
    }
    .table-name-img {
      vertical-align: middle;
      display: inline-block;
      width: 18px;
      height: 18px;
    }
}
</style>