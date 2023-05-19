<template>
<view class="container">
  <!-- 自定义标题栏 -->
  <navigationBar title="退款/售后" extClass="nav" id="top">
  </navigationBar>
  <!-- 顶部选项卡 -->
  <view class="swiper-tab dis-flex flex-x-around flex-y-center">
    <block v-for="(item, index) in tabList" :key="index">
      <view :class="'swiper-tab-item ' + ( dataType == item.value ? 'on' : '')" :data-current="item.value" @tap="swichNav">{{ item.text }}</view>
    </block>
  </view>
  <!-- 退款/售后单 -->
  <scroll-view scroll-y="true" @scrolltolower="onPageDown" :style="'height: ' + swiperHeight + 'px;margin-top:80rpx'">
    <view class="widget-list" v-if="list.data && list.data.length > 0">
      <view class="widget-detail" v-for="(item, index) in list.data" :key="index">
        <view class="row-block dis-flex flex-y-center">
          <view class="flex-box">{{ item.create_time }}</view>
          <view class="flex-box t-r">
            <text class="col-m">{{ item.state_text }}</text>
          </view>
        </view>
        <view class="detail-goods row-block dis-flex">
          <view class="goods-image">
            <image lazy-load :src="item.order_goods.image.file_path" mode="aspectFill"></image>
          </view>
          <view class="goods-right flex-box">
            <view class="goods-name">
              <text class="twolist-hidden">{{ item.order_goods.goods_name }}</text>
            </view>
            <view class="goods-attr">
              <text class="f-26 col-8">{{ item.order_goods.goods_attr }}</text>
            </view>
            <view class="goods-num t-r">
              <text class="f-26 col-8">×{{ item.order_goods.total_num }}</text>
            </view>
          </view>
        </view>
        <view class="detail-order row-block dis-flex flex-x-end flex-y-center">
          <text >付款金额：</text>
          <text class="col-m">￥{{ item.order_goods.total_pay_price }}</text>
        </view>
        <view class="detail-operate row-block dis-flex flex-x-end flex-y-center">
          <view class="detail-btn btn-detail" @tap.stop="onTargetDetail" :data-id="item.order_refund_id">查看详情</view>
        </view>
      </view>
      <!-- 没有更多 -->
      <view v-if="list.data && !isLoading && isLastPage" class="no-more f-30">亲, 没有更多了</view>
    </view>
    <!-- 没有记录 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-else-if="!isLoading">
			<view class="col-9">亲，您还没有订单信息哦！</view>
		</tui-no-data>
  </scroll-view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      applyStatus: [],
      tabList: [],
      dataType: -1,
      submsgSetting: {},
      // 订阅消息配置
      list: [],
      // 列表数据
      page: 1,
      // 当前页码
      isLoading: true,
      // 是否正在加载中
      isLastPage: false // 当前是最后一页
      ,
      swiperHeight: ""
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // 获取订阅消息配置
    this.getSubmsgSetting();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取退款/售后单列表
    this.getRefundList();
     // 设置swiper的高度
    this.$nextTick(() => {
      this.setSwiperHeight(); 
    })
  },

  methods: {
    /**
     * 跳转订单详情页
     */
    triggerDetail(order_id, state_text) {
      uni.navigateTo({
        url: '../order/detail?order_id=' + order_id + '&&state_text=' + state_text
      });
    },
    /**
     * 获取退款/售后单列表
     */
    getRefundList(isNextPage, page) {
      let _this = this;

      getApp().globalData._get('sharing.refund/lists', {
        state: _this.dataType,
        page: page || 1
      }, result => {
        // 创建页面数据
        _this.setData(_this.createData(result.data, isNextPage));
      });
    },

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
     * 创建页面数据
     */
    createData(data, isNextPage) {
      data['isLoading'] = false; // 列表数据

      let dataList = this.list;

      if (isNextPage == true && typeof dataList !== 'undefined') {
        data.list.data = dataList.data.concat(data.list.data);
      } // 导航栏数据


      data['tabList'] = [{
        value: -1,
        text: '全部'
      }, {
        value: 0,
        text: '待处理'
      }];
      return data;
    },

    /**
     * 设置swiper的高度
     */
    setSwiperHeight() {
      setTimeout(() => {
        const query = wx.createSelectorQuery();
        query.select('#top').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(res => {
          let systemInfo = wx.getSystemInfoSync(),
              rpx = systemInfo.windowWidth / 750,
              // 计算rpx
          tapHeight = Math.floor(rpx * 80),
              // tap高度
          swiperHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度

          this.setData({
            swiperHeight
          });
        }, 1000);
      })
    },

    /** 
     * 点击tab切换 
     */
    swichNav(e) {
      let _this = this,
          current = e.target.dataset.current;

      if (_this.dataType == current) {
        return false;
      }

      _this.setData({
        dataType: current,
        list: {},
        page: 1,
        isLastPage: false,
        isLoading: true
      }, () => {
        // 获取退款/售后单列表
        _this.getRefundList();
      });
    },

    /**
     * 下拉到底加载数据
     */
    onPageDown() {
      let _this = this; // 已经是最后一页


      if (_this.page >= _this.list.last_page) {
        _this.setData({
          isLastPage: true
        });

        return false;
      } // 获取退款/售后单列表


      _this.getRefundList(true, ++_this.page);
    },

    /**
     * 跳转售后详情页
     */
    onTargetDetail(e) {
      let _this = this; // 跳转售后详情页


      const onCallback = () => {
        uni.navigateTo({
          url: `./detail/detail?order_refund_id=${e.currentTarget.dataset.id}`
        });
      }; // 请求用户订阅消息


      _this.onRequestSubscribeMessageFun(onCallback);
    },

    /**
     * 订阅消息 => [售后状态通知]
     */
    onRequestSubscribeMessageFun(callback) {
      let _this = this;

      let tmplItem = _this.submsgSetting.order.refund.template_id;

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
    }

  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>