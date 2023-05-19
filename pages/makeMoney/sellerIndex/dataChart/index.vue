<template>
<view class="dataSummary">
  <!-- 自定义标题栏 -->
  <navigationBar title="销售数据">
  </navigationBar>
  <!-- 日历 -->
  <view class="rangeBox" @tap.stop="onShowDatePicker()">
    <text class="iconfont2 icon-calendar"></text>
    <text v-if="startDate != '' && endDate != ''">{{startDate}} - {{endDate}}</text>
  </view>
  <view class="allDataBox dis-flex flex-y-center flex-x-center">
  	<view class="allDataItem flex-box">
  		<view class="allDataNum">
  			{{total_sale}}
  		</view>
  		<view class="allDataTitle">
  			销售总额(元)
  		</view>
  	</view>
	<view class="line">
		
	</view>
  	<view class="allDataItem flex-box">
  		<view class="allDataNum">
  			{{total_profit}}
  		</view>
  		<view class="allDataTitle">
  			分佣总额(元)
  		</view>
  	</view>
  </view>
  <view class="bgBox">
  	<view class="bg"></view>
  </view>
  <!-- 交易走势 -->
  <echart-vue :closeEchats="closeEchats" ref="echart1" :echartsList="echartsList" fieldName="sales" title="七日销售额(元)" canvasId="saleline1"></echart-vue>
  <echart-vue :closeEchats="closeEchats" ref="echart2" :echartsList="echartsList" fieldName="profits" title="七日分佣额(元)" canvasId="saleline2"></echart-vue>
  <view class="no-more f-24 col-9">开单虾技术支持～</view>
  <tui-calendar :type="2" @change="onSelected" ref="tuiCalender" isFixed @timeHide="timeHide"></tui-calendar>
</view>
</template>

<script>
const App = getApp().globalData;
import echartVue from './echartVue/index';


export default {
  data() {
    return {
      tabItem: '1',
      startDate: '',
      endDate: '',
      total_profit: '0.00',
      total_sale: '0.00',
      echartsList: {},
      closeEchats: false
    };
  },

  components: {
    'echart-vue': echartVue
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAllData()
	  this.unitTime()
  },

  methods: {
	  unitTime() {
		  let date1 = new Date()
		  let ty = date1.getYear(); //年
		  let tm = date1.getMonth(); //月
		  let td = date1.getDate(); //日
		  let time = date1.getTime() - 24 * 60 * 60 * 1000 * 7
		  let date2 = new Date(time); //一个月前的日期
		  let startDate = date2.toLocaleDateString()
		  let endDate = date1.toLocaleDateString()
		  this.startDate = startDate
		  this.endDate = endDate
	  },
    // 获取全部数据
    getAllData() {
      let data = {}
      if (this.startDate != '') {
        data.startDate = this.startDate
      }
      if (this.endDate != '') {
        data.endDate = this.endDate
      }
      App._get('share.share_money/getSaleTotalDetail', data, (result) => {
        let data = result.data
		this.echartsList = data.echarts || {}
		this.total_profit = data.gather.total_profit || '0.00'
		this.total_sale = data.gather.total_sale || '0.00'
		this.$nextTick(() => {
			this.$refs.echart1.upDate()
			this.$refs.echart2.upDate()
		})
      })
    },
    onShowDatePicker(){//显示
      this.closeEchats = true
      this.$refs.tuiCalender.show()
    },
    onSelected(e) {//选择
      this.closeEchats = false
      if(e) {
        this.startDate = e.startDate
        this.endDate = e.endDate
      }
      this.getAllData()
    },
    timeHide() {
      this.closeEchats = false
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>