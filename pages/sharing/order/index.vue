<template>
<view class="container">
<!-- 自定义标题栏 -->
<navigationBar title="拼团订单" extClass="nav" id="top">
<view solt></view>
</navigationBar>
  <!-- tab栏 -->
  <view class="header f-28 col-3">
    <view @tap.stop="bindHeaderTap" :class="'tabItem ' + (dataType==='all'?'active':'')" data-type="all">
      <text>全部</text>
      <view class="line"></view>
    </view>
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='payment'?'active':'')" data-type="payment">
      <text>待付款</text>
      <view class="line"></view>
    </view>
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='sharing'?'active':'')" data-type="sharing">
      <text>拼团中</text>
      <view class="line"></view>
    </view>
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='delivery'?'active':'')" data-type="delivery">
      <text>待发货</text>
      <view class="line"></view>
    </view>
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='received'?'active':'')" data-type="received">
      <text>待收货</text>
      <view class="line"></view>
    </view>
    <view @tap.stop="onTargetRefund" class="tabItem">
      <text>售后</text>
      <view class="line"></view>
    </view>
  </view>
  <!-- 订单列表 -->
  <view class="goods-detail-box">
    <scroll-view @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;margin-top:88rpx'">
      <view class="wrapper" v-if="list.data">
        <view class="m-top20 list" v-for="(item, index) in list.data" :key="index">
          <form @submit="navigateToDetail" report-submit="true">
            <button class="btn-normal" formType="submit" :data-id="item.order_id">
              <!-- 订单状态 -->
              <view class="order-box b-f">
                <view class="order-header dis-flex flex-x-between">
                  <view>
                    <view class="create_time">下单时间:{{item.create_newtime}}</view>
                    <view class="order_no col-6 f-24">订单号:{{item.order_no}}</view>
                  </view>
                  <view>
                    <text>{{ item.state_text }}</text>
                  </view>
                </view>
              </view>
              <!-- 商品信息 -->
              <view class="order-box order-img_list">
                <view class="detail-goods b-f dis-flex flex-dir-row">
                  <view class="left">
                    <image lazy-load class="goods-image" :src="item.goods[0].image.file_path"></image>
                  </view>
                  <view class="right">
                    <view class="goods-name f-24 col-3">
                      <text class="twolist-hidden">{{ item.goods[0].goods_name }}</text>
                    </view>
                    <view class="goods-attr">
                      <text class="f-26 col-8">{{ item.goods[0].goods_attr }}</text>
                    </view>
                    <view class="goods-num">
                      <text class="f-26 col-8">×{{ item.goods[0].total_num }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </button>
            <!-- 底部区 -->
            <view class="order-box b-f">
              <view class="order-btn dis-flex">
                <view class="order-left dis-flex flex-y-center">
                  <view class="text">
                    <text class="f-24 col-9">共{{item.goods[0].total_num}}件</text>
                    <text class="col-m f-28">￥{{item.pay_price}}</text>
                  </view>
                </view>
                <view class="order-right flex-box">
                  <view class="btn-group clear" v-if="item.order_status.value != 20">
                    <!-- 未支付取消订单 -->
                    <view v-if="item.pay_status.value==10" class="btn-group-item">
                      <view @tap.stop="cancelOrder" class="btn-default" :data-id="item.order_id">取消订单</view>
                    </view>
                    <!-- 已支付取消订单 -->
                    <view v-if="item.order_status.value!=21 && item.order_type.value==10 && item.pay_status.value==20 && item.delivery_status.value==10" class="btn-group-item">
                      <view @tap.stop="cancelOrder" class="btn-default" :data-id="item.order_id">申请取消</view>
                    </view>
                    <view v-if="item.order_status.value==21" class="f-28 col-8 t-r">取消申请中</view>
                    <!-- 订单付款 -->
                    <view v-if="item.pay_status.value==10" class="btn-group-item">
                      <view @tap.stop="onPayOrder" class="btn-main" :data-id="item.order_id">去支付</view>
                    </view>
                    <!-- 订单核销码 -->
                    <view v-if="item.pay_status.value==20 && item.delivery_type.value == DeliveryTypeEnum.EXTRACT.value && item.delivery_status.value == 10 && (item.order_type.value==20 ? item.active.status.value==20 : true ) && item.order_status.value!=21" class="btn-group-item">
                      <view @tap.stop="onExtractQRCode" class="btn-main" :data-id="item.order_id">
                        <text class="iconfont icon-qr-extract"></text>
                        <text class="m-l-10">核销码</text>
                      </view>
                    </view>
                    <!-- 确认收货 -->
                    <view v-if="item.delivery_status.value==20 && item.receipt_status.value == 10" class="btn-group-item">
                      <view @tap.stop="receipt" class="btn-main" :data-id="item.order_id">确认收货</view>
                    </view>
                    <!-- 订单评价 -->
                    <view v-if="item.order_status.value==30 && item.is_comment==0" class="btn-group-item">
                      <view @tap.stop="comment" class="btn-main" :data-id="item.order_id">评价</view>
                    </view>
                    <!-- 拼单详情 -->
                    <view v-if="item.order_type.value==20 && item.pay_status.value==20" class="btn-group-item">
                      <form @submit="navigateToSharingActive" report-submit="true">
                        <button class="btn-normal" formType="submit" :data-id="item.active_id">
                          <view class="btn-default">拼单详情</view>
                        </button>
                      </form>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </form>
        </view>
      </view>
      <view v-if="no_more" class="no-more f-30">亲, 没有更多了</view>
			<tui-no-data :imgUrl="imgUrl[dataType]" :imgWidth="264" :imgHeight="264" btnText="去开团" @click="toNavigate" v-if="!isLoading && !list.data.length">
        <!-- <view class="yoshop-notcont"> -->
					<view class="col-9">亲，您还没有订单信息哦！</view>
					<!-- <navigator url="../../sharing/index/index">去开团</navigator> -->
        <!-- </view> -->
			</tui-no-data>
    </scroll-view>
  </view>

  <!-- 核销码弹出层 -->
  <zan-popup :show="showQRCodePopup" @close="onToggleQRCodePopup">
    <view class="pop-qrcode pop-example__container">
      <view class="pop-title">
        <text class="f-30">核销二维码</text>
      </view>
      <view class="pop-content">
        <image lazy-load :src="QRCodeImage"></image>
      </view>
    </view>
  </zan-popup>

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
</template>

<script>
const App = getApp().globalData; // 枚举类：发货方式
// 枚举类：发货方式
import DeliveryTypeEnum from "../../../utils/enum/DeliveryType"; // 枚举类：支付方式
// 枚举类：支付方式
import PayTypeEnum from '../../../utils/enum/order/PayType';
import zanPopup from "../../../components/popup/index";

export default {
  data() {
    return {
      tapHeight: 0,
      // hearder高度
      dataType: 'all',
      // 列表类型
      list: [],
      // 订单列表
      scrollHeight: null,
      // 列表容器高度
      DeliveryTypeEnum,
      // 配送方式
      PayTypeEnum,
      // 支付方式
      no_more: false,
      // 没有更多数据
      isLoading: true,
      // 是否正在加载中
      page: 1,
      // 当前页码
      showQRCodePopup: false,
      // 核销码弹窗显示隐藏
      QRCodeImage: '' // 核销码图片
      ,
      payOrderId: "",
      showPayPopup: false,
			imgUrl: {
				all: 'http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png',
				payment: 'http://pic.kaidanxia.com/2020-06-22/202006221449002c4f91525.png',
				sharing: 'http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png',
				delivery: 'http://pic.kaidanxia.com/2020-06-22/20200622144845e61934196.png',
				received: 'http://pic.kaidanxia.com/2020-06-22/202006221448494dcf33432.png',
				comment: 'http://pic.kaidanxia.com/2020-06-22/20200622144847fb7112214.png',
			},
    };
  },

  components: {
    zanPopup,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.$nextTick(() => {
      this.setHeight(); // 设置scroll-view高度

      this.setListHeight(); // 设置数据类型
    })

    this.setData({
      dataType: options.type || 'all'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取订单列表
    this.getOrderList(this.dataType);
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  methods: {
    // 设置top
    setHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        this.setData({
          tapHeight: res[0].height
        });
      });
    },

    /**
     * 获取订单列表
     */
    getOrderList(isPage, page) {
      let _this = this;

      getApp().globalData._get('sharing.order/lists', {
        page: page || 1,
        dataType: _this.dataType
      }, result => {
        let resList = result.data.list,
            dataList = _this.list; // 订单时间截取

        if (resList.data && resList.data.length > 0) {
          resList.data = _this.initOrderDataFun(resList.data);
        }

        if (isPage == true) {
          _this.setData({
            'list.data': dataList.data.concat(resList.data),
            isLoading: false
          });
        } else {
          _this.setData({
            list: resList,
            isLoading: false
          });
        }
      });
    },

    /**
      * 初始化订单时间
      */
    initOrderDataFun(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].create_time) {
          data[i].create_newtime = data[i].create_time.substring(0, 11);
        }
      }

      return data;
    },

    /**
     * 切换标签
     */
    bindHeaderTap(e) {
      this.setData({
        dataType: e.currentTarget.dataset.type,
        list: {},
        isLoading: true,
        page: 1,
        no_more: false
      }); // 获取订单列表

      this.getOrderList(e.currentTarget.dataset.type);
    },

    /**
     * 取消订单
     */
    cancelOrder(e) {
      let _this = this;

      let order_id = e.currentTarget.dataset.id;
      wx.showModal({
        title: "友情提示",
        content: "确认要取消该订单吗？",

        success(o) {
          if (o.confirm) {
            getApp().globalData._post_form('sharing.order/cancel', {
              order_id
            }, result => {
              _this.getOrderList(_this.dataType);
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

      let order_id = e.currentTarget.dataset.id;
      wx.showModal({
        title: "提示",
        content: "确认收到商品？",

        success(o) {
          if (o.confirm) {
            getApp().globalData._post_form('sharing.order/receipt', {
              order_id
            }, result => {
              _this.getOrderList(_this.dataType);
            });
          }
        }

      });
    },

    /**
     * 点击付款按钮
     */
    onPayOrder(e) {
      let _this = this; // 记录订单id


      _this.setData({
        payOrderId: e.currentTarget.dataset.id
      }); // 显示支付方式弹窗


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
        _this.payment(_this.payOrderId, e.currentTarget.dataset.value);
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
    payment(orderId, payType) {
      // 显示loading
      wx.showLoading({
        title: '正在处理...'
      });

      getApp().globalData._post_form('sharing.order/pay', {
        order_id: orderId,
        payType: payType
      }, result => {
        if (result.code === -10) {
          getApp().globalData.showError(result.msg);
          return false;
        } // 发起微信支付


        // if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
        //   getApp().globalData.wxPayment({
        //     payment: result.data.payment,

        //     success() {
        //       // 跳转到已付款订单
        //       uni.navigateTo({
        //         url: '../order/detail/detail?order_id=' + orderId
        //       });
        //     },

        //     fail() {
        //       getApp().globalData.showError(result.msg.error);
        //     }

        //   });
        // }
        // 余额支付


        if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
          getApp().globalData.showSuccess(result.msg.success, () => {
            // 跳转到已付款订单
            uni.navigateTo({
              url: '../order/detail/detail?order_id=' + orderId
            });
          });
        }
      }, null, () => {
        wx.hideLoading();
      });
    },

    /**
     * 订单评价
     */
    comment(e) {
      let _this = this;

      let order_id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: './comment/comment?order_id=' + order_id
      });
    },

    /**
     * 跳转订单详情页
     */
    navigateToDetail(e) {
      // 记录formId
      getApp().globalData.saveFormId(e.detail.formId);
      let order_id = e.detail.target.dataset.id;
      uni.navigateTo({
        url: './detail/detail?order_id=' + order_id
      });
    },

    /**
     * 跳转到拼团详情
     */
    navigateToSharingActive(e) {
      // 记录formId
      getApp().globalData.saveFormId(e.detail.formId);
      let active_id = e.detail.target.dataset.id;
      uni.navigateTo({
        url: '../active/index?active_id=' + active_id
      });
    },

    /**
     * 跳转到售后列表
     */
    onTargetRefund() {
      uni.navigateTo({
        url: './refund/index'
      });
    },

    /**
     * 下拉到底加载数据
     */
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.list.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      } // 加载下一页列表


      this.getOrderList(true, ++this.page);
    },

    /**
     * 设置商品列表高度
     */
    setListHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        tapHeight = Math.floor(rpx * 88),
            // tap高度
        scrollHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度

        this.setData({
          scrollHeight: scrollHeight
        });
      });
    },

    /**
     * 查看核销二维码
     */
    onExtractQRCode(e) {
      let _this = this,
          order_id = e.currentTarget.dataset.id; // 调用后台api获取核销二维码


      wx.showLoading({
        title: '加载中'
      });

      getApp().globalData._get('sharing.order/extractQrcode', {
        order_id
      }, result => {
        // 设置二维码图片路径
        _this.setData({
          QRCodeImage: result.data.qrcode
        }); // 显示核销二维码


        _this.onToggleQRCodePopup();
      }, null, () => {
        wx.hideLoading();
      });
    },

    /**
     * 核销码弹出层
     */
    onToggleQRCodePopup() {
      let _this = this;

      _this.setData({
        showQRCodePopup: !_this.showQRCodePopup
      });
    },
		toNavigate(){
			uni.navigateTo({
				url: '../../sharing/index/index'
			})
		}

  }
};
</script>
<style>
@import "./index.css";
</style>