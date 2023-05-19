<template>
<!-- 导航组 -->
<view class="diy-navBar radius16">
  <view :class="'data-list avg-sm-' + itemStyle.rowsNum">
    <view class="item-nav" v-for="(dataItem, index) in dataList" :key="index">
      <view class="nav-to" @tap.stop="navigationTo(dataItem)">
        <view class="item-image">
          <image lazy-load class="image" mode="aspectFit" :src="dataItem.imgUrl"></image>
        </view>
        <view class="item-text f-22 onelist-hidden" :style="'color: ' + dataItem.color + ';'">{{ dataItem.text }}</view>
      </view>
    </view>
  </view>
  <contact ref="contact"></contact>
</view>
</template>

<script>
import contact from '@/components/myGoodsCommon/contact/index';
const App = getApp().globalData;

export default {
  data() {
    return {};
  },

  components: {
    contact
  },
  props: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    dataList: [Object, Array],
    user: {
      type: Object
    }
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    /**
     * 跳转到指定页面
     */
    navigationTo: function (item) {
      if (item.linkUrl == 'event-contact') {
        this.$refs.contact.open(this.user)
      } else {
        App.navigationTo(item.linkUrl);
      }
    }
  }
};
</script>
<style>
@import "./navBar.css";
</style>