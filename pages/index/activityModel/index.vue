<template>
	<!-- 活动弹窗 -->
	<view v-if="popups&&popups.active&&!noGiveMember">
		<tui-modal class="tui-modal-custom" :show="isGiveMember" @cancel="_close" :custom="true" fadeIn padding="0" width="560rpx" radius="0" :maskClosable="false">
				<navigator :url="popups.popups_link" class="img"><image class="image" :src="popups.popups_image" mode="widthFix"></image></navigator>
				<view class="noShow f-24 t-c" @tap="noShowModel">不再提示</view>
				<view class="close-btn" @tap="_close"><text class="iconfont2 icon-fail f-52 col-f"></text></view>
		</tui-modal>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import {mapState,mapMutations} from 'vuex';
	export default{
		props: {
		},
		data(){
			return {
				noGiveMember: false,
				popups: {}
			}
		},
		computed:{
			//对全局变量进行监控
			...mapState(['isGiveMember'])
		},
		methods:{
			//对全局方法changeGiveMember进行监控
			...mapMutations(['changeGiveMember']),
			
			_open(popups){
				this.popups = popups;
				this.noGiveMember = uni.getStorageSync('noGiveMember') || false;
			},
			_close(){
				this.changeGiveMember(false)
			},
			noShowModel(){
				this._close()
				uni.setStorageSync('noGiveMember', true);
			},
		}
	}
</script>

<style lang="scss">
	.tui-modal-custom{
		width: 100%;
		position: relative;
		overflow: hidden;
		.img .image{
			width: 100%;
			height: 100%;
			display: block;
		}
		.noShow{
			position: absolute;
			top: 0;
			left: 0;
			width: 114rpx;
			line-height: 44rpx;
			color: #1E277B;
			background: #FED67F;
			border-radius: 0 0 20rpx 0;
		}
		.close-btn{
			position: absolute;
			bottom: -100rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.f-52{font-size: 52rpx;}
</style>
