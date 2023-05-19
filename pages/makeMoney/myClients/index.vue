<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="我的客户" extClass="nav" id="top"></navigationBar>
		<!-- top -->
		<view class="top-wrap">
			<view class="top-con bgf">
				<!-- 搜索框 -->
				<view class="wrap30 search">
					<search @search="search" placeholder="搜索"></search>
				</view>
				<!-- tab -->
				<view class="top-clientTab dis-flex flex-y-center">
					<view class="clientTab-item f-28 col-3" :class="clientOn==index?'on':''" v-for="(item,index) in clientTabs" :key="index" @tap="clientChange(index)">
						{{item.text}}
					</view>
				</view>
				<!-- tab -->
				<view class="wrap30 top-tab dis-flex flex-y-center">
					<view class="top-tab-item f-24 col-3" :class="tabOn==item.val?'on':''" v-for="(item,index) in tabs" :key="index" @tap="changeTab(item.val)">
						{{item.text}}
					</view>
					<text class="f-24 app-red">根据绑定时间</text>
				</view>
			</view>
		</view>
		<!-- list -->
		<scroll-view scroll-y class="list-wrap p-t-20" v-if="list.data!=''">
			<view class="list-item m-b-20 bgf dis-flex" v-for="(item,index) in list.data" :key="index" @tap="toDetail(item)">
				<view class="list-item-pic oh">
					<view class="user_img"><image lazy-load :src="item.avatarUrl||defaultImg" mode="aspectFill"></image></view>
				</view>
				<view class="list-item-info flex-box m-l-20 oh">
					<view class="user-name-wrap dis-flex flex-y-center">
						<view class="f-28 onelist-hidden user-name">{{item.nickName}}</view>
						<view class="f-26 p-l-20 m-l-20 list-date">{{item.create_timeNew}}</view>
					</view>
					<view class="list-item-data m-t-10 dis-flex flex-y-center">
						<view class="data-item">
							<text class="f-24 col-9">成交额(元)</text><view class="f-28 col-3 m-t-10">{{item.total_sale||0}}</view>
						</view>
						<text class="col-e"></text>
						<view class="data-item t-c">
							<text class="f-24 col-9">收益(元)</text><view class="f-28 col-3 m-t-10">{{item.total_profit||0}}</view>
						</view>
						<text class="col-e"></text>
						<view class="data-item t-c">
							<text class="f-24 col-9">订单数</text><view class="f-28 col-3 m-t-10">{{item.total_order||0}}</view>
						</view>
						<text class="col-e"></text>
						<view class="data-item t-c">
							<text class="f-24 col-9">商品数</text><view class="f-28 col-3 m-t-10">{{item.goods_num||0}}</view>
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
		<tui-tips position="center" ref="toast"></tui-tips>
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
				defaultImg:'/static/images/defaultImg.png',
				clientTabs:[{text:'全部客户',val:'all'},{text:'成交客户',val:1},{text:'潜在客户',val:0}],
				clientOn: 0,
				tabs:[{text:'全部',val:'all'},{text:'今日',val:'0'},{text:'昨日',val:'-1'},{text:'近七日',val:'-7'}],
				tabOn: 'all',
				keyword:'',
				store_id:'',
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
			this.tabOn = options.date||'all';
			this.store_id = options.store_id||'';
			this.getList()
		},
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
					store_wxapp_id: that.store_id,
					type: that.clientTabs[that.clientOn].val,
					duration: that.tabOn,
					search: that.keyword,
					page: that.page,
				};
				app._get('share.make_money/getClientList',data, res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data;
					if(data.data.length>0){
						data.data = this.getNewTime(data.data);
					}
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
			getNewTime(list){
				for (let i = 0; i < list.length; i++) {
					list[i].create_timeNew = list[i].create_time.slice(0,10)
				}
				return list
			},
			search(val){
				this.keyword = val;
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList()
			},
			changeTab(val){
				this.tabOn = val;
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList()
			},
			clientChange(index){
				this.clientOn = index
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList()
			},
			toDetail(item){
				uni.navigateTo({
					url: 'detail/index?user_id=' + item.user_id+'&store_id=' + this.store_id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '../order/list/index';
	@import 'index';
</style>
