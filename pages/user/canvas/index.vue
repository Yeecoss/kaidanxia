<template>
	<div class="pageBox">
		<navigationBar ref="navigationBar" title="Canva-开单虾专属"></navigationBar>
		<div @tap.stop="toCanva">
			<image src="http://pic.kaidanxia.com/2020-08-05/2020080510455729aeb9922.jpg"></image>
		</div>
		<view class="bottomBox">
			
		</view>
		<view class="bottomFixed">
			<view class="bottom" @tap.stop="toCanva">
				点击进入
			</view>
		</view>
	</div>
</template>
<script>
	let App = getApp().globalData;
	export default {
		data() {
			return {

			};
		},

		components: {
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
		},
		mounted() {},
		methods: {
            toCanva() {
				/* #ifdef MP-WEIXIN */
                uni.navigateToMiniProgram({
                    appId: 'wx47bb17ae9c1d7bd3',
                    path: 'pages/anonymous-templates/anonymous-templates',
                    envVersion: 'release',
                    success: () => {
                        // console.log('success')
                    },
                    fail: () => {
                        // console.log('fail')
                    },
                    complete: () => {
                        // console.log('complete')
                    },
                })
				/* #endif */
				
				/* #ifndef MP-WEIXIN */
                let url = '/pages/user/canvas/appUse'
                uni.navigateTo({
                    url: url
                });
				/* #endif */
            },
		}
	}
</script>
<style lang="scss" scoped>
	image{
		width: 750rpx;
		height: 1875rpx;
	}
	.bottomBox{
		height: 98rpx;
	}
	.bottomFixed{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 98rpx;
		background: #FFFFFF;
		.bottom{
			margin: 10rpx auto 0;
			width: 690rpx;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			color: white;
			background: #E82E2E;
			box-shadow: 0 0 8rpx 1rpx rgba(222, 222, 222, 0.5);
			border-radius: 40rpx;
		}
	}
</style>
