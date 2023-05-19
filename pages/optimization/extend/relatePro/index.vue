<template>
	<view class="wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar title="选择商品" extClass="nav" id="top"></navigationBar>
		<!-- 搜索框 -->
		<view class="dis-flex flex-y-center flex-x-between">
			<search class="flex-box" :value="searchValue" @search="searchList" placeholder="商品名称/货号/条形码"></search>
			<view class="cate_btn f-28 col-3" @tap.stop="screen"><text class="iconfont2 icon-preparation m-r-10"></text>分类</view>
		</view>
		<!-- 历史搜索 -->
		<view class="recentSearch" v-if="recentOrder.length">
			<view class="title-box col-3 dis-flex flex-y-center flex-x-between">
				<text class="f-28">历史搜索</text>
				<view @tap="clearSearch" class="iconfont2 icon-shanchu f-24"></view>
			</view>
			<view class="sale-button-box">
				<view class="seconds-kill-li" v-for="(recent, idx) in recentOrder" :key="idx">
					<view @tap="searchList(recent)" class="recent-button col-6">{{recent}}</view>
				</view>
			</view>
		</view>
		<!-- 列表tab -->
		<!-- <view class="list-tab dis-flex flex-y-center" v-if="searchValue==''">
			<view class="list-tab-item" :class="tabOn==0?'on':''" @tap="changeTab(0)">热销</view>
			<view class="list-tab-item" :class="tabOn==1?'on':''" @tap="changeTab(1)">推荐</view>
			<view class="list-tab-item" :class="tabOn==2?'on':''" @tap="changeTab(2)">全部</view>
		</view> -->
		<!-- 列表 -->
		<checkbox-group class="prolist-wrap dis-flex flex-wrap" @change.stop="choose" v-if="list.data!=''">
			<view class="prolist-item" v-for="(item, index) in list.data" :key="index">
			<label>
				<view class="prolist-pic">
					<image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image>
				</view>
				<view class="prolist-info f-24">
					<view class="prolist-name onelist-hidden col-3">{{item.goods.goods_name}}</view>
					<view class="prolist-stock col-6">库存：{{item.goods.stock_num}}</view>
					<view class="prolist-price col-6">¥{{item.goods.min_price}}</view>
				</view>
				<view class="prolist-add check-wrap default-check"><checkbox class="checkbox" :value="item.wxapp_goods_id+''" :checked="item.checked" /></view>
			</label>
			</view>
		</checkbox-group>
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#fff"></tui-nomore>
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view>暂无数据</view>
		</tui-no-data>
		<!--加载loadding-->
		<!-- 底部 -->
		<view class="footer" v-if="list.data!=''">
			<view class="foot wrap30 dis-flex flex-y-center flex-x-between">
				<checkbox-group class="check-wrap checked-all f-28 col-3 dis-flex flex-y-center" @change="chooseAll">
					<label class="check-wrap default-check dis-flex flex-y-center">
						<checkbox :checked="isAll"/>全选
					</label>
				</checkbox-group>
				<view class="foot-btn f-28 col-f" @tap.stop="toSubmit">已选好（共{{checkList.length}}件）</view>
			</view>
		</view>
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import rightDrawer from '../rightDrawer/index';
	export default {
		components: {
			search,
			rightDrawer
		},
		data() {
			return {
				recentOrder: [],
				searchValue: '',
				// tabOn: 0,//默认显示热销商品
				category_id: '',//分类id
				page: 1,
				list: '',//商品列表
				loadding: false,
				pullUpOn: true,
				checkList: [],//选择的商品列表id
				isAll: false,
			}
		},
		onLoad() {
			this.getList()
		},
		// 获取历史搜索
		onShow: function () {
			this.getRecentSearch();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			let that = this;
			//延时为了看效果
			that.list = [];
			that.checkList = [];
			that.page = 1;
			that.getList();
			that.pullUpOn = true;
			that.loadding = false;
			uni.stopPullDownRefresh();
			that.$api.msg("刷新成功")
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
			that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			// 获取列表
			getList (){
				let that = this;
				let data = {
					page: that.page,
					category_id: that.category_id || 0,
					search: that.searchValue || ''
				}, 
					url = 'shop.wxapp.goods/index';
				app._get(url, data, res => {
					that.loadding = false;
					let _list = that.list,
							data = res.data.list.data;
					if(that.page==1){
						_list = res.data.list;
					}else{
						_list.data = _list.data.concat(data);
					}
					that.list = _list;
				});
				
			},
			// tab切换
			// changeTab(id){
			// 	let that =this;
			// 	that.page = 1;
			// 	that.loadding= false;
			// 	that.pullUpOn= true;
			// 	// that.list = [];
			// 	// that.tabOn = id;
			// 	that.checkList = [];
			// 	that.getList();
			// },
			// 搜索提交
			searchList (e) {
				this.searchValue = e;
				if (this.searchValue) {
					// 记录最近搜索
					let recentOrder = wx.getStorageSync('recentOrder') || [];
					let index = recentOrder.indexOf(this.searchValue);
					index > -1 && recentOrder.splice(index, 1);
					recentOrder.unshift(this.searchValue);
					wx.setStorageSync('recentOrder', recentOrder); 
				}
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList();
				this.getRecentSearch();
			},
			//获取历史搜索
			getRecentSearch () {
				let recentOrder = wx.getStorageSync('recentOrder');
				this.recentOrder = recentOrder;
			},
			//清空最近搜索记录
			clearSearch () {
				wx.removeStorageSync('recentOrder');
				this.getRecentSearch();
			},
			//打开筛选框
			screen() {
			  this.$refs.rightDrawer.screen(app.myShopInfo.wxapp_id)
			},
			//筛选框确定
			rightDrawerChange(obj) {
				this.page = 1;
				this.checkList = [];
				this.category_id = obj.category_id;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList();
			},
			// 提交
			toSubmit(){
				let that = this;
				that.pageBack(that.checkList);
			},
			// 选中
			choose(e) {
				let that = this;
				var items = that.list.data,
						values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.wxapp_goods_id.toString())){
						that.$set(item,'checked',true)
					}else{
						that.$set(item,'checked',false)
					}
				}
				//  是否全部勾选，判断全选与否状态
				var checkList = [];
				that.list.data.forEach(item => {
					// item.checked == true? checkList.push(item.wxapp_goods_id): '';
					item.checked == true? checkList.push(item): '';
				});
				let allChecks = checkList.length == that.list.data.length;
				that.isAll = allChecks ? true:false;
				that.checkList = checkList;
			},
			// 全选
			chooseAll(e){
				let that = this;
				if (e.detail.value.length == 0) {
						that.list.data.map(item => that.$set(item, 'checked', false))
						that.isAll= false;
				} else {
						that.list.data.map(item => that.$set(item, 'checked', true))
						that.isAll= true;
				}
				var checkList = [];
				that.list.data.forEach(item => {
					// item.checked == true? checkList.push(item.wxapp_goods_id): ''
					item.checked == true? checkList.push(item): ''
				});
				that.checkList = checkList;
			},
			//返回
			pageBack(checkList){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.proCheck){
					prevPage.$vm.proCheck(checkList)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import "@/pages/myGoods/printorder/selectProduct/search";
	.footer view{box-sizing: border-box;}
	/* footer */
	.footer,.foot{
		height: 88rpx;
		width: 100%;
	}
	.foot{
		position: fixed;
		left: 0;
		bottom: 0;
		padding-left: 80rpx;
		background:#fff;
		box-shadow:0 0 16rpx 0 rgba(222,222,222,0.5);
		z-index: 2;
	}
	.foot-btn{
		width: 280rpx;
		line-height:64rpx;
		text-align: center;
		background: $red;
		box-shadow:0 0 16rpx 2rpx rgba(222,222,222,0.5);
		border-radius: 40rpx;
		overflow: hidden;
		text{
			margin-right: 10rpx;
		}
	}
</style>
