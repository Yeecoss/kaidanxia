<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="售后详情" extClass="nav" id="top"></navigationBar>
<view v-if="detail.order_refund_id" class="container p-bottom">

  <!-- 顶部状态栏 -->
  <view class="detail-header dis-flex flex-y-center">
    <view class="header-backdrop">
      <image lazy-load src="/static/images/refund-bg.png"></image>
    </view>
    <view class="header-state">
      <text class="f-32 col-f">{{ detail.state_text }}</text>
    </view>
  </view>

  <!-- 商品详情 -->
  <form @submit="onGoodsDetail" report-submit="true">
    <button class="btn-normal" formType="submit" :data-id="detail.order_goods.goods_id">
      <view class="detail-goods b-f m-top20 dis-flex flex-dir-row">
        <view class="left">
          <image lazy-load class="goods-image" :src="detail.order_goods.image.file_path"></image>
        </view>
        <view class="right dis-flex flex-box flex-dir-column flex-x-around">
          <view class="goods-name">
            <text class="twolist-hidden">{{ detail.order_goods.goods_name }}</text>
          </view>
          <view class="dis-flex col-9 f-24">
            <view class="flex-box">{{ detail.order_goods.goods_attr }}</view>
            <text class="t-r">×{{ detail.order_goods.total_num }}</text>
          </view>
        </view>
      </view>
    </button>
  </form>

  <!-- 付款金额 -->
  <view class="detail-order b-f row-block dis-flex flex-x-end flex-y-center">
    <text >付款金额：</text>
    <text class="col-m">￥{{ detail.order_goods.total_pay_price }}</text>
  </view>

  <!-- 已退款金额 -->
  <view v-if="detail.status.value == 20 && detail.type.value == 10" class="detail-order b-f row-block dis-flex flex-x-end flex-y-center">
    <text >已退款金额：</text>
    <text class="col-m">￥{{ detail.refund_money }}</text>
  </view>

  <!-- 售后信息 -->
  <view class="detail-refund b-f m-top20">
    <view class="detail-refund__row dis-flex">
      <view class="text">
        <text>售后类型：</text>
      </view>
      <view class="flex-box">
        <text>{{ detail.type.text }}</text>
      </view>
    </view>
    <view class="detail-refund__row dis-flex">
      <view class="text">
        <text>申请原因：</text>
      </view>
      <view class="flex-box">
        <text>{{ detail.apply_desc }}</text>
      </view>
    </view>
    <view v-if="detail.image.length > 0" class="detail-refund__row dis-flex">
      <view class="text">
        <text>申请凭证：</text>
      </view>
      <view class="image-list flex-box">
        <view class="image-preview" v-for="(item, index) in detail.image" :key="index">
          <image lazy-load mode="aspectFill" :src="item.file_path" @tap.stop="previewImages" :data-index="index"></image>
        </view>
      </view>
    </view>
  </view>

  <!-- 售后信息 -->
  <view v-if="detail.status.value == 10" class="detail-refund b-f m-top20">
    <view class="detail-refund__row dis-flex">
      <view class="text">
        <text class="col-m">拒绝原因：</text>
      </view>
      <view class="flex-box">
        <text>{{ detail.refuse_desc }}</text>
      </view>
    </view>
  </view>

  <!-- 商家收货地址 -->
  <view v-if="detail.is_agree.value == 10" class="detail-address b-f m-top20">
    <view class="detail-address__row address-title">
      <text class="f-30 col-m">退货地址</text>
    </view>
    <view class="detail-address__row address-details">
      <view class="address-details__row">
        <text>收货人：　{{ detail.address.name }}</text>
      </view>
      <view class="address-details__row">
        <text>联系电话：{{ detail.address.phone }}</text>
      </view>
      <view class="address-details__row dis-flex">
        <view class="text">
          <text>详细地址：</text>
        </view>
        <view class="flex-box">
          <text>{{ detail.address.detail }}</text>
        </view>
      </view>
    </view>
    <view class="detail-address__row">
      <view class="f-26 col-9">
        <text>· 未与卖家协商一致情况下，请勿寄到付或平邮</text>
      </view>
      <view class="f-26 col-9">
        <text>· 请填写真实有效物流信息</text>
      </view>
    </view>
  </view>

  <!-- 填写物流信息 -->
  <form v-if="detail.type.value == 10 && detail.is_agree.value == 10 && detail.is_user_send == 0" @submit="onSubmit" report-submit>
    <view class="detail-express b-f m-top20">
      <view class="form-group dis-flex flex-y-center">
        <view class="field">物流公司：</view>
        <view class="flex-box">
          <picker mode="selector" @change="onExpressChange" :range="expressList" range-key="express_name" name="express_id" :value="expressList[expressIndex].express_id">
            <text v-if="expressIndex > -1">{{ expressList[expressIndex].express_name }}</text>
            <text v-else class="col-80">请选择物流公司</text>
          </picker>
        </view>
      </view>
      <view class="form-group dis-flex flex-y-center">
        <view class="field">物流单号：</view>
        <view class="flex-box">
          <input placeholder="请填写物流单号" name="express_no"/>
        </view>
      </view>
    </view>

    <!-- 确认发货 -->
    <view class="padding-box profile-btn">
      <button formType="submit" :disabled="disabled">确认发货</button>
    </view>
  </form>

</view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      expressList:[],
      // 售后单id
      order_refund_id: null,
      // 订单商品详情
      detail: {},
      // 物流公司索引
      expressIndex: -1
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 记录页面参数
    this.order_refund_id = options.order_refund_id; // 获取售后单详情

    this.getRefundDetail();
  },
  methods: {
    /**
     * 获取售后单详情
     */
    getRefundDetail: function () {
      let _this = this;

      getApp().globalData._get('sharing.refund/detail', {
        order_refund_id: this.order_refund_id
      }, function (result) {
        _this.setData(result.data);
      });
    },

    /**
     * 跳转商品详情
     */
    onGoodsDetail: function (e) {
      uni.navigateTo({
        url: '/pages/goods/index?goods_id=' + e.detail.target.dataset.id
      });
    },

    /**
     * 凭证图片预览
     */
    previewImages: function (e) {
      let imageUrls = [];
      this.detail.image.forEach(function (item) {
        imageUrls.push(item.file_path);
      });
      wx.previewImage({
        current: imageUrls[e.target.dataset.index],
        urls: imageUrls
      });
    },

    /**
     * 选择物流公司 picker
     */
    onExpressChange: function (e) {
      this.setData({
        expressIndex: e.detail.value
      });
    },

    /**
     * 表单提交
     */
    onSubmit: function (e) {
      let _this = this,
          values = e.detail.value; 
					
			// 判断是否重复提交
      if (_this.disable === true) {
        return false;
      } // 表单提交按钮设为禁用 (防止重复提交)


      _this.disable = true;
      wx.showLoading({
        title: '正在处理...',
        mask: true
      }); // 提交到后端

      values['order_refund_id'] = _this.order_refund_id;

      getApp().globalData._post_form('sharing.refund/delivery', values, function (result) {
        getApp().globalData.showSuccess(result.msg, function () {
          // 获取售后单详情
          _this.getRefundDetail();
        });
      }, false, function () {
        wx.hideLoading(); // 解除禁用

        _this.disable = false;
      });
    }
  }
};
</script>
<style>
@import "./detail.css";
</style>