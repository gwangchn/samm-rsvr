<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'left-bar',
  props: {
    color: {
      type: String,
      default: 'black'
    }
  },
  computed: {
    style() {
      let { color } = this
      return {
        borderLeft: `3px solid ${color}`,
        paddingLeft: '8px'
      }
    }
  }
}
</script>
