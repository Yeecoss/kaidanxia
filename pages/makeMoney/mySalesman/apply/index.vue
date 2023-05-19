<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="店小二申请" extClass="nav" id="top"></navigationBar>
		<view class="main wrap30">
			<view class="listBox m-b-20 m-t-20 radius16">
				<view class="list bgf dis-flex flex-y-center flex-x-between">
					<view class="label f-30">无需审核</view>
					<view class="control dis-flex flex-x-end flex-y-center">
						<cust-switch ref="switch" :checked="auto_pass==1?true: false" @change="switchCange($event,'auto_pass')"></cust-switch>
					</view>
				</view>
				<view class="notes f-24 app-red"><text class="iconfont2 icon-jingshi f-24 m-r-10"></text>开启后所有申请用户自动通过！</view>
			</view>
			<!-- 列表 -->
			<scroll-view scroll-y class="salesman-list p-b-20">
				<view class="salesman-item bgf m-b-20 dis-flex flex-y-center flex-x-between" v-for="(item,index) in list.data" :key="index">
					<view class="salesman-pic oh"><image lazy-load :src="item.avatarUrl?item.avatarUrl:default_url" mode="aspectFill"></image></view>
					<view class="salesman-wrap flex-box m-l-20 oh">
						<view class="f-28 col-3 onelist-hidden salesman-name">{{item.nickName}}</view>
						<view class="f-26 col-6 list-date">{{item.update_time}}</view>
					</view>
					<view class="btn-wrap m-l-20 dis-flex oh t-c">
						<view class="btn" @tap.stop="checkWaiter(index,2)">拒绝</view>
						<view class="btn btn2 m-l-30" @tap.stop="checkWaiter(index,1)">同意</view>
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
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import custSwitch from '@/components/cust-switch/index.vue';
	export default {
		components: {
			custSwitch,
		},
		data() {
			return {
				auto_pass: 0,//状态
				default_url: '/static/images/default-avatar.jpg',
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad() {
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
					page: that.page,
				};
				app._get('share.share_money/getApplyList',data, res => {
					that.loadding = false;
					that.auto_pass = res.data.auto_pass;
					let _list = that.list;
					let data = res.data.list;
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
			//switch
			switchCange(e,fieldName) {
			  this[fieldName] = e? 1: 0;
				app._post_form('share.share_money/changeAutoPassed',{auto_pass: this.auto_pass}, res => {
					this.$api.msg(res.msg)
					if(res.code==1){
						this.page = 1;
						this.pullUpOn = true;
						this.loadding = false;
						this.getList()
					}
				})
			},
			//审核
			checkWaiter(index,is_pass) {
				app._post_form('share.share_money/checkWaiter',{
					id: this.list.data[index].id,
					is_pass: is_pass,
				}, res => {
					this.$api.msg(res.msg)
					if(res.code==1){
						this.page = 1;
						this.pullUpOn = true;
						this.loadding = false;
						this.getList()
						// this.list.data.splice(index,1)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
