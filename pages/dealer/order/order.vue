<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" title="代理订单" id="top"></navigationBar>
<!-- 顶部选项卡 -->
<view class="swiper-tab dis-flex box-align-center flex-y-center">
  <block v-for="(item, index) in tabList" :key="index">
    <view :class="'swiper-tab-item ' + ( dataType == item.value ? 'on' : '')" :data-current="item.value" @tap="swichNav">{{ item.text }}</view>
  </block>
</view>
<view class="container">
  <!-- 订单列表 -->
  <scroll-view scroll-y="true" @scrolltolower="triggerDownLoad" :style="'height: ' + swiperHeight + 'px;margin-top:80rpx;'">
    <view class="widget-list b-f" v-if="list.data.length">
      <view class="widget__detail" v-for="(item, index) in list.data" :key="index">
        <view class="detail__row dis-flex flex-x-between">
          <view class="detail__left f-24">订单号：{{ item.order_master.order_no }}</view>
          <view class="detail__right f-24 c-violet">{{ item.order_master.state_text }}</view>
        </view>
        <view class="detail__row m-top10 dis-flex flex-x-between">
          <view class="detail__left dis-flex flex-y-center">
            <view class="user-avatar">
              <image lazy-load :src="item.user.avatarUrl"></image>
            </view>
            <view class="user-info dis-flex flex-dir-column flex-x-center">
              <view class="user-nickName f-28">{{ item.user.nickName }}</view>
              <view class="user-time f-24 c-80">消费金额：￥{{ item.order_price }}</view>
            </view>
          </view>
          <view class="detail__right dis-flex flex-dir-column flex-x-center flex-y-center">
            <view class="detail__money t-r col-m">
              <text class="f-26">+</text>
              <text class="f-28" v-if="item.first_user_id == user_id">{{ item.first_money }}</text>
              <text class="f-28" v-if="item.second_user_id == user_id">{{ item.second_money }}</text>
              <text class="f-28" v-if="item.third_user_id == user_id">{{ item.third_money }}</text>
            </view>
            <view class="detail__time f-22 c-80">{{ item.create_time }}</view>
          </view>
        </view>
      </view>
      <!-- 没有更多 -->
      <view v-if="list.data.length && !isLoading && no_more" class="no-more f-30">亲, 没有更多了</view>
    </view>
    <!-- 没有记录 -->
    <view class="yoshop-notcont" v-if="!list.data.length && !isLoading">
      <text class="iconfont icon-wushuju"></text>
      <text class="cont">亲，暂无订单记录哦</text>
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
      isLoading: true,
      dataType: -1,
      page: 1,
      no_more: false,
      swiperHeight: "",
      list: {}
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置swiper的高度
    this.setSwiperHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getOrderList();
  },
  methods: {
    /**
     * 获取订单列表
     */
    getOrderList: function (isNextPage, page) {
      let _this = this;

      getApp().globalData._get('user.dealer.order/lists', {
        settled: _this.dataType,
        page: page || 1
      }, function (result) {
        // 创建页面数据
        _this.setData(_this.createData(result.data, isNextPage));
      });
    },

    /**
     * 创建页面数据
     */
    createData: function (data, isNextPage) {
      data['isLoading'] = false; // 列表数据

      let dataList = this.list;

      if (isNextPage == true && typeof dataList !== 'undefined') {
        data.list.data = dataList.data.concat(data.list.data);
      } // 设置当前页面标题


      wx.setNavigationBarTitle({
        title: data.words.order.title.value
      }); // 当前用户id

      data['user_id'] = getApp().globalData.getUserId(); // 导航栏数据

      data['tabList'] = [{
        value: -1,
        text: data.words.order.words.all.value
      }, {
        value: 0,
        text: data.words.order.words.unsettled.value
      }, {
        value: 1,
        text: data.words.order.words.settled.value
      }];
      return data;
    },

    /**
     * 设置swiper的高度
     */
    setSwiperHeight: function () {
      // 获取系统信息(拿到屏幕宽度)
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        tapHeight = Math.floor(rpx * 82),
            // tap高度
        swiperHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度

        this.setData({
          swiperHeight
        });
      });
    },

    /** 
     * 点击tab切换 
     */
    swichNav: function (e) {
      let _this = this;

      _this.setData({
        dataType: e.target.dataset.current,
        list: {},
        page: 1,
        no_more: false,
        isLoading: true
      }, function () {
        // 获取订单列表
        _this.getOrderList();
      });
    },

    /**
     * 下拉到底加载数据
     */
    triggerDownLoad: function () {
      // 已经是最后一页
      if (this.page >= this.list.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      } // 获取订单列表


      this.getOrderList(true, ++this.page);
    }
  }
};
</script>
<style>
@import "./order.css";
</style>