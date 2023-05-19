<template>
<view>
<view class="container p-bottom" v-if="detail.active_id">
  <!-- 自定义标题栏 -->
  <navigationBar title="拼团详情" extClass="nav" id="top">
  </navigationBar>
  <!-- 商品信息 -->
  <view class="header dis-flex">
    <view class="header_lf" @tap.stop="onTargetGoods">
      <image lazy-load :src="goods.goods_image"></image>
    </view>
    <view class="header_rt">
      <view class="goods-name" @tap.stop="onTargetGoods">
        <text class="twolist-hidden">{{ goods.goods_name }}</text>
      </view>
      <view class="goods-price">
        <text class="f-26 col-m">￥</text>
        <text class="m-price">{{ goods.goods_sku.sharing_price }}</text>
        <text class="line-price" v-if="goods.goods_sku.line_price > 0">￥{{ goods.goods_sku.line_price }}</text>
      </view>
      <view class="goods-tag">
        <text class="tag-item">{{ detail.people }}人团</text>
        <text class="tag-item" v-if="goods.goods_sku.line_price > 0">拼团省{{ goods.goods_sku.diff_price }}</text>
      </view>
    </view>
  </view>

  <!-- 拼团成员 -->
  <view class="main">

    <!-- 拼团状态 (成功、失败) -->
    <view v-if="detail.status.value == 30" class="main_status main_status__fail">
      <text class="status-icon iconfont icon-shibai"></text>
      <text>超过有效时间，拼团失败</text>
    </view>
    <view v-if="detail.status.value == 20" class="main_status main_status__success">
      <text class="status-icon iconfont icon-success"></text>
      <text>拼团已成功</text>
    </view>

    <!-- 参团用户 -->
    <view class="dis-flex">
      <view style="width:75%" class="main_user">
        <template v-for="(item, index) in detail.users">
          <view :key="index" class="user-item" v-if="index<5">
            <image lazy-load :src="item.user.avatarUrl"></image>
            <view v-if="item.is_creator == 1" class="user-role">
              <text>团长</text>
            </view>
          </view>
        </template>
        <view class="textBox f-24 col-9" v-if="detail.users.length > 5">等{{detail.actual_people}}人已参团</view>
      </view>
      <view class="noticebox col-9 f-24" style="width:25%" @tap.stop="onToggleRules">
        <text class="iconfont2 icon-guize"></text>
        <text class="f-30">拼团须知</text>
      </view>
    </view>

    <!-- 拼单状态：拼团中 -->
    <view v-if="detail.status.value == 10" class="main_status main_tiem">
      <text>还差</text>
      <text class="main_timer_color">{{ detail.surplus_people }}</text>
      <text>个名额，</text>
      <view class="tui-countdown-content" v-for="(item, index) in countDownList" :key="index">
        <!-- <text class="tui-conutdown-box">{{item.day}}</text>: -->
        <text class="tui-conutdown-box">{{item.hou}}</text>:<text class="tui-conutdown-box">{{item.min}}</text>:<text class="tui-conutdown-box tui-countdown-bg">{{item.sec}}</text>
      </view>
      <text>后结束</text>
    </view>

    <!-- 操作按钮 -->
    <block v-if="detail.status.value == 10">
      <button v-if="!is_join" @tap.stop="onTriggerOrder">立即参团</button>
      <button v-else open-type="share" @tap.stop="onShare">立即分享</button>
    </block>
    <button v-else @tap.stop="onTargetGoods">去开团</button>
  </view>

  <!-- 拼团须知 -->
  <!-- <view class="notice" catchtap="onToggleRules">
    <text class="f-30">拼团须知</text>
    <text class="t-brief">{{ setting.basic.rule_brief }}</text>
    <text class="icon-arrow"></text>
  </view> -->

  <!-- 更多拼团 -->
  <view class="content" v-if="goodsList.data.length">
    <view class="content_top col-3" @tap.stop="onTargetIndex">
      <text class="f-30">更多拼团</text>
      <text class="iconfont2 icon-gengduobeifen2"></text>
    </view>
    <view v-for="(item, key) in goodsList.data" :key="key" class="content_main dis-flex" @tap.stop="onTargetGoods" :data-id="item.goods_id">
      <view class="goods-image">
        <image lazy-load :src="item.goods_image"></image>
      </view>
      <view class="goods-detail">
        <view class="goods-name twolist-hidden">
          <text>{{ item.goods_name }}</text>
        </view>
        <view class="goods-sales">
          <text>已团{{ item.goods_sales }}件</text>
        </view>
        <view class="goods-detail_bottom clear">
          <view class="bottom-right onelist-hidden fl dis-flex flex-y-end">
            <text class="goods-price">￥{{ item.goods_sku.sharing_price }}</text>
            <text class="line-price">￥{{ item.goods_sku.line_price }}</text>
          </view>
          <button class="fr btn-navie">去开团</button>
        </view>
      </view>
    </view>
  </view>

</view>


<!-- 确认购买弹窗 -->
<zan-popup :show="showBottomPopup" type="bottom" @close="onToggleTrade">
  <view class="popup__trade">
    <!-- 关闭按钮 -->
    <view class="trade-close dis-flex flex-x-center flex-y-center" @tap.stop="onToggleTrade">
      <text class="iconfont2 icon-shanchu1 f-26"></text>
    </view>
    <!-- 主体信息 -->
    <view class="trade-main">
      <view class="goods-info dis-flex">
        <!-- 图片名称 -->
        <view class="goods-image" @tap.stop="onPreviewSkuImage">
          <image lazy-load :src="skuCoverImage" mode="aspectFill"></image>
        </view>
        <view class="flex-box">
          <view class="money-box">
            <text class="col-m f-26">￥</text>
            <text class="price col-m">{{ sharing_price }}</text>
            <text class="del" v-if="line_price>0">￥{{line_price}}</text>
          </view>
          <view class="goods-stock dis-flex">
            <text class="flex-box f-26 col-7">库存：{{stock_num}}</text>
          </view>
        </view>
      </view>
      <!-- 规格列表 -->
      <view class="goods-list-box" scroll-y="true">
        <view class="cf tmall-types" v-for="(attr, attr_idx) in goodsMultiSpec.spec_attr" :key="attr_idx">
          <view class="tipstxt" :data-id="attr.group_id">{{attr.group_name}}</view>
          <view class="cf cartypelist" v-for="(item, item_idx) in attr.spec_items" :key="item_idx">
            <view v-if="item.checked">
              <form @submit="onSwitchSpec" report-submit="true" :data-attr-idx="attr_idx" :data-item-idx="item_idx">
                <button formType="submit" class="btn-normal">
                  <view class="cartypeitem cur">{{item.spec_value}}</view>
                </button>
              </form>
            </view>
            <view v-else>
              <form @submit="onSwitchSpec" report-submit="true" :data-attr-idx="attr_idx" :data-item-idx="item_idx">
                <button formType="submit" class="btn-normal">
                  <view class="cartypeitem">{{item.spec_value}}</view>
                </button>
              </form>
            </view>
          </view>
        </view>
      </view>
      <!-- 购买数量 -->
      <view class="buy_number dis-flex flex-y-center">
        <view class="buyNumber f-26">
          <text>购买数量</text>
        </view>
        <view class="select-number" v-if="showBottomPopup">
          <form @submit="onDecGoodsNumber" report-submit="true">
            <button formType="submit" :class="'default ' + (goods_num>1?'':' disabled')" type="default">-</button>
          </form>
          <text class="line"></text>
          <input @input="onInputGoodsNum" type="number" :value="goods_num"/>
          <text class="line"></text>
          <form @submit="onIncGoodsNumber" report-submit="true">
            <button formType="submit" class="default" type="default">+</button>
          </form>
        </view>
      </view>
    </view>
    <!-- 底部操作栏 -->
    <view class="footer-fixed f-30">
      <block v-if="stock_num > 0">
        <view class="order-bt dis-flex flex-x-center flex-y-center" @tap.stop="onCheckout" data-type="buyNow">
          <text>确定</text>
        </view>
      </block>
      <view class="default-btn" v-else>暂无现货</view>
    </view>
  </view>
</zan-popup>

<zan-dialog id="zan-base-dialog"></zan-dialog>
</view>
</template>

<script>
const App = getApp().globalData;
const Sharing = require("../../../utils/extend/sharing.js");
const Dialog = require("../../../components/dialog/dialog"); // 工具类
// 工具类
const util = require("../../../utils/util.js"); // 记录规格的数组
// 记录规格的数组
let goodsSpecArr = [];
import zanDialog from "../../../components/dialog/index";
import zanPopup from "../../../components/popup/index";

export default {
  data() {
    return {
      detail: {},
      // 拼单详情
      goodsList: [],
      goods: {},
      // 更多拼团列表
      setting: {},
      // 拼团设置
      is_join: false,
      // 当前用户是否已参团
      is_creator: false,
      // 当前是否为创建者(团长)
      goods_price: 0,
      // 商品价格
      line_price: 0,
      // 划线价格
      stock_num: 0,
      // 库存数量
      goods_num: 1,
      // 商品数量
      goods_sku_id: 0,
      // 规格id
      goodsMultiSpec: {},
      // 多规格信息
      countDownList: [],
      actEndTimeList: [],
      sharing_price: "",
      skuCoverImage: "",
      showBottomPopup: false
    };
  },

  components: {
    zanDialog,
    zanPopup,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let _this = this; // 获取拼团详情


    _this.getActiveDetail(option.active_id); // 获取拼团设置


    _this.getSetting();
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this; // 构建页面参数


    let params = getApp().globalData.getShareUrlParams({
      'active_id': _this.detail.active_id
    });
    return {
      title: _this.goods.goods_name,
      path: "/pages/sharing/active/index?" + params
    };
  },

  methods: {
    /**
     * 点击立即分享,请求订阅消息
     */
    onShare() {
      let _this = this;

      _this.onRequestSubscribeMessageFun();
    },

    /**
     * 订阅消息 => [拼团进度通知]
     */
    onRequestSubscribeMessageFun(callback) {
      let _this = this;

      let tmplItem = _this.setting.order_submsg.active_status;

      if (tmplItem.length > 0) {
        wx.requestSubscribeMessage({
          tmplIds: [tmplItem],

          success(res) {},

          fail(res) {},

          complete(res) {
            callback && callback();
          }

        });
      }
    },

    /**
     * 获取拼团详情
     */
    getActiveDetail(active_id, callback) {
      let _this = this;

      getApp().globalData._get('sharing.active/detail', {
        active_id
      }, result => {
        // 创建当前页面数据
        _this.createPageData(result.data);

        if (callback) {
          callback();
        }
      });
    },

    /**
     * 创建页面数据
     */
    createPageData(data) {
      let _this = this; // 商品详情


      let goodsDetail = data.goods; // 当前用户是否已参团

      data['is_join'] = _this.checkUserIsJoin(data.detail.users);
      // console.log(data['is_join']); // 当前用户是否为创建者

      data['is_creator'] = !!(data.detail.creator_id == getApp().globalData.getUserId()); // 拼团结束时间

      data['actEndTimeList'] = [data.detail.end_time.text]; // 商品价格/划线价/库存

      data.goods_sku_id = goodsDetail.goods_sku.spec_sku_id;
      data.sharing_price = goodsDetail.goods_sku.sharing_price;
      data.goods_price = goodsDetail.goods_sku.goods_price;
      data.line_price = goodsDetail.goods_sku.line_price;
      data.stock_num = goodsDetail.goods_sku.stock_num; // 商品封面图(确认弹窗)

      data.skuCoverImage = goodsDetail.goods_image; // 多规格商品封面图(确认弹窗)

      if (goodsDetail.spec_type == 20 && goodsDetail.goods_sku['image']) {
        data.skuCoverImage = goodsDetail.goods_sku['image']['file_path'];
      } // 初始化商品多规格


      if (goodsDetail.spec_type == 20) {
        data.goodsMultiSpec = _this.initGoodsDetailDataFun(goodsDetail.goods_multi_spec);
      } // 赋值页面数据


      _this.setData(data); // 执行倒计时函数


      _this.onCountDown();
    },

    /**
     * 初始化商品多规格
     */
    initGoodsDetailDataFun(data) {
      goodsSpecArr = [];

      for (let i in data.spec_attr) {
        for (let j in data.spec_attr[i].spec_items) {
          if (j < 1) {
            data.spec_attr[i].spec_items[0].checked = true;
            goodsSpecArr[i] = data.spec_attr[i].spec_items[0].item_id;
          }
        }
      }

      return data;
    },

    /**
     * 点击切换不同规格
     */
    onSwitchSpec(e) {
      let _this = this,
          attrIdx = e.currentTarget.dataset.attrIdx,
          itemIdx = e.currentTarget.dataset.itemIdx,
          goodsMultiSpec = _this.goodsMultiSpec; // 记录formid


      getApp().globalData.saveFormId(e.detail.formId);

      for (let i in goodsMultiSpec.spec_attr) {
        for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
          if (attrIdx == i) {
            goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;

            if (itemIdx == j) {
              goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true;
              goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id;
            }
          }
        }
      }

      _this.setData({
        goodsMultiSpec
      }); // 更新商品规格信息


      _this.updateSpecGoodsFun();
    },

    /**
     * 更新商品规格信息
     */
    updateSpecGoodsFun() {
      let _this = this,
          specSkuId = goodsSpecArr.join('_'); // 查找skuItem


      let spec_list = _this.goodsMultiSpec.spec_list,
          skuItem = spec_list.find(val => {
        return val.spec_sku_id == specSkuId;
      }); // 记录goods_sku_id
      // 更新商品价格、划线价、库存

      if (typeof skuItem === 'object') {
        _this.setData({
          goods_sku_id: skuItem.spec_sku_id,
          goods_price: skuItem.form.goods_price,
          sharing_price: skuItem.form.sharing_price,
          line_price: skuItem.form.line_price,
          stock_num: skuItem.form.stock_num,
          skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.goods.goods_image
        });
      }
    },

    /**
     * 验证当前用户是否已参团
     */
    checkUserIsJoin(users) {
      let user_id = getApp().globalData.getUserId();

      if (!user_id) {
        return false;
      }

      let isJoin = false;
      users.forEach(item => {
        user_id == item.user_id && (isJoin = true);
      });
      return isJoin;
    },

    /**
     * 获取拼团设置
     */
    getSetting() {
      let _this = this;

      Sharing.getSetting(setting => {
        _this.setData({
          setting
        });
      });
    },

    /**
     * 小于10的格式化函数
     */
    timeFormat(param) {
      return param < 10 ? '0' + param : param;
    },

    /**
     * 倒计时函数
     */
    onCountDown() {
      // 获取当前时间，同时得到活动结束时间数组
      let newTime = new Date().getTime();
      let endTimeList = this.actEndTimeList;
      let countDownArr = []; // 对结束时间进行处理渲染到页面

      endTimeList.forEach(o => {
        let endTime = new Date(util.format_date(o)).getTime();
        let obj = null; // 如果活动未结束，对时间进行处理

        if (endTime - newTime > 0) {
          let time = (endTime - newTime) / 1000; // 获取天、时、分、秒

          let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          obj = {
            day: day,
            hou: this.timeFormat(hou),
            min: this.timeFormat(min),
            sec: this.timeFormat(sec)
          };
        } else {
          //活动已结束，全部设置为'00'
          obj = {
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
          };
        }

        countDownArr.push(obj);
      }); // 渲染，然后每隔一秒执行一次倒计时函数

      this.setData({
        countDownList: countDownArr
      });
      setTimeout(this.onCountDown, 1000);
    },

    /**
     * 查看拼团规则
     */
    onTargetRules() {
      uni.navigateTo({
        url: '../rules/index'
      });
    },

    /**
     * 显示拼团规则
     */
    onToggleRules() {
      let _this = this;

      Dialog({
        title: '拼团规则',
        message: _this.setting.basic.rule_detail,
        selector: '#zan-base-dialog',
        buttons: [{
          text: '关闭',
          color: 'red',
          type: 'cash'
        }]
      });
    },

    /**
     * 跳转商品详情页
     */
    onTargetGoods(e) {
      let goodsId = e.currentTarget.dataset.id > 0 ? e.currentTarget.dataset.id : this.detail.goods_id;
      uni.navigateTo({
        url: '../goods/index?goods_id=' + goodsId
      });
    },

    /**
     * 增加商品数量
     */
    onIncGoodsNumber(e) {
      let _this = this;

      getApp().globalData.saveFormId(e.detail.formId);

      _this.setData({
        goods_num: ++_this.goods_num
      });
    },

    /**
     * 减少商品数量
     */
    onDecGoodsNumber(e) {
      let _this = this;

      getApp().globalData.saveFormId(e.detail.formId);

      if (_this.goods_num > 1) {
        _this.setData({
          goods_num: --_this.goods_num
        });
      }
    },

    /**
     * 自定义输入商品数量
     */
    onInputGoodsNum(e) {
      let _this = this,
          iptValue = e.detail.value;

      if (!util.isPositiveInteger(iptValue) && iptValue !== '') {
        iptValue = 1;
      }

      _this.setData({
        goods_num: iptValue
      });
    },

    /**
     * 立即参团
     */
    onCheckout(e) {
      let _this = this; // 表单验证


      if (!_this.onVerifyFun()) {
        return false;
      } // 立即参团


      const onCommitCallback = () => {
        let user_id = getApp().globalData.getUserId();

        if (!user_id) {
          getApp().globalData.doLogin();
          return false;
        }

        const callback = () => {
          if (_this.checkUserIsJoin(_this.detail.users)) {
            _this.setData({
              showBottomPopup: false
            });

            getApp().globalData.showError('您已参与过此拼团，不能重复参与！');
          }
        };

        if (_this.checkUserIsJoin(_this.detail.users)) {
          _this.getActiveDetail(_this.detail.active_id, callback);

          return false;
        }

        uni.navigateTo({
          url: '../checkout/index?' + util.urlEncode({
            order_type: 20,
            active_id: _this.detail.active_id,
            goods_id: _this.goods.goods_id,
            goods_num: _this.goods_num,
            goods_sku_id: _this.goods_sku_id
          })
        });
      }; // 请求用户订阅消息


      _this.onRequestSubscribeMessageFun(onCommitCallback);
    },

    /**
     * 表单验证
     */
    onVerifyFun() {
      let _this = this;

      if (_this.goods_num === '') {
        getApp().globalData.showError('请输入购买数量');
        return false;
      } // 将购买数量转为整型，防止出错


      _this.setData({
        goods_num: parseInt(_this.goods_num)
      });

      if (_this.goods_num <= 0) {
        getApp().globalData.showError('购买数量不能为0');
        return false;
      }

      return true;
    },

    /**
     * 预览Sku规格图片
     */
    onPreviewSkuImage(e) {
      let _this = this;

      wx.previewImage({
        current: _this.skuCoverImage,
        urls: [_this.skuCoverImage]
      });
    },

    /**
     * 确认购买弹窗
     */
    onToggleTrade(e) {
      this.setData({
        showBottomPopup: !this.showBottomPopup
      });
    },

    /**
     * 立即下单
     */
    onTriggerOrder(e) {
      let _this = this;

      _this.onToggleTrade();
    },

    /**
     * 跳转到拼团首页
     */
    onTargetIndex(e) {
      uni.navigateTo({
        url: '../index/index'
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>