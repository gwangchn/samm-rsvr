<template>
  <div class="dispatchbox">
    <div ref="tableheight" class="dispatchTableBox">
      <Table :height="listheight" :columns="columns1" :data="tableList"  @on-row-dblclick ='dbclickRow'></Table>
    </div>
  </div>
</template>
<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    name: 'all',
    data() {
      return {
        listheight: "",
        columns1: [{
            title: '库名',
            key: 'ennm',
            width:100,
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
                      h('span', {
                        style: {
                          display: 'inline',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                        },
                        domProps: {
                          title:params.row.ennm
                        },
                      },params.row.ennm),
                  ]);
              },
          },
          {
            title: '水位(m)',
            key: "rz",
            align:"center",
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
            align:"center",
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
            align:"center",
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
            align:'center',
            width:70,
            renderHeader: (h) => {
              return h('p', [
                h('span', null, '起调水位'),
                h('br'),
                h('span', null, '(m)')
              ])
            }
          }
        ]
      }
    },
    computed: {
      ...mapGetters('dispatch', ['tableList'])
    },
    mounted() {
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
    },
    methods: {
      // table里的星星
      stars(index, params) {
        params.row.isClick = !params.row.isClick;
        //是否关注的逻辑
        this.getDispatchFollow([this,params.row]);
      },
      //点击table row 定位地图点
      dbclickRow(value){
        this.$eventBus.$emit('dispatchLinkage',value);
      },
      ...mapActions('dispatch',['getDispatchFollow'])
    },
    destroyed() {}
  }
</script>
<style lang="scss" scoped>
  .dispatchbox {
    .dispatchTableBox {
      height: calc(100vh - 105px - #{$header-height});
    }
  }
</style>
<style lang="scss">
.dispatchbox{
    .ivu-checkbox {
        padding-right: 5px ;
    }
    .dispatchTableBox{
      .ivu-table-wrapper{
        position: static!important;
      }
      .ivu-table-cell{
        padding:0 10px; 
      }
      .ivu-table-header .ivu-table td, .ivu-table th{
        text-align:center;
      }
    }
    
}
</style>
