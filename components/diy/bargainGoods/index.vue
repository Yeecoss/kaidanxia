<template>
<!-- 商品组 -->
<view class="diy-bargainGoods" :style="'background: ' + itemStyle.background + ';'">
  <view class="goods-item dis-flex" v-for="(dataItem, index) in dataList" :key="index">
    <form @submit="onTargetGoodsFun" report-submit="true">
      <button formType="submit" class="btn-normal dis-flex" :data-id="dataItem.active_id">
        <view class="goods-item--container dis-flex">
          <!-- 商品图片 -->
          <view class="goods-image">
            <image lazy-load class="image" :src="dataItem.goods_image"></image>
          </view>
          <view class="goods-info">
            <!-- 商品名称 -->
            <view class="goods-name">
              <text class="twolist-hidden">{{ dataItem.goods_name }}</text>
            </view>
            <!-- 参与的用户头像 -->
            <view v-if="dataItem.helps_count > 0" class="peoples dis-flex">
              <view class="user-list dis-flex">
                <view v-for="(help, index2) in dataItem.helps" :key="index2" class="user-item-avatar">
                  <image lazy-load class="image" :src="help.user.avatarUrl"></image>
                </view>
              </view>
              <view class="people__text">
                <text>{{ dataItem.helps_count }}人正在砍价</text>
              </view>
            </view>
            <!-- 商品原价 -->
            <view class="goods-price">
              <text>￥{{ dataItem.original_price }}</text>
            </view>
            <!-- 砍价低价 -->
            <view class="floor-price">
              <text class="small">最低￥</text>
              <text class="big">{{ dataItem.floor_price }}</text>
            </view>
            <!-- 操作按钮 -->
            <view class="opt-touch">
              <view class="touch-btn">
                <text>立即参加</text>
              </view>
            </view>
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
    params: Object,
    dataList: [Object,Array]
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
        url: `/pages/bargain/goods/index?active_id=${e.detail.target.dataset.id}`
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>