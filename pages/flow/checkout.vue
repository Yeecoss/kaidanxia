<template>
<view class="container bgf5 p-bottom">
  <!-- 自定义标题栏 -->
  <navigationBar extClass="nav" :back="false">
      <view slot="left" class="cate_btn" @tap.stop="back">
        <text class="iconfont2 icon-fanhui"></text>
        <text class="title">确认订单</text>
      </view>
  </navigationBar>
  <!-- 顶部选项卡 -->
  <!-- <view v-if="isShowTab" class="swiper-tab dis-flex flex-y-center flex-x-around">
    <view v-for="(item, index) in DeliveryTypeEnum" :key="index" :class="'swiper-tab-item ' + ( curDelivery == item.value ? 'on' : '' )" :data-current="item.value" @tap.stop="onSwichDelivery">{{ item.name }}<view class="line"></view>
    </view>
  </view> -->
	<view class="main" v-if="goods_list.length">
		
		<view class="content pad_lr30 m-t-20">
		  <!-- 快递配送：配送地址 -->
		  <view v-if="curDelivery == DeliveryTypeEnum.EXPRESS.value" @tap.stop="onSelectAddress" class="flow-delivery bgf b-radius-6">
		    <view class="address_border"></view>
		    <view class="flow-delivery__detail dis-flex flex-y-center">
		      <view class="detail-location dis-flex">
		        <text class="iconfont icon-dingwei"></text>
		      </view>
		      <view class="detail-content flex-box">
		        <block v-if="address && address.address_id">
		          <view class="detail-content__title dis-flex">
		            <text class="f-30">{{ address.name }}</text>
		            <text class="detail-content__title-phone f-28">{{ address.phone }}</text>
		          </view>
		          <view class="detail-content__describe">
		            <text class="col-7">{{address.region.province}} {{address.region.city}} {{address.region.region}} {{address.detail}}</text>
		          </view>
		        </block>
		        <block v-else>
		          <view class="detail-content__describe dis-flex">
		            <text class="col-6">请选择配送地址</text>
		          </view>
		        </block>
		      </view>
		      <view class="detail-arrow dis-flex">
		        <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
		      </view>
		    </view>
		  </view>
		
		  <!-- 上门自提：自提门店 -->
		  <block v-if="curDelivery == DeliveryTypeEnum.EXTRACT.value">
		    <view @tap.stop="onSelectExtractPoint" class="flow-delivery dis-flex flex-y-center">
		      <view class="address_border"></view>
		      <view class="flow-delivery__detail dis-flex flex-y-center">
		        <view class="detail-location dis-flex">
		          <text class="iconfont icon-dingwei"></text>
		        </view>
		        <view class="detail-content flex-box">
		          <block v-if="extract_shop.shop_id">
		            <view class="detail-content__title dis-flex">
		              <text class="f-30">{{ extract_shop.shop_name }}</text>
		            </view>
		            <view class="detail-content__describe">
		              <text class="col-7">{{extract_shop.region.province}} {{extract_shop.region.city}} {{extract_shop.region.region}} {{extract_shop.address}}</text>
		            </view>
		          </block>
		          <block v-else>
		            <view class="detail-content__describe dis-flex">
		              <text class="col-6">请选择自提点</text>
		            </view>
		          </block>
		        </view>
		        <view class="detail-arrow dis-flex">
		          <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
		        </view>
		      </view>
		    </view>
		    <!-- 自提联系方式 -->
		    <view class="flow-extract-contact m-top20 b-f boxShadow">
		      <view class="contact-item dis-flex">
		        <view class="item_label dis-flex flex-y-center">
		          <text>联系人：</text>
		        </view>
		        <view class="item_ipt flex-box dis-flex flex-y-center">
		          <input placeholder="请填写联系人姓名" @input="onInputLinkman" :value="linkman"/>
		        </view>
		      </view>
		      <view class="contact-item dis-flex">
		        <view class="item_label dis-flex flex-y-center">
		          <text>联系电话：</text>
		        </view>
		        <view class="item_ipt flex-box dis-flex flex-y-center">
		          <input placeholder="请填写联系电话" @input="onInputPhone" :value="phone"/>
		        </view>
		      </view>
		    </view>
		  </block>
		
		  <!-- 商品列表 -->
		  <view class="m-t-20 bgf checkout_list_box b-radius-6">
				<view class="shop_info col-3 f-32 m-b-10 dis-flex flex-y-center">
					<image class="m-r-10 fl" :src="wxapp.logo" mode="aspectFill"></image>
					<text>{{wxapp.name}}</text>
					<text class="iconfont2 icon-gengduobeifen2 f-24 m-l-10"></text>
				</view>
		    <view class="checkout_list m-b-40" v-for="(item, index) in goods_list" :key="index">
		      <form @submit="onTargetGoods" :data-id="item.wxapp_goods_id" report-submit="true">
		        <button formType="submit" class="btn-normal">
		          <view class="flow-shopList dis-flex" :data-index="index">
		            <!-- 商品图片 -->
		            <view class="flow-list-left m-r-20">
		              <image lazy-load mode="aspectFill" :src="item.goods.goods_image"></image>
		            </view>
		            <view class="flow-list-right flex-box">
		              <view class="goods_name">
		                <!-- 商品名称 -->
		                <text class="f-24 col-3 twolist-hidden">{{ item.goods.goods_name }}</text>
		              </view>
									<!-- 商品sku信息 -->
									<text class="f-24 col-7 onelist-hidden goods_attr" v-if="item.goods_sku.goods_attr">{{ item.goods_sku?item.goods_sku.goods_attr :''}}</text>
		              <!-- 商品数量和单价 -->
		              <!-- <view class="flow-list-cont dis-flex flex-x-between flex-y-center">
		                <text class="small">×{{ item.total_num }}</text>
		                <text :class="'col-3 f-28 ' + ( item.is_user_grade ? 'price-delete' : '' )">￥{{ item.goods_price }}</text>
		              </view> -->
		              <!-- 会员折扣价 -->
		              <!-- <view wx:if="{{ item.is_user_grade }}" class="grade-price">
		                <text>会员折扣价：￥{{ item.grade_goods_price }}</text>
		              </view> -->
		            </view>
								<view class="pri_num m-l-20">
									<view class="goods-price">
										<text class="f-28 col-3">￥{{ item.goods_sku?item.goods_sku.goods_price:'' }}</text>
									</view>
									<view class="goods-num">
										<text class="f-28 col-3">×{{ item.total_num }}</text>
									</view>
								</view>
		          </view>
		        </button>
		      </form>
		    </view>
		
		    <view class="flow-num-box b-f padding-box t-r">
		      <text class="col-3">共{{order_total_num}}件商品，</text>
		      <!-- <text class="flow-money"> -->
		        <text class="col-3">合计：</text>
		        <text class="col-m">￥{{ order_total_price }}</text>
		      <!-- </text> -->
		    </view>
		
		  </view>
		
		  <!-- 商品金额 -->
		  <view class="flow-all-money b-f m-t-20 b-radius-6">
		    <!-- 优惠券 -->
		    <view class="flow-all-list dis-flex">
		      <text class="flex-five col-3">优惠券：</text>
		      <view class="flex-five t-r">
		        <view @tap.stop="onTogglePopupCoupon">
		          <block v-if="coupon_list.length > 0">
		            <text class="col-m" v-if="coupon_id > 0">-￥{{ coupon_money }}</text>
		            <text class="col-m" v-else>有{{ coupon_list.length }}张优惠券可用</text>
		            <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
		          </block>
		          <text v-else >无优惠券可用</text>
		        </view>
		      </view>
		    </view>
		    <!-- 积分抵扣 -->
		    <!-- <view v-if="is_allow_points" class="points flow-all-list dis-flex flex-y-center">
		      <view class="block-left flex-five">
		        <form class="flex-five" @submit="onShowPoints" report-submit="true">
		          <button formType="submit" class="btn-normal">
		            <text class="title">可用{{ setting.points_name }}抵扣：</text>
		            <text class="iconfont icon-help"></text>
		          </button>
		        </form>
		      </view>
		      <view class="flex-five dis-flex flex-x-end flex-y-center">
		        <text class="points-money col-m">￥{{ points_money }}</text>
		        <switch :checked="isUsePoints" @change="onTriggerPoints" style="transform:scale(0.7)"/>
		      </view>
		    </view> -->
		    <!-- 配送费用 -->
		    <view v-if="curDelivery == DeliveryTypeEnum.EXPRESS.value" class="dis-flex flow-all-list">
		      <text class="flex-five col-3">配送费用：</text>
		      <view class="flex-five t-r">
		        <view v-if="address && address.address_id">
		          <text class="col-m">+￥{{ express_price }}</text>
		          <!-- <text v-else>不在配送范围</text> -->
		        </view>
		        <view v-else>
		          <text class="col-7">请先选择配送地址</text>
		        </view>
		      </view>
		    </view>
		  </view>
		
		  <!-- 支付方式 -->
		  <view class="pay-method flow-all-money b-f m-t-20 b-radius-6">
		    <!-- <view class="flow-all-list dis-flex">
		      <text class="flex-five">支付方式</text>
		    </view> -->
		    <radio-group @change="onSelectPayType">
		      <!-- <form bindsubmit="onSelectPayType" data-value="{{ PayTypeEnum.WECHAT.value }}" report-submit="true"> -->
		        <!-- <button formType="submit" class="btn-normal"> -->
		          <!-- <view class="pay-item dis-flex flex-x-between">
		            <view class="item-left dis-flex flex-y-center">
		              <view class="item-left_icon wechat">
		                <text class="iconfont icon-weixinzhifu"></text>
		              </view>
		              <view class="item-left_text col-3">
		                <text>{{ PayTypeEnum.WECHAT.name }}</text>
		              </view>
		            </view>
		            <view class="item-right col-m">
		              <radio checked color="#E82E2E" :value="PayTypeEnum.WECHAT.value + ''"></radio>
		            </view>
		          </view> -->
		        <!-- </button> -->
		      <!-- </form> -->
		      <!-- <form bindsubmit="onSelectPayType" data-value="{{ PayTypeEnum.BALANCE.value }}" report-submit="true"> -->
		        <!-- <button formType="submit" class="btn-normal"> -->
		          <!-- <view class="pay-item dis-flex flex-x-between">
		            <view class="item-left dis-flex flex-y-center">
		              <view class="item-left_icon balance">
		                <text class="iconfont icon-qiandai"></text>
		              </view>
		              <view class="item-left_text col-3">
		                <text>{{ PayTypeEnum.BALANCE.name }}</text>
		              </view>
		            </view>
		            <view class="item-right col-m">
		              <radio checked color="#E82E2E" :value="PayTypeEnum.BALANCE.value + ''"></radio>
		            </view>
		          </view> -->
		        <!-- </button> -->
		      <!-- </form> -->
		    </radio-group>
		  </view>
		
		  <!-- 买家留言 -->
		  <view class="flow-all-money b-f m-t-20 b-radius-6">
		    <view class="ipt-wrapper dis-flex flow-all-list" style="border:0">
					<textarea :value="remark" @input="bindRemark" class="ly" maxlength="50" auto-height placeholder="选填：买家留言（50字以内）" />
		      <!-- <input @input="bindRemark" placeholder="选填：买家留言（50字以内）" :value="remark"/> -->
		    </view>
		  </view>
		</view>
		<!-- 提交订单 -->
		<view class="flow-fixed-footer m-top10">
		  <view class="dis-flex chackout-box">
		    <view class="chackout-left pl-12">实付款：<text class="col-m">￥{{ order_pay_price }}</text>
		    </view>
		    <view @tap.stop="onSubmitOrder" class="chackout-right dis-flex flex-y-center">
		      <text class="flow-btn f-32">提交订单</text>
		    </view>
		  </view>
		</view>
		
		<!-- 优惠券弹出框 -->
		<zan-popup :show="showBottomPopup" type="bottom" @close="onTogglePopupCoupon">
		  <view class="popup__coupon">
		    <view class="coupon__title f-32">选择优惠券</view>
		
		    <!-- 优惠券列表 -->
		    <view class="coupon-list">
		      <scroll-view scroll-y="true" style="height: 565rpx;">
		        <view class="coupon-item" v-for="(item, index) in coupon_list" :key="index">
		          <view :class="'item-wrapper color__' + item.color.text" @tap.stop="onSelectCoupon" :data-index="index" :data-id="item.user_coupon_id">
		            <view class="coupon-type">{{ item.coupon_type.text }}</view>
		            <view class="tip dis-flex flex-dir-column flex-x-center">
		              <view v-if="item.coupon_type.value == 10">
		                <text class="f-30">￥</text>
		                <text class="money">{{ item.reduce_price }}</text>
		              </view>
		              <text class="money" v-if="item.coupon_type.value == 20">{{ item.discount }}折</text>
		              <text class="pay-line">满{{ item.min_price }}元可用</text>
		            </view>
		            <view class="split-line"></view>
		            <view class="content dis-flex flex-dir-column flex-x-between">
		              <view class="title">{{ item.name }}</view>
		              <view class="bottom dis-flex flex-y-center">
		                <view class="time flex-box">
		                  <text>有效期：{{ item.start_time.text }}~{{ item.end_time.text }}</text>
		                </view>
		                <!-- <view class="state flex-box">
		                  <text>-￥{{ item.reduced_price }}</text>
		                </view> -->
		              </view>
		            </view>
		          </view>
		        </view>
		      </scroll-view>
		    </view>
		
		    <!-- 不使用优惠券 -->
		    <view class="coupon__do_not dis-flex flex-y-center flex-x-center">
		      <view class="control dis-flex flex-y-center flex-x-center" @tap.stop="onNotUseCoupon">
		        <text class="f-26">不使用优惠券</text>
		      </view>
		    </view>
		    <!-- <view class="footer-fixed f-32">
		      <view catchtap="onTogglePopupCoupon" class="order-bt" style="width:100%">关闭</view>
		    </view> -->
		  </view>
		</zan-popup>
		
		<!-- 积分说明弹框 -->
		<zan-dialog id="zan-base-dialog"></zan-dialog>
	</view>


</view>

</template>

<script>
const app = getApp().globalData; 
// 工具类
import Util from "@/utils/util"; // 验证类
// 验证类
import Verify from "@/utils/verify"; // 枚举类：发货方式
// 枚举类：发货方式
import DeliveryTypeEnum from "@/utils/enum/DeliveryType"; // 枚举类：支付方式
// 枚举类：支付方式
import PayTypeEnum from '@/utils/enum/order/PayType'; // 对话框插件
// 对话框插件
import Dialog from '@/components/dialog/dialog';
import zanPopup from "@/components/popup/index";
import zanDialog from "@/components/dialog/index";

export default {
  data() {
    return {
			wxapp: {},//店铺信息
      goods_list: [],
      // 当前页面参数
      options: {},
      // // 系统设置：配送方式
      // deliverySetting: [],
      // 系统设置
      setting: {
        delivery: [] // 支持的配送方式

      },
      // 配送方式
      isShowTab: false,
      DeliveryTypeEnum,
      curDelivery: null,
      // 支付方式
      PayTypeEnum,
      curPayType: PayTypeEnum.BALANCE.value,
      address: null,
      // 默认收货地址
      exist_address: false,
      // 是否存在收货地址
      selectedShopId: 0,
      // 选择的自提门店id
      linkman: '',
      // 自提联系人
      phone: '',
      // 自提联系电话
      // 商品信息
      goods: {},
      extract_shop: {},
      // 选择的优惠券
      selectCouponId: 0,
      // 是否使用积分抵扣
      isUsePoints: false,
      // 买家留言
      remark: '',
      // 禁用submit按钮
      disabled: false,
      has_error: false,
      error_msg: '',
      notRefresh: false // 不允许刷新
      ,
      order_total_num: 0,
      order_total_price: 0,
      order_pay_price: 0,
      express_price: 0,
      points_money: 0,
      coupon_list: [],
      is_allow_points: false,
      intra_region: false,
      extract_sho: {},
      coupon_id: '',
      coupon_money: '',
      showBottomPopup: false,
			
			cart_ids:'',
    };
  },

  components: {
    zanPopup,
    zanDialog,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this; // 当前页面参数

    _this.setData({
      options
    });
		// _this.cart_ids = JSON.parse(decodeURIComponent(options.cart_ids)).join(',');
		_this.cart_ids = options.cart_ids;
		
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this; // 获取当前订单信息

   _this.getOrderData();

    // !_this.notRefresh && _this.getOrderData();
  },

  methods: {
    // 返回
    back() {
      var data = this;
      wx.navigateBack({
        delta: data.delta
      });
      this.$emit('back', {
        delta: data.delta
      }, {});
    },

    /**
     * 获取当前订单信息
     */
    getOrderData() {
      let _this = this,
          options = _this.options; // 获取订单信息回调方法


      let callback = result => {
        let resData = result.data; // 请求错误

        if (result.code !== 1) {
          app.showError(result.msg);
          return false;
        } // 显示错误信息


        if (resData.has_error) {
          app.showError(resData.error_msg);
        }

        let data = {}; // 当前选择的配送方式

        data.curDelivery = resData.delivery; // 如果只有一种配送方式则不显示选项卡

        data.isShowTab = resData.setting.delivery.length > 1; // 上门自提联系信息

        if (_this.linkman === '') {
          data.linkman = resData.last_extract.linkman;
        }

        if (_this.phone === '') {
          data.phone = resData.last_extract.phone;
        } // 设置页面数据


        _this.setData(Object.assign({}, resData, data));

        wx.hideLoading();
      };

      wx.showLoading({
        title: '加载中...'
      }); // 请求的参数

      let params = {
        delivery: _this.curDelivery || 0,
        shop_id: _this.selectedShopId || 0,
        coupon_id: _this.selectCouponId || 0,
        is_use_points: _this.isUsePoints ? 1 : 0,
				address_id: _this.address? _this.address.address_id :''
      }; // 立即购买

      if (options.order_type === 'buyNow') {
        app._get('xr_order/buyNow', Object.assign({}, params, {
					wxapp_goods_id: options.wxapp_goods_id,
          goods_id: options.goods_id,
          goods_num: options.goods_num,
          goods_sku_id: options.goods_sku_id
        }), result => {
          callback(result);
        });
      } // 砍价活动结算
      else if (options.order_type === 'bargain') {
          app._get('xr_order/bargain', Object.assign({}, params, {
            task_id: options.task_id,
            goods_sku_id: options.goods_sku_id
          }), result => {
            callback(result);
          });
        } // 秒杀活动结算
      else if (options.order_type === 'sharp') {
				app._get('xr_order/sharp', Object.assign({}, params, {
					active_time_id: options.active_time_id,
					sharp_goods_id: options.sharp_goods_id,
					goods_sku_id: options.goods_sku_id,
					goods_num: options.goods_num
				}), result => {
					callback(result);
				});
			} 
			// 购物车结算
			else if (options.order_type === 'cart') {
					app._get('xr_order/cart',Object.assign({}, params, {
						cart_ids: _this.cart_ids || 0,
						wxapp_id: options.wxapp_id ||'',
					}), result => {
						callback(result);
					});
			}else{}
    },

    /**
     * 切换配送方式
     */
    onSwichDelivery(e) {
      // 设置当前配送方式
      let _this = this;

      _this.setData({
        curDelivery: e.currentTarget.dataset.current
      }); // 重新获取订单信息


      _this.getOrderData();
    },

    /**
     * 快递配送：选择收货地址
     */
    onSelectAddress() {
      let _this = this; // 允许刷新


      _this.setData({
        notRefresh: false
      }); // 跳转到选择自提点


      uni.navigateTo({
        url: '../address/index?pindex=1'
        // url: '../address/' + (_this.exist_address ? 'index?from=flow' : 'create')
      });
    },

    /**
     * 上门自提：选择自提点
     */
    onSelectExtractPoint() {
      let _this = this,
          selectedId = _this.selectedShopId; // 允许刷新


      _this.setData({
        notRefresh: false
      }); // 跳转到选择自提点


      uni.navigateTo({
        url: '../_select/extract_point/index?selected_id=' + selectedId
      });
    },

    /**
     * 跳转到商品详情页
     */
    onTargetGoods(e) {
      uni.navigateTo({
        url: `../goods/index?goods_id=${e.currentTarget.dataset.id}`
      });
    },

    /**
     * 订单提交
     */
    onSubmitOrder() {
      let _this = this,
          options = _this.options;
			
      // if (_this.disabled) {
      //   return false;
      // } // 表单验证
      if (!_this.address) {
					_this.$api.msg('请选择地址!')
					return false;
      }


      // if (!_this.onVerifyFun()) {
      //   return false;
      // } 

			// 按钮禁用, 防止二次提交
      // _this.disabled = true;
      let url = ''; // 表单提交的数据

      let postData = {
        delivery: _this.curDelivery,
        pay_type: _this.curPayType,
        shop_id: _this.selectedShopId || 0,
        linkman: _this.linkman,
        phone: _this.address.phone,
        coupon_id: _this.selectCouponId || 0,
        is_use_points: _this.isUsePoints ? 1 : 0,
        remark: _this.remark || '',
				address_id: _this.address.address_id
      }; 
			// 创建订单-立即购买
      if (options.order_type === 'buyNow') {
        url = 'xr_order/buyNow';
        postData = Object.assign(postData, {
					wxapp_goods_id: options.wxapp_goods_id,
          goods_id: options.goods_id,
          goods_num: options.goods_num,
          goods_sku_id: options.goods_sku_id
        });
      } 

			// 创建订单-购物车结算
      if (options.order_type === 'cart') {
        url = 'xr_order/cart';
        postData = Object.assign(postData, {
          cart_ids: _this.cart_ids || 0,
					wxapp_id: options.wxapp_id ||'',
        });
      } 

			// 创建订单-砍价活动
      if (options.order_type === 'bargain') {
        url = 'xr_order/bargain';
        postData = Object.assign(postData, {
          task_id: options.task_id,
          goods_sku_id: options.goods_sku_id
        });
      } 

			// 创建订单-秒杀商品
      if (options.order_type === 'sharp') {
        url = 'xr_order/sharp';
        postData = Object.assign(postData, {
          active_time_id: options.active_time_id,
          sharp_goods_id: options.sharp_goods_id,
          goods_sku_id: options.goods_sku_id,
          goods_num: options.goods_num
        });
      } 

			// 提交到后端
      const onCommitCallback = () => {
        // 显示loading
        wx.showLoading({
          title: '正在处理...'
        }); 
				// 订单提交
        app._post_form(url, postData, result => {
          _this.onSubmitCallbackFun(result);
        }, result => {}, () => {
          wx.hideLoading(); // 解除按钮禁用

          // _this.disabled = false;
        }); 

				// 不允许刷新
        _this.notRefresh = true;
      }; 

			// 请求用户订阅消息
      /* #ifdef H5 || APP-PLUS */
      onCommitCallback()
      /* #endif */

      /* #ifdef MP-WEIXIN */
      _this.onRequestSubscribeMessageFun(onCommitCallback);
      /* #endif */
    },

    /**
     * 请求用户订阅消息
     */
    onRequestSubscribeMessageFun(onCommitCallback) {
      let _this = this,
          tmplIds = _this.setting.order_submsg;

      if (tmplIds.length == 0) {
        onCommitCallback();
        return;
      }

      wx.requestSubscribeMessage({
        tmplIds,

        success(res) {},

        fail(res) {},

        complete(res) {
          onCommitCallback();
        }

      });
    },

    /**
     * 订单提交成功后回调
     */
    onSubmitCallbackFun(result) {
      let _this = this; // 订单创建成功后回调--微信支付
			if(result.code ==1){
				let data = result.data;
				//订单分享页
				app._get('xr_order/shareOrderInfo', {order_id: data.order_id}, res => {
					let shareOrderInfo = res.data;
					shareOrderInfo.wxapp_user.service_qrcode = shareOrderInfo.wxapp.service_qrcode;
					shareOrderInfo.wxapp_user.wxapp_id = shareOrderInfo.wxapp.wxapp_id;
					uni.redirectTo({
						url: '/pages/order/success/index?data='+ encodeURIComponent(JSON.stringify(shareOrderInfo))
					})
				})
			}

      if (result.code === -10) {
        app.showError(result.msg, () => {
          _this.redirectToOrderIndex();
        });
        return false;
      } // 发起微信支付


      // if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
      //   app.wxPayment({
      //     payment: result.data.payment,
      //     success: res => {
      //       _this.redirectToOrderIndex();
      //     },
      //     fail: res => {
      //       app.showError(result.msg.error, () => {
      //         _this.redirectToOrderIndex();
      //       });
      //     }
      //   });
      // }
      // 余额支付


      if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
        app.showSuccess(result.msg.success, () => {
          _this.redirectToOrderIndex();
        });
      }
    },

    /**
     * 表单验证
     */
    onVerifyFun() {
      let _this = this;

      if (_this.has_error) {
        app.showError(_this.error_msg);
        return false;
      } 

			// 验证自提填写的联系方式
      if (_this.curDelivery == DeliveryTypeEnum.EXTRACT.value) {
        _this.setData({
          linkman: _this.linkman.trim(),
          phone: _this.phone.trim()
        });

        if (_this.selectedShopId <= 0) {
          app.showError('请选择自提的门店');
          return false;
        }

        if (Verify.isEmpty(_this.linkman)) {
          app.showError('请填写自提联系人');
          return false;
        }

        if (Verify.isEmpty(_this.phone)) {
          app.showError('请填写自提联系电话');
          return false;
        }

        if (!Verify.isPhone(_this.phone)) {
          app.showError('请输入正确的联系电话');
          return false;
        }
      }

      return true;
    },

    /**
     * 买家留言
     */
    bindRemark(e) {
      let _this = this;

      _this.setData({
        remark: e.detail.value
      });
    },

    /**
     * 选择优惠券(弹出/隐藏)
     */
    onTogglePopupCoupon() {
      let _this = this;

      if (_this.coupon_list.length > 0) {
        _this.setData({
          showBottomPopup: !_this.showBottomPopup
        });
      }
    },

    /**
     * 选择优惠券
     */
    onSelectCoupon(e) {
      let _this = this; // 记录选中的优惠券id


      _this.setData({
        selectCouponId: e.currentTarget.dataset.id
      }); // 重新获取订单信息


      _this.getOrderData(); // 隐藏优惠券弹层


      _this.onTogglePopupCoupon();
    },

    /**
     * 不使用优惠券
     */
    onNotUseCoupon() {
      let _this = this;

      _this.setData({
        selectCouponId: 0
      }); // 重新获取订单信息


      _this.getOrderData(); // 隐藏优惠券弹层


      _this.onTogglePopupCoupon();
    },

    /**
     * 选择支付方式
     */
    onSelectPayType(e) {
      let _this = this; // 记录formId


      app.saveFormId(e.detail.formId); // 设置当前支付方式

      _this.setData({
        curPayType: e.detail.value
      });
    },

    /**
     * 跳转到未付款订单
     */
    redirectToOrderIndex() {
      wx.redirectTo({
        url: '../order/index'
      });
    },

    /**
     * input绑定：联系人
     */
    onInputLinkman(e) {
      let _this = this;

      _this.setData({
        linkman: e.detail.value
      });
    },

    /**
     * input绑定：联系电话
     */
    onInputPhone(e) {
      let _this = this;

      _this.setData({
        phone: e.detail.value
      });
    },

    /**
     * 选择积分抵扣
     */
    // onTriggerPoints(e) {
    //   let _this = this;

    //   _this.setData({
    //     isUsePoints: e.target.value
    //   }); // 重新获取订单信息


    //   _this.getOrderData();
    // },

    /**
     * 显示积分说明
     */
    // onShowPoints(e) {
    //   let _this = this; // 记录formId


    //   app.saveFormId(e.detail.formId); // 显示dialog

    //   let setting = _this.setting;
    //   Dialog({
    //     title: `${setting.points_name}说明`,
    //     message: setting.points_describe,
    //     selector: '#zan-base-dialog',
    //     isScroll: true,
    //     // 滚动
    //     buttons: [{
    //       text: '关闭',
    //       color: 'red',
    //       type: 'cash'
    //     }]
    //   });
    // },
		//更新地址
		iplChange(data){
			this.address = data;
		},
  }
};
</script>
<style>
@import "./checkout.css";
</style>