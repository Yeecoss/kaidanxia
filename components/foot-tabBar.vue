<template>
	<view class="tabbar-wrap" :style="theme.themeStyle">
		<view class="tabbar dis-flex">
			<!-- 简约模板 -->
			<template v-if="homeStyle == 'minishop'">
				<view class="tabbar-item minishop" @tap="navgateTo(item)"
					:class="[dIndex==index?'on':'']" 
					v-for="(item, index) in tabbarList" :key="index">
					<text :class="'iconfont2 ' + [dIndex==index?item.minishop_icon2:item.minishop_icon]"></text>
					<view>{{item.text}}</view>
				</view>
			</template>
			<!-- 运动模板 -->
			<template v-if="homeStyle == 'sportshop'">
				<view class="tabbar-item" @tap="navgateTo(item)"
					:class="[homeStyle,dIndex==index?'on':'']" 
					v-for="(item, index) in tabbarList" :key="index">
					<text :class="'iconfont2 ' + item.sportshop_icon"></text>
					<view>{{item.text}}</view>
				</view>
			</template>
			<!-- 默认模板 -->
			<template v-if="homeStyle == 'div'||homeStyle == 'saler'">
				<view class="tabbar-item"
					v-for="(item, index) in tabbarList" :key="index"
					:class="[dIndex==index?'on':'']" 
					
					@tap="navgateTo(item)">
					<text :class="'iconfont2 ' + item.icon"></text>
					<view>{{item.text}}</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import {mapState,mapMutations} from 'vuex';
	var tabbar0 = [{
			icon: 'icon-Fill1',
			minishop_icon: 'icon-homepage1',
			minishop_icon2: 'icon-homepage2',
			active_color:'',
			disable_color:'',
			text: '首页',
			url: '/pages/index/index'
		},{
			icon: 'icon-theheart',
			minishop_icon: 'icon-Optimization1',
			minishop_icon2: 'icon-Optimization2',
			active_color:'',
			disable_color:'',
			text: '优选',
			url: '/pages/optimization/index'
		},
		// {
		// 	icon: 'icon-shop',
		// 	minishop_icon: 'icon-personalstores1',
		// 	minishop_icon2: 'icon-personalstores2',
		// 	active_color:'',
		// 	disable_color:'',
		// 	text: '店铺',
		// 	url: '/pages/retailShop/index'
		// },
		{
			icon: 'icon-bianzu2',
			minishop_icon: 'icon-ShoppingCart1',
			minishop_icon2: 'icon-ShoppingCart2',
			active_color:'',
			disable_color:'',
			text: '购物车',
			url: '/pages/flow/index'
		},{
			icon: 'icon-bianzu',
			minishop_icon: 'icon-my1',
			minishop_icon2: 'icon-my2',
			active_color:'',
			disable_color:'',
			text: '我的',
			url: '/pages/userIndex/index'
		},];
	export default {
		props:{
			dIndex:{
				type: [Number,String],
				default: 1
			},
			homeStyle: {
				type: String,
				default: 'div'
			}
		},
		data() {
			return {
				// tabbar: app.tabbarList||[],
				isShow: false,
			};
		},
		computed:{
			//对全局变量tabbarList进行监控
			...mapState(['tabbarList','theme'])
		},
		mounted() {
    	uni.hideTabBar();
		},
		methods: {
			navgateTo (item){
				console.log(item)
				uni.switchTab({
					url: item.url
				})
			},
		}
	}
</script>

<style lang="scss">
.tabbar-wrap,.tabbar{
	width: 100%;
	height:98rpx;
	// padding-bottom: env(safe-area-inset-bottom);
	// box-sizing: content-box;
}
.tabbar{
	position: fixed;
	left: 0;
	bottom: 0;
	font-size: 22rpx;
	color: #999;
	background:#fff;
	box-shadow:0 0 16rpx 2rpx rgba(222,222,222,0.5);
	z-index: 99;
}
.tabbar-item{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	&.on{
		// color: $red;
		color: var(--color);
	}
	&.tabbar-center text{
		display: block;
		width: 84rpx;
		height: 84rpx;
		line-height: 84rpx;
		border-radius: 50%;
		font-size: 60rpx;
		text-align: center;
		color: #fff;
		background: url(../static/images/tabbarbg.png) no-repeat;
		background-size: 100% 100%;
		box-shadow: 0 0 8rpx 0 rgba(201,201,201,0.5);
		border: 4rpx solid #fff;
		margin-top: -42rpx;
	}
	text{
		font-size: 40rpx;
	}
	// 简约模板
	&.minishop{
		&.on{
			color: $red2;
			text{
				background-image:-webkit-linear-gradient(bottom,#F27257,#FAAB90); 
				-webkit-background-clip:text; 
				-webkit-text-fill-color:transparent;
			}
		}
	}
	&.sportshop{
		&.on{
			color: $theme4Color;
			// text{
			// 	background-image:-webkit-linear-gradient(bottom,#F27257,#FAAB90); 
			// 	-webkit-background-clip:text; 
			// 	-webkit-text-fill-color:transparent;
			// }
		}
	}
}
</style>
