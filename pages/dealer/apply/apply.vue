<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" title="申请"></navigationBar>
<view class="container" v-if="isData">

  <!-- 头部背景图 -->
  <view class="dealer-bg">
    <image lazy-load mode="widthFix" :src="background"></image>
  </view>

  <!-- 填写申请信息 -->
  <block v-if="!is_applying">
    <view class="dis-flex flex-dir-column flex-y-center">
      <view class="widget-form b-f m-top20 dis-flex flex-dir-column">
        <view class="form-title f-30">{{ words.apply.words.title.value }}</view>
        <view class="form-box dis-flex flex-dir-column">
          <form @submit="onFormSubmit" report-submit="true">
            <view class="form-field dis-flex flex-y-center">
              <view class="field-label">邀请人</view>
              <view class="field-input">
                <text>{{ referee_name }}（请核对）</text>
              </view>
            </view>
            <view class="form-field dis-flex flex-y-center">
              <view class="field-label">姓名</view>
              <view class="field-input flex-box">
                <input name="name" placeholder="请输入真实姓名" :value="name"/>
              </view>
            </view>
            <view class="form-field dis-flex flex-y-center">
              <view class="field-label">手机号</view>
              <view class="field-input flex-box">
                <input name="mobile" placeholder="请输入手机号" :value="mobile"/>
              </view>
            </view>
            <!-- 申请协议 -->
            <view class="form-license dis-flex flex-x-center flex-y-center">
              <view class="license-radio dis-flex flex-y-center" @tap.stop="toggleSetRead">
                <text :class="'license-icon  ' + ( is_read ? 'c-violet' : 'col-bb' ) + ' f-38 iconfont icon-radio'"></text>
                <text class="f-28 col-80">我已阅读并了解</text>
              </view>
              <text @tap.stop="toggleApplyLicense" class="f-28 c-violet">【{{ words.apply.words.license.value }}】</text>
            </view>
            <!-- 立即申请 -->
            <view class="form-submit dis-flex flex-x-center">
              <button formType="submit" :disabled="disabled">{{ words.apply.words.submit.value }}</button>
            </view>
          </form>
        </view>
      </view>
    </view>
    <zan-dialog id="zan-base-dialog"></zan-dialog>
  </block>

  <!-- 等待审核 -->
  <view v-if="is_applying" class="dealer-boot dis-flex flex-dir-column flex-y-center">
    <view class="boot__msg f-30 dis-flex flex-dir-column flex-y-center">
      <text class="msg__icon iconfont icon-shenhezhong"></text>
      <text class="msg__content m-top20 f-29 col-80">{{ words.apply.words.wait_audit.value }}</text>
    </view>
    <!-- 去商城逛逛 -->
    <view class="boot__submit form-submit dis-flex flex-x-center">
      <form @submit="navigationToIndex" report-submit="true">
        <button formType="submit">{{ words.apply.words.goto_mall.value }}</button>
      </form>
    </view>
    <!-- 订阅消息通知 -->
    <view class="boot__submsg" @tap.stop="onSubMsg">
        <text class="iconfont icon-iconxx"></text>
        <text class="f-29">点击订阅消息通知</text>
    </view>
  </view>
</view>
</view>
</template>

<script>
const App = getApp().globalData;
const Dialog = require("@/components/dialog/dialog");
import zanDialog from "@/components/dialog/index";

export default {
  data() {
    return {
      is_read: false,
      disabled: false,
      submsgSetting: {} // 订阅消息配置

    };
  },

  components: {
    zanDialog,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this; // 获取订阅消息配置


    _this.getSubmsgSetting();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this; // 获取渠道商申请状态


    _this.getApplyState();
  },

  methods: {
    /**
     * 获取订阅消息配置
     */
    getSubmsgSetting() {
      let _this = this;

      getApp().globalData._get('wxapp.submsg/setting', {}, result => {
        _this.setData({
          submsgSetting: result.data.setting
        });
      });
    },

    /**
     * 获取渠道商申请状态
     */
    getApplyState() {
      let _this = this;

      getApp().globalData._get('user.dealer/apply', {
        referee_id: _this.getRefereeid()
      }, result => {
        let data = result.data; // 当前是否已经为渠道商

        if (data.is_dealer) {
          wx.redirectTo({
            url: '../index/index'
          });
        } // 设置当前页面标题


        wx.setNavigationBarTitle({
          title: data.words.apply.title.value
        });
        data.isData = true;

        _this.setData(data);
      });
    },

    /**
     * 显示申请协议
     */
    toggleApplyLicense() {
      Dialog({
        title: '申请协议',
        message: this.license,
        selector: '#zan-base-dialog',
        isScroll: true,
        // 滚动
        buttons: [{
          text: '我已阅读',
          color: 'red',
          type: 'cash'
        }]
      }).then(() => {
      });
    },

    /**
     * 已阅读
     */
    toggleSetRead() {
      let _this = this;

      _this.setData({
        is_read: !this.is_read
      });
    },

    /**
     * 提交申请 
     */
    onFormSubmit(e) {
      let _this = this,
          values = e.detail.value; // 验证姓名


      if (!values.name || values.name.length < 1) {
        getApp().globalData.showError('请填写姓名');
        return false;
      } // 验证手机号


      if (!/^\+?\d[\d -]{8,12}\d/.test(values.mobile)) {
        getApp().globalData.showError('手机号格式不正确');
        return false;
      } // 验证是否阅读协议


      if (!_this.is_read) {
        getApp().globalData.showError('请先阅读渠道商申请协议');
        return false;
      } // 按钮禁用


      _this.setData({
        disabled: true
      }); // 数据提交


      getApp().globalData._post_form('user.dealer.apply/submit', values, () => {
        // 获取渠道商申请状态
        _this.getApplyState();
      }, null, () => {
        // 解除按钮禁用
        _this.setData({
          disabled: false
        });
      });
    },

    /**
     * 去商城逛逛
     */
    navigationToIndex(e) {
      // 跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      });
    },

    /**
     * 订阅消息通知
     */
    onSubMsg() {
      let _this = this;

      let tmplItem = _this.submsgSetting.dealer.apply.template_id;

      if (tmplItem.length > 0) {
        wx.requestSubscribeMessage({
          tmplIds: [tmplItem],

          success(res) {},

          fail(res) {},

          complete(res) {}

        });
      }
    },

    /**
     * 获取推荐人id
     */
    getRefereeid() {
      return wx.getStorageSync('referee_id');
    }

  }
};
</script>
<style>
@import "./apply.css";
</style>