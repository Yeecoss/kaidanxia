<template>
<!-- 辅助空白 -->
<view class="diy-shop">
  <view class="shop-item" v-for="(dataItem, index) in dataList" :key="index">
    <form @submit="onTargetDetailFun" report-submit="true">
      <button formType="submit" class="btn-normal dis-flex flex-y-center" :data-id="dataItem.shop_id">
        <view class="shop-item__logo">
          <image lazy-load class="image" :src="dataItem.logo_image"></image>
        </view>
        <view class="shop-item__content flex-box">
          <view class="shop-item__title">
            <span>{{ dataItem.shop_name }}</span>
          </view>
          <view class="shop-item__address onelist-hidden">
            <span>门店地址：{{ dataItem.region.province }}{{ dataItem.region.city }}{{ dataItem.region.region }}{{ dataItem.address }}</span>
          </view>
          <view class="shop-item__phone">
            <span>联系电话：{{ dataItem.phone }}</span>
          </view>
        </view>
      </button>
    </form>
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
    dataList: Object
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    /**
     * 跳转门店详情页
     */
    onTargetDetailFun(e) {
      // 记录formid
      getApp().globalData.saveFormId(e.detail.formId);
      uni.navigateTo({
        url: '/pages/shop/detail/index?shop_id=' + e.detail.target.dataset.id
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>