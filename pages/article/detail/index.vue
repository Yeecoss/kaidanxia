<template>
<view>
<view class="container b-f p-b">
  <view class="article-title">
    <text class="f-32">{{ detail.article_title }}</text>
  </view>
  <view class="article-little dis-flex flex-x-between m-top10">
    <view class="article-little__left">
      <text class="article-views f-24 col-8">{{ detail.show_views }}次浏览</text>
    </view>
    <view class="article-little__right">
      <text class="article-views f-24 col-8">{{ detail.view_time }}</text>
    </view>
  </view>
  <view class="article-content m-top20">
    <jyf-parser :html="article_content"></jyf-parser>
  </view>
</view>

</view>
</template>

<script>
const App = getApp().globalData; // 富文本插件

export default {
  data() {
    return {
      // 文章详情
      detail: {},
      article_content: ""
    };
  },

  components: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取文章详情
    this.getArticleDetail(options.article_id);
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    // 构建页面参数
    let params = getApp().globalData.getShareUrlParams({
      'article_id': this.detail.article_id
    });
    return {
      title: this.detail.article_title,
      path: "/pages/article/detail/index?" + params
    };
  },

  methods: {
    /**
     * 获取文章详情
     */
    getArticleDetail(article_id) {
      let _this = this;

      getApp().globalData._get('article/detail', {
        article_id
      }, function (result) {
        let detail = result.data.detail; // 富文本转码

        if (detail.article_content.length > 0) {
          //wxParse.wxParse('content', 'html', detail.article_content, _this, 0)
          setTimeout(() => {
            _this.article_content = detail.article_content;
          }, 200);
        }

        _this.setData({
          detail
        });
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>