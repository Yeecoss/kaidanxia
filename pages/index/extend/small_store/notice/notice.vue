<template>
	<!-- 店铺公告 -->
	<view class="notice dis-flex flex-y-center m-t-40 bgf" v-if="wxapp.notice!=''" @tap.stop="toNotice(wxapp.notice)">
		<text class="iconfont2 icon-Notice1 app-red2 m-r-20"></text>
		<view class="f-26 col-6 flex-box notice-con oh">
			<view class="tui-notice" :class="[animation?'tui-animation':'']">{{wxapp.notice}}</view>
		</view>
		<text class="iconfont2 icon-more1 f-26 m-l-20"></text>
	</view>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
			animation:false
		};
  },
  props: {
    wxapp: Object
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
	
	// 公告
	.notice{
		height: 80rpx;
		margin: 40rpx 30rpx;
		padding: 0 20rpx;
		border-radius: 40rpx;
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