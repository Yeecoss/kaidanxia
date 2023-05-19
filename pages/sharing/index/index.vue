<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="拼团专区" id="top"></navigationBar>
<!-- 拼团商品列表 -->
<view class="cont">
  <scroll-view @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;'">
    <view class="main">
      <view class="main_goods" v-for="(item, index) in goodsList.data" :key="index">
        <!-- 商品图片 -->
        <picture-group :images="item.image"></picture-group>
        <view class="main_goods_right">
          <!-- 商品标题 -->
          <view class="main_goods_title_box">
            <view>
              <text class="main_goods_title twolist-hidden">{{ item.goods_name }}</text>
            </view>
            <text class="more f-24 col-m" @tap.stop="onTargetGoods" :data-id="item.goods_id">更多<text class="iconfont2 icon-gengduobeifen2 f-24"></text></text>
          </view>
          <!-- 商品信息 -->
          <view class="main_goods_desc">
            <view class="desc_footer dis-flex flex-y-center">
              <text class="price_x col-m">¥{{ item.goods_sku.sharing_price }}</text>
              <text class="price_y col-9" v-if="item.goods_sku.line_price">¥{{ item.goods_sku.line_price }}</text>
            </view>
            <!-- <view class="">
              <text class="desc_introduction onelist-hidden">{{ item.selling_point }}</text>
            </view> -->
            <view class="desc_situation">
              <text class="iconfont icon-pintuan_huaban"></text>
              <text class="people">{{ item.people }}人团</text>
              <text class="cl-9">已有{{ item.goods_sales }}人进行拼团</text>
            </view>
            <view class="sku f-24">
              <view v-if="item.goods_multi_spec && item.goods_multi_spec.spec_attr">
                <view class="sku_item dis-flex flex-y-center" v-for="(item, index2) in item.goods_multi_spec.spec_attr" :key="index2">
                  <view class="sku_title col-9">{{item.group_name}}</view><view class="onelist-hidden">{{item.group_text}}</view>
                </view>
              </view>
            </view>
          </view>
          <view class="optbox">
            <!-- <button open-type="contact" type="default-light" class="consultation" sessionFrom="weapp">咨询</button> -->
            <view class="oper-item f-24 col-6" @tap="upload(item.image)"><text class="iconfont2 icon-download f-30"></text>下载</view>
            <view class="oper-item f-24 col-6"><text class="iconfont2 icon-synchro f-30"></text>同步</view>
            <button class="settlement" @tap.stop="openDialog" :data-id="item.goods_id">去拼团</button>
          </view>
        </view>
      </view>
      <view v-if="no_more" class="no-more f-24">亲, 没有更多了</view>
      <!-- 无数据提供的页面 -->
      <view v-if="!isLoading && !goodsList.data.length">
        <view class="yoshop-notcont">
          <text class="iconfont icon-wushuju"></text>
          <text class="cont">亲，暂无拼团商品哦</text>
        </view>
      </view><!-- 确认购买弹窗 -->
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
                <view class="group-item" v-for="(attr, attr_idx) in goods_multi_spec.spec_attr" :key="attr_idx">
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
          <view class="footer-fixed f-30 flex-x-center">
            <block v-if="stock_num > 0" class="dis-flex flex-y-center">
              <view class="order-bt dis-flex flex-x-center flex-y-center" @tap.stop="onCheckout">
                <text>确定</text>
              </view>
            </block>
            <view class="default-btn" v-else>暂无现货</view>
          </view>
        </view>
      </zan-popup>
    </view>
  </scroll-view>
</view>
	<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
</view>
</template>

<script>
const App = getApp().globalData; // 工具类
import pictureGroup from '@/components/goods/picture-group/index';
// 工具类
const util = require("../../../utils/util.js"); // 记录规格的数组
// 记录规格的数组
let goodsSpecArr = [];
import zanPopup from "../../../components/popup/index";
import zanDialog from "../../../components/dialog/index";
import downloadFile from '@/components/download-file';

export default {
  data() {
    return {
      detail: {},
      tabList: [],
      // 商品详情信息
      sharing_price: 0,
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
      goods_multi_spec: {},
      // 多规格信息
      // 商品分类列表
      categoryList: [],
      // 拼团商品列表
      goodsList: [],
      // 当前的分类id (0则代表首页)
      category_id: 0,
      scrollHeight: null,
      option: {},
      // 当前页面参数
      list: {},
      // 商品列表数据
      no_more: false,
      // 没有更多数据
      isLoading: true,
      // 是否正在加载中
      page: 1,
      // 当前页码
      showBottomPopup: false // 去拼单
      ,
      skuCoverImage: "",
    };
  },

  components: {
    // zanActionsheet,
    zanPopup,
    zanDialog,
		'picture-group': pictureGroup,
		downloadFile
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // Api：获取拼团首页
    this.$nextTick(() => {
      this.setListHeight();
    })

    this.getIndexData();
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function () {
    return {
      title: '拼团专区',
      path: "/pages/sharing/index/index?" + getApp().globalData.getShareUrlParams()
    };
  },
  methods: {
    openDialog(e) {
      let _this = this;

      for (let i in _this.goodsList.data) {
        if (_this.goodsList.data[i].goods_id == e.currentTarget.dataset.id) {
          let obj = _this.goodsList.data[i];
          let goods_multi_spec = {}; // 初始化商品多规格

          if (obj.spec_type == 20) {
            goods_multi_spec = _this.initManySpecData(obj.goods_multi_spec);

            _this.setData({
              detail: obj,
              goods_multi_spec: goods_multi_spec
            });

            for (let i in _this.goods_multi_spec.spec_attr) {
              for (let j in _this.goods_multi_spec.spec_attr[i].spec_items) {
                if (j < 1) {
                  _this.goods_multi_spec.spec_attr[i].spec_items[0].checked = true;
                  goodsSpecArr[i] = _this.goods_multi_spec.spec_attr[i].spec_items[0].item_id;
                }
              }
            }

            _this.updateSpecGoodsFun();
          } else {
            _this.setData({
              detail: obj,
              showBottomPopup: true,
              goods_sku_id: obj.goods_sku.spec_sku_id,
              goods_price: obj.goods_sku.goods_price,
              sharing_price: obj.goods_sku.sharing_price,
              line_price: obj.goods_sku.line_price,
              stock_num: obj.goods_sku.stock_num,
              skuCoverImage: obj.goods_image,
              goods_multi_spec: {}
            });
          }
        }
      }
    },

    /**
    * 初始化商品多规格
    */
    initManySpecData(data) {
      let obj = JSON.parse(JSON.stringify(data));
      goodsSpecArr = [];

      for (let i in obj.spec_attr) {
        for (let j in obj.spec_attr[i].spec_items) {
          if (j < 1) {
            obj.spec_attr[i].spec_items[0].checked = true;
            goodsSpecArr[i] = obj.spec_attr[i].spec_items[0].item_id;
          }
        }
      }

      return obj;
    },

    /**
    * 更新商品规格信息
    */
    updateSpecGoodsFun() {
      let _this = this;

      let specSkuId = goodsSpecArr.join('_'); // 查找skuItem

      let spec_list = _this.goods_multi_spec.spec_list,
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

      _this.setData({
        showBottomPopup: true
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
     * 预览Sku规格图片
     */
    onPreviewSkuImage(e) {
      let _this = this;

      wx.previewImage({
        current: _this.detail.skuCoverImage,
        urls: [_this.detail.skuCoverImage]
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
          goods_id: _this.detail.goods_id,
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
    * 点击切换不同规格
    */
    onSwitchSpec(e) {
      let _this = this,
          attrIdx = e.currentTarget.dataset.attrIdx,
          itemIdx = e.currentTarget.dataset.itemIdx,
          goods_multi_spec = JSON.parse(JSON.stringify(_this.goods_multi_spec)); // 记录formid


      getApp().globalData.saveFormId(e.detail.formId);

      for (let i in goods_multi_spec.spec_attr) {
        for (let j in goods_multi_spec.spec_attr[i].spec_items) {
          if (attrIdx == i) {
            goods_multi_spec.spec_attr[i].spec_items[j].checked = false;

            if (itemIdx == j) {
              goods_multi_spec.spec_attr[i].spec_items[itemIdx].checked = true;
              goodsSpecArr[i] = goods_multi_spec.spec_attr[i].spec_items[itemIdx].item_id;
            }
          }
        }
      }

      _this.setData({
        goods_multi_spec
      }); // 更新商品规格信息


      _this.updateSpecGoodsFun();
    },

    /**
     * 确认购买弹窗
     */
    onToggleTrade(e) {
      let _this = this;

      if (typeof e === 'object') {
        // 记录formId
        e.detail.hasOwnProperty('formId') && getApp().globalData.saveFormId(e.detail.formId);
      }

      _this.setData({
        showBottomPopup: false
      });
    },

    /**
     * Api：获取拼团列表
     */
    getIndexData() {
      let _this = this; // 获取拼团首页


      getApp().globalData._get('sharing.index/index', {}, function (result) {
        _this.setData({
          categoryList: result.data.categoryList
        });
      }); // Api：获取商品列表


      _this.getGoodsList();
    },

    /**
     * Api：切换导航栏
     */
    onSwitchTab: function (e) {
      let _this = this; // 第一步：切换当前的分类id


      _this.setData({
        category_id: e.currentTarget.dataset.id,
        goodsList: {},
        page: 1,
        no_more: false,
        isLoading: true
      }); // 第二步：更新当前的商品列表


      _this.getGoodsList();
    },

    /**
     * Api：获取商品列表
     */
    getGoodsList(isPage, page) {
      getApp().globalData._get('index.php', {
        s: '/xapi/sharing.goods/lists',
        page: 1,
        category_id: 0
      }, result => {
        let resList = result.data.list,
            dataList = this.goodsList;

        if (resList.data) {
          resList.data = this.initListFun(resList.data);
        }

        if (isPage == true) {
          this.setData({
            'goodsList.data': dataList.data.concat(resList.data),
            isLoading: false
          });
        } else {
          this.setData({
            goodsList: resList,
            isLoading: false
          });
        }
      });
    },

    // 拼接规格
    initListFun(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].goods_multi_spec && data[i].goods_multi_spec.spec_attr) {
          for (let j = 0; j < data[i].goods_multi_spec.spec_attr.length; j++) {
            data[i].goods_multi_spec.spec_attr[j].group_text = this.getText(data[i].goods_multi_spec.spec_attr[j].spec_items);
          }
        }
      }

      return data;
    },

    getText(list) {
      let str = '';

      for (let i = 0; i < list.length; i++) {
        str += list[i].spec_value;

        if (i < list.length - 1) {
          str += '/';
        }
      }

      return str;
    },

    /**
     * 跳转商品详情页
     */
    onTargetGoods(e) {
      uni.navigateTo({
        url: '../goods/index?goods_id=' + e.currentTarget.dataset.id
      });
    },

    /**
     * 下拉到底加载数据
     */
    bindDownLoad: function () {
      // 已经是最后一页
      if (this.page >= this.goodsList.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      } // 加载下一页列表


      this.getGoodsList(true, ++this.page);
    },

    /**
     * 设置商品列表高度
     */
    setListHeight: function () {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        // tapHeight = Math.floor(rpx * res[0].height), // tap高度
        scrollHeight = systemInfo.windowHeight - res[0].height; // swiper高度

        this.setData({
          scrollHeight: scrollHeight
        });
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