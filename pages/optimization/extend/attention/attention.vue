<template>
	<view class="bgf8 min_h_100">
		
		<!-- 自定义标题栏 -->
		<navigationBar title="关注中心" extClass="nav" id="top"></navigationBar>
		<!-- tab -->
		<view class="attention-tab-wrap">
			<view class="attention-tab dis-flex flex-y-center wrap30">
				<view class="flex-box dis-flex flex-y-center">
					<view class="attention-tab-item" :class="tabsOn==v.id?'on':''" v-for="v in tabs" :key="v.id" @tap="switchTab(v.id)">{{v.text}}</view>
				</view>
				<view class="guanli col-3" @tap="toNext">{{ifManage?'完成':'管理'}}</view>
			</view>
		</view>
		<view class="main">
			
			<!-- 商品列表 -->
			<view v-show="tabsOn==0" class="wrap30">
				<product-water ref="waterfall" :list="list.data" :ifManage="ifManage" @delete="delData"></product-water>
			</view>
			
			<!-- 种草列表 -->
			<view v-show="tabsOn==1||tabsOn==2" :class="homeStyle!='minishop'?'border-top':''">
				<template v-if="homeStyle=='div'">
					<want-to-buy :list="tabsOn==1?list1.data:list2.data" :ifManage="ifManage" :type="tabsOn==1?'wantbuy':'marketing'" @delete="delData"></want-to-buy>
				</template>
				<template v-if="homeStyle=='minishop'">
					<wantBuy :list="tabsOn==1?list1.data:list2.data" :ifManage="ifManage" :type="tabsOn==1?'wantbuy':'marketing'" @delete="delData"></wantBuy>
				</template>
				<template v-if="homeStyle=='saler'">
					<wantBuy3 :list="tabsOn==1?list1.data:list2.data" :ifManage="ifManage" :type="tabsOn==1?'wantbuy':'marketing'" @delete="delData"></wantBuy3>
				</template>
				<template v-if="homeStyle=='sportshop'">
					<wantBuy4 :list="tabsOn==1?list1.data:list2.data" :ifManage="ifManage" :type="tabsOn==1?'wantbuy':'marketing'" @delete="delData"></wantBuy4>
				</template>
			</view>
			
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn&&list.data!=''&&tabsOn==0) || (page==list.last_page&&tabsOn==0&&list.data!='')||(!pullUpOn&& list1.data!=''&& tabsOn==1) || (page==list1.last_page&& tabsOn==1&&list1.data!='')||(!pullUpOn&&list2.data!=''&&tabsOn==2) || (page==list2.last_page&& tabsOn==2&&list2.data!='')" backgroundColor="#f8f8f8">
			</tui-nomore>
			<!-- 无数据 -->
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="(list.data=='' && tabsOn==0) ||(list1.data=='' && tabsOn==1) ||(list2.data=='' && tabsOn==2)">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
			
		</view>
		<!--加载loadding-->
		
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	import productWater from '@/components/waterfall/product-water.vue';
	import wantToBuy from '@/components/waterfall/want-to-buy/index';
	import wantBuy from '@/components/waterfall/wantBuy/index';
	import wantBuy3 from '@/components/waterfall/wantBuy/indexSaler';
	import wantBuy4 from '@/components/waterfall/wantBuy/indexSport';
	
	const app = getApp().globalData;
	export default {
		components: {
			productWater,
			wantToBuy,
			wantBuy,
			wantBuy3,
			wantBuy4,
		},
		data() {
			return {
				title: '',
				typeOn: 1,
				ifManage:false,//默认不显示多选框
				tabs:[{id:0,text:'商品'},{id:1,text:'种草'},{id:2,text:'社区'},],//tab
				tabsOn: 0,//默认第一个tab
				page: 1,
				keyword:'',//关键字
				
				list: '',//列表
				list1: '',//列表
				list2: '',//列表
				loadding: false,
				pullUpOn: true,
				checkList: [],//选中列表
				homeStyle: '',
			}
		},
		// 局部更新
		onShow() {
			this.homeStyle = app.homeStyle?app.homeStyle:'div';
			this.page = 1;
			this.pullUpOn = true;
			this.loadding = false;
			this.$nextTick(() =>{
			this.getWantList(this.tabsOn);
			})
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			//延时为了看效果
			setTimeout(() => {
				this.list = [];
				this.list1 = [];
				this.list2 = [];
				this.page = 1;
				this.getWantList(this.tabsOn);
				this.pullUpOn = true;
				this.loadding = false;
				uni.stopPullDownRefresh();
				this.$api.msg("刷新成功")
			}, 200)
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			let last_page = that.tabsOn==0? that.list.last_page: that.tabsOn==1? that.list1.last_page : that.list2.last_page;
			
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getWantList(this.tabsOn);
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
						url = tabsOn==0? 'wxapp.goods/collections':tabsOn==1?'content.article.goods/collections':tabsOn==2? 'content.article.market/collections':'';
				app._get(url,obj,res => {
					that.loadding = false;
					let _list = that.tabsOn==0? that.list: that.tabsOn==1? that.list1 : that.list2,
							data = tabsOn==0? res.data.wxappGoods: res.data;
					if(data!=''&&data.data!=''){
						data.data.forEach(item => {
							if(item.show_views>10000){
								item.show_views = (item.show_views-item.show_views%1000)/10000+'W';
							}
						})
					}
					if(that.page == 1){
						_list = data;
					}else{
						let new_list = Object.assign({},_list,data);
						new_list.data = _list.data.concat(data.data);
						_list = new_list;
						// _list.data = _list.data.concat(data.data);
					}
					if(tabsOn == 0)	{
						that.list = _list;
					}else if(tabsOn == 1){
						that.list1 = _list;
					}else{
						that.list2 = _list;
					}
					
				});
				
			},
			// 批量删除取消收藏
			delData(ids,type){
				if(ids){
					let object_id = ids.toString();
					app._post_form('user.collection/del',{type: type,object_id: object_id}, res => {
						if(res.code==1){
							this.ifManage = !this.ifManage;
							this.$api.msg(res.msg);
							setTimeout(()=> {
								this.page = 1;
								this.getWantList(this.tabsOn);
								this.pullUpOn = true;
								this.loadding = false;
							},500)
						}else{
							this.$api.msg(res.msg);
						}
					});
				}else{
					this.$api.msg('你还没有选择哦');
				}
			},
			// 切换tab
			switchTab(id){
				let that = this;
				that.tabsOn = id;
				that.ifManage = false;
				let list = that.tabsOn==0? that.list: that.tabsOn==1? that.list1 : that.list2;
				if(list==''){
					that.page = 1;
					that.getWantList(that.tabsOn);
					that.pullUpOn = true;
					that.loadding = false;
				}else{
					that.pullUpOn = true;
					that.page = list.current_page || 1;
				}
			},
			// 更新页面
			listChange(res){
				if(res){
					this.tabsOn = id;
					this.keyword= '';
					this.page = 1;
					this.getWantList(this.tabsOn);
					this.pullUpOn = true;
					this.loadding = false;
				}
			},
			// 点击管理
			toNext() {
				this.ifManage = !this.ifManage;
			},
		}
	}
</script>

<style lang="scss">
	@import "attention.scss";
</style>
