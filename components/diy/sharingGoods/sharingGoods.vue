<template>
<!-- 商品组 -->
<view class="diy-sharingGoods" :style="'background: ' + itemStyle.background + ';'">
  <view class="goods-item" v-for="(dataItem, index) in dataList" :key="index">
    <form @submit="onTargetGoodsFun" report-submit="true">
      <button formType="submit" class="btn-normal dis-flex" :data-id="dataItem.goods_id">
        <!-- 商品图片 -->
        <view class="goods-item_left">
          <image lazy-load class="image" mode="aspectFill" :src="dataItem.image"></image>
        </view>
        <view class="goods-item_right">
          <!-- 商品名称 -->
          <view v-if="itemStyle.show.goodsName" class="goods-item_title twolist-hidden">
            <text>{{ dataItem.goods_name }}</text>
          </view>
          <view class="goods-item_desc">
            <!-- 商品卖点 -->
            <view v-if="itemStyle.show.sellingPoint" class="desc-selling_point onelist-hidden">
              <text>{{ dataItem.selling_point }}</text>
            </view>
            <!-- 拼团信息 -->
            <view class="desc-situation">
              <text class="iconfont icon-pintuan_huaban"></text>
              <text class="people">{{ dataItem.people }}人团</text>
              <text class="col-9">已有{{ dataItem.goods_sales }}人进行拼团</text>
            </view>
            <!-- 商品价格 -->
            <view class="desc_footer">
              <text class="price_x" v-if="itemStyle.show.sharingPrice">¥{{ dataItem.sharing_price }}</text>
              <text class="price_y col-9" v-if="itemStyle.show.linePrice && dataItem.line_price > 0">¥{{ dataItem.line_price }}</text>
            </view>
          </view>
          <view class="btn-settlement">去拼团</view>
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
    params: Object,
    dataList: Array
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    /**
     * 跳转商品详情页
     */
    onTargetGoodsFun(e) {
      // 记录formid
      getApp().globalData.saveFormId(e.detail.formId);
      uni.navigateTo({
        url: '/pages/sharing/goods/index?goods_id=' + e.detail.target.dataset.id
      });
    }

  }
};
</script>
<style>
@import "./sharingGoods.css";
</style>