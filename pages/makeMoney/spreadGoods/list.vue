<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="推广商品" extClass="nav" id="top"></navigationBar>
		<!-- top -->
		<view class="top-wrap">
			<view class="top-con bgf">
				<!-- 搜索框 -->
				<view class="wrap30 search">
					<search @search="search" placeholder="搜索"></search>
				</view>
				<!-- tab -->
				<view class="wrap30 top-tab dis-flex flex-y-center">
					<view class="top-tab-item f-28 col-3" :class="tabOn==index?'active':''" v-for="(item,index) in tabs" :key="index" @tap="switchTab(index)">
						{{item.text}}
						<template v-if="index==(tabs.length-1)">
							<text class="angle_top" :class="priceSort==1?'priceOn':''"></text>
							<text class="angle_bottom" :class="priceSort==-1?'priceOn':''"></text>
						</template>
					</view>
				</view>
			</view>
		</view>
		<!-- list -->
		<scroll-view scroll-y class="list-wrap p-t-20 p-b-20" v-if="list.data!=''">
			<view class="list-item m-b-20 bgf dis-flex" v-for="(item,index) in list.data" :key="index">
				<view class="list-item-pic oh radius16">
					<image lazy-load :src="item.goods.goods_image||defaultImg" mode="aspectFill"></image>
				</view>
				<view class="list-item-info flex-box m-l-20 oh">
					<view class="f-28 onelist-hidden list-name">{{item.goods_name}}</view>
					<view class="f-28 col-6 m-t-6">销量：{{item.goods.goods_sales||0}}</view>
					<view class="list-item-bottom m-top30 dis-flex flex-y-end flex-x-between">
						<view class="f-28 app-red">¥{{item.goods.min_price||0}}</view>
						<view @tap.stop="toShare(item)" class="list-btn f-28">
							<text class="iconfont2 icon-relay f-28 m-r-10"></text>赚 ¥{{item.gain||0}}
						</view>
					</view>
				</view>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5"></tui-nomore>
		</scroll-view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 分享同步 -->
		<share-bottom ref="shareBottom" pageType="goods"></share-bottom>
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import shareBottom from '@/components/share-bottom/index';
	export default {
		components: {
			search,
			shareBottom
		},
		data() {
			return {
				defaultImg:'/static/images/defaultImg.png',
				tabs:[{text:'全部'},{text:'销量'},{text:'收益'},],
				tabOn: 0,
				priceSort: 0,
				
				store_id:'',
				keyword: '',
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
			this.store_id = options.store_id||'';
			this.getList()
		},
		// #ifdef MP
		onShareAppMessage(res) {
			// 构建分享参数
			let user_id = uni.getStorageSync('user_id')||'';
			if(res.from=='button' && res.target.id){
				let shareObj = {      
					title: '商品详情',
					path: '/pages/goods/index?goods_id='+res.target.id+'&mbid='+user_id,
					imageUrl: res.target.dataset.shareimg
				};
				return shareObj;
			}else{
				return {
					title: '推广商品',
					path: "/pages/index/index?wid=" + this.store_id+'&mbid='+user_id,
				}
			}
		},
		// #endif
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false;
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
					search: that.keyword,
					store_wxapp_id: that.store_id
				};
				if(that.tabOn==2){
					if(that.priceSort==1){
						data.profit = 'asc';
					}else if(that.priceSort==-1){
						data.profit = 'desc';
					}
				}else if(that.tabOn==1){
					data.sales = true;
				}
				app._get('share.make_money/getGoodsList',data,res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data;
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
			//点击分享
			toShare(item) {
				// let data = {
				// 	opeText: 'weChat,',
				// 	isTwo: true,
				// 	upGoods: item,
				// 	styleList: '-1,1,4,8'
				// }
				// this.$refs.shareBottom.openShare(data);
				let data = {
					isTwo: true,
					upGoods: item
				}
				// #ifdef MP-WEIXIN
				data.opeText = 'weChat';
				// #endif
				// #ifndef MP-WEIXIN
				data.opeText = 'weChat, weChatFriends';
				// #endif
				this.$refs.shareBottom.open(data);
			},
			// 筛选
			switchTab(index){
				this.tabOn = index;
				if(index==2){
					this.priceSort = this.priceSort==1? -1 : 1;
				}else{
					this.priceSort = 0;
				}
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList()
			},
			search(val){
				this.keyword = val;
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList()
			},
		}
	}
</script>

<style lang="scss">
	@import 'list';
</style>
