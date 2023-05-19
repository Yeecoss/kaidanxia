<template>
<!-- 单图组 -->
<view class="diy-imageSingle" :style="'padding-bottom: ' + itemStyle.paddingTop + 'px;'">
  <view class="item-image" v-for="(dataItem, index) in dataList" :key="index" :style="'padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px 0;'">
    <view class="nav-to" @tap.stop="navigationTo" :data-url="dataItem.linkUrl">
      <image lazy-load class="image" :src="dataItem.imgUrl" mode="widthFix"></image>
    </view>
  </view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    dataList: [Object, Array]
  },
  options: {},
  methods: {
    /**
     * 跳转到指定页面
     */
    navigationTo: function (e) {
      getApp().globalData.navigationTo(e.currentTarget.dataset.url);
    }
  }
};
</script>
<style>
@import "./imageSingle.css";
</style>