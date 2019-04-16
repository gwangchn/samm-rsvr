<template>
  <div class="warnallbox">
    <div ref="tableheight" class="tableBox">
      <Table :height="listheight" :columns="columns1" :data="tableList" @on-row-dblclick ='dbclickRow'></Table>
    </div>
    <div class="rp-check">
      <CheckboxGroup v-model="check" @on-change="line(check)">
        <Checkbox v-for="(item,index) in checklist" :key="index" :label="item.label">
          <span>{{item.value}}</span>
          <Icon size="16" :type="item.type" :color="item.color"></Icon>
        </Checkbox>
      </CheckboxGroup>
    </div>
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
    name: 'all',
    data() {
      return {
        baseUrl: process.env.BASE_URL,
        listheight: "",
        checklist: [{
            label: "1",
            type: "md-pin",
            color: "blue",
            value:"超汛限"
          },
          {
            label: "2",
            type: "md-pin",
            color: "gold",
            value:"超设计"
          },
          {
            label: "3",
            type: "md-pin",
            color: "red",
            value:"漫顶"
          }
        ],
        check:['1','2','3'],
        columns1: [{
            title: '库名',
            key: 'ennm',
            width:95,
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
            title: '行政区',
            key: 'dsnm1',
            align:"center",
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
            align:"center",
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
            title: '超警(m)',
            key: 'warn',
            width:70,
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
            },
            renderHeader: (h) => {
              return h('p', [
                h('span', null, '超警'),
                h('br'),
                h('span', null, '(m)')
              ])
            }
          },
        ]
      }
    },
    computed: {
      ...mapGetters('warning', ['tableList'])
    },
    mounted() {
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
      this.$eventBus.$on('initwaterCheck',x=>{
        this.check = ['1','2','3'];
      });
    },
    methods: {
      line(temp) {
        let data = this.tableList;
        let tempData = [];
        data.forEach(x => {
          if(temp.indexOf(x.m)>-1){
            tempData.push(x);
          }
        });
        this.$eventBus.$emit('passWarnlist',tempData);
      },
      // table里的星星
      stars(index, params) {
        params.row.isClick = !params.row.isClick;
        //是否关注的逻辑
        this.getFollow([this,params.row]);
      },
      //点击table row控制地图上点定位
      dbclickRow(value){
        this.$eventBus.$emit('warningLinkage',value);
      },
      ...mapActions('warning',['getFollow'])
    },
    destroyed() {}
  }
</script>
<style lang="scss" scoped>
  .warnallbox {
    .tableBox {
      height: calc(100vh - 105px - #{$header-height});
    }
    .rp-check {
      width: 100%;
      line-height: 30px;
      position: relative;
      bottom: 0;
      text-align: center;

      .ivu-checkbox-wrapper {
        padding: 0 2px;
      }
    }
  }
</style>
<style lang="scss">
.warnallbox{
    .ivu-checkbox {
        padding-right: 5px ;
    }
    .ivu-table-cell{
      padding:0 10px; 
    }
    .table-name-img {
      vertical-align: middle;
      display: inline-block;
      width: 18px;
      height: 18px;
    }
    .ivu-table-header .ivu-table td, .ivu-table th{
      text-align:center;
    }
}
</style>