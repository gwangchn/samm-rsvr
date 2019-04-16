<template>
  <div class="leftCondition">
    <span class="type">预报站点:</span>
    <span class="type typeinput ">
      <Input  style="width: 180px"  placeholder="请输入政区或水库名称">
        <Button slot="append" icon="ios-search" ></Button>
      </Input>
    </span>
    <div class="station" >
      <ul v-for="(item,index) in rsvrs"  :key='index'>
        <li @click="changeRsvr(item,index)" :class="{ clickStyle:index == currentIndex}">
          <Icon type="ios-play" />
          <span class="title">{{item.name}}</span>  
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'leftCondition',
  data() {
    return {
      rsvrs:[
        {name:'中心'},
        {name:'小太平河站'}
      ],
      currentIndex: ''
    };
  },
  methods:{
    changeRsvr(item,index){
      this.currentIndex = index;
    }
  }
}
</script>

<style scoped lang="scss">
  .leftCondition{
    width: 200px;
    height: calc(100vh - 40px - #{$header-height});
    border-right: 1px solid #ddd; 
    float: left;
    .type{
      width: 100%;
      line-height: 30px;
      display: inline-block;
      font-size: 13px;
      font-weight: 900;
      padding-left: 10px;
    }
    .input{
      width: 170px;
    }
    .station{
      width: 100%;
      height: calc(100% - 70px);
      padding: 5px 0 0 0 ;
      overflow-y: auto;
      ul {
        li{
          width: 100%;
          line-height: 25px;
          padding-left: 10px;
          cursor: pointer;
          font-size: 14px;
          .title{
            margin-left: 5px;
            display: inline-block;
            height: 100%;
          }
        }
        .clickStyle{
          color:rgb(100, 185, 249);
        }
      }
    }
  }
</style>
