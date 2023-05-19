<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="回收站" extClass="nav" id="top"></navigationBar>
		<view class="tab-wrap">
			<view class="tab f-30 dis-flex bgf">
				<view class="tabItem" :class="tabOn==i?'on':'col-9'" v-for="(v,i) in tabItem" :key="i" @tap="switchTab(i)"><text>{{v}}</text></view>
			</view>
		</view>
		<view class="main" v-if="list.data!=''">
			<view class="tip f-24">回收站内容最多保留30天</view>
			<view class="list-wrap pad_lr30 bgf dis-flex" v-for="(item,index) in list.data" :key="index">
				<view class="list-pic bgf5">
					<image v-if="tabOn==0" :src="item.goods.goods_image||''" mode="aspectFill"></image>
					<image v-if="tabOn==1" :src="item.image?item.image.file_path:''" mode="aspectFill"></image>
					<image v-if="tabOn==2" :src="item.image?item.image.file_path:''" mode="aspectFill"></image>
				</view>
				<view class="list-info flex-box">
					<view class="name twolist-hidden f-26 col-3">
						<template v-if="tabOn==0">{{item.goods.goods_name}}</template>
						<template v-if="tabOn==1">{{item.article_title}}</template>
						<template v-if="tabOn==2">{{item.article_title}}</template>
					</view>
					<view class="middle f-24 col-6">
						<template v-if="tabOn==0">
							￥{{item.goods.min_price||0}}
						</template>
						<template v-if="tabOn==1 &&item.goods_relation!=''">
							<text class="iconfont2 icon-commodity f-22"></text>
							内容含{{item.goods_relation.length}}个商品
						</template>
					</view>
					<view class="bottom dis-flex flex-x-between flex-y-end">
						<view class="col-9 f-24">{{item.create_newtime}}</view>
						<view class="btn f-24" @tap="recycle(item)">还原</view>
					</view>
				</view>
			</view>
			
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data() {
			return {
				index: 1,//提示框
				tabItem:['商品','种草','社区'],
				tabOn: 0,
				list:{},
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onShow() {
			this.page = 1;
			this.list = '';
			this.loadding= false;
			this.pullUpOn= true;
			this.getList()
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			this.page = 1;
			this.getList();
			this.pullUpOn = true;
			this.loadding = false;
			uni.stopPullDownRefresh();
			this.$api.msg("刷新成功")
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
				let url = that.tabOn==0?'shop.recyclebin.goods/getGoodsList':that.tabOn==1?'shop.recyclebin.article/index':that.tabOn==2?'shop.recyclebin.market/index':'';
				app._get(url, {page: that.page}, res => {
					that.loadding = false;
					
					let _list = that.list;
					let data = res.data.list;
					if(that.page==1){
						let list = data;
						list.data = that.initTime(data.data) || '';
						_list = list;
					}else{
						let list = that.initTime(data.data) || '';
						_list.data = _list.data.concat(list);
					}
					that.list = _list;
				});
			},
			initTime(data){
				data.forEach(item => {
					item.create_newtime = item.create_time.substring(0,11);
				});
				return data;
			},
			//还原
			recycle(item){
				let that = this;
				uni.showModal({
					title: '友情提示',
					content: '是否确定还原？',
					confirmColor: '#E82E2E',
					confirmText: '是',
					cancelText: '否',
					success: (res) => {
						if(res.confirm){
							let url = that.tabOn==0?'shop.recyclebin.goods/revertGoods':that.tabOn==1?'shop.recyclebin.article/revert':that.tabOn==2?'shop.recyclebin.market/revert':'';
							let data = {};
							if(that.tabOn==0){
								data.wxapp_goods_id = item.wxapp_goods_id;
							}else{
								data.article_id = item.article_id;
							}
							app._post_form(url, data, res => {
								that.$api.msg(res.msg);
								this.list = [];
								this.page = 1;
								this.loadding= false;
								this.pullUpOn= true;
								this.getList();
							})
						}
					}
				});
			},
			// switchTab
			switchTab(i){
				this.tabOn = i;
				this.list = [];
				this.page = 1;
				this.loadding= false;
				this.pullUpOn= true;
				this.getList();
			},
		}
	}
</script>

<style lang="scss">
	@import "index";
</style>
