<template>
	<view class="min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="店小二详情" extClass="nav" id="top"></navigationBar>
		
		<!-- 客户信息 -->
		<view class="h_div20"></view>
		<view class="user-wrap">
			<view class="user-info dis-flex flex-y-center">
				<view class="user-left">
					<view class="user_img"><image lazy-load :src="total.avatarUrl||default_url" mode="aspectFill"></image></view>
					<view class="lianxi" @tap.stop="toShopInformation"><text class="iconfont2 icon-WeChat col-f f-24"></text></view>
				</view>
				<view class="m-l-20">
					<view class="f-30 col-3 onelist-hidden">{{total.nickName}}</view>
					<view class="user-rank f-24 col-f t-c">{{total.level?total.level.text:''}}</view>
				</view>
			</view>
			<view class="money-data m-top30 dis-flex flex-y-center flex-x-between">
				<view class="data-item">
					<text class="f-24 col-9">成交额(元)</text><view class="f-28 col-3 m-t-10">{{total.sale_total||0}}</view>
				</view>
				<text class="col-e"></text>
				<view class="data-item">
					<text class="f-24 col-9">分佣(元)</text><view class="f-28 col-3 m-t-10">{{total.profit_total||0}}</view>
				</view>
				<text class="col-e"></text>
				<view class="data-item">
					<text class="f-24 col-9">订单数</text><view class="f-28 col-3 m-t-10">{{total.order_total||0}}</view>
				</view>
				<text class="col-e"></text>
				<view class="data-item">
					<text class="f-24 col-9">商品数</text><view class="f-28 col-3 m-t-10">{{total.total_num||0}}</view>
				</view>
			</view>
		</view>
		<view class="h_div20"></view>
		
		<!-- 商品列表 -->
		<scroll-view scroll-y class="list-wrap wrap30" v-if="list.data!=''">
			<view class="list-item col-9 f-24 dis-flex flex-y-center flex-x-between p-r-30">
				<view class="list-txt1">序号</view>
				<view class="list-txt2">商品数/时间</view>
				<view class="list-txt3">成交额(元)</view>
				<view class="list-txt4">分佣(元)</view>
			</view>
			<view class="list-item col-3 f-24 dis-flex flex-y-center flex-x-between p-r-30" v-for="(item,index) in list.data" :key="index">
				<view class="list-txt1 t-c">{{index+1}}</view>
				<view class="list-txt2">
					<view>商品数：{{item.total_num||0}}</view>
					<view>{{item.create_timeNew}}</view>
				</view>
				<view class="list-txt3">¥{{item.total_pay_price||0}}</view>
				<view class="list-txt4">¥{{item.profit||0}}</view>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#fff"></tui-nomore>
		</scroll-view>
		<tui-no-data class="p-t-30 m-t-40" imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		
		<!-- 联系商家 -->
		<contact ref="contact"></contact>
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import contact from '@/components/myGoodsCommon/contact/index';
	export default {
		components: {
			contact
		},
		data() {
			return {
				default_url: '/static/images/default-avatar.jpg',
				user_id:'',
				total: {},
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
			this.user_id = options.user_id || '';
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
			getList(){
				let that = this;
				app._get('share.share_money/getWaiterDetail',{user_id: that.user_id,page: that.page,}, res => {
					that.loadding = false;
					that.total = res.data.total;
					let _list = that.list;
					let data = res.data.list;
					if(data.data.length>0){
						data.data = that.getNewTime(data.data);
					}
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				})
			},
			getNewTime(list){
				for (let i = 0; i < list.length; i++) {
					// list[i].update_timeNew = list[i].update_time.slice(0,10)
					list[i].create_timeNew = list[i].create_time.slice(0,10)
				}
				return list
			},
			// 店铺资料
			toShopInformation() {
				this.$refs.contact.open(this.total.concat)
			},
		}
	}
</script>

<style lang="scss">
	@import '../../myClients/detail/index';
	@import 'index';
</style>
