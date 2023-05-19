<template>
	<view class="bgf min_h_100" v-if="homeStyle=='minishop'">
		<view class="page-bg">
			<!-- <image src="https://pic.kaidanxia.com/2021-04-29/1651449a97b5181.png" mode="widthFix"></image> -->
		</view>
		<!-- 首页头部 -->
		<view class="header">
		  <header class="wrap30 index-header dis-flex flex-y-center flex-x-between">
		
		    <view class="index-header-c dis-flex flex-y-center">
		      <view class="on col-2" @tap="switchTab(0)">首页</view>
		      <view class="col-6" @tap="switchTab(1)">优选</view>
		      <view class="col-6" @tap="switchTab2" v-if="isCheckGoods">采购</view>
		    </view>
		
		    <!-- <view class="index-header-l">
		    </view> -->
		    <view class="index-header-r dis-flex flex-y-center flex-x-end col-3">
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
		        url="/pages/search/index"
		        hover-class="none"
		      >
		        <text class="iconfont2 icon-sousuo f-32 m-r-10"></text>
						<text class="text">搜索</text>
		      </navigator>
		    </view>
		  </header>
		</view>
		<!-- 内容 -->
		<view class="main p-b-40">
			<view class="mbg"></view>
			<view class="">
				<!-- banner轮播 -->
				<diy-banner itemIndex="0" styleClass="minishop" :itemStyle="ban_style" :params="ban_params" :dataList="infoData.banners"></diy-banner>
				<!-- 店铺公告 -->
				<view>
					<notice :wxapp="wxapp"></notice>
				</view>
				<!-- 优惠券 -->
				<coupon-templete1 v-if="couponList.length" styleClass="minishop" :homeStyle="homeStyle" :list="couponList" @toCoupon="receive" @receive="receive"></coupon-templete1>
				<!-- 联系商家 -->
				<view class="lianxiShop f-28 tb-lr-center" @tap.stop="toShopInformation">
					<text class="iconfont2 icon-WeChat"></text>
				</view>
				<!-- 推荐专区 -->
				<template v-if="rHotTbs.length>0">
					<view class="recomHot m-t-50" v-if="rHotTbs[sortType].list.length>0">
						<view class="recomHot-top dis-flex flex-x-between wrap30 m-b-20">
							<view class="rHotTbs f-32 col-6 dis-flex flex-y-end">
								<view :class="sortType==index?'on m-r-30':'m-r-30'" v-for="(item, index) in rHotTbs" :key="index" @tap="sortTypeChange(index)">
									{{item.text}}
								</view>
							</view>
							<navigator class="col-6 f-24 m-top6" :url='`/pages/category/extend/list?sortType=` + rHotTbs[sortType].type' hover-class="none">
								更多<text class="iconfont2 icon-more1 f-24"></text>
							</navigator>
						</view>
						<scroll-view scroll-x :show-scrollbar="false" class="mgoods_list p-l-30 dis-flex">
							<view class="mini_goods bgf" v-for="(item,index) in rHotTbs[sortType].list" :key="index" @tap="toDetail(item.wxapp_goods_id)">
								<view class="mgoods_pic"><image :src="item.goods?item.goods.goods_image:'/static/images/defaultImg.png'" mode="aspectFill"></image></view>
								<view class="mgoods_detail">
									<view class="mgoods_name onelist-hidden f-28 col-3">{{item.goods?item.goods.goods_name:''}}</view>
									<view class="app-red2 f-28 m-t-10">¥{{ item.goods?item.goods.min_price:'' }}</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</template>
				<!-- 砍价专区 -->
				<template v-if="infoData.bargain_goods&&infoData.bargain_goods.length>0">
					<view class="bargin-wrap wrap30 m-t-50" @tap="toBargin" v-if="infoData.bargain_goods[0].wxappgoods">
						<view class="recomHot-top dis-flex flex-x-between m-b-30">
							<view class="bargin-title f-32">砍价专区 <text class="col-6 m-l-20 f-24">低价购买</text></view>
							<view class="col-6 f-24 m-top6">
								更多<text class="iconfont2 icon-more1 f-24"></text>
							</view>
						</view>
						<view class="bargin-goods dis-flex flex-x-between">
							<view class="bargin-item" v-for="(item,index) in infoData.bargain_goods" :key="index">
								<image :src="item.wxappgoods?item.wxappgoods.goods.goods_image:'/static/images/defaultImg.png'" mode="aspectFill"></image>
								<view class="bargain-price f-28 col-f">¥{{ item.floor_price }}</view>
							</view>
						</view>
					</view>
				</template>
				<!-- 秒杀商品 -->
				<view class="wrap30" v-if="sharpGood">
					<diy-sharpGoods ref="diySharpGoods" :itemStyle="sharpGoods.style" :itemData="sharpGood" :params="sharpGoods.params"></diy-sharpGoods>
				</view>
			</view>
			<!-- 商品展示 -->
			<tui-divider v-if="infoData.all_goods!=''" class="m-b-10" :size="32" width="52%" :height="112" dividerColor="#F27257" color="#F27257"><text class="iconfont2 icon-Commoditydisplay app-red2 m-r-10 f-28"></text>商品展示</tui-divider>
			<view class="mini_good_list dis-flex flex-wrap wrap30" v-if="infoData.all_goods!=''">
				<template v-for="(item,index) in infoData.all_goods">
					<view class="mini_good" :key="item.wxapp_goods_id" @tap="toDetail(item.wxapp_goods_id)">
						<view class="mgoods_pic">
							<image :src="item.goods.goods_image||'/static/images/defaultImg.png'" mode="aspectFill"></image>
						</view>
						<view class="mgoods_detail">
							<view class="mgoods_name onelist-hidden f-28 col-3">{{item.goods.goods_name||''}}</view>
							<view class="app-red2 f-28 m-t-10">¥{{ item.goods.min_price }}</view>
						</view>
					</view>
				</template>
			</view>
			<navigator v-if="infoData.all_goods&&infoData.all_goods.length>0" url="/pages/category/extend/list" hover-class="none" class="more-img t-c f-24 col-3 p-t-10 p-b-10">
				<image src="https://pic.kaidanxia.com/2021-02-28/112445b0b590752.png" mode="widthFix"></image>
			</navigator>
		</view>
		<view class="saler_nodata p-bottom" v-if="infoData.all_goods==''">
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<!-- 确认购买弹窗 -->
		<view class="proSpec">
			<proSpecs ref="proSpecs"></proSpecs>
		</view>
		<!-- 分享同步 -->
		<!-- <share-bottom ref="shareBottom" pageType="goods"></share-bottom> -->
		<!-- 右拉筛选 -->
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
		<!-- 联系商家 -->
		<contact ref="contact"></contact>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import diyBanner from "./banner/banner";
	import notice from "./notice/notice";
	import diySharpGoods from "./sharpGoods/index";
	import couponTemplete1 from '@/pages/coupon/_templete/templete1/index';
	import popupTips from '@/components/popup-tips/index';
	import good from '@/components/diy/saler/good/good';
	import proSpecs from '@/components/goods/proSpecs/pro-specs';
	// import shareBottom from '@/components/share-bottom/index';
	import rightDrawer from '@/components/goods/rightDrawer/index';
	import contact from '@/components/myGoodsCommon/contact/index';
	export default {
		components: {
			diyBanner,
			notice,
			diySharpGoods,
			couponTemplete1,
			popupTips,
			good,
			proSpecs,
			// shareBottom,
			rightDrawer,
			contact
		},
		props: {
			homeStyle: {
				type: String,
				default: ''
			},
			isCheckGoods: {
				type: Boolean,
				default: false
			},
		},
		data(){
			return{
				index: 1,
				mtitle:'',
				mcontent:'',
				next: null,
				infoData: {},
				banner: [],
				ban_style: {btnColor: "#fff",btnShape: "round"},
				ban_params: {interval: "2800"},
				couponList: [],//优惠券
				rHotTbs:[{type: 'recommend', text:'推荐',list: []},{type: 'hot', text:'热销',list: []},],
				sortType: 0,
				sharpGoods:{
					params: {showNum: 6},
					style: {background: "",column: 3,show: {goodsName: 1,seckillPrice: "1",originalPrice: "1"}},
				},
				sharpGood: '',
				
				wxapp: {},
				otherObj: {},//筛选条件
			}
		},
		methods: {
			// 局部更新
			_show(next){
				this.page = 1;
				this.otherObj = {}
				this.next = next || null;
				this.getInfo();
			},
			//获取数据
			getInfo(){
				app._get('page/minishop',{}, res => {
					this.infoData = res.data || '';
					this.wxapp = res.data.wxapp;
					this.sharpGood = res.data.sharp_active||'';
					if(res.data.coupon){
						this.couponList[0] = res.data.coupon||'';
					}
					// 热销推荐
					let rHotTbs = [];
					if(res.data.rmd_goods.length>0){
						let obj = {
							type: 'recommend', text:'推荐',list: res.data.rmd_goods
						};
						rHotTbs.push(obj);
					}
					if(res.data.hot_goods.length>0){
						let obj = {
							type: 'hot', text:'热销',list: res.data.hot_goods
						};
						rHotTbs.push(obj)
					}
					this.rHotTbs = rHotTbs;
					this.next(res.data);
				})
			},
			//筛选框确定
			rightDrawerChange(obj) {
				this.otherObj = obj;
				this.page = 1;
				// 获取商品列表
				// this.getList();
			},
			// 店铺资料
			toShopInformation() {
				let obj = {
					wxapp_id: app.wxapp_id
				}
				app._get('wxapp/info', obj, (res) => {
					let values = res.data.shop || {}
					this.user = values
					this.$refs.contact.open(this.user)
				})
			},
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
			// 立即领取
			receive(couponId) {
				uni.navigateTo({
					url:'/pages/coupon/coupon'
				})
				// app._post_form('user.coupon/receive', {
				// 	coupon_id: couponId
				// }, res => {
				// 	this.$api.msg(res.msg)
				// 	// 获取优惠券列表
				// 	this.getInfo();
				// });
			},
			//推荐热销
			sortTypeChange(index){
				this.$nextTick(() =>{
					this.sortType = index;
				});
			},
			toBargin(){
				uni.navigateTo({
					url: '/pages/bargain/index/index'
				})
			},
			//详情
			toDetail(id){
				uni.navigateTo({
					url: '/pages/goods/index?goods_id=' + id
				})
			},
			toNotice(text){
				uni.navigateTo({
					url: '/pages/myGoods/shopNotice/detail?text='+text
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index.scss';
</style>
