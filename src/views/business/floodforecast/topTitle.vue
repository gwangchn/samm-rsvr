<template>
  <div class="topTitle">
    <Icon class="icon" type="md-menu" :size='20' />
    <span>洪水预报</span>
    <Icon class="icon" type="md-arrow-round-forward" />
    <span>{{title}}</span>
  </div>
</template>

<script>
export default {
  name: 'topTitle',
  props:{
    title:{
      type:String,
      default:'标题'
    }
  },
  data() {
    return {};
  },
}
</script>

<style scoped lang="scss">
.topTitle{
  line-height: 40px;
  width: 100%;
  top: 40px;
  right: 0;
  background: #e4e4e4;
  font-size: 13px;
  font-weight: 900;
  .icon{
    padding: 0 15px;
  }
}
</style>
