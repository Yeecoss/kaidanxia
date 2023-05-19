<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="提现" extClass="nav" id="top"></navigationBar>
<view class="container b-f">

  <!-- 头部背景图 -->
  <view class="dealer-bg">
    <image lazy-load mode="widthFix" :src="background"></image>
  </view>

  <view class="widget-body b-f dis-flex flex-dir-column flex-y-center">
    <form @submit="onFormSubmit" report-submit="true">
      <!-- 提现收益 -->
      <view class="widget widget__capital m-top20 b-f dis-flex flex-dir-column">
        <view class="capital__item dis-flex flex-x-between flex-y-center">
          <view class="item__left">{{ words.withdraw_apply.words.capital.value }}：</view>
          <view class="item__right c-violet">
            <text class="f-24">￥</text>
            <text class="f-34">{{ dealer.money }}</text>
          </view>
        </view>
        <view class="capital__item dis-flex flex-y-center">
          <view class="item__left">{{ words.withdraw_apply.words.money.value }}：</view>
          <view class="item__right flex-box">
            <input name="money" :placeholder="words.withdraw_apply.words.money_placeholder.value" :value="name"/>
          </view>
        </view>
      </view>
      <!-- 最低提现金额 -->
      <view class="capital__lowest m-top20 f-24 col-7 t-r">{{ words.withdraw_apply.words.min_money.value }}{{ settlement.min_money }}元</view>

      <!-- 提现方式 -->
      <view class="widget widget__form m-top20 b-f dis-flex flex-dir-column">
        <view class="form__title f-28">提现方式</view>
        <view class="form__box">
          <block v-for="(item, index) in settlement.pay_type" :key="index">
            <block v-if="item == 10">
              <!-- 微信支付 -->
              <view class="form__field dis-flex flex-y-center">
                <view class="form__radio dis-flex flex-y-center" @tap.stop="toggleChecked" data-payment="10">
                  <text :class="'radio__icon ' + ( payment == 10 ? 'c-violet' : 'col-bb' ) + ' iconfont icon-radio'"></text>
                  <text class="f-28">微信支付</text>
                </view>
              </view>
            </block>
            <block v-if="item == 20">
              <!-- 支付宝 -->
              <view class="form__field dis-flex flex-y-center">
                <view class="form__radio dis-flex flex-y-center" @tap.stop="toggleChecked" data-payment="20">
                  <text :class="'radio__icon ' + ( payment == 20 ? 'c-violet' : 'col-bb' ) + ' iconfont icon-radio'"></text>
                  <text class="f-28">支付宝</text>
                </view>
              </view>
              <block v-if="payment == 20">
                <view class="form__field dis-flex flex-y-center">
                  <view class="field-input flex-box">
                    <input name="alipay_name" placeholder="请输入姓名"/>
                  </view>
                </view>
                <view class="form__field dis-flex flex-y-center">
                  <view class="field-input flex-box">
                    <input name="alipay_account" placeholder="请输入支付宝账号"/>
                  </view>
                </view>
              </block>
            </block>
            <block v-if="item == 30">
              <!-- 银行卡 -->
              <view class="form__field dis-flex flex-y-center">
                <view class="form__radio dis-flex flex-y-center" @tap.stop="toggleChecked" data-payment="30">
                  <text :class="'radio__icon ' + ( payment == 30 ? 'c-violet' : 'col-bb' ) + ' iconfont icon-radio'"></text>
                  <text class="f-28">银行卡</text>
                </view>
              </view>
              <block v-if="payment == 30">
                <view class="form__field dis-flex flex-y-center">
                  <view class="field-input flex-box">
                    <input name="bank_name" placeholder="请输入姓名" value/>
                  </view>
                </view>
                <view class="form__field dis-flex flex-y-center">
                  <view class="field-input flex-box">
                    <input name="bank_account" placeholder="请输入开户行名称/地址" value/>
                  </view>
                </view>
                <view class="form__field dis-flex flex-y-center">
                  <view class="field-input flex-box">
                    <input name="bank_card" placeholder="请输入银行卡号" value/>
                  </view>
                </view>
              </block>
            </block>
          </block>
        </view>
      </view>
      <!-- 提交申请 -->
      <view class="form-submit dis-flex flex-x-center">
        <button formType="submit" :disabled="disabled">{{ words.withdraw_apply.words.submit.value }}</button>
      </view>
    </form>
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
      payment: 20,
      submsgSetting: {} // 订阅消息配置
      ,
      disabled: false
    };
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
    let _this = this; // 获取渠道商提现信息


    _this.getDealerWithdraw();
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
     * 获取渠道商提现信息
     */
    getDealerWithdraw() {
      let _this = this;

      getApp().globalData._get('user.dealer/withdraw', {}, result => {
        let data = result.data;
        data.isData = true; // 设置当前页面标题

        wx.setNavigationBarTitle({
          title: data.words.withdraw_apply.title.value
        }); //  默认提现方式

        data['payment'] = data.settlement.pay_type[0];

        _this.setData(data);
      });
    },

    /**
     * 提交申请 
     */
    onFormSubmit(e) {
      let _this = this,
          values = e.detail.value,
          words = _this.words.withdraw_apply.words; // 验证可提现收益


      if (_this.dealer.money <= 0) {
        getApp().globalData.showError('当前没有' + words.capital.value);
        return false;
      } // 验证提现金额


      if (!values.money || values.money.length < 1) {
        getApp().globalData.showError('请填写' + words.money.value);
        return false;
      } // 按钮禁用


      _this.setData({
        disabled: true
      }); // 提现方式


      values['pay_type'] = _this.payment; // 数据提交

      const onCallback = () => {
        getApp().globalData._post_form('user.dealer.withdraw/submit', {
          data: JSON.stringify(values)
        }, result => {
          // 提交成功
          getApp().globalData.showError(result.msg, () => {
            uni.navigateTo({
              url: '../list/list'
            });
          });
        }, null, () => {
          // 解除按钮禁用
          _this.setData({
            disabled: false
          });
        });
      }; // 确认是否提交


      wx.showModal({
        // title: '友情提示',
        content: '确定提交提现申请吗？请确认填写无误',
        showCancel: true,

        success(res) {
          if (res.confirm) {
            // 请求用户订阅消息
            _this.onRequestSubscribeMessageFun(onCallback);
          } else if (res.cancel) {
            // 解除按钮禁用
            _this.setData({
              disabled: false
            });
          }
        }

      });
    },

    /**
     * 订阅消息 => [提现通知]
     */
    onRequestSubscribeMessageFun(callback) {
      let _this = this,
          tmplIds = [],
          dealerSubmsg = _this.submsgSetting.dealer;

      dealerSubmsg.withdraw_01.template_id != '' && tmplIds.push(dealerSubmsg.withdraw_01.template_id);
      dealerSubmsg.withdraw_02.template_id != '' && tmplIds.push(dealerSubmsg.withdraw_02.template_id);

      if (tmplIds.length > 0) {
        wx.requestSubscribeMessage({
          tmplIds,

          success(res) {},

          fail(res) {},

          complete(res) {
            callback && callback();
          }

        });
      }
    },

    /**
     * 切换提现方式
     */
    toggleChecked(e) {
      let _this = this;

      _this.setData({
        payment: e.currentTarget.dataset.payment
      });
    }

  }
};
</script>
<style>
@import "./apply.css";
</style>