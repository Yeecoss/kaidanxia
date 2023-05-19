<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" title="订单详情"></navigationBar>
<view class="container p-bottom" v-if="order.order_id">

  <scroll-view scroll-y="true">

    <!-- 顶部状态栏 -->
    <view class="detail-header dis-flex flex-y-center">
      <view class="header-state f-32 col-m">
        <text>{{ order.state_text }}</text>
      </view>
    </view>

    <!-- 快递配送：配送地址 -->
    <view v-if="order.delivery_type.value == DeliveryTypeEnum.EXPRESS.value" class="flow-delivery">
      <view class="flow-delivery__detail f-28">
        <view class="content_title">收货人信息</view>
        <view class="detail-content flex-box">
          <view class="detail-content__title dis-flex">
            <text>{{ order.address.name }}</text>
            <text class="detail-content__title-phone">{{ order.address.phone }}</text>
          </view>
          <view class="detail-content__describe">
            <text class="col-7">{{order.address.region.province}} {{order.address.region.city}} {{order.address.region.region}} {{order.address.detail}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 上门自提：自提门店 -->
    <view v-if="order.delivery_type.value == DeliveryTypeEnum.EXTRACT.value" class="m-top20 b-f">
      <view class="flow-delivery">
        <view class="flow-delivery__title m-top20">
          <text class="flow-delivery__title-text f-30">自提门店</text>
          <text class="f-24 col-8">您须到该自提点取货</text>
        </view>
        <view class="flow-delivery__detail dis-flex flex-y-center" @tap.stop="onTargetShop" :data-id="order.extract_shop.shop_id">
          <view class="detail-location dis-flex">
            <text class="iconfont icon-dingwei"></text>
          </view>
          <view class="detail-content flex-box">
            <view class="detail-content__title dis-flex">
              <text class="f-30">{{ order.extract_shop.shop_name }}</text>
            </view>
            <view class="detail-content__describe">
              <text class="col-7">{{order.extract_shop.region.province}} {{order.extract_shop.region.city}} {{order.extract_shop.region.region}} {{order.extract_shop.address}}</text>
            </view>
          </view>
          <view class="detail-arrow dis-flex">
            <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 物流信息 -->
    <view class="flow-all-money b-f padding-box m-top20" v-if="order.delivery_type.value == DeliveryTypeEnum.EXPRESS.value && order.delivery_status.value == 20">
      <view class="flow-all-list dis-flex">
        <text >物流信息</text>
      </view>
      <navigator class="dis-flex" hover-class="none" :url="'./express/express?order_id=' + order.order_id">
        <view class="flex-box">
          <view class="dis-flex flow-all-list-cont">
            <text class="col-7">物流公司：{{order.express.express_name}}</text>
          </view>
          <view class="dis-flex flow-all-list-cont">
            <text class="col-7" selectable="true">物流单号：{{order.express_no}}</text>
          </view>
        </view>
        <view class="flow-arrow dis-flex">
          <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
        </view>
      </navigator>
    </view>

    <!-- 标题：商品信息 -->
    <view class="flow-all-money b-f padding-box m-top20">
      <view class="flow-all-list dis-flex">
        <text >商品信息</text>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="checkout_list padding-box b-f">
      <view @tap.stop="onTargetGoods" class="flow-shopList dis-flex b-f" :data-id="item.goods_id" v-for="(item, index) in order.goods" :key="index">
        <view class="flow-list-left">
          <image lazy-load mode="scaleToFill" :src="item.image.file_path"></image>
        </view>
        <view class="flow-list-right flex-box">
          <!-- 商品名称 -->
          <text class="f-30 col-3 twolist-hidden">{{item.goods_name}}</text>
          <!-- 商品sku信息 -->
          <view class="goods_attr f-24 col-7">{{item.goods_attr && item.goods_attr != '' ? '规格:' + item.goods_attr : ''}}</view>
          <!-- 商品数量和单价 -->
          <view class="flow-list-cont dis-flex flex-x-between flex-y-center">
            <text class="small">共{{item.total_num}}件商品</text>
            <text :class="'flow-cont ' + ( item.is_user_grade ? 'price-delete' : '' )">￥{{item.goods_price}}</text>
          </view>
          <!-- 会员折扣价 -->
          <view v-if="item.is_user_grade" class="grade-price">
            <text>{{member}}折扣价：￥{{ item.grade_goods_price }}</text>
          </view>
          <!-- 申请售后 -->
          <view class="m-top20 dis-flex flex-x-end">
            <text v-if="item.refund" class="f-26 col-7">已申请售后</text>
            <view v-else-if="order.isAllowRefund" class="btn-default" @tap.stop="onApplyRefund" :data-id="item.order_goods_id">申请售后</view>
          </view>
        </view>
      </view>
    </view>

    <!-- <view class="flow-num-box b-f">
      <text>共{{order.goods.length}}件商品，合计: </text>
      <text class="flow-money col-m">￥{{order.total_price}}</text>
    </view> -->

    <!-- 买家留言 -->
    <view class="flow-all-money b-f m-top20" v-if="order.buyer_remark.length">
      <view class="dis-flex flow-all-list">
        <text class="flex-five">买家留言</text>
      </view>
      <view class="dis-flex flow-all-list-cont" style="padding: 15rpx 0;">
        <text class="col-7">{{ order.buyer_remark }}</text>
      </view>
    </view>

    <!-- 订单金额 -->
    <view class="flow-all-money b-f padding-box m-top20">
      <view class="dis-flex flow-all-list-cont">
        <text class="flex-five col-3">订单总价</text>
        <text class="flex-five col-m t-r">￥{{order.total_price}}</text>
      </view>
      <view v-if="order.coupon_id > 0" class="dis-flex flow-all-list-cont">
        <text class="flex-five col-3">优惠券抵扣</text>
        <text class="flex-five col-m t-r">-￥{{ order.coupon_money }}</text>
      </view>
      <view v-if="order.points_num > 0" class="dis-flex flow-all-list-cont">
        <text class="flex-five col-3">{{ setting.points_name }}抵扣：</text>
        <text class="flex-five col-m t-r">-￥{{ order.points_money }}</text>
      </view>
      <view class="dis-flex flow-all-list-cont">
        <text class="flex-five col-3">配送费用</text>
        <text class="flex-five col-m t-r">+￥{{ order.express_price }}</text>
      </view>
      <view class="dis-flex flow-all-list-cont" v-if="order.update_price.value != '0.00'">
        <text class="flex-five col-3">后台改价</text>
        <text class="flex-five col-m t-r">{{order.update_price.symbol}}￥{{order.update_price.value}}</text>
      </view>
      <view class="dis-flex flow-all-list-cont" style="border:none">
        <text class="flex-five col-3">实付金额</text>
        <text class="flex-five col-m t-r">￥{{order.pay_price}}</text>
      </view>
    </view>
      <!-- <view class="order-cont dis-flex">
        <view class="order-num">
          <text selectable="{{true}}">订单号：{{order.order_no}}</text>
        </view>
        <view class="order-time">
          <text>{{order.create_time}}</text>
        </view>
      </view> -->
    <!-- 订单编号 -->
    <view class="flow-all-money b-f padding-box m-top20 f-24">
      <view class="flow-all-list-cont">
        <text class="flex-five col-3">订单编号：{{order.order_no}}</text>
      </view>
      <view class="flow-all-list-cont" style="border:none">
        <text class="flex-five col-3">下单时间：{{order.create_time}}</text>
      </view>
    </view>

  </scroll-view>

  <!-- 操作栏 -->
  <view v-if="order.order_status.value != 20" class="flow-fixed-footer b-f">
    <view class="dis-flex checkout-box  flex-x-end" v-if="order.pay_status.value==10">
      <!-- 取消订单 -->
      <view class="t-c">
        <text @tap.stop="cancelOrder" class="flow-btnn">取消订单</text>
      </view>
      <!-- 订单付款 -->
      <view >
        <text @tap.stop="onPayOrder" class="flow-btnr" v-if="order.pay_status.value==10">去支付</text>
      </view>
    </view>
    <!-- 确认收货 -->
    <view class="flow-btn h3" v-if="order.delivery_status.value==20 && order.receipt_status.value==10">
      <view @tap.stop="receipt">确认收货</view>
    </view>
  </view>

  <!-- 支付方式弹窗 -->
  <zan-popup :show="showPayPopup" @close="onTogglePayPopup">
    <view class="pop-orderPay pop-example__container">
      <view class="pop-title">
        <text class="f-30">请选择支付方式</text>
      </view>
      <view class="pop-content">
        <view class="pay-method">
          <!-- <form @submit="onSelectPayType" :data-value="PayTypeEnum.WECHAT.value" report-submit="true">
            <button formType="submit" class="btn-normal">
              <view class="pay-item dis-flex flex-x-between">
                <view class="item-left dis-flex flex-y-center">
                  <view class="item-left_icon wechat">
                    <text class="iconfont icon-weixinzhifu"></text>
                  </view>
                  <view class="item-left_text">
                    <text>{{ PayTypeEnum.WECHAT.name }}</text>
                  </view>
                </view>
              </view>
            </button>
          </form> -->
          <form @submit="onSelectPayType" :data-value="PayTypeEnum.BALANCE.value" report-submit="true">
            <button formType="submit" class="btn-normal">
              <view class="pay-item dis-flex flex-x-between">
                <view class="item-left dis-flex flex-y-center">
                  <view class="item-left_icon balance">
                    <text class="iconfont icon-qiandai"></text>
                  </view>
                  <view class="item-left_text">
                    <text>{{ PayTypeEnum.BALANCE.name }}</text>
                  </view>
                </view>
              </view>
            </button>
          </form>
        </view>
      </view>
    </view>
  </zan-popup>


</view>
</view>
</template>

<script>
const App = getApp().globalData;
// 枚举类：发货方式
import DeliveryTypeEnum from "@/utils/enum/DeliveryType"; // 枚举类：支付方式
// 枚举类：支付方式
import PayTypeEnum from '@/utils/enum/order/PayType';
import zanPopup from "@/components/popup/index";

export default {
  data() {
    return {
      member: App.member,
      // 配送方式
      DeliveryTypeEnum,
      // 支付方式
      PayTypeEnum,
      order_id: null,
      order: {},
      showPayPopup: ""
    };
  },

  components: {
    zanPopup,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;

    _this.order_id = options.order_id; // 获取订单详情

    _this.getOrderDetail(options.order_id);
  },

  methods: {
    /**
     * 获取订单详情
     */
    getOrderDetail(order_id) {
      let _this = this;

      getApp().globalData._get('sharing.order/detail', {
        order_id
      }, result => {
        _this.setData(result.data);
      });
    },

    /**
     * 跳转到商品详情
     */
    onTargetGoods(e) {
      let goods_id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: '../../goods/index?goods_id=' + goods_id
      });
    },

    /**
     * 取消订单
     */
    cancelOrder(e) {
      let _this = this;

      let order_id = _this.order_id;
      wx.showModal({
        title: "提示",
        content: "确认取消订单？",

        success(o) {
          if (o.confirm) {
            getApp().globalData._post_form('sharing.order/cancel', {
              order_id
            }, result => {
              wx.navigateBack();
            });
          }
        }

      });
    },

    /**
     * 确认收货
     */
    receipt(e) {
      let _this = this;

      let order_id = _this.order_id;
      wx.showModal({
        title: "提示",
        content: "确认收到商品？",

        success(o) {
          if (o.confirm) {
            getApp().globalData._post_form('sharing.order/receipt', {
              order_id
            }, result => {
              _this.getOrderDetail(order_id);
            });
          }
        }

      });
    },

    /**
     * 申请售后
     */
    onApplyRefund(e) {
      uni.navigateTo({
        url: '../refund/apply/apply?order_goods_id=' + e.currentTarget.dataset.id
      });
    },

    /**
     * 跳转到门店详情
     */
    onTargetShop(e) {
      uni.navigateTo({
        url: '../../../shop/detail/index?shop_id=' + e.currentTarget.dataset.id
      });
    },

    /**
     * 点击付款按钮
     */
    onPayOrder(e) {
      let _this = this; // 显示支付方式弹窗


      _this.onTogglePayPopup();
    },

    /**
     * 选择支付方式
     */
    onSelectPayType(e) {
      let _this = this; // 记录formId


      getApp().globalData.saveFormId(e.detail.formId); // 隐藏支付方式弹窗

      _this.onTogglePayPopup();

      if (!_this.showPayPopup) {
        // 发起付款请求
        _this.payment(e.currentTarget.dataset.value);
      }
    },

    /**
     * 显示/隐藏支付方式弹窗
     */
    onTogglePayPopup() {
      this.setData({
        showPayPopup: !this.showPayPopup
      });
    },

    /**
     * 发起付款请求
     */
    payment(payType) {
      let _this = this,
          orderId = _this.order_id; // 显示loading


      wx.showLoading({
        title: '正在处理...'
      });

      getApp().globalData._post_form('sharing.order/pay', {
        order_id: orderId,
        payType
      }, result => {
        if (result.code === -10) {
          getApp().globalData.showError(result.msg);
          return false;
        } // 发起微信支付


        // if (result.data.pay_type == ) {
        //   getApp().globalData.wxPayment({
        //     payment: result.data.payment,

        //     success() {
        //       _this.getOrderDetail(orderId);
        //     },

        //     fail() {
        //       getApp().globalData.showError(result.msg.error);
        //     }

        //   });
        // }
        // 余额支付


        if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
          getApp().globalData.showSuccess(result.msg.success, () => {
            _this.getOrderDetail(orderId);
          });
        }
      }, null, () => {
        wx.hideLoading();
      });
    }

  }
};
</script>
<style>
@import "./detail.css";
</style>