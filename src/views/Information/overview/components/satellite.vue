<template>
  <item-box name="卫星云图">
    <img class="image" src="~@/assets/overview/satellite.jpg" alt="卫星云图" @click="toLink">
  </item-box>
</template>

<script>
import itemBox from './item-box'
export default {
  components: {
    itemBox
  },
  methods: {
    toLink() {
      this.$router.push('weather')
    }
  }
}
</script>

<style scoped lang="scss">
.image {
  width: 100%;
  height: 100%;
  &:hover {
    cursor: pointer;
  }
}
</style>
