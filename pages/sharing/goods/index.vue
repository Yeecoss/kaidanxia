<template>
<view>
<!-- 自定义标题栏 -->
	<div  id="top">
		  <navigationBar title="商品详情" extClass="nav">
		  </navigationBar>
	</div>
  <view class="container" v-if="detail.goods_id">
    <scroll-view @scroll="scroll" :scroll-top="scrollTop" scroll-y="true">
	    <detail-swiper ref="detailSwiper" :imageList0="detail.image"></detail-swiper>

      <!-- 团购提醒 -->
      <view class="goods-attention dis-flex flex-y-center">
        <!-- 商品价格 -->
        <view class="goods-price">
          <text class="price-currency">￥</text>
          <text class="price-text">{{ sharing_price }}</text>
        </view>
        <view class="goods-message">
          <view class="line-price" v-if="line_price > 0">
            <text class="f-22">￥</text>
            <text class="f-26">{{ line_price }}</text>
          </view>
        </view>
        <view class="in-tag f-24">团购中</view>
      </view>
      <view class="content">
        <view class="goods-name b-f">
          <!-- 商品名称 -->
          <view class="flex-box dis-flex flex-dir-column">
            <view class="goods-title">
              <view class="title f-30 twolist-hidden">
                <text class="people f-24">{{ detail.people }}人团</text>
                <text class="goods_name col-3">{{ detail.goods_name }}</text>
              </view>
            </view>
          </view>
          <!-- 商品卖点 -->
          <!-- <view class="goods-selling-point">
            <text class="f-24">{{ detail.selling_point }}</text>
          </view> -->
          <view class="dis-flex flex-y-center flex-x-between">
            <view class="in-txt f-24 col-9">
              <text></text>{{ detail.goods_sales }}人已参团</view>
            <!-- 分享按钮 -->
            <view class="goods__share">
              <form @submit="onClickShare" report-submit="true">
                <button formType="submit" class="btn-normal dis-flex flex-dir-column">
                  <text class="share__icon iconfont2 icon-share"></text>
                  <text class="f-24">分享</text>
                </button>
              </form>
            </view>
          </view>
					<!-- 标签 -->
					<view class="tag-wrap dis-flex flex-wrap">
						<view class="f-24 m-r-10" v-for="(item,index) in detail.tags" :key="index">#{{item}}</view>
					</view>
        </view>
				<view class="gray-bg20"></view>

        <!-- 选择商品规格 -->
        <form v-if="goodsMultiSpec.spec_attr" @submit="onToggleTrade" report-submit>
          <button class="btn-normal" formType="submit">
            <view class="sku-selector b-f dis-flex flex-y-center">
              <view class="flex-box f-28">
                <text class="col-9">选择：</text>
                <text v-for="(item, index) in goodsMultiSpec.spec_attr" :key="index">{{ item.group_name }}</text>
              </view>
              <view class="f-26 col-9 t-r">
                <text class="iconfont icon-xiangyoujiantou"></text>
              </view>
            </view>
          </button>
        </form>
				<view class="gray-bg20"></view>

        <!-- 商品评价 -->
        <goods-comment :comment_data="detail.comment_data" :comment_data_count="detail.comment_data_count" :goods_id="goods_id"></goods-comment>
				<view class="gray-bg20"></view>
        
        <!-- 进行中的团购 -->
        <view class="top-nav-bar m-top20 b-f" v-if="activeList.length">
          <view class="top-nav dis-flex flex-x-between">
            <text>进行中的团购</text>
            <!-- <text class="col-9">更多团购 <text class="iconfont icon-xiangyoujiantou"></text> </text> -->
          </view>
          <!-- 进行中的团购-内容部分 -->
          <view class="corwd" v-for="(item, index) in activeList" :key="index" @tap.stop="onTargetActive" :data-id="item.active_id">
            <view class="corwd_people">
              <!-- 进行中的团购-头像 -->
              <view >
                <image lazy-load :src="item.user.avatarUrl" class="corwd_people_images"></image>
              </view>
              <!-- 进行中的团购-名称 -->
              <text class="onelist-hidden">{{ item.user.nickName }}的团</text>
            </view>
            <view class="corwd_time">
              <view class="corwd_time_text">
                <!-- 进行中的团购-开团人数 -->
                <text class="corwd_time_title onelist-hidden">还差<text>{{ item.people - item.actual_people }}</text>人成团</text>
                <!-- 进行中的团购-倒计时 -->
                <text class="corwd_time_number col-9 onelist-hidden">剩余{{ countDownList[index].day }}天{{ countDownList[index].hou }}:{{ countDownList[index].min }}:{{ countDownList[index].sec }}</text>
              </view>
              <!-- 进行中的团购-按钮 -->
              <button>去参团</button>
            </view>
          </view>
        </view>

        <!-- 拼团玩法 -->
        <view class="rule-nav top-nav-bar b-f">
          <form @submit="onToggleRules" report-submit="true">
            <button formType="submit" class="btn-normal">
              <view class="top-nav dis-flex flex-x-between">
                <text>拼团玩法</text>
                <text class="f-25 col-9">查看规则</text>
              </view>
              <!-- 拼团步骤 -->
              <view class="rule-simple dis-flex flex-x-around">
                <view class="simple-item dis-flex flex-dir-column flex-y-center">
                  <view class="i-number dis-flex flex-x-center flex-y-center">
                    <!-- <text class="f-30">1</text> -->
                    <view class="i-inner"></view>
                    <view class="i-line"></view>
                  </view>
                  <view class="i-text f-28 col-3">选择商品</view>
                </view>
                <view class="simple-item dis-flex flex-dir-column flex-y-center">
                  <view class="i-number dis-flex flex-x-center flex-y-center">
                    <!-- <text class="f-30">2</text> -->
                    <view class="i-line"></view>
                  </view>
                  <view class="i-text f-28">开团/参团</view>
                </view>
                <view class="simple-item dis-flex flex-dir-column flex-y-center">
                  <view class="i-number dis-flex flex-x-center flex-y-center">
                    <!-- <text class="f-30">3</text> -->
                    <view class="i-line"></view>
                  </view>
                  <view class="i-text f-28">邀请好友</view>
                </view>
                <view class="simple-item dis-flex flex-dir-column flex-y-center">
                  <view class="i-number dis-flex flex-x-center flex-y-center">
                    <!-- <text class="f-30">4</text> -->
                  </view>
                  <view class="i-text f-28">人满成团</view>
                </view>
              </view>
            </button>
          </form>
        </view>
				<view class="gray-bg20"></view>

        <!-- 商品描述 -->
        <goods-describe :article_content="article_content" :hiddenOrder="hiddenOrder"></goods-describe>
      </view>
    </scroll-view>
    <!-- 底部操作栏 -->
    <view class="footer-fixed f-28">
      <!-- 返回主页 -->
      <form @submit="onNavigationHome" report-submit="true" style="height:100%" class="dis-flex flex-dir-column flex-y-center flex-x-center">
        <button formType="submit" class="btn-normal">
          <view class="opticon col-3">
            <text class="iconfont2 icon-Fill1 col-3"></text>
            <view class="icontitle f-24">主页</view>
          </view>
        </button>
      </form>
      <!-- 在线客服 -->
      <!-- <button open-type="contact" sessionFrom="weapp" class="btn-normal opticon col-3 dis-flex flex-dir-column flex-y-center flex-x-center" type="default-light">
          <text class="iconfont2 icon-kefu col-3"></text>
          <view class="icontitle f-24">客服</view>
      </button> -->
      <button class="btn-normal opticon col-3 dis-flex flex-dir-column flex-y-center flex-x-center" type="default-light" @tap="upload(detail.image)">
          <text class="iconfont2 icon-download col-3"></text>
          <view class="icontitle f-24">下载</view>
      </button>
      <!-- 购买按钮 -->
      <view class="fixed-buttons flex-box dis-flex">
        <view v-if="detail.is_alone == 0" class="order-number flex-box dis-flex flex-dir-column flex-x-center">
          <form @submit="onTriggerOrder" report-submit="true" data-type="10">
            <button formType="submit" class="btn-normal">
              <view class="f-26">￥{{ goods_price }}</view>
              <view>单独购买</view>
            </button>
          </form>
        </view>
        <view class="order-bt flex-box dis-flex flex-dir-column flex-x-center">
          <form @submit="onTriggerOrder" report-submit="true" data-type="20">
            <button formType="submit" class="btn-normal col-f">
              <view class="f-26">￥{{ sharing_price }}</view>
              <view>发起拼单</view>
            </button>
          </form>
        </view>
      </view>
    </view>
  </view>

<!-- 确认购买弹窗 -->
<zan-popup :show="showBottomPopup" type="bottom" @close="onToggleTrade">
  <view class="popup__trade">
    <!-- 关闭按钮 -->
    <view class="trade-close dis-flex flex-x-center flex-y-center">
      <form @submit="onToggleTrade" report-submit="true">
        <button formType="submit" class="btn-normal">
          <text class="iconfont2 icon-shanchu1 f-26 col-9"></text>
        </button>
      </form>
    </view>
    <!-- 主体信息 -->
    <view class="trade-main">
      <view class="goods-info dis-flex">
        <!-- 图片名称 -->
        <view class="goods-image" @tap.stop="onPreviewSkuImage">
          <image lazy-load :src="skuCoverImage" mode="aspectFill"></image>
        </view>
        <view class="right flex-box">
          <view class="money-box dis-flex flex-y-center">
            <!-- 商品价 -->
            <view class="goods-price">
              <text class="goods-price_num col-m f-40">￥{{ order_type == 10 ? goods_price : sharing_price }}</text>
            </view>
            <!-- 划线价 -->
            <view class="line-price" v-if="line_price > 0">
              <text>￥{{ line_price }}</text>
            </view>
          </view>
          <view class="goods-stock dis-flex">
            <text class="flex-box f-24 col-7">库存：{{stock_num}}</text>
          </view>
        </view>
      </view>
      <!-- 规格列表 -->
      <view class="goods-attr">
        <!-- 滚动容器 -->
        <scroll-view class="goods-attr--scroll b-b" scroll-y="true">
          <view class="group-item" v-for="(attr, attr_idx) in goodsMultiSpec.spec_attr" :key="attr_idx">
            <view class="tips-text" :data-id="attr.group_id">{{ attr.group_name }}</view>
            <view :class="'spec-item ' + ( item.checked ? 'cur' : '' )" v-for="(item, item_idx) in attr.spec_items" :key="item_idx" :data-attr-idx="attr_idx" :data-item-idx="item_idx" @tap.stop="onSwitchSpec">
              <view class="spec-itemBox onelist-hidden">{{ item.spec_value }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 购买数量 -->
      <view class="buy_number dis-flex flex-y-center">
        <view class="buyNumber f-26 col-3">
          <text>购买数量</text>
        </view>
        <view class="select-number" v-if="showBottomPopup">
          <form @submit="onDecGoodsNumber" report-submit="true">
            <button formType="submit" :class="'default ' + ( goods_num > 1 ? '' : 'disabled' )" type="default">-</button>
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
      <block v-if="stock_num > 0" class="dis-flex flex-y-center">
        <view class="order-bt dis-flex flex-x-center flex-y-center" @tap.stop="onCheckout">
          <text>确定</text>
        </view>
      </block>
      <view class="default-btn" v-else>暂无现货</view>
    </view>
  </view>
</zan-popup>

<!-- 返回顶部 -->
<view class="widget-goTop" v-if="floorstatus">
  <form @submit="onScrollTop" report-submit="true">
    <button formType="submit" class="btn-normal">
      <text class="iconfont icon-fanhuidingbu"></text>
    </button>
  </form>
</view>

<!-- 分享按钮 -->
<!-- <zan-actionsheet :show="share.show" :actions="share.actions" :cancel-text="share.cancelText" :cancel-with-mask="share.cancelWithMask" @cancel="onCloseShare" @actionclick="onClickShareItem" mask-class="tiny"></zan-actionsheet> -->

<!-- 商品海报 弹出层 -->
<zan-popup :show="share.showPopup" @close="onTogglePopup">
  <view class="pop-poster pop-example__container">
    <!-- 关闭按钮 -->
    <view class="pop-close dis-flex flex-x-center flex-y-center" @tap.stop="onTogglePopup">
      <text class="iconfont2 icon-shanchu1 f-30 col-9"></text>
    </view>
    <form @submit="onSavePoster" report-submit="true">
      <view class="poster__image">
        <image lazy-load mode="widthFix" :src="qrcode"></image>
      </view>
      <view class="poster__tips m-top10 t-c">
      </view>
      <view class="padding-box m-top10 profile-btn">
        <button formType="submit">保存图片</button>
      </view>
    </form>
  </view>
</zan-popup>
<!-- 拼团规则 -->
<zan-dialog id="zan-base-dialog"></zan-dialog>
<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>

<!-- 快捷导航 -->
<shortcut></shortcut>
</view>
</template>

<script>
const App = getApp().globalData;
const Sharing = require("@/utils/extend/sharing.js");

const Dialog = require("@/components/dialog/dialog"); // 工具类
// 工具类
const util = require("@/utils/util.js"); // 记录规格的数组
// 记录规格的数组
let goodsSpecArr = [];
import zanPopup from "@/components/popup/index";
import zanDialog from "@/components/dialog/index";
import shortcut from "@/components/shortcut/shortcut";
import detailSwiper from '@/components/goods/detail-swiper/index';
import goodsComment from '@/components/goods/goods-comment/index';
import goodsDescribe from '@/components/goods/goods-describe/index';
import downloadFile from '@/components/download-file';

export default {
  data() {
    return {
      activeList: [],
      hiddenOrder: false,
      floorstatus: false,
      // 返回顶部
      showView: true,
      // 显示商品规格
      detail: {},
      // 商品详情信息
      sharing_price: 0,
      qrcode: '',
      // 拼团价格
      goods_price: 0,
      // 单买价
      line_price: 0,
      // 划线价格
      stock_num: 0,
      // 库存数量
      order_type: 20,
      // 下单类型 10=>单独购买 20=>拼团
      goods_num: 1,
      // 商品数量
      goods_sku_id: 0,
      // 规格id
      cart_total_num: 0,
      // 购物车商品总数量
      goodsMultiSpec: {},
      // 多规格信息
      countDownList: [],
      // 时间记录
      actEndTimeList: [],
      // 分享按钮组件
      share: {
        show: false,
        cancelWithMask: true,
        cancelText: '关闭',
        actions: [{
          name: '生成商品海报',
          className: 'action-class',
          loading: false
        }, {
          name: '发送给朋友',
          openType: 'share'
        }],
        // 商品海报
        showPopup: false
      },
      tapHeight: "",
      setting: "",
      skuCoverImage: "",
      scrollTop: 0,
      showBottomPopup: false,
      article_content: ""
    };
  },

  components: {
    // zanActionsheet,
    zanPopup,
    zanDialog,
    shortcut,
	  detailSwiper,
    goodsComment,
    goodsDescribe,
		downloadFile
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let scene = getApp().globalData.getSceneData(e);
    this.$nextTick(() => {
      this.setHeight(); // 商品id
    })
    this.goods_id = e.goods_id ? e.goods_id : scene.gid; // 获取商品信息

    this.getGoodsDetail(); // 获取拼团设置

    this.getSetting();
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this; // 构建页面参数


    let params = getApp().globalData.getShareUrlParams({
      'goods_id': _this.goods_id
    });
    return {
      title: _this.detail.goods_name,
      path: "/pages/sharing/goods/index?" + params
    };
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
     * 获取商品信息
     */
    getGoodsDetail() {
      let _this = this;

      getApp().globalData._get('index.php', {
        s: '/xapi/sharing.goods/detail',
        goods_id: _this.goods_id
      }, result => {
        // 初始化商品详情数据
        let data = _this.initGoodsDetailDataFun(result.data);

        _this.setData(data); // 执行倒计时函数


        _this.countDown();
      });
    },

    // 初始化图片列表
    initImageList(data) {
      let newData = [];
      data.forEach(item => {
        if (item.file_type == 'video') {
          newData.push(item);
        }
      });
      data.forEach(item => {
        if (item.file_type == 'image') {
          newData.push(item);
        }
      });
      return newData;
    },

    /**
     * 初始化商品详情数据
     */
    initGoodsDetailDataFun(data) {
      let _this = this; // 商品详情


      let goodsDetail = data.detail; // 富文本转码

      if (goodsDetail.content.length > 0) {
        //wxParse.wxParse('content', 'html', goodsDetail.content, _this, 0)
        setTimeout(() => {
          _this.article_content = goodsDetail.content;
        }, 200);
      } // 商品价格/划线价/库存


      data.goods_sku_id = goodsDetail.goods_sku.spec_sku_id;
      data.goods_price = goodsDetail.goods_sku.goods_price;
      data.sharing_price = goodsDetail.goods_sku.sharing_price;
      data.line_price = goodsDetail.goods_sku.line_price;
      data.stock_num = goodsDetail.goods_sku.stock_num; // 商品封面图(确认弹窗)

      data.skuCoverImage = goodsDetail.goods_image; // 多规格商品封面图(确认弹窗)

      if (goodsDetail.spec_type == 20 && goodsDetail.goods_sku['image']) {
        data.skuCoverImage = goodsDetail.goods_sku['image']['file_path'];
      } // 商品图片列表将视频放在首位


      if (goodsDetail.image) {
        data.detail.image = _this.initImageList(goodsDetail.image);
      } // 初始化商品多规格


      if (goodsDetail.spec_type == 20) {
        data.goodsMultiSpec = _this.initManySpecData(goodsDetail.goods_multi_spec);
      } // 记录倒计时时间


      data['actEndTimeList'] = [];

      if (data.activeList.length > 0) {
        data.activeList.forEach(item => {
          data['actEndTimeList'].push(item.end_time.text);
        });
      }

      return data;
    },

    // 初始化图片列表
    initImageList(data) {
      let newData = [];
      data.forEach(item => {
        if (item.file_type == 'video') {
          newData.push(item);
        }
      });
      data.forEach(item => {
        if (item.file_type == 'image') {
          newData.push(item);
        }
      });
      return newData;
    },

    /**
     * 初始化商品多规格
     */
    initManySpecData(data) {
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


      let spec_list = this.goodsMultiSpec.spec_list,
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
          skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.detail.goods_image
        });
      }
    },

    /**
     * 设置轮播图当前指针 数字
     */
    setCurrent(e) {
      let _this = this;

      let curIdx = e.detail.current;

      _this.setData({
        currentIndex: curIdx + 1
      });

      if (this.indexCurrent || this.indexCurrent == 0) {
        let videoContextPrev = wx.createVideoContext('myVideo' + this.indexCurrent);

        if (this.indexCurrent != curIdx) {
          videoContextPrev.pause();

          _this.setData({
            indexCurrent: null
          });
        }
      }
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
     * 返回顶部
     */
    onScrollTop(e) {
      let _this = this;

      getApp().globalData.saveFormId(e.detail.formId);

      _this.setData({
        scrollTop: 0
      });
    },

    /**
     * 显示/隐藏 返回顶部按钮
     */
    scroll(e) {
      let _this = this;

      _this.setData({
        floorstatus: e.detail.scrollTop > 200
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
     * 确认购买
     */
    onCheckout() {
      let _this = this; // 表单验证


      if (!_this.onVerifyFun()) {
        return false;
      } // 立即购买


      uni.navigateTo({
        url: '../checkout/index?' + util.urlEncode({
          order_type: _this.order_type,
          goods_id: _this.goods_id,
          goods_num: _this.goods_num,
          goods_sku_id: _this.goods_sku_id
        }),

        success() {
          // 关闭弹窗
          _this.onToggleTrade();
        }

      });
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
     * 跳转到评论
     */
    onTargetToComment(e) {
      let _this = this;

      getApp().globalData.saveFormId(e.detail.formId);
      uni.navigateTo({
        url: './comment/comment?goods_id=' + _this.goods_id
      });
    },

    /**
     * 显示分享选项
     */
    onClickShare(e) {
      let _this = this; // 记录formId


      getApp().globalData.saveFormId(e.detail.formId);

      _this.setData({
        'share.show': true
      });
    },

    /**
     * 关闭分享选项
     */
    onCloseShare() {
      let _this = this;

      _this.setData({
        'share.show': false
      });
    },

    /**
     * 点击生成商品海报
     */
    onClickShareItem(e) {
      let _this = this;

      if (e.index == 0) {
        // 显示商品海报
        _this.showPosterFun();
      }

      _this.onCloseShare();
    },

    /**
     * 切换商品海报
     */
    onTogglePopup() {
      let _this = this;

      _this.setData({
        'share.showPopup': !_this.share.showPopup
      });
    },

    /**
     * 显示商品海报图
     */
    showPosterFun() {
      let _this = this;

      wx.showLoading({
        title: '加载中'
      });

      getApp().globalData._get('sharing.goods/poster', {
        goods_id: _this.goods_id
      }, result => {
        _this.setData(result.data, () => {
          _this.onTogglePopup();
        });
      }, null, () => {
        wx.hideLoading();
      });
    },

    /**
     * 保存海报图片
     */
    onSavePoster(e) {
      let _this = this; // 记录formId


      getApp().globalData.saveFormId(e.detail.formId);
      wx.showLoading({
        title: '加载中'
      }); // 下载海报图片

      wx.downloadFile({
        url: _this.qrcode,

        success(res) {
          wx.hideLoading(); // 图片保存到本地

          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,

            success(data) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              }); // 关闭商品海报

              _this.onTogglePopup();
            },

            fail(err) {
              // console.log(err.errMsg);

              if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                wx.showToast({
                  title: "请允许访问相册后重试",
                  icon: "none",
                  duration: 1000
                });
                setTimeout(() => {
                  wx.openSetting();
                }, 1000);
              }
            },

            complete(res) {
              // console.log('complete'); // wx.hideLoading();
            }

          });
        }

      });
    },

    /**
     * 确认购买弹窗
     */
    onToggleTrade(e) {
      let _this = this;

      if (typeof e === 'object') {
        // 记录formId
        // e.detail.hasOwnProperty('formId') && getApp().globalData.saveFormId(e.detail.formId);
      }

      _this.setData({
        showBottomPopup: !_this.showBottomPopup
      });
    },

    /**
     * 显示拼团规则
     */
    onToggleRules(e) {
      // 记录formId
      getApp().globalData.saveFormId(e.detail.formId); // 显示拼团规则

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
     * 返回主页
     */
    onNavigationHome(e) {
      getApp().globalData.saveFormId(e.detail.formId);
      uni.switchTab({
        url: '/pages/index/index'
      });
    },

    /**
     * 立即下单
     */
    onTriggerOrder(e) {

      let _this = this; // 设置当前购买类型


      _this.setData({
        order_type: e.currentTarget.dataset.type
      }, () => {
        _this.onToggleTrade();
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
    countDown() {
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
      setTimeout(this.countDown, 1000);
    },

    /**
     * 跳转到拼单页面
     */
    onTargetActive(e) {
      uni.navigateTo({
        url: '../active/index?active_id=' + e.currentTarget.dataset.id
      });
    },
		// 点击下载
		upload(files){
			const that = this;
			let uploads = [];
			files.forEach(item => {
				uploads.push(item.file_path)
			});
			if(uploads!=''){
				uni.showModal({
					title: '友情提示',
					content: '是否下载该商品的图片/视频？',
					confirmColor: '#E82E2E',
					confirmText: '是',
					cancelText: '否',
					success: (res) => {
						if(res.confirm){
							that.$refs.download._downloadFileS(uploads);
						}
					}
				});
			}else{
				that.$api.msg('该商品暂无可下载的图片/视频');
			}
		},
		//下载回调
		comfirmStatusS (promise) {
			promise.then((res) => {
				uni.hideLoading();
				uni.hideToast();
				this.$api.msg(res?"保存成功~":'取消保存')
			})
		},

  }
};
</script>
<style>
@import "./index.css";
</style>