<template>
<!-- 在线客服 -->
<view class="diy-service" :style="'right: ' + itemStyle.right + '%; bottom: ' + itemStyle.bottom + '%;'">
  <!-- 拨打电话 -->
  <block v-if="params.type == 'phone'">
    <form @submit="onServiceEventFun" report-submit="true">
      <button formType="submit" class="btn-normal">
        <view class="service-icon">
          <image lazy-load class="image" :src="params.image"></image>
        </view>
      </button>
    </form>
  </block>
  <!-- 在线聊天 -->
  <block v-else-if="params.type == 'chat'">
    <button open-type="contact" class="btn-normal">
      <view class="service-icon">
        <image lazy-load class="image" :src="params.image"></image>
      </view>
    </button>
  </block>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    itemIndex: String,
    itemStyle: Object,
    params: Object
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    /**
     * 点击拨打电话
     */
    onServiceEventFun(e) {
      // 记录formid
      getApp().globalData.saveFormId(e.detail.formId); // 拨打电话

      wx.makePhoneCall({
        phoneNumber: this.params.phone_num
      });
    }

  }
};
</script>
<style>
@import "./service.css";
</style>