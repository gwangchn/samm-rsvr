<template>
  <div class="realprediction">
    <topTitle :title='title'></topTitle>
    <leftCondition></leftCondition>
    <rightPanel></rightPanel>
  </div>
</template>

<script>
import topTitle from '../topTitle'
import leftCondition from './leftCondition'
import rightPanel from './rightPanel'
export default {
  name: 'realprediction',
  components:{
    topTitle,
    leftCondition,
    rightPanel
  },
  data() {
    return {
      title:'实时预报'
    };
  },
}
</script>

<style scoped lang="scss">
</style>
