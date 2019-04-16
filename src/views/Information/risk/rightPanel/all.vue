<template>
  <div class="riskbox">
    <div ref="tableheight" class="riskTableBox">
      <Table :height="listheight" :columns="columns1" :data="tableList" @on-row-dblclick ='dbclickRow'></Table>
    </div>
  </div>
</template>
<script>
  import expandRow from './table-expand.vue';
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    name: 'all',
    components: { 
      expandRow 
    },
    data() {
      return {
        listheight: "",
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
            // align: "center",
            render: (h, params) => {
              return h('div', [
                  h('Icon', {
                      props: {
                          type: params.row.isClick ? 'md-star' : 'md-star-outline'
                      },
                      style: {
                          color: '#ffb340',
                          cursor: 'pointer',
                          fontSize: '18px',
                          display: 'inline',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                      },
                      on: {
                          click: () => {
                              this.stars(params.index, params)
                          }
                      },
                  }),
                  h('span', params.row.ennm)
              ]);
            }
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
      ...mapGetters('risk', ['tableList'])
    },
    mounted() {
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
    },
    methods: {
      // table里的星星
      stars(index, params) {
        params.row.isClick = !params.row.isClick;
        //是否关注的逻辑
        this.getFollow([this,params.row]);
      },
      //点击table row控制地图上点定位
      dbclickRow(value){
        this.$eventBus.$emit('riskLinkage',value);
      },
      ...mapActions('risk',['getFollow'])
    },
    destroyed() {}
  }
</script>
<style lang="scss" scoped>
  .riskbox {
    .riskTableBox {
      height: calc(100vh - 105px - #{$header-height});
    }
  }
</style>
<style lang="scss">
.riskbox{
    .ivu-checkbox {
        padding-right: 5px ;
    }
    .riskTableBox{
      .ivu-table-wrapper{
        position: static!important;
      }
    }
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
