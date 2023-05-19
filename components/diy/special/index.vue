<template>
<!-- 头条快报 -->
<view class="diy-special dis-flex flex-y-center">
  <!-- 图片 -->
  <form @submit="onTargetIndexFun" report-submit="true">
    <button formType="submit" class="btn-normal dis-flex">
      <view class="special-left">
        <image lazy-load class="image" mode="widthFix" :src="itemStyle.image"></image>
      </view>
    </button>
  </form>
  <!-- 资讯轮播 -->
  <swiper :class="'special-content flex-box display_' + itemStyle.display" autoplay="true" :interval="2200" duration="800" circular="true" vertical="true" :display-multiple-items="itemStyle.display">
    <swiper-item v-for="(item, index) in dataList" :key="index">
      <form @submit="onTargetDetailFun" report-submit="true">
        <button formType="submit" class="btn-normal dis-flex" :data-id="item.article_id">
          <view class="content-item onelist-hidden">
            <text>{{ item.article_title }}</text>
          </view>
        </button>
      </form>
    </swiper-item>
  </swiper>
  <!-- 更多资讯 -->
  <form @submit="onTargetIndexFun" report-submit="true">
    <button formType="submit" class="btn-normal dis-flex">
      <view class="special-more">
        <i class="iconfont icon-xiangyoujiantou"></i>
      </view>
    </button>
  </form>
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
     * 跳转文章首页
     */
    onTargetIndexFun(e) {
      // 记录formid
      getApp().globalData.saveFormId(e.detail.formId);
      uni.navigateTo({
        url: '/pages/article/index'
      });
    },

    /**
     * 跳转文章详情页
     */
    onTargetDetailFun(e) {
      // 记录formid
      getApp().globalData.saveFormId(e.detail.formId);
      uni.navigateTo({
        url: '/pages/article/detail/index?article_id=' + e.detail.target.dataset.id
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>