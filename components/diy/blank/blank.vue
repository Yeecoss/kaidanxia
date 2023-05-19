<template>
<!-- 辅助空白 -->
<view class="diy-blank" :style="'height: ' + itemStyle.height + 'px; background: ' + itemStyle.background + ';'">
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    itemIndex: String,
    itemStyle: Object
  },
  options: {},
  methods: {}
};
</script>
<style>
@import "./blank.css";
</style>