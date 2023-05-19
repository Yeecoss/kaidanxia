<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" title="推广二维码"></navigationBar>
<view class="container">
  <view class="qrcode">
    <image lazy-load mode="widthFix" :src="qrcode" @tap.stop="previewImage"></image>
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取推广二维码
    this.getPoster();
  },
  methods: {
    /**
     * 获取推广二维码
     */
    getPoster: function () {
      let _this = this;

      // wx.showLoading({
      //   title: '加载中'
      // });

      getApp().globalData._get('user.dealer.qrcode/poster', {}, function (result) {
        // 设置当前页面标题
        wx.setNavigationBarTitle({
          title: result.data.words.qrcode.title.value
        });

        _this.setData(result.data);
      }, null, function () {
        // wx.hideLoading();
      });
    },
    previewImage: function () {
      wx.previewImage({
        current: this.qrcode,
        urls: [this.qrcode]
      });
    }
  }
};
</script>
<style>
@import "./qrcode.css";
</style>