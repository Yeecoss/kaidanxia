<template>
	<view class="container">
		<!-- 自定义标题栏 -->
		<navigationBar title="搜索"></navigationBar>
		
		<view class="cont-box">
			<view class="dis-flex search-input-box">
				<view class="search-input">
					<view class="dis-flex flex-y-center search-box">
							<text class="iconfont2 icon-searchfor col-9"></text>
							<input v-model="searchValue" @blur="search(searchValue)" class="input" focus="true" placeholder="请输入您搜索的内容" placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text"/>
					</view>
				</view>
			</view>
			
			<view class="search-cont-box" v-if="recentWant.length">
				<view class="title-box col-3">
					<text>最近搜索</text>
					<text @tap="clearSearch" class="iconfont icon-lajixiang"></text>
				</view>
				<view class="sale-button-box">
					<view class="seconds-kill-li" v-for="(recent, idx) in recentWant" :key="idx">
						<view @tap="goSearch(recent)" class="recent-button col-6">{{recent}}</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	let App = getApp().globalData;
	import {mapState,mapMutations} from 'vuex';

	export default {
		data() {
			return {
				recentWant: [],
				searchValue: '',
				tabsOn: '',//搜索的类型
			};
		},

		//生命周期函数--监听页面加载
		onLoad (options) {
			this.tabsOn = options.tabsOn;
		},
		//生命周期函数--监听页面显示
		onShow () {
			// 获取历史搜索
			this.getRecentSearch();
		},
		methods: {
			//对全局方法进行监控
			...mapMutations(['changeData']),
			//获取历史搜索
			getRecentSearch () {
				this.recentWant = wx.getStorageSync('recentWant');
			},

			//搜索提交
			search (val) {
				if (val!='') {
					// 记录最近搜索
					let recentWant = wx.getStorageSync('recentWant') || [];
					let index = recentWant.indexOf(val);
					index > -1 && recentWant.splice(index, 1);
					recentWant.unshift(val);
					wx.setStorageSync('recentWant', recentWant); // 跳转到商品列表页
					
					this.changeData({k:'optimizateSearch',v:val})
					uni.switchTab({
						url: `/pages/index/index`,
					});
					// uni.reLaunch({
					// 	url: `/pages/optimization/index?search=${val}&tabsOn=${this.tabsOn}`,
					// });
				}
			},
			//跳转到最近搜索
			goSearch(val) {
				this.changeData({k:'optimizateSearch',v:val})
				
				wx.switchTab({
					url: `/pages/index/index`,
				});
				// uni.navigateTo({
				// 	url: '/pages/optimization/index'
				// })
			},
			//清空最近搜索记录
			clearSearch () {
				wx.removeStorageSync('recentWant');
				this.getRecentSearch();
			},

		}
	};
</script>
<style>
	@import "index.css";
</style>