<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="我的店小二" extClass="nav" id="top"></navigationBar>
		<!-- top -->
		<view class="top-wrap">
			<view class="top-con bgf">
				<!-- 搜索框 -->
				<view class="wrap30 search bgf">
					<search @search="search" placeholder="搜索"></search>
				</view>
				<!-- tab -->
				<view class="top-tab">
					<screen-top ref="screenTop" @compelete="screenCompelete"></screen-top>
				</view>
			</view>
		</view>
		<!-- list -->
		<scroll-view scroll-y class="list-wrap p-t-20" v-if="list.data!=''">
			<view class="list-item m-b-20 bgf" v-for="(item,index) in list.data" :key="index" @tap="toDetail(item)">
				<view class="list-item-pic oh dis-flex flex-y-center">
					<view class="user_img"><image lazy-load :src="item.avatarUrl?item.avatarUrl:default_url" mode="aspectFill"></image></view>
					<!-- <view class="list-item-status t-c f-24">待确认</view> -->
					<view class="list-item-info oh m-l-20 flex-box">
						<view class="user-name-wrap dis-flex flex-y-center">
							<view class="f-28 onelist-hidden user-name">{{item.nickName}}</view>
							<view class="f-26 p-l-20 m-l-20 list-date">{{item.create_timeNew}}</view>
						</view>
						<view class="user-rank f-24 col-f t-c">{{item.level.text}}</view>
					</view>
					<view class="list-btn f-24 t-c" :class="!item.is_disable?'red-btn':''" @tap.stop="switchStatus(item)">{{!item.is_disable?'开启中':'关闭中'}}</view>
				</view>
				<view class="list-item-data m-t-10 dis-flex flex-y-center">
					<view class="data-item">
						<text class="f-24 col-9">成交额(元)</text><view class="f-28 col-3 m-t-10">{{item.sale_total||0}}</view>
					</view>
					<text class="col-e"></text>
					<view class="data-item t-c">
						<text class="f-24 col-9">分佣(元)</text><view class="f-28 col-3 m-t-10">{{item.profit_total||0}}</view>
					</view>
					<text class="col-e"></text>
					<view class="data-item t-c">
						<text class="f-24 col-9">订单数</text><view class="f-28 col-3 m-t-10">{{item.order_total||0}}</view>
					</view>
					<text class="col-e"></text>
					<view class="data-item t-c">
						<text class="f-24 col-9">商品数</text><view class="f-28 col-3 m-t-10">{{item.total_num||0}}</view>
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
	import screenTop from '../_templete/screen-top';
	export default {
		components: {
			search,
			screenTop
		},
		data() {
			return {
				default_url: '/static/images/default-avatar.jpg',
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
				screen: {date: 'all',level: 'all',sort: '',},
				keyword:'',
			}
		},
		onLoad(options) {
			if(options.date){
				this.$nextTick(() =>{
					this.$refs.screenTop.dropdownItem(options.date)
				})
			}else{
				this.getList()
			}
			
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
					page: that.page,
					search: that.keyword
				};
				app._get('share.share_money/getWaiterList',Object.assign({}, data, that.screen), res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data.list;
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
					// list[i].update_timeNew = list[i].update_time.slice(0,10)
					list[i].create_timeNew = list[i].create_time.slice(0,10)
				}
				return list
			},
			screenCompelete(data){
				this.screen = data;
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList()
			},
			switchStatus(item){
				app._post_form('share.share_money/changeDisable',{id: item.id}, res => {
					this.$api.msg(res.msg)
					if(res.code==1){
						this.page = 1;
						this.getList()
					}
				})
			},
			toDetail(item){
				uni.navigateTo({
					url: 'detail/index?user_id=' + item.user_id
				})
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
