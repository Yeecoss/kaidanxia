<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="申请售后" extClass="nav" id="top">
</navigationBar>
<view class="container p-bottom" v-if="detail.order_goods_id">

  <form @submit="onSubmit" report-submit>

    <!-- 商品详情 -->
    <form @submit="onGoodsDetail" report-submit="true">
      <button class="btn-normal" formType="submit" :data-id="detail.goods_id">
        <view class="goods-detail b-f dis-flex flex-dir-row">
          <view class="left">
            <image lazy-load class="goods-image" :src="detail.image.file_path"></image>
          </view>
          <view class="right dis-flex flex-box flex-dir-column flex-x-around">
            <view class="goods-name">
              <text class="twolist-hidden">{{ detail.goods_name }}</text>
            </view>
            <view class="col-9 f-24">
              <view class="flex-box">{{ detail.goods_attr }}</view>
              <text>×{{ detail.total_num }}</text>
            </view>
          </view>
        </view>
      </button>
    </form>

    <!-- 服务类型 -->
    <view class="row-service b-f m-top20">
      <view class="row-title">服务类型</view>
      <form @submit="onSwitchService" report-submit="true">
        <view class="service-switch dis-flex">
          <button class="btn-normal" formType="submit" data-type="10">
            <view :class="'switch-item ' + ( serviceType==10?'active':'' )">退货退款</view>
          </button>
          <button class="btn-normal dis-flex" formType="submit" data-type="20">
            <view :class="'switch-item ' + ( serviceType==20?'active':'' )">换货</view>
          </button>
        </view>
      </form>
    </view>

    <!-- 申请原因 -->
    <view class="row-textarea b-f m-top20">
      <view class="row-title">申请原因</view>
      <view class="content">
        <textarea name="content" maxlength="2000" placeholder-class="placeholderStyle" placeholder="请详细填写申请原因，注意保持商品的完好，建议您先与卖家沟通"></textarea>
      </view>
    </view>

    <!-- 退款金额 -->
    <view v-if="serviceType == 10" class="row-money b-f m-top20 dis-flex">
      <view class="row-title">退款金额</view>
      <view class="money col-m">￥{{ detail.total_pay_price }}</view>
    </view>

    <!-- 上传凭证 -->
    <view class="row-voucher b-f m-top20">
      <view class="row-title">上传凭证 (最多6张)</view>
      <view class="image-list">
        <!-- 图片列表 -->
        <view class="image-preview" v-for="(imagePath, imageIndex) in imageList" :key="imageIndex">
          <text class="image-delete iconfont2 icon-shanchu1" @tap.stop="deleteImage" :data-index="index" :data-image-index="imageIndex"></text>
          <image lazy-load mode="aspectFill" :src="imagePath"></image>
        </view>
        <!-- 上传图片 -->
        <form v-if="imageList.length < 6" @submit="chooseImage" report-submit="true">
          <button class="btn-normal" formType="submit">
            <view class="image-picker dis-flex flex-dir-column flex-x-center flex-y-center" style="margin:15rpx 0">
              <text class="choose__icon iconfont icon-tubiao_xiangji"></text>
              <text class="choose__text">上传图片</text>
            </view>
          </button>
        </form>
      </view>
    </view>
    <button class="submitBut" formType="submit">确认提交</button>
  </form>

</view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      // 订单商品id
      order_goods_id: null,
      // 订单商品详情
      detail: {},
      // 图片列表
      imageList: [],
      // 服务类型
      serviceType: 10
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 记录页面参数
    this.order_goods_id = options.order_goods_id; // 获取订单商品详情

    this.getGoodsDetail();
  },
  methods: {
    /**
     * 获取订单商品详情
     */
    getGoodsDetail: function () {
      let _this = this;

      getApp().globalData._get('sharing.refund/apply', {
        order_goods_id: this.order_goods_id
      }, function (result) {
        _this.setData(result.data);
      });
    },

    /**
     * 切换标签
     */
    onSwitchService: function (e) {
      this.setData({
        serviceType: e.detail.target.dataset.type
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
     * 选择图片
     */
    chooseImage: function (e) {
      let _this = this,
          index = e.currentTarget.dataset.index,
          imageList = _this.imageList;


      // 选择图片

      wx.chooseImage({
        count: 6 - imageList.length,
        // #ifdef H5 || MP
        sizeType: ['compressed', 'original'],
        // #endif
        // #ifdef APP-PLUS
        sizeType: ['compressed', 'original'],
        // #endif
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          let list = []
          res.tempFilePaths.forEach((item,index) => {
            // #ifdef H5 || MP
            if (res.tempFiles[index].size <= 2048000) {
            // #endif
            list.push(item)
            // #ifdef H5 || MP
            } else {
              App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
            }
            // #endif
          })
          _this.setData({
            imageList: imageList.concat(list)
          });
        }
      });
    },

    /**
     * 删除图片
     */
    deleteImage: function (e) {
      let dataset = e.currentTarget.dataset,
          imageList = this.imageList;
      imageList.splice(dataset.imageIndex, 1);
      this.setData({
        imageList
      });
    },

    /**
     * 表单提交
     */
    onSubmit: function (e) {
      let _this = this;

      if (!e.detail.value.content) {
        getApp().globalData.showError('申请原因不能为空');
        return false;
      } // 判断是否重复提交


      if (_this.disable === true) {
        return false;
      } // 表单提交按钮设为禁用 (防止重复提交)


      _this.disable = true;
      wx.showLoading({
        title: '正在处理...',
        mask: true
      }); // form参数

      let postParams = {
        order_goods_id: _this.order_goods_id,
        type: _this.serviceType,
        content: e.detail.value.content
      }; // form提交执行函数

      let fromPostCall = function (params) {
        // console.log('fromPostCall');

        getApp().globalData._post_form('sharing.refund/apply', params, function (result) {
          if (result.code === 1) {
            getApp().globalData.showSuccess(result.msg, function () {
              // 跳转售后管理页面
              uni.navigateTo({
                url: "../index"
              });
            });
          } else {
            getApp().globalData.showError(result.msg);
          }
        }, false, function () {
          wx.hideLoading();
          _this.disable = false;
        });
      }; // 统计图片数量


      let imagesLength = _this.imageList.length; // 判断是否需要上传图片

      imagesLength > 0 ? _this.uploadFile(imagesLength, fromPostCall, postParams) : fromPostCall(postParams);
    },

    /**
     * 上传图片
     */
    uploadFile: function (imagesLength, callBack, formData) {
      let uploaded = []; // 文件上传

      let i = 0;
      this.imageList.forEach(function (filePath, fileKey) {
        wx.uploadFile({
          url: getApp().globalData.api_root + 'upload/image',
          filePath: filePath,
          name: 'iFile',
          formData: {
            wxapp_id: getApp().globalData.getWxappId(),
            token: wx.getStorageSync('token')
          },
          success: function (res) {
            let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);

            if (result.code === 1) {
              uploaded[fileKey] = result.data.file_id;
            }
          },
          complete: function () {
            i++;

            if (imagesLength === i) {
              // 所有文件上传完成
              // console.log('upload complete');
              formData['images'] = uploaded; // 执行回调函数

              callBack && callBack(formData);
            }
          }
        });
      });
    }
  }
};
</script>
<style>
@import "./apply.css";
</style>