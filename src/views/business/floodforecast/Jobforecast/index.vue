<template>
  <div class="Jobforecast">
    <topTitle :title='title'></topTitle>
    <leftCondition></leftCondition>
    <rightMap v-if="hideRight"></rightMap>
    <rightPanel v-if="!hideRight"></rightPanel>
  </div>
</template>

<script>
import topTitle from '../topTitle'
import leftCondition from './leftCondition'
import rightMap from './rightMap'
import rightPanel from './rightPanel'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Jobforecast',
  components:{
    topTitle,
    leftCondition,
    rightMap,
    rightPanel
  },
  data() {
    return {
      title:'作业预报'
    };
  },
  mounted(){},
  computed:{
    ...mapGetters('Jobforecast',['hideRight'])
  },
  methods:{}
}
</script>
<style scoped lang="scss">
</style>
