<template>
<view class="echartVue">
  <div class="checkBox dis-flex flex-x-between">
    <view class="itemTitle">{{title}}</view>
  </div>
  <!-- 折线图 -->
  <div v-show="!closeEchats">
	  <uCharts ref="uCharts"  :canvasId="canvasId" :opts="opts"  :cWidth="345"></uCharts>
  </div>
</view>
</template>

<script>
const App = getApp().globalData;
import uCharts from '@/components/u-charts/component';
export default {
  data() {
    return {
      select: '1',
      opts: {
        categories: [],
        series: [],
      }
    };
  },

  components: {
    uCharts
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    canvasId: {
      type: String,
      default: ''
    },
    closeEchats: {
      type: Boolean,
      default: false
    },
    fieldName: {
      type: String,
      default: ''
    },
    echartsList: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  
  methods: {
    selectItem(type) {
      this.select = type
      this.checkData()
      this.$nextTick(() => {
        this.$refs.uCharts.changeData(this.canvasId, this.opts)
      })
    },
    checkData() {
        this.opts = {
          categories: this.unitList(this.echartsList.days || []),
          series: []
        }
        this.opts.series = [{
          name: '',
          data: this.unitVal(this.echartsList[this.fieldName] || [])
        }]
    },
	unitVal(list) {
      let newList = []
      list.forEach((item, index) => {
        newList.push({value: item, color: 'rgba(232, 46, 46, 1)'})
      })
      return newList
	},
    upDate() {
      this.checkData()
      this.$nextTick(() => {
        this.$refs.uCharts.init()
      })
    },
    unitList(list) {
      let newList = []
      list.forEach(element => {
        newList.push(element.slice(8,10))
      })
      return newList
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>