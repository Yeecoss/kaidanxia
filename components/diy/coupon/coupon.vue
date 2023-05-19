<template>
<!-- 优惠券组 -->
<view class="diy-coupon" v-if="dataList.length" :style="'background: ' + itemStyle.background + '; padding: ' + itemStyle.paddingTop + 'px 0;'">

  <scroll-view scroll-x="true">
    <view class="coupon-wrapper" v-for="(dataItem, index) in dataList" :key="index">
      <view :class="'coupon-item color__' + ( dataItem.state.value ? dataItem.color.text : 'gray' )">
        <i class="before" :style="'background: ' + itemStyle.background + ';'"></i>
        <view class="left-content dis-flex flex-dir-column flex-x-center flex-y-center">
          <view class="content-top">
            <block v-if="dataItem.coupon_type.value == 10">
              <text class="f-30">￥</text>
              <text class="price">{{ dataItem.reduce_price }}</text>
            </block>
            <text class="price" v-if="dataItem.coupon_type.value == 20">{{ dataItem.discount }}折</text>
          </view>
          <view class="content-bottom">
            <text class="f-22">满{{ dataItem.min_price }}元可用</text>
          </view>
        </view>
        <view class="right-receive dis-flex flex-x-center flex-y-center" @tap.stop="receiveTap" :data-index="index" :data-state="dataItem.state.value" :data-coupon-id="dataItem.coupon_id">
          <view v-if="dataItem.state.value" class="dis-flex flex-dir-column">
            <text>立即</text>
            <text>领取</text>
          </view>
          <view v-else class="state">
            <text>{{ dataItem.state.text }}</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>

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
     * 领取优惠券
     */
    receiveTap: function (e) {
      let _this = this,
          dataset = e.currentTarget.dataset;

      if (!dataset.state) {
        return false;
      }

      getApp().globalData._post_form('user.coupon/receive', {
        coupon_id: dataset.couponId
      }, function (result) {
        getApp().globalData.showSuccess(result.msg);

        _this.setData({
          ['dataList[' + dataset.index + '].state']: {
            value: 0,
            text: '已领取'
          }
        });
      });
    }
  }
};
</script>
<style>
@import "./coupon.css";
</style>