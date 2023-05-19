<template>
	<view class="main bgf8">
		<!-- 首页头部 -->
		<header-top :homeStyle="homeStyle" :isCheckGoods="isCheckGoods" :tabsOn="tabsOn" @switchTab="typeTab">
			
		</header-top>
		<!-- tab -->
		<view class="attention-tab-wrap">
			<view class="attention-tab dis-flex flex-y-center wrap30">
				<view class="flex-box dis-flex flex-y-center">
					<view class="attention-tab-item" :class="tabsOn==v.id?'on':''" v-for="v in tabs" :key="v.id" @tap="switchTab(v.id)">{{v.text}}</view>
				</view>
			</view>
		</view>
		<!-- 自定义标题栏 -->
		<!-- <navigationBar :back="false">
				<navigator slot="left" class="search_btn" openType="navigate" :url="'/pages/optimization/extend/search/index?tabsOn='+tabsOn" hover-class="none">
					<text class="iconfont2 icon-sousuo f-36"></text>
				</navigator>
				<view class="index-header-c dis-flex flex-y-center flex-x-center" slot="center">
					<view :class="tabsOn==v.id?'on col-2':'col-6'" v-for="v in tabs" :key="v.id" @tap="switchTab(v.id)">{{v.text}}</view>
				</view>
		</navigationBar> -->
		<!-- 搜索框提醒 -->
		<view class="remind-model">
			<tui-bubble-popup direction="top" radius="38rpx" left="30rpx" right="30rpx" width="690rpx" backgroundColor="#fff" translateY="20rpx" :mask="false" :show="showRemind"
				borderWidth="20rpx" triangleLeft="42rpx" triangleTop="-40rpx">
				<view class="search-key f-24 col-9 dis-flex flex-y-center flex-x-between">
					当前搜索
					<text class="flex-box onelist-hidden col-3 m-r-30">“{{keyword}}”</text>
					<view class="remind-colse iconfont2 icon-fail f-36" @tap="resetSearch"></view>
				</view>
			</tui-bubble-popup>
		</view>
		<!-- 种草列表 -->
		<view v-show="tabsOn==0">
			<!-- 小商店 -->
			<wantBuy v-if="homeStyle=='minishop'" ref="wantBuy" :list="list.data" type="wantbuy"></wantBuy>
			<!-- 默认模板 -->
			<view class="wrap30" v-else>
				<want-to-buy ref="wantToBuy" :list="list.data" type="wantbuy"></want-to-buy>
			</view>
		</view>
		<!-- 营销列表 -->
		<view v-show="tabsOn==1" class="bgf wrap30">
			<!-- 小商店 -->
			<!-- <marketing2 v-if="homeStyle=='minishop'" ref="marketing2" :list="list1.data" type="marketing"></marketing2> -->
			<!-- 默认模板 -->
			<!-- <marketing v-else ref="marketing" :list="list1.data" type="marketing"></marketing> -->
		</view>
		
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="(!pullUpOn && list.data!='' && tabsOn==0) || (page==list.last_page && tabsOn==0 && list.data!='')||(!pullUpOn && list1.data!='' && tabsOn==1) || (page==list1.last_page && tabsOn==1 && list1.data!='')" backgroundColor="#f8f8f8"></tui-nomore>
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="(list.data=='' && tabsOn==0) || (list1.data=='' && tabsOn==1)">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!--加载loadding-->
		
		<!-- 自定义tabbar -->
		<foot-tabBar ref="footTabBar" dIndex='1' :homeStyle="homeStyle"></foot-tabBar>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import headerTop from '../_header/index';
	import footTabBar from '@/components/foot-tabBar';
	import wantToBuy from '@/components/waterfall/want-to-buy/index';
	// import marketing from '@/components/waterfall/marketing/index';
	import wantBuy from '@/components/waterfall/small_store/wantBuy/index';
	// import marketing2 from '@/components/waterfall/small_store/marketing/index';
	import {mapState,mapMutations} from 'vuex';
	
	export default {
		components: {
			headerTop,
			footTabBar,
			wantToBuy,
			// marketing,
			// marketing2,
			wantBuy,
		},
		props:{
			isCheckGoods: false,//商家信息
			homeStyle: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				// tab
				tabs: [{id:0,text:'种草'},{id:1,text:'社区'},],
				tabsOn: 0,//默认第一个tab
				keyword: '',//默认''
				page: 1,
				list: '',
				list1: '',
				loadding: false,
				pullUpOn: true,
				// homeStyle: '',
			}
		},
		computed:{
			showRemind(){
				if(this.keyword!=''){
					return true
				}else{
					return false
				}
			},
			//对全局变量进行监控
			...mapState(['optimizateSearch'])
		},
		methods: {
			//对全局方法进行监控
			...mapMutations(['changeData']),
			_onLoad(options) {
				let that = this;
				
				that.tabsOn = options.tabsOn? options.tabsOn:that.tabsOn;
				that.keyword = options.search? options.search : that.keyword;
			},
			_show() {
				this.keyword = this.optimizateSearch||''
				let that = this;
				// that.homeStyle = app.homeStyle?app.homeStyle:'div';
				that.page = 1;
				that.loadding= false;
				that.pullUpOn= true;
				that.getWantList(that.tabsOn);
			},
			//页面相关事件处理函数--监听用户下拉动作
			_onPullDownRefresh () {
				let that = this;
				//延时为了看效果
				setTimeout(() => {
					that.page = 1;
					that.getWantList(that.tabsOn);
					that.pullUpOn = true;
					that.loadding = false;
					uni.stopPullDownRefresh();
					that.$api.msg("刷新成功")
				}, 200)
			},
			// 上拉加载下一页
			_onReachBottom () {
				let that = this;
				let last_page = that.tabsOn==0? that.list.last_page: that.list1.last_page;
				if (!that.pullUpOn) return;
				that.loadding = true;
				if (that.page >= last_page) {
					that.loadding = false;
					that.pullUpOn = false
				} else {
					that.page = ++that.page;
					that.loadding = true;
					that.getWantList(that.tabsOn);
				}
			},
			// 获取列表
			getWantList (tabsOn){
				let that = this;
				var obj = {
						keyword: that.keyword,
						page: that.page,
						}, 
						url = (tabsOn==0)? 'content.article.goods/lists': 'content.article.market/lists';
				app._get(url,obj,res => {
					that.loadding = false
					let _list = tabsOn==0 ? that.list : that.list1;
					let data = res.data;
					data.data = data.data.filter(val => {
						return val.article_status==1
					});
					data.data.forEach(item => {
						if(item.show_views>10000){
							item.show_views = (item.show_views-item.show_views%1000)/10000+'W';
						}
					})
					if(that.page==1){
						_list = data;
					}else{
						let new_list = Object.assign({},_list,data);
						new_list.data = _list.data.concat(data.data);
						_list = new_list;
						// _list.data = _list.data.concat(data.data);
					}
					if(tabsOn==0)	{
						that.list = _list;
					}else{
						that.list1 = _list;
					}
				});
			},
			// 切换tab
			switchTab(id){
				let that = this;
				that.tabsOn = id;
				let list = that.tabsOn==0? that.list: that.tabsOn==1? that.list1 : '';
				// if(that.list==''||that.list1==''||that.list.data==''||that.list1.data==''){
				if(list==''||list.data==''){
					// that.keyword= '';
					// that.changeData({k:'optimizateSearch',v:''})
					that.page = 1;
					that.getWantList(that.tabsOn);
					that.pullUpOn = true;
					that.loadding = false;
				}else{
					that.pullUpOn = true;
					that.loadding = false;
					that.page = list.current_page || 1;
				}
			},
			resetSearch(){
				this.keyword= '';
				this.changeData({k:'optimizateSearch',v:''})
				this.page = 1;
				this.getWantList(this.tabsOn);
				this.pullUpOn = true;
				this.loadding = false;
			},
			// 切换tab
			typeTab(id){
				this.typeOn = id;
				this.$emit('typeTab',this.typeOn)
			},
			typeTab2(){
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/shopDetail/index?wxapp_id='+app.wxapp_id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "index.scss";
</style>
