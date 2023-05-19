<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="提现明细" extClass="nav" id="top"></navigationBar>
<!-- 顶部选项卡 -->
<view class="swiper-tab dis-flex box-align-center flex-y-center">
  <block v-for="(item, index) in tabList" :key="index">
    <view :class="'swiper-tab-item ' + ( dataType == item.value ? 'on' : '')" :data-current="item.value" @tap="swichNav">{{ item.text }}</view>
  </block>
</view>
<view class="container b-f">
  <!-- 提现明细列表 -->
  <scroll-view scroll-y="true" @scrolltolower="triggerDownLoad" :style="'height: ' + swiperHeight + 'px;margin-top:80rpx'">
    <view class="widget-list" v-if="list.data.length">
      <view class="widget__detail dis-flex flex-x-between" v-for="(item, index) in list.data" :key="index">
        <view class="detail__left dis-flex flex-dir-column flex-x-around">
          <view class="detail__money f-30">提现 {{ item.money }}元</view>
          <view class="detail__time col-9 f-24">{{ item.create_time }}</view>
        </view>
        <view class="detail__right dis-flex flex-dir-column flex-x-center flex-y-center">
          <view :class="'detail__status f-28 ' + ( item.apply_status == 20 || item.apply_status == 40 ? 'col-green' : 'col-m' )">{{ applyStatus[item.apply_status] }}</view>
          <block v-if="item.apply_status == 30">
            <view class="detail__reason f-24" @tap.stop="triggerReasonMsg" :data-reason="item.reject_reason">查看原因</view>
          </block>
        </view>
      </view>
      <!-- 没有更多 -->
      <view v-if="list.data.length && !isLoading && no_more" class="no-more f-30">亲, 没有更多了</view>
    </view>
    <!-- 没有记录 -->
    <view class="yoshop-notcont" v-if="!list.data.length && !isLoading">
      <text class="iconfont icon-wushuju"></text>
      <text class="cont">亲，暂无提现记录哦</text>
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
      applyStatus: [],
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
    // 获取提现明细列表
    this.getWithdrawList();
  },
  methods: {
    /**
     * 获取提现明细列表
     */
    getWithdrawList: function (isNextPage, page) {
      let _this = this;

      getApp().globalData._get('user.dealer.withdraw/lists', {
        status: _this.dataType,
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
        title: data.words.withdraw_list.title.value
      }); // 导航栏数据

      data['tabList'] = [{
        value: -1,
        text: data.words.withdraw_list.words.all.value
      }, {
        value: 10,
        text: data.words.withdraw_list.words.apply_10.value
      }, {
        value: 20,
        text: data.words.withdraw_list.words.apply_20.value
      }, {
        value: 40,
        text: data.words.withdraw_list.words.apply_40.value
      }, {
        value: 30,
        text: data.words.withdraw_list.words.apply_30.value
      }]; // 审核状态

      data['applyStatus'] = {};
      data['tabList'].forEach(function (item) {
        data['applyStatus'][item.value] = item.text;
      });
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
      let _this = this,
          current = e.target.dataset.current;

      if (_this.dataType == current) {
        return false;
      }

      _this.setData({
        dataType: current,
        list: {},
        page: 1,
        no_more: false,
        isLoading: true
      }, function () {
        // 获取提现明细列表
        _this.getWithdrawList();
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
      } // 获取提现明细列表


      this.getWithdrawList(true, ++this.page);
    },

    /**
     * 查看驳回原因
     */
    triggerReasonMsg: function (e) {
      wx.showModal({
        // title: this.data.applyStatus['30'] + '原因',
        title: '友情提示',
        content: e.currentTarget.dataset.reason,
        showCancel: false
      });
    }
  }
};
</script>
<style>
@import "./list.css";
</style>