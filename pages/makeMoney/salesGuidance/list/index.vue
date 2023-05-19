<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="销售指导" extClass="nav" id="top"></navigationBar>
		
		<scroll-view scroll-y class="list-wrap p-t-20" v-if="list.data!=''">
			<view class="list-item m-b-20 bgf dis-flex" v-for="(item,index) in list.data" :key="index" @tap="toDetail(item.article_id)">
				<view class="list-item-info flex-box m-r-20 oh dis-flex flex-dir-column flex-x-between">
					<view class="f-28 twolist-hidden list-name">{{item.article_title}}</view>
					<view class="f-26 col-9">{{item.create_timeNew}}</view>
				</view>
				<view class="list-item-pic oh">
					<image lazy-load :src="item.image.file_path" mode="aspectFill"></image>
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
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				defaultImg:'/static/images/defaultImg.png',
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
				app._get('share.make_money/getGuideList',data, res => {
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
			toDetail(article_id){
				uni.navigateTo({
					url: '../detail/index?id='+article_id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
