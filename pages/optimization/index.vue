<template>
	<view class="main bgf8">
		<!-- 自定义标题栏 -->
		<navigationBar :lLidth="homeStyle=='sportshop'?'width:60rpx':''">
				<view class="index-header-c flex-box dis-flex" :class="['top-'+homeStyle,homeStyle!='sportshop'?'flex-x-center':'']" slot="center">
					<view :class="tabsOn==v.id?'on':''" v-for="v in tabs" :key="v.id" @tap="switchTab(v.id)">{{v.text}}</view>
				</view>
		</navigationBar>
		<!-- 搜索框 -->
		<view class="search-wrap">
			<view class="bgf search">
				<search :value="keyword" @search="search" :radius="homeStyle=='sportshop'?'0':''" background="#F5F5F8" placeholder="搜索" placeStyle="color:#999;font-size:24rpx;">
				</search>
			</view>
		</view>
		<!-- 搜索框提醒 -->
		<!-- <view class="remind-model">
			<tui-bubble-popup direction="top" radius="38rpx" left="30rpx" right="30rpx" width="690rpx" backgroundColor="#fff" translateY="20rpx" :mask="false" :show="showRemind"
				borderWidth="20rpx" triangleLeft="42rpx" triangleTop="-40rpx">
				<view class="search-key f-24 col-9 dis-flex flex-y-center flex-x-between">
					当前搜索
					<text class="flex-box onelist-hidden col-3 m-r-30">“{{keyword}}”</text>
					<view class="remind-colse iconfont2 icon-fail f-36" @tap="resetSearch"></view>
				</view>
			</tui-bubble-popup>
		</view> -->
		<!-- 种草列表 -->
		<!-- <view :class="homeStyle!='minishop'?'border-top':''"> -->
		<view>
			<template v-if="homeStyle=='div'">
				<want-to-buy :list="tabsOn==0?list.data:list1.data" :type="tabsOn==0?'wantbuy':'marketing'"></want-to-buy>
			</template>
			<template v-if="homeStyle=='minishop'">
				<wantBuy :list="tabsOn==0?list.data:list1.data" :type="tabsOn==0?'wantbuy':'marketing'"></wantBuy>
			</template>
			<template v-if="homeStyle=='saler'">
				<wantBuy3 :list="tabsOn==0?list.data:list1.data" :type="tabsOn==0?'wantbuy':'marketing'"></wantBuy3>
			</template>
			<template v-if="homeStyle=='sportshop'">
				<wantBuy4 :list="tabsOn==0?list.data:list1.data" :type="tabsOn==0?'wantbuy':'marketing'"></wantBuy4>
			</template>
		</view>
		
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="(!pullUpOn && list.data!='' && tabsOn==0) || (page==list.last_page && tabsOn==0 && list.data!='')||(!pullUpOn && list1.data!='' && tabsOn==1) || (page==list1.last_page && tabsOn==1 && list1.data!='')" backgroundColor="#f8f8f8"></tui-nomore>
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="(list.data=='' && tabsOn==0) || (list1.data=='' && tabsOn==1)">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!--加载loadding-->
		<!-- 浮层 -->
		<template v-if="homeStyle!='minishop'">
			<!-- <guidePage title="optimization" :fixed="false" endStyle="top:1540rpx"></guidePage> -->
		</template>
		
		<!-- 自定义tabbar -->
		<!-- <foot-tabBar ref="footTabBar" dIndex='1' :homeStyle="homeStyle"></foot-tabBar> -->
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	// import footTabBar from '@/components/foot-tabBar';
	import wantToBuy from '@/components/waterfall/want-to-buy/index';
	// import guidePage from '@/components/guide-page';
	import wantBuy from '@/components/waterfall/wantBuy/index';
	import wantBuy3 from '@/components/waterfall/wantBuy/indexSaler';
	import wantBuy4 from '@/components/waterfall/wantBuy/indexSport';
	
	export default {
		components: {
			search,
			// footTabBar,
			wantToBuy,
			wantBuy,
			wantBuy3,
			wantBuy4,
			// guidePage,
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
				homeStyle: 'div',
			}
		},
		computed:{
			showRemind(){
				if(this.keyword!=''){
					return true
				}else{
					return false
				}
			}
		},
		onLoad(options) {
			let that = this;
			
			that.tabsOn = options.tabsOn? options.tabsOn:that.tabsOn;
			that.keyword = options.search? options.search : that.keyword;
		},
		onShow() {
			let that = this;
			that.homeStyle = app.homeStyle?app.homeStyle:'div';
			that.page = 1;
			that.loadding= false;
			that.pullUpOn= true;
			that.getWantList(that.tabsOn);
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
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
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
			that.loadding = true;
			let last_page = that.tabsOn==0 ? that.list.last_page : that.list1.last_page;
			if (that.page >= last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getWantList(that.tabsOn);
			}
		},
		methods: {
			// 获取列表
			getWantList (tabsOn){
				let that = this;
				var obj = {
						keyword: that.keyword,
						page: that.page,
						}, 
						url = (tabsOn==0)? 'content.article.goods/lists': 'content.article.market/lists';
				app._get(url,obj,res => {
					that.loadding = false;
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
				that.keyword= '';
				let list = that.tabsOn==0? that.list: that.tabsOn==1? that.list1 : '';
				if(list==''||list.data==''){
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
				this.page = 1;
				this.getWantList(this.tabsOn);
				this.pullUpOn = true;
				this.loadding = false;
			},
			search (e) {
				this.keyword = e;
				this.page = 1;
				this.loadding= false;
				this.pullUpOn= true;
				this.getWantList(this.tabsOn);
			},
		}
	}
</script>

<style lang="scss">
	@import "index.scss";
</style>
