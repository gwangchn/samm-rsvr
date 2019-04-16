<template>
    <div class="dispatchFollowbox" ref="tableheight">
        <Table :height="listheight" :columns="columns1" :data="followList"></Table>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        name: 'follow',
        data() {
            return {
                columns1: [{
                        title: '库名',
                        key: 'ennm',
                        align: 'center',
                        width:80,
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
                        title: '水位(m)',
                        key: 'rz',
                        align: "center",
                        renderHeader: (h) => {
                            return h('p', [
                                h('span', null, '水位'),
                                h('br'),
                                h('span', null, '(m)')
                            ])
                        }
                    },
                    {
                        title: '入流(m³/s)',
                        key: 'inq',
                        align: "center",
                        renderHeader: (h) => {
                            return h('p', [
                                h('span', null, '入流'),
                                h('br'),
                                h('span', null, '(m³/s)')
                            ])
                        }
                    },
                    {
                        title: '泄流(m³/s)',
                        key: 'otq',
                        align: "center",
                        renderHeader: (h) => {
                            return h('p', [
                                h('span', null, '泄流'),
                                h('br'),
                                h('span', null, '(m³/s)')
                            ])
                        }
                    },
                    {
                        title: '起调水位',
                        key: 'rgz',
                        align: "center",
                        renderHeader: (h) => {
                            return h('p', [
                                h('span', null, '起调水位'),
                                h('br'),
                                h('span', null, '(m)')
                            ])
                        }
                    }
                ],
                listheight:''
            }
        },
        computed: {
            ...mapGetters('dispatch', ['followList'])
        },
        mounted() {
            this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
        },
        methods: {}
    }
</script>
<style lang="scss" scoped>
.dispatchFollowbox{
  height: calc(100vh - 75px - #{$header-height});  
}
</style>
<style lang="scss">
.dispatchFollowbox{
  .ivu-table-cell{
        padding-left:0px; 
        padding-right: 0px; 
      }  
}
</style>
