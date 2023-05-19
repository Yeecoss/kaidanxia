<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="渠道商品" extClass="nav" id="top"></navigationBar>
<view class="container">
  <div class="heardOpt dis-flex flex-y-center flex-x-between">
    <div>是否开启渠道</div>
    <div>
      <cust-switch :checked="open_dealer == 1" @change="isIndDealerChange"></cust-switch>
    </div>
  </div>
  <div class="goodsList flex-wrap dis-flex flex-y-center" v-if="goodsList.length > 0">
    <div class="goodsItem" v-for="(item, index) in goodsList" :key="index">
      <div class="imgBox">
        <image class="img" lazy-load :src="item.goods.goods_image" mode="widthFix"></image>
      </div>
      <div class="goodsBox">
        <div class="goodsName onelist-hidden">
          {{item.goods.goods_name}}
        </div>
        <div class="goodsPrice dis-flex flex-y-center flex-x-between">
          <div>
            ¥{{item.goods.min_price}}
          </div>
          <div class="close" @tap.stop="del(item)">
            <text class="iconfont2 icon-blacklist"></text>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png" :imgWidth="264" :imgHeight="264">
      <view class="col-9">亲，您还没有渠道商品哦～</view>
    </tui-no-data>
  </div>
  <div class="footBut" @tap="addGoods">
    <text class="iconfont2 icon-jiahao addIcon"></text>
    添加渠道商品
  </div>
  <popup-tips ref="popupTips" @tipsCallback="tipsCallback" content="确定从渠道商品中移除？"></popup-tips>
</view>
</view>
</template>

<script>
let App = getApp().globalData;
import custSwitch from '@/components/cust-switch/index.vue';
import popupTips from '@/components/popup-tips/index';

export default {
  data() {
    return {
      open_dealer: 0,
      goodsList: []
    };
  },

  components: {
    custSwitch,
    popupTips
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },
  methods: {
    getData() {
      App._get('shop.goods/getOpenDealerGoods',{},res => {
        this.goodsList = res.data.list.data || []
      });
      App._get('shop.xrdealer.setting/detail',{},res => {
        this.open_dealer = res.data.setting ? res.data.setting.open_dealer || '0' : '0'
      });
    },
    addGoods() {
      uni.navigateTo({
        url: '/pages/user/distribution/checkGoods/index'
      });
    },
    isIndDealerChange(e) {
      App._post_form('shop.xrdealer.setting/detail',{
        open_dealer: e ? 1 : 0
      },res => {
        this.$api.msg(res.msg)
      });
    },
    del(item) {
      this.checkItem = item
      this.$refs.popupTips.open()
    },
    tipsCallback() {
      App._post_form('shop.goods/closeDealer',{
        wxapp_goods_id: this.checkItem.wxapp_goods_id
      },res => {
        this.$api.msg(res.msg)
        this.getData()
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>