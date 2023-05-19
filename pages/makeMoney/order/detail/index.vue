<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="订单详情" extClass="nav" id="top"></navigationBar>
		
		<scroll-view scroll-y class="list" v-if="list.data!=''">
			<view class="list-item bgf m-t-20 dis-flex" v-for="(item,index) in list.data" :key="index">
				<view class="list-item-index f-32 col-3 oh dis-flex flex-y-center flex-x-center">{{index+1}}</view>
				<view class="list-pic radius16">
					<image :src="item.image?item.image.file_path:default_url" mode="aspectFill"></image>
				</view>
				<view class="list-item-info flex-box oh m-l-20">
					<view class="onelist-hidden f-28 col-3">{{item.goods_name}}</view>
					<view class="onelist-hidden f-26 col-6 m-t-6" v-show="item.goods_attr">规格：{{item.goods_attr}}</view>
					<view class="list-item-bottom f-26 col-6 dis-flex flex-y-center">
						¥{{item.goods_price}} <text class="num m-l-20 m-r-20">x{{item.total_num}}</text>
						<!-- <text class="app-red">收益：¥3.00</text> -->
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
	export default {
		components: {
		},
		data() {
			return {
				default_url: '/static/images/defaultImg.png',
				order_id: '',
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
			this.order_id = options.order_id||'';
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
				let data = {
					order_id: this.order_id,
					page: this.page
				};
				app._get('share.make_money/getOrderDetail', data, res => {
					this.loadding = false;
					let _list = this.list;
					let data = res.data;
					if(this.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					this.list = _list;
				});
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
