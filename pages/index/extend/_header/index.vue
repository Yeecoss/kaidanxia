<template>
	<view>
		<!-- 关注头部 -->
		<template v-if="homeStyle != 'minishop'">
			<view class="header defaultHeaer">
				<header
					class="wrap30 index-header dis-flex flex-y-center flex-x-between"
				>
					<view class="index-header-l">
						<navigator
							class="cate_btn dis-flex flex-y-center"
							openType="navigate"
							url="/pages/optimization/extend/attention/attention"
							hover-class="none"
						>
							<text class="iconfont2 icon-delete2"></text>
							<text class="text">关注</text>
						</navigator>
					</view>
			
					<view class="index-header-c dis-flex flex-y-center flex-x-center">
						<view class="col-6" :class="typeOn==0?'on':''" @tap="switchTab(0)">首页</view>
						<view class="col-2" :class="typeOn==1?'on':''" @tap="switchTab(1)">优选</view>
						<view class="col-6" @tap="switchTab2" v-if="isCheckGoods">采购</view>
					</view>
			
					<view class="index-header-r dis-flex flex-y-center flex-x-end">
						<navigator
							class="search_btn"
							openType="navigate"
							:url="typeOn==0?'/pages/search/index':'/pages/optimization/extend/search/index?tabsOn='+tabsOn"
							hover-class="none"
							v-if="isIndex"
						>
							<text class="iconfont2 icon-sousuo"></text>
							<text class="text">搜索</text>
						</navigator>
						<slot v-else name="right"></slot>
					</view>
				</header>
			</view>
		</template>
		<!-- 简约模板 -->
		<template v-if="homeStyle == 'minishop'">
			<view class="header minishop">
			  <header class="wrap30 index-header dis-flex flex-y-center flex-x-between">
			    <view class="index-header-c dis-flex flex-y-center">
			      <view class="col-6" :class="typeOn==0?'on':''" @tap="switchTab(0)">首页</view>
			      <view class="col-6" :class="typeOn==1?'on':''" @tap="switchTab(1)">优选</view>
			      <view class="col-6" @tap="switchTab2" v-if="isCheckGoods">采购</view>
			    </view>
			    <view class="index-header-r dis-flex flex-y-center flex-x-end col-3">
			      <!-- <navigator
			        class="cate_btn f-28"
			        openType="navigate"
			        url="/pages/category/index"
			        hover-class="none"
			      >
			        <text class="iconfont2 icon-classification1 f-32 m-r-10"></text>
			        <text class="text">分类</text>
			      </navigator> -->
						<navigator
							class="cate_btn f-28"
							openType="navigate"
							url="/pages/optimization/extend/attention/attention"
							hover-class="none"
						>
							<text class="iconfont2 icon-delete2 f-32 m-r-10"></text>
							<text class="text">关注</text>
						</navigator>
			      <navigator
			        class="search_btn f-28 m-l-30"
			        openType="navigate"
			        :url="typeOn==0?'/pages/search/index':'/pages/optimization/extend/search/index?tabsOn='+tabsOn"
			        hover-class="none"
							v-if="isIndex"
			      >
			        <text class="iconfont2 icon-sousuo f-32 m-r-10"></text>
							<text class="text">搜索</text>
			      </navigator>
						<slot v-else name="right"></slot>
			    </view>
			  </header>
			</view>
		</template>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default{
		props:{
			homeStyle: {
				type: String,
				default: ''
			},
			isCheckGoods: {
				type: Boolean,
				default: false
			},
			//是否是首页
			isIndex: {
				type: Boolean,
				default: true
			},
			typeOn: {
				type: [String,Number],
				default: 1
			},
			tabsOn:{
				type: [String,Number],
			}
		},
		data(){
			return {
				
			}
		},
		watch:{
			// typeOn(newval, oldvar) {
			// 	if (newval) {
			// 		this.typeOn = newval
			// 	}else{
			// 		this.typeOn = oldvar
			// 	}
			// }
		},
		methods: {
			// 切换tab
			switchTab(id) {
				this.$emit('switchTab',id)
			},
			// 去采购
			switchTab2() {
			  uni.navigateTo({
			    url:"/pages/retailShop/shopAbout/shopDetail/index?wxapp_id=" + app.wxapp_id,
			  });
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
