<template>
  <div class="waterbox">
    <div ref="tableheight" class="tableBox">
      <Table :height="listheight" :columns="columns1" :data="tableList" @on-row-dblclick ='dbclickRow'></Table>
    </div>
    <div class="rp-check">
      <CheckboxGroup v-model="check" @on-change="line(check)">
        <Checkbox v-for="(item,index) in checklist" :disabled='item.disabled' :key="index" :label="item.label">{{item.value}}</Checkbox>
      </CheckboxGroup>
    </div>
  </div>
</template>
<script>
  import {
    mapGetters,
    mapMutations, 
    mapActions
  } from 'vuex'
  export default {
    name: 'all',
    data() {
      return {
        listheight: "",
        checklist: [{
          label:'ZZ',
          value: "河道站",
          disabled:false
        },
        {
          label:'RR',
          value: "水库站",
          disabled:false
        }],
        check:['ZZ','RR'],
        columns1: [{
            title: '站名',
            key: 'stnm',
            width: 140,
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
                              fontSize: '18px'
                          },
                          on: {
                              click: () => {
                                  this.stars(params.index, params)
                              }
                          },
                      }),
                      h('span', params.row.stnm)
                  ]);
              }
          },
          {
            title: '水位(m)',
            key: 'rz',
            align: "center"
          },
          {
            title: '流量(m³/s)',
            key: 'inq',
            align: "center"
          }
        ]
      }
    },
    computed: {
      ...mapGetters('water', ['tableList','type'])
    },
    mounted() {
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
      this.$eventBus.$on('cSiteList',x=>{
        this.checklist = x;
        this.check = ['ZZ','RR'];
      });
    },
    methods: {
      //控制水库站 河道站显示隐藏
      line(temp) {
        let data = this.tableList;
        let tempData = [];
        if(this.type == 'S'){
          data.forEach(x => {
            if(temp.indexOf(x.sttp)>-1){
              tempData.push(x);
            };
          });
        }else{
          if(temp.indexOf('RR')>-1){
            tempData = data;
          }else{
            tempData = [];
          }
        }
        this.$eventBus.$emit('passWaterlist',tempData);
      },
      // table里的星星
      stars(index, params) {
        params.row.isClick = !params.row.isClick;
        let data = params.row;
        if(data.type == 'Y'){
          this.getFollowRsvr([this,data]);
        }else{
          this.getFollowSite([this,data]);
        }
      },
      //点击table row控制地图上点定位
      dbclickRow(value){
        this.$eventBus.$emit('waterLinkage',value);
      },
      ...mapMutations('water',['CHANGE_TABLELIST']),
      ...mapActions('water',['getFollowRsvr','getFollowSite'])
    },
    destroyed() {}
  }
</script>
<style lang="scss" scoped>
  .waterbox {
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
        width: 33%;
        text-align: center;
        margin-right: 0;
      }
    }
  }
</style>
<style lang="scss">
.waterbox{
    .ivu-checkbox {
        padding-right: 5px ;
    }
    .ivu-table-header .ivu-table td, .ivu-table th{
      text-align:center;
    }
}
</style>