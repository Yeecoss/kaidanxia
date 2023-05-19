<template>
<!-- 文章组 -->
<view class="diy-article">
  <view :class="'article-item show-type__' + item.show_type" v-for="(item, index) in dataList" :key="index" @tap.stop="onTargetDetail" :data-id="item.article_id">
    <!-- 小图模式 -->
    <block v-if="item.show_type == 10">
      <view class="article-item__left flex-box">
        <view class="article-item__title twolist-hidden">
          <text class="f-30 col-3">{{ item.article_title }}</text>
        </view>
        <view class="article-item__footer m-top10">
          <text class="article-views f-24 col-8">{{ item.show_views }}次浏览</text>
        </view>
      </view>
      <view class="article-item__image">
        <image lazy-load class="image" mode="widthFix" :src="item.image.file_path"></image>
      </view>
    </block>
    <!-- 大图模式 -->
    <block v-if="item.show_type == 20">
      <view class="article-item__title">
        <text class="f-30 col-3">{{ item.article_title }}</text>
      </view>
      <view class="article-item__image m-top20">
        <image lazy-load class="image" mode="widthFix" :src="item.image.file_path"></image>
      </view>
      <view class="article-item__footer m-top10">
        <text class="article-views f-24 col-8">{{ item.show_views }}次浏览</text>
      </view>
    </block>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    itemIndex: String,
    // itemStyle: Object,
    params: Object,
    dataList: Object
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    /**
     * 跳转文章详情页
     */
    onTargetDetail(e) {
      uni.navigateTo({
        url: '/pages/article/detail/index?article_id=' + e.currentTarget.dataset.id
      });
    }

  }
};
</script>
<style>
@import "./article.css";
</style>