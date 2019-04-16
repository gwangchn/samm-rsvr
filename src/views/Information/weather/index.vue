
<template>
  <div class="Water">
    <oMap></oMap>
    <Maptool></Maptool>
    <TimeBar :timeData="timeDate"></TimeBar>
  </div>
</template>

<script>
import oMap from './components/map'
import Maptool from './components/Maptool'
import TimeBar from './components/TimeBar'
import { mapGetters } from 'vuex'

export default {
  name: 'weather',
  components:{
    oMap,
    Maptool,
    TimeBar
  },
  computed: mapGetters('weather', ['timeDate'])
}
</script>
