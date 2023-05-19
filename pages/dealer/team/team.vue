<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" title="我的团队" id="top"></navigationBar>
<view class="container">
  <!-- 顶部选项卡 -->
  <view v-if="tabList.length > 1" class="swiper-tab dis-flex box-align-center flex-y-center">
    <block v-for="(item, index) in tabList" :key="index">
      <view :class="'swiper-tab-item ' + ( dataType == item.value ? 'on' : '') + ' flex-box'" :data-current="item.value" @tap="swichNav">{{ item.text }}({{ item.total }})</view>
    </block>
  </view>
  <!-- 团队总人数 -->
  <view class="widget-people f-28 col-9">{{ words.team.words.total_team.value }}：{{ team_total }}人</view>
  <!-- 我的团队列表 -->
  <scroll-view scroll-y="true" @scrolltolower="triggerDownLoad" :style="'height: ' + swiperHeight + 'px;'">
    <view class="widget-list b-f" v-if="list.data.length">
      <view class="widget__detail dis-flex flex-x-between" v-for="(item, index) in list.data" :key="index">
        <view class="detail__left dis-flex flex-y-center">
          <view class="user-avatar">
            <image lazy-load :src="item.user.avatarUrl"></image>
          </view>
          <view class="user-info dis-flex flex-dir-column flex-x-center">
            <view class="user-nickName f-28">{{ item.user.nickName }}</view>
            <view class="user-time col-9 f-24">{{ item.create_time }}</view>
          </view>
        </view>
        <view class="detail__right dis-flex flex-dir-column flex-x-center flex-y-center">
          <view class="detail__money">
            <text class="f-24">￥</text>
            <text class="f-34">{{ item.user.expend_money }}</text>
          </view>
          <view class="detail__member f-22" v-if="item.dealer">{{ item.dealer.first_num + item.dealer.second_num + item.dealer.third_num }}个成员</view>
        </view>
      </view>
      <!-- 没有更多 -->
      <view v-if="list.data.length && !isLoading && no_more" class="no-more f-30">亲, 没有更多了</view>
    </view>
    <!-- 没有记录 -->
    <view class="yoshop-notcont" v-if="!list.data.length && !isLoading">
      <text class="iconfont icon-wushuju"></text>
      <text class="cont">亲，暂无团队记录哦</text>
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
      dataType: 1,
      page: 1,
      no_more: false,
      swiperHeight: "",
      list: {}
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取我的团队列表
    this.getTeamList();
  },
  methods: {
    /**
     * 获取我的团队列表
     */
    getTeamList: function (isNextPage, page) {
      let _this = this;

      getApp().globalData._get('user.dealer.team/lists', {
        level: _this.dataType,
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
        title: data.words.team.title.value
      }); // 团队总人数

      data['team_total'] = data.dealer.first_num; // 导航栏数据

      data['tabList'] = [{
        value: 1,
        text: data.words.team.words.first.value,
        total: data.dealer.first_num
      }];

      if (data.setting.level >= 2) {
        data['tabList'].push({
          value: 2,
          text: data.words.team.words.second.value,
          total: data.dealer.second_num
        });
        data['team_total'] += data.dealer.second_num;
      }

      if (data.setting.level == 3) {
        data['tabList'].push({
          value: 3,
          text: data.words.team.words.third.value,
          total: data.dealer.third_num
        });
        data['team_total'] += data.dealer.third_num;
      } // 设置swiper的高度


      this.setSwiperHeight(data.setting.level > 1);
      return data;
    },

    /**
     * 下拉到底加载数据
     */
    triggerDownLoad: function () {
      // console.log(this.data.list);
      // 已经是最后一页
      if (this.page >= this.list.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      }

      this.getTeamList(true, ++this.page);
    },

    /**
     * 设置swiper的高度
     */
    setSwiperHeight: function (isTap) {
      // 获取系统信息(拿到屏幕宽度)
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        tapHeight = isTap ? Math.floor(rpx * 82) : 0,
            // tap高度
        peopleHeight = Math.floor(rpx * 65),
            // people高度
        swiperHeight = systemInfo.windowHeight - tapHeight - peopleHeight - res[0].height; // swiper高度

        this.setData({
          swiperHeight
        });
      }); // let systemInfo = wx.getSystemInfoSync(),
      //   rpx = systemInfo.windowWidth / 750, // 计算rpx
      //   tapHeight = isTap ? Math.floor(rpx * 82) : 0, // tap高度
      //   peopleHeight = Math.floor(rpx * 65), // people高度
      //   swiperHeight = systemInfo.windowHeight - tapHeight - peopleHeight - res[0].height; // swiper高度
      // this.setData({
      //   swiperHeight
      // });
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
        // 获取我的团队列表
        _this.getTeamList();
      });
    }
  }
};
</script>
<style>
@import "./team.css";
</style>