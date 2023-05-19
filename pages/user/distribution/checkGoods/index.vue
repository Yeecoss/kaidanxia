<template>
	<view class="wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar title="选择商品" extClass="nav" id="top"></navigationBar>
		<!-- 搜索框 -->
		<view>
			<search :value="searchValue" @search="search" placeholder="商品名称/货号/条形码"></search>
		</view>
		<view v-if="hostoryList.length > 0">
			<view class="hostory dis-flex flex-y-center flex-x-between">
				<span>历史搜索</span>
				<span class="iconfont2 icon-shanchu" @tap.stop="clearHostory"></span>
			</view>
			<view class="hostoryBox">
				<view class="hostoryItem" v-for="(item, index) in hostoryList" :key="index" @tap.stop="searchThis(item)">
					{{item.name}}
				</view>
			</view>
		</view>
		<div class="tabsBox dis-flex flex-y-center" v-if="searchValue == ''">
			<div class="tabItem" :class="checkTab == '' ? 'tabItemActive' : ''" @tap.stop="tabChange('')">全部</div>
			<div class="tabItem" :class="checkTab == '1' ? 'tabItemActive' : ''" @tap.stop="tabChange('1')">热销</div>
			<div class="tabItem" :class="checkTab == '2' ? 'tabItemActive' : ''" @tap.stop="tabChange('2')">推荐</div>
		</div>
		<view class="prolist-wrap dis-flex flex-wrap" v-if="list.length">
			<view class="prolist-item" v-for="(item, index) in list" :key="index" @tap.stop="itemClick(item)">
				<view class="prolist-pic">
					<image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image>
				</view>
				<view class="prolist-info f-24">
					<view class="prolist-name onelist-hidden col-3">{{item.goods.goods_name}}</view>
					<view class="prolist-stock col-6">库存：{{item.goods.stock_num}}</view>
					<view class="prolist-price col-6">¥{{item.goods.min_price}}</view>
				</view>
				<view class="prolist-add">
					<view class="prolist-label dis-flex flex-y-center">
						<radio :checked="item.checked" color="#E82E2E" />
					</view>
					<view class="prolist-addLink"></view>
				</view>
			</view>
		</view>
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="(!pullUpOn && list.length > 0) || page==last_page" backgroundColor="#fff"></tui-nomore>
		<tui-no-data v-if="list==''">
			<view>暂无数据</view>
		</tui-no-data>
		<!--加载loadding-->
		<!-- 底部 -->
		<view class="bottom-wrap">
			<view class="bottom wrap30 dis-flex flex-y-center flex-x-between">
				<div class="allCheck" :class="allCheck ? 'allCheckActive' : ''" @tap.stop="allCheckTap">
					<label class="dis-flex flex-y-center">
						<radio :checked="allCheck" color="#E82E2E" />{{allCheck ? '全不选' : '全选'}}
					</label>
				</div>
				<div class="dis-flex flex-y-center">
					<div class="checkNum">已选<text class="col-m">{{allCheck ? total : checkNum}}</text>件商品</div>
					<view class="submit dis-flex flex-y-center flex-x-center f-32" @tap="toSubmit">确定</view>
				</div>
			</view>
		</view>
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	export default {
		components: {
			search,
		},
		data() {
			return {
				allCheck: false,
				checkTab: '',
				hostoryList: [],
				searchValue: '',
				fieldName: '',
				source:'',
				list: [],
				page: 1,
				last_page: 1,
				total: 0,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
			this.searchValue = options.search || '';
			this.fieldName = options.fieldName;
			this.source = options.source || ''
			let searchHostoryList = uni.getStorageSync('searchHostoryList') || '[]'
			this.hostoryList = JSON.parse(searchHostoryList)
			this.getList();
		},
		computed: {
			checkNum() {
				let num = 0
				this.list.forEach(item => {
					if (item.checked) {
						num ++
					}
				})
				return num
			}
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
			if (that.page >= that.last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			allCheckTap() {
				this.allCheck = !this.allCheck
				this.list.forEach(item => {
					item.checked = this.allCheck
				})
			},
			tabChange(type) {
				this.checkTab = type
				this.getList()
			},
			searchThis(item) {
				this.searchValue = item.name
				this.getList()
			},
			clearHostory() {
				this.hostoryList = []
				uni.removeStorageSync('searchHostoryList')
			},
			itemClick(item) {
				item.checked = !item.checked
				this.allCheck = false
			},
			// 选择提交
			toSubmit(){
				let str = ''
				if (this.allCheck) {
					str = -1
				} else {
					let checkList = []
					this.list.forEach(item => {
						if (item.checked) {
							checkList.push(item.wxapp_goods_id)
						}
					})
					str = checkList.join(',')
				}
				let obj = {
					wxapp_good_ids: str
				}
				uni.showLoading()
				app._post_form('shop.goods/batchOpenDealer', obj, (result) => {
				app.showSuccess(result.msg, function () {
					wx.navigateBack();
				});
				}, false,  () => {
				uni.hideLoading()
				})
			},
			checkItem(item) {
				this.checkList.push(item.wxapp_goods_id)
			},
				// 获取列表
			getList (){
				let data = {
					page: this.page
				}
				if (this.searchValue == '') {
					if (this.checkTab == '1') {
						data.sortType = 'hot'
						data.is_hot = '1'
					} else if (this.checkTab == '2') {
						data.sortType = 'recommend'
						data.shop_rmd = '1'
					}
				} else {
					data.search = this.searchValue
				}
				let url = 'shop.goods/searchDealerGoods';
				app._get(url, data, res => {
					this.loadding = false;
					let list = this.list;
					let data = res.data.list.data;
					data.forEach(element => {
						element.checked = this.allCheck
					});
					this.last_page = res.data.list.last_page
					this.total = res.data.list.total
					if(this.page==1){
						list = res.data.list.data;
					}else{
						list = list.concat(data);
					}
					this.list = list;
				});
			},
			// 搜索
			search (val){
				this.searchValue = val
				if (val != '') {
					let newlist = JSON.parse(JSON.stringify(this.hostoryList))
					this.hostoryList.forEach((item, index) => {
						if (item.name == val) {
							newlist.splice(index, 1)
						}
					})
					this.hostoryList = newlist
					this.hostoryList.unshift({
						name: val
					})
					uni.setStorageSync('searchHostoryList', JSON.stringify(this.hostoryList))
				}
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index.scss';
	.navigator-hover{
		background: none;
		opacity: 1;
	}
	.prolist-wrap{padding-top: 30rpx;}
	.hostory{
		height: 92rpx;
		line-height: 92rpx;
		font-size: 28rpx;
		color: #333333;
		.iconfont2{
			font-size: 28rpx;
		}
	}
	.hostoryBox{
		.hostoryItem{
			width:160rpx;
			height:50rpx;
			background:rgba(246,246,246,1);
			border-radius:26rpx;
			text-align: center;
			color: #666666;
			font-size: 24rpx;
			display: inline-block;
			vertical-align: top;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
			line-height: 50rpx;
		}
	}
	.tabsBox{
		margin-top: 30rpx;
		font-size: 30rpx;
		color: #666666;
		.tabItem{
			width: 88rpx;
		}
		.tabItemActive{
			color: #E82E2E;
		}
	}
</style>