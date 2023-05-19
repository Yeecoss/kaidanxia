<template>
	<!-- 公告组 -->
	<view class="diy-notice bgf dis-flex flex-y-center flex-x-between f-26 col-3" v-if="params.text!=''" @tap.stop="toNotice(params.notice)">
		<view class="title m-r-20"><text class="iconfont2 icon-Notice f-26"></text></view>
		<view class="flex-box notice-con oh">
			<view class="tui-notice" :class="[animation?'tui-animation':'']">{{params.notice}}</view>
		</view>
		<text class="line m-l-30">|</text>
		<view class="more m-l-30"><image src="https://pic.kaidanxia.com/2020-08-18/202008181711400af7c4687.png" mode="widthFix"></image></view>
		
	</view>
</template>

<script>

export default {
  data() {
    return {
			animation:false
		};
  },
  props: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
		// animation: Boolean
  },
  options: {},
	beforeMount() {
		setTimeout(() => {
			this.animation = true
		}, 600)
	},
  methods: {
		toNotice(text){
			uni.navigateTo({
				url: '/pages/myGoods/shopNotice/detail?text='+text
			})
		}
	}
};
</script>
<style lang="scss">
	.diy-notice{
		padding: 0 20rpx;
		height: 80rpx;
		box-shadow:0 0 12rpx 0 rgba(51,51,51,0.06);
		border-radius: 16rpx;
		.title{
			width: 48rpx;
			color: #FA6400;
		}
	}
	image{
		width: 100%;
		display: block;
	}
	.line{color: #D8D8D8;}
	.more{
		width: 60rpx;
	}
	.notice-con{
		white-space: nowrap;
	}
	// 跑马灯效果
	.tui-notice {
		transform: translateX(100%);
	}
	.tui-animation {
		-webkit-animation: tui-rolling 12s linear infinite;
		animation: tui-rolling 12s linear infinite;
	}
	
	@-webkit-keyframes tui-rolling {
		0% {
			transform: translateX(100%);
		}
	
		100% {
			transform: translateX(-170%);
		}
	}
	
	@keyframes tui-rolling {
		0% {
			transform: translateX(100%);
		}
	
		100% {
			transform: translateX(-170%);
		}
	}
	/* @import "./notice.css"; */
</style>