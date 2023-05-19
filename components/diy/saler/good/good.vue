<template>
	<view class="bgf m-t-20 goods dis-flex" @tap="toDetail(good.wxapp_goods_id)">
		<view class="seller m-r-20" v-if="wxapp">
			<image lazy-load :src="wxapp.logo" mode="aspectFill"></image>
		</view>
		<!-- info -->
		<view class="good_info flex-box">
			<view class="good_name onelist-hidden f-30 col-3" :style="(good.is_hot.value==1&&good.shop_rmd.value==1)?'width:82%':(good.is_hot.value==1||good.shop_rmd.value==1)?'width:90%':''" @tap.stop="clipboard(good.goods.goods_name)">
				<text>{{good.goods.goods_name}}</text>
			</view>
			<view class="price dis-flex flex-y-center">
				<text class="f-32 price1">¥{{good.goods.min_price}}</text>
				<text class="f-24 col-9 m-l-10 price2" v-if="good.goods.goods_sku.line_price>0&&good.goods.sku && good.goods.sku.length == 1">
					¥{{good.goods.goods_sku.line_price}}
				</text>
			</view>
			<view class="f-24 col-3 m-top10">销量:{{good.buy_num}}/分享:{{good.share_num}}</view>
			<view class="sell_point m-top10" v-show="good.goods.selling_point" :class="showAll?'':'sixlist-hidden'">
				<text class="col-6 f-24 point">{{good.goods.selling_point}}</text>
			</view>
			<view class="oh" v-show="good.goods.selling_point">
				<view class="col-b f-28 fl" @tap.stop="showAllPoint" v-if="isMore">{{showAll ? '收起' : '全文'}}</view>
				<view class="copy f-24 fr" @tap.stop="clipboard(good.goods.selling_point)">复制文字</view>
			</view>
			<!-- 商品图片 -->
			<view class="m-t-20">
				<picture-group :images="good.goods.image" @priview="priview"></picture-group>
			</view>
			<view class="f-26 col-9 m-top10">{{good.goods.create_time}}</view>
			<view class="optbox flex-x-between">
				<view class="dis-flex flex-y-center">
					<view class="oper-item f-24 col-6 m-r-40" @tap.stop="upload(good.goods.image)"><text class="iconfont2 icon-download f-30"></text>下载</view>
					<view class="oper-item f-24 col-6" @tap.stop="toShare(good)"><text class="iconfont2 icon-share f-30"></text>分享</view>
				</view>
				<button class="settlement" style="padding:0" @tap.stop="openDialog(good)">立即购买</button>
			</view>
		</view>
		<view class="tag-wrap dis-flex flex-x-end">
			<view class="hot-tag" v-show="good.is_hot.value==1">
				<image lazy-load src="http://pic.kaidanxia.com/2020-08-13/20200813152908bc60b6427.png" mode="widthFix"></image>
			</view>
			<view class="hot-tag" v-show="good.shop_rmd.value==1">
				<image lazy-load src="http://pic.kaidanxia.com/2020-08-13/20200813152908b7bf00843.png" mode="widthFix"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import pictureGroup from '@/components/goods/picture-group/index';
	export default{
		components:{
			pictureGroup,
		},
		props:{
			list: {
				type: Object,
				default: () => {
				  return {}
				}
			},
			wxapp: {
				type: Object,
				default: () => {
				  return {}
				}
			},
		},
		data(){
			return{
				good: {},
				showAll: false,
				isMore: false
			}
		},
		created() {
			this.good = JSON.parse(JSON.stringify(this.list));
		},
		mounted() {
			this.getH()
			this.getH2()
		},
		watch: {
			list (v) {
				if (v) {
					this.good = JSON.parse(JSON.stringify(v));
				} 
			},
		},
		methods:{
			//立即购买
			openDialog(item){
				this.$emit('openDialog',item)
			},
			// 点击下载
			upload(files){
				this.$emit('upload',files)
			},
			//点击分享
			toShare(item){
				this.$emit('toShare',item)
			},
			//详情
			toDetail(id){
				uni.navigateTo({
					url: '/pages/goods/index?goods_id=' + id
				})
			},
			// 复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
			showAllPoint(){
				this.showAll = !this.showAll
			},
			getH(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('.point').boundingClientRect(result => { 
				  if (result) {
				    this.vheight = result.height;
				  }else { 
				    this.getH(); 
					} 
				}).exec();
			},
			getH2(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('.sell_point').boundingClientRect(result => { 
				  if (result) {
				    this.vheight0 = result.height;
						if(this.vheight>this.vheight0){
							this.isMore = true;//console.log('高度======',this.vheight,this.vheight0)
						}
				  }else { 
				    this.getH2(); 
					} 
				}).exec();
			},
			priview(e){
				this.$emit('priview',e)
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'good';
</style>
