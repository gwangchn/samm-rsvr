<template>
  <div class="rainbox">
    <div ref="tableheight" class="tableBox">
      <Table :height="listheight" :columns="columns1" :data="tableList"  @on-row-dblclick ='dbclickRow'></Table>
    </div>
    <div class="rp-check">
      <!-- <Checkbox v-model="vIsosurline" @on-change='Isosurline'>等值线</Checkbox> -->
      <Checkbox v-model="vIsosurface"  @on-change='Isosurface'>等值面</Checkbox>
      <Checkbox v-model="vLatticerain" :disabled='dLatticerain'  @on-change='Latticerain'>格点雨量</Checkbox>
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
        vIsosurline:true,
        vIsosurface:true,
        vLatticerain:true,
        dLatticerain:true,
        check:["等值线","等值面","格点雨量"],
        columns1: [{
            title: '站名',
            key: 'stnm',
            // width: 110,
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
            title: '降水量(mm)',
            key: 'drp',
            align: "center"
          },
        ]
      }
    },
    computed: {
      ...mapGetters('rain', ['tableList','startTm','endTm'])
    },
    mounted() {
      this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
      this.$eventBus.$on('dLatticerain',x=>{
        this.dLatticerain = x;
      })
    },
    methods: {
      //等值线
      Isosurline(val){
        //debugger
      },
      //等值面
      Isosurface(val){
        let {startTm,endTm} = this;
        if(val){
          this.CHANGE_ISOSURFACE(true);
          this.getIsosurfaceLine([this,{
            startDate:startTm,
            endDate:endTm
          }]);
        }else{
          this.CHANGE_ISOSURFACE(false);
          this.getIsosurfaceLine([this,{
            startDate:startTm,
            endDate:endTm
          }]);
        }
      },
      //格点雨量
      Latticerain(val){
        if(val){
          this.CHANGE_LATTICE(true);
          this.getLatticerainfall(this);
        }else {
          this.CHANGE_LATTICE(false);
          this.getLatticerainfall(this);
        }
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
      //点击table row 定位地图点
      dbclickRow(value){
        this.$eventBus.$emit('rainLinkage',value);
      },
      ...mapMutations('rain',['CHANGE_LATTICE','CHANGE_ISOSURFACE']),
      ...mapActions('rain',['getFollowRsvr','getFollowSite','getLatticerainfall','getIsosurfaceLine'])
    },
    destroyed() {
      this.$eventBus.$off('dLatticerain')
    }
  }
</script>
<style lang="scss" scoped>
  .rainbox {
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
.rainbox{
    .ivu-checkbox {
        padding-right: 5px ;
    }
    .ivu-table-header .ivu-table td, .ivu-table th{
      text-align:center;
    }
}
</style>