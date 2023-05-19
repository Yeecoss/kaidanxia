<template>
	<view class="min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="销售指导详情" extClass="nav" id="top"></navigationBar>
		
		<!-- banner -->
		<view class="banner">
			<image lazy-load :src="banner" mode="aspectFill"></image>
		</view>
		<view class="wrap">
			<view class="m-l-30 m-r-30 good-data">
				<view class="goods-name twolist-hidden f-30 col-3">
					{{info.article_title}}
				</view>
				<view class="goods-data dis-flex flex-y-center flex-x-between">
					<view class="publishTime f-24 col-9">{{info.create_time}}</view>
					<!-- <view class="read-num f-24 col-9"><text class="iconfont2 icon-eye f-24"></text>{{info.show_views}}</view> -->
				</view>
			</view>
			<!-- 详情富文本 -->
			<view class="detail">
				<!-- 商品描述 -->
				<goods-describe :article_content="info.article_content" :isTitle="false"></goods-describe>
			</view>
		</view>
		
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import goodsDescribe from '@/components/goods/goods-describe/index';
	export default {
		components: {
			goodsDescribe
		},
		data() {
			return {
				banner:'',
				info:'',//页面信息
				article_id:'',
			}
		},
		onLoad(options) {
			this.article_id = options.id ||'';
			this.getInfo()
		},
		methods: {
			// 获取详情信息
			getInfo(type,id){
				let that = this;
				app._get('share.make_money/getGuideDetail',{article_id: that.article_id},res => {
					let article = res.data;
					that.info = article;
					that.banner = article.image.file_path;
				});
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
