<template>
  <div class="item-box" :class="{ 'item-box-shadow': isShadow }">
    <header class="title-wrap">
      <span class="title-name">{{name}}</span>
      <ul class="button-wrap">
        <li v-for="(item, index) in list"
            :key="'item-box' + index"
            :class="[index === select ? 'active' : '']"
            >{{item.text}}
            </li>
      </ul>
    </header>
    <section class="content">
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: 'item-box',
  props: {
    name: {
      type: String,
      default: '标题'
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    isShadow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      select: 0
    }
  },
  methods: {
    seletItem (item, index) {
      this.select = index
      this.$emit('onSelect', item, index)
    }
  }
}
</script>

<style scoped lang="scss">
// 圆角大小
$radius: 8px;
// 边框颜色
$border-color: #ccc;
// 标题高度
$title-height: 30px;
// 标题字体大小
$title-size: 16px;
// 按钮间距
$button-gap: 6px;
// 按钮颜色
$button-color: #888;

.item-box {
  height: 100%;
  border-radius: $radius $radius 0 0;
  border: 1px solid $border-color;
}
.item-box-shadow {
  box-shadow: 3px 3px 5px #aaa;
}
.title-wrap {
  height: $title-height;
  border-bottom: 1px solid $border-color;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: $radius $radius 0 0;
  background: linear-gradient(white, #eee);
}
.title-name {
  line-height: $title-height;
  font-size: $title-size;
  margin-left: $title-size;
}
.button-wrap {
  height: $title-height;
  margin-right: $button-gap;
  font-size: $title-size - 3px;
  display: flex;
  align-items: center;
  color: $button-color;
  li {
    line-height: $title-size - 2px;
    height: $title-size - 2px;
    padding: 0 $button-gap;
  }
  li:hover {
    cursor: pointer;
  }
  li:not(:last-child) {
    border-right: 1px solid $button-color;
  }
  li:last-child {
    cursor: not-allowed;
  }
  li.active {
    @include font_color(#409EFF);
    font-weight: bold;
  }
}
.content {
  height: calc(100% - #{$title-height});
  position: relative;
}
</style>
