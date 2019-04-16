<template>
  <div class="overview">
    <div class="top">
      <div class="left">
        <warn-map></warn-map>
      </div>
      <div class="right">
        <warn-res></warn-res>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="item">
          <satellite></satellite>
        </div>
        <div class="item">
          <real></real>
        </div>
        <div class="item">
          <forecast></forecast>
        </div>
      </div>
      <div class="right">
        <reservoir></reservoir>
      </div>
    </div>
    <res-detail></res-detail>
  </div>
</template>

<script>
import warnMap from './components/warn-map'
import warnRes from './components/warn-res'
import satellite from './components/satellite'
import real from './components/real'
import forecast from './components/forecast'
import reservoir from './components/reservoir'
import { mapActions } from 'vuex'
import resDetail from '@/components/res-detail'

export default {
  name: 'overview',
  components: {
    warnMap,
    warnRes,
    satellite,
    real,
    forecast,
    reservoir,
    resDetail
  },
  created () {
    this.getWarnData()
  },
  methods: mapActions('overview', ['getWarnData'])
}
</script>

<style scoped lang="scss">
$margin: 10px;

.overview {
  padding: $margin;
  width: calc(100% - #{$menu-width});
  float: left;
  height: calc(100vh - #{$header-height});
  background-color: #f9f9f9;
  .top {
    height: calc(65% - #{$margin});
    margin-bottom: $margin;
    display: flex;
    justify-content: space-between;
  }
  .bottom {
    height: 35%;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      justify-content: space-between;
    }
    .item {
      width: calc((100% - #{$margin} * 2) / 3);
      height: 100%;
    }
  }
  .left {
    width: calc(70% - #{$margin});
  }
  .right {
    width: 30%;
  }
}
</style>
