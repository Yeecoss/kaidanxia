<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="我的代理" extClass="nav" id="top"></navigationBar>
<view class="container b-f" v-if="is_dealer && isData">

  <!-- 头部背景图 -->
  <view class="dealer-bg">
    <image lazy-load mode="widthFix" :src="background"></image>
  </view>

  <!-- widget -->
  <view class="widget-body b-f dis-flex flex-dir-column flex-y-center">
    <!-- 用户信息 -->
    <view class="widget widget__base m-top20 b-f dis-flex flex-dir-column">
      <view class="base__user f-30">
        <!-- 用户头像 -->
        <view class="user-avatar">
          <image lazy-load :src="user.avatarUrl"></image>
        </view>
        <view class="user-nickName f-32">{{ user.nickName }}</view>
        <view class="user-referee f-24 col-9">{{ words.index.words.referee.value }}：{{ dealer.referee ? dealer.referee.nickName : '平台' }}</view>
      </view>
      <view class="base__capital dis-flex flex-dir-column">
        <!-- 收益卡片 -->
        <view class="capital-card dis-flex">
          <view class="card-left flex-box dis-flex flex-dir-column flex-x-around">
            <view class="f-28 col-f">
              <text space="ensp">{{ words.index.words.money.value }} {{ dealer.money }} 元</text>
            </view>
            <view class="f-28 col-f">
              <text space="ensp">{{ words.index.words.freeze_money.value }} {{ dealer.freeze_money }} 元</text>
            </view>
          </view>
          <view class="card-right flex-box dis-flex flex-x-end flex-y-center">
            <view class="withdraw-btn f-26" @tap.stop="navigationToWithdraw">{{ words.index.words.withdraw.value }}</view>
          </view>
        </view>
        <!-- 已提现金额 -->
        <view class="capital-already clear">
          <view class="already-left f-28 fl">{{ words.index.words.total_money.value }}</view>
          <view class="already-right f-28 fr">{{ dealer.total_money }}元</view>
        </view>
      </view>
    </view>

    <!-- 操作列表 -->
    <view class="widget widget__operat clear b-f">
      <view class="operat__item">
        <navigator hover-class="none" url="../withdraw/list/list">
          <view class="item__icon">
            <text class="iconfont icon-zhangben" style="color:#F9BA21;"></text>
          </view>
          <view class="item__text f-28">{{ words.withdraw_list.title.value }}</view>
        </navigator>
      </view>
      <view class="operat__item">
        <navigator hover-class="none" url="../order/order">
          <view class="item__icon">
            <text class="iconfont icon-dingdan" style="color:#FF7575;"></text>
          </view>
          <view class="item__text f-28">{{ words.order.title.value }}</view>
        </navigator>
      </view>
      <view class="operat__item">
        <navigator hover-class="none" url="../team/team">
          <view class="item__icon">
            <text class="iconfont icon-tuandui" style="color:#59C78E;"></text>
          </view>
          <view class="item__text f-28">{{ words.team.title.value }}</view>
        </navigator>
      </view>
      <view class="operat__item">
        <navigator hover-class="none" url="../qrcode/qrcode">
          <view class="item__icon">
            <text class="iconfont icon-erweima" style="color:#5fa5ff;"></text>
          </view>
          <view class="item__text f-28">{{ words.qrcode.title.value }}</view>
        </navigator>
      </view>
    </view>
  </view>
</view>

<!-- 当前不是渠道商 -->
<view class="container b-f" v-if="!is_dealer && isData">
  <view class="no-dealer">
    <view class="no-icon dis-flex flex-x-center">
      <image lazy-load src="/static/images/not-dealer.png"></image>
    </view>
    <view class="no-msg dis-flex flex-x-center f-30">{{ words.index.words.not_dealer.value }}</view>
    <!-- 立即申请 -->
    <view class="no-submit form-submit dis-flex flex-x-center">
      <form @submit="triggerApply" report-submit="true">
        <button formType="submit">{{ words.index.words.apply_now.value }}</button>
      </form>
    </view>
  </view>
</view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      isData: false,
      words: {},
      user: {},
      dealer: {}
    };
  },

  components: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this; // 获取渠道商中心数据


    _this.getDealerCenter();
  },

  methods: {
    /**
     * 获取渠道商中心数据
     */
    getDealerCenter() {
      let _this = this;

      getApp().globalData._get('user.dealer/center', {}, function (result) {
        let data = result.data;
        data.isData = true; // 设置当前页面标题

        wx.setNavigationBarTitle({
          title: data.words.index.title.value
        });

        _this.setData(data);
      });
    },

    /**
     * 跳转到提现页面
     */
    navigationToWithdraw() {
      uni.navigateTo({
        url: '../withdraw/apply/apply'
      });
    },

    /**
     * 立即加入渠道商
     */
    triggerApply(e) {
      uni.navigateTo({
        url: '../apply/apply'
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>