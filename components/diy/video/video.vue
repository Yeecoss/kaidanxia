<template>
<!-- 视频组 -->
<view class="diy-video" :style="'padding: ' + itemStyle.paddingTop + 'px 0;'">
  <video preload="none" class="video" :style="'height: ' + itemStyle.height + 'px;'" :src="params.videoUrl" :poster="params.poster" :autoplay="params.autoplay == 1" controls></video>
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
    itemStyle: Object,
    params: Object
  },
  options: {},
  methods: {}
};
</script>
<style>
@import "./video.css";
</style>