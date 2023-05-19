<template>
<view>
<!-- 分类tab -->
<view class="header">
  <scroll-view scroll-x scroll-left style="height: 100%;">
    <view :class="'cs ' + ( category_id ==  0 ? 'active' : '' )" @tap.stop="onSwitchTab" data-id="0">
      <text>全部</text>
    </view>
    <!-- 分类列表 -->
    <view :class="'cs ' + (  item.category_id == category_id ? 'active' : '' )" @tap.stop="onSwitchTab" v-for="(item, index) in categoryList" :key="index" :data-id="item.category_id">
      <text>{{ item.name }}</text>
    </view>
  </scroll-view>
</view>

<!-- 文章列表 -->
<view class="article-list">
  <scroll-view @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;'">
    <view :class="'article-item show-type__' + item.show_type" v-for="(item, index) in articleList.data" :key="index" @tap.stop="onTargetDetail" :data-id="item.article_id">
      <!-- 小图模式 -->
      <block v-if="item.show_type == 10">
        <view class="article-item__left flex-box">
          <view class="article-item__title twolist-hidden">
            <text class="dis-block f-30 col-3">{{ item.article_title }}</text>
          </view>
          <view class="article-item__footer m-top10">
            <text class="article-views f-24 col-8">{{ item.show_views }}次浏览</text>
          </view>
        </view>
        <view class="article-item__image">
          <image lazy-load mode="widthFix" :src="item.image.file_path"></image>
        </view>
      </block>
      <!-- 大图模式 -->
      <block v-if="item.show_type == 20">
        <view class="article-item__title twolist-hidden">
          <text class="dis-block f-30 col-3">{{ item.article_title }}</text>
        </view>
        <view class="article-item__image m-top20">
          <image lazy-load mode="widthFix" :src="item.image.file_path"></image>
        </view>
        <view class="article-item__footer m-top10">
          <text class="article-views f-24 col-8">{{ item.show_views }}次浏览</text>
        </view>
      </block>
    </view>
    <view v-if="no_more" class="no-more f-30">亲, 没有更多了</view>
    <!-- 无数据提供的页面 -->
    <view v-if="!isLoading && !articleList.data.length">
      <view class="yoshop-notcont">
        <text class="iconfont icon-wushuju"></text>
        <text class="cont">亲，暂无内容哦</text>
      </view>
    </view>
  </scroll-view>
</view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      // 分类列表
      categoryList: [],
      // 文章列表
      articleList: [],
      // 当前的分类id (0则代表首页)
      category_id: 0,
      scrollHeight: null,
      no_more: false,
      // 没有更多数据
      isLoading: true,
      // 是否正在加载中
      page: 1 // 当前页码

    };
  },

  components: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this; // 设置文章列表高度


    _this.setListHeight(); // Api：获取文章首页


    _this.getIndexData();
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    return {
      title: '文章首页',
      path: "/pages/article/index?" + getApp().globalData.getShareUrlParams()
    };
  },

  methods: {
    /**
     * Api：获取文章列表
     */
    getIndexData() {
      let _this = this; // 获取文章首页


      getApp().globalData._get('article/index', {}, function (result) {
        _this.setData({
          categoryList: result.data.categoryList
        });
      }); // Api：获取文章列表


      _this.getArticleList();
    },

    /**
     * Api：切换导航栏
     */
    onSwitchTab: function (e) {
      let _this = this; // 第一步：切换当前的分类id


      _this.setData({
        category_id: e.currentTarget.dataset.id,
        articleList: {},
        page: 1,
        no_more: false,
        isLoading: true
      }); // 第二步：更新当前的文章列表


      _this.getArticleList();
    },

    /**
     * Api：获取文章列表
     */
    getArticleList(isPage, page) {
      let _this = this;

      getApp().globalData._get('article/lists', {
        page: page || 1,
        category_id: _this.category_id
      }, function (result) {
        let resList = result.data.list,
            dataList = _this.articleList;

        if (isPage == true) {
          _this.setData({
            'articleList.data': dataList.data.concat(resList.data),
            isLoading: false
          });
        } else {
          _this.setData({
            articleList: resList,
            isLoading: false
          });
        }
      });
    },

    /**
     * 跳转文章详情页
     */
    onTargetDetail(e) {
      uni.navigateTo({
        url: './detail/index?article_id=' + e.currentTarget.dataset.id
      });
    },

    /**
     * 下拉到底加载数据
     */
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.articleList.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      } // 加载下一页列表


      this.getArticleList(true, ++this.page);
    },

    /**
     * 设置文章列表高度
     */
    setListHeight() {
      let systemInfo = wx.getSystemInfoSync(),
          rpx = systemInfo.windowWidth / 750,
          // 计算rpx
      tapHeight = Math.floor(rpx * 98),
          // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度

      this.setData({
        scrollHeight
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>