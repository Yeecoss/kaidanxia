<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" title="查看物流"></navigationBar>
<view class="container p-bottom" v-if="express.express_name">
  <!-- 物流公司 -->
  <view class="flow-all-money dis-flex b-f padding-box">
    <view class="flex-box">
      <view class="dis-flex flow-all-list-cont">
        <text class="col-7">物流公司: {{express.express_name}}</text>
      </view>
      <view class="dis-flex flow-all-list-cont">
        <text class="col-7" selectable="true">物流单号: {{express.express_no}}</text>
      </view>
    </view>
  </view>
  <!-- 物流动态 -->
  <view class="logis-detail m-top20 b-f">
    <view :class="'logis-item ' + ( index === 0 ? 'first' : '' )" v-for="(item, index) in express.list" :key="index">
      <view class="logis-item-content">
        <view class="logis-item-content__describe">
          <text class="f-26">{{ item.context }}</text>
        </view>
        <view class="logis-item-content__time">
          <text class="f-22">{{ item.ftime }}</text>
        </view>
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
    return {
      options: {},
      express: {}
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取物流动态
    this.getExpressDynamic(options.order_id);
  },
  methods: {
    /**
     * 获取物流动态
     */
    getExpressDynamic: function (order_id) {
      let _this = this;

      getApp().globalData._get('sharing.order/express', {
        order_id
      }, function (result) {
        _this.setData(result.data);
      }, function () {
        wx.navigateBack();
      });
    }
  }
};
</script>
<style>
@import "./express.css";
</style>