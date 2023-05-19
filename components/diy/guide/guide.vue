<template>
<!-- 辅助线 -->
<view class="diy-guide" :style="'padding: ' + itemStyle.paddingTop + 'px 0; background: ' + itemStyle.background + ';'">
  <view class="line" :style="'border-top: ' + itemStyle.lineHeight + 'px ' + itemStyle.lineStyle + ' ' + itemStyle.lineColor + ';'">
  </view>
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
@import "./guide.css";
</style>