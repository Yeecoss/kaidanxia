<template>
<!-- 图片橱窗 -->
<view class="diy-window" :style="'background: ' + itemStyle.background + '; padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px;'">
  <!-- matrix -->
  <view v-if="itemStyle.layout > -1" :class="'data-list avg-sm-' + itemStyle.layout">
    <view v-for="(dataItem, index) in dataList" :key="index" class="data-item" :style="'padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px;'">
      <view class="item-image" @tap.stop="navigationTo" :data-url="dataItem.linkUrl">
        <image lazy-load class="image" mode="widthFix" :src="dataItem.imgUrl"></image>
      </view>
    </view>
  </view>
  <!-- display -->
  <view v-else class="display">
    <view class="display-left" :style="'padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px;'">
      <image lazy-load class="image" @tap.stop="navigationTo" :data-url="dataList[0].linkUrl" :src="dataList[0].imgUrl"></image>
    </view>
    <view class="display-right">
      <view v-if="dataList.length >= 2" class="display-right1" :style="'padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px;'">
        <image lazy-load class="image" @tap.stop="navigationTo" :data-url="dataList[1].linkUrl" :src="dataList[1].imgUrl"></image>
      </view>
      <view class="display-right2">
        <view v-if="dataList.length >= 3" class="left" :style="'padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px;'">
          <image lazy-load class="image" @tap.stop="navigationTo" :data-url="dataList[2].linkUrl" :src="dataList[2].imgUrl"></image>
        </view>
        <view v-if="dataList.length >= 4" class="right" :style="'padding: ' + itemStyle.paddingTop + 'px ' + itemStyle.paddingLeft + 'px;'">
          <image lazy-load class="image" @tap.stop="navigationTo" :data-url="dataList[3].linkUrl" :src="dataList[3].imgUrl"></image>
        </view>
      </view>
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
    dataList: Object
  },
  options: {
    addGlobalClass: true
  },
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
@import "./window.css";
</style>