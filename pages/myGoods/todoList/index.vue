<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="待办事项" extClass="nav" id="top"></navigationBar>
		<view class="tab-wrap">
			<tui-tabs :tabs="tabItem" :currentTab="tabOn" @change="switchTab" itemWidth="50%" color="#999" selectedColor="#E82E2E" :height="80" :sliderWidth="80" :size="30" :padding="0" :sliderHeight="4" sliderBgColor="#E82E2E" :isFixed="true"></tui-tabs>
		</view>
		<view class="main">
			<!-- list -->
			<view class="list-wrap" v-show="list.data!=''">
				<block v-for="(item, index) in list.data" :key="index">
				<view class="list-item bgf" :class="[tabOn==0?'list-item0':tabOn==1?'list-item1':'',item.isOver?'list-item2':'']" @tap.stop="toDtail(item)">
					<view class="list-top dis-flex flex-y-center flex-x-between">
						<view class="title-wrap onelist-hidden f-26 col-3">
							<view class="user-avatar" v-if="item.avatarUrl"><image :src="item.avatarUrl" mode="aspectFill"></image></view>
							<text>{{item.backlog_title}}</text>
						</view>
						<view class="done-btn" @tap.stop="toDone(item,index)"><text class="iconfont2 icon-duihao f-24"></text></view>
					</view>
					<view class="middle f-24" v-if="item.backlog_content">
						<text class="col-6">{{item.show?item.backlog_content:item.backlog_content.substring(0,46)}} <block v-if="item.backlog_content.length>46 && !item.show">...</block></text>
						<text class="more fr" v-if="item.backlog_content.length>46" @tap.stop="showMore(index)">{{item.show?'收起':'更多'}}</text>
					</view>
					<view class="list-bottom dis-flex flex-y-center flex-x-between">
						<!-- 倒计时 -->
						<view class="count-down dis-flex flex-y-center">
						  <view class="clock-text f-24 m-r-20">
						    <text v-if="tabOn==0">{{item.isOver?'已超时':'距结束'}}</text>
						    <text v-else>已结束</text>
						  </view>
							<template v-if="tabOn==0 && item.status==0 && !item.isOver">
								<tui-countdown :time="item.time" color="#333" borderColor="#D0D0D0" :size="22" colonColor="#333" :colonSize="24" :scale="true" @end="endOfTime"></tui-countdown>
							</template>
						</view>
						<!-- btn -->
						<view class="operation dis-flex flex-y-center f-24 col-8">
							<view @tap.stop="topping(item, index)">置顶<text class="iconfont2 icon-edit1 f-24"></text></view>
							<view @tap.stop="toDelete(item, index)">删除<text class="iconfont2 icon-shanchu f-24"></text></view>
						</view>
					</view>
				</view>
				</block>
			</view>
			
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || (page==list.last_page && list.data!='')" backgroundColor="#f5f5f5"></tui-nomore>
			<tui-no-data v-if="list.data==''" imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
			<!--加载loadding-->
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toAdd"><text class="iconfont2 icon-jiahao f-36"></text>添加待办</view>
			</view>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	import popupTips from '@/components/popup-tips/index';
	const app = getApp().globalData;
	export default {
		components: {
			popupTips
		},
		data() {
			return {
				index: 1,//提示框
				tabItem:[{name: '待办'},{name: '已完成'}],
				tabOn: 0,
				list:{},
				page: 1,
				loadding: false,
				pullUpOn: true,
				mtitle: '',//model标题
				mcontent: '',//model内容
			}
		},
		onShow() {
			this.list = {}
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
			this.getList();
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
			//获取列表
			getList(){
				// let that = this;
				let url = this.tabOn==0? 'backlog/getBacklogList':'backlog/getCompleteList';
				app._get(url, {page: this.page}, res => {
					this.loadding = false;
					let _list = this.list;
					let data = res.data.list;
					if(this.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					this.$nextTick(() => {
						this.list = this.countDown(_list);
					});
				});
			},
			//确认完成
			toDone(item,index){
				let that = this;
				
				if(item.status == 0){
					uni.showModal({
						title: '确定所选待办已完成？',
						confirmColor: '#E82E2E',
						success: (res) => {
							if(res.confirm){
								app._post_form('backlog/complete',{backlog_id: item.backlog_id}, res => {
									that.$api.msg(res.msg);
									if(res.code==1){
										that.list.data.splice(index,1);
									}
								});
							}
						}
					});
				}else{
					uni.showModal({
						title: '确定所选待办重置？',
						confirmColor: '#E82E2E',
						success: (res) => {
							if(res.confirm){
								app._post_form('backlog/uncomplete',{backlog_id: item.backlog_id}, res => {
									that.$api.msg(res.msg);
									if(res.code==1){
										that.list.data.splice(index,1);
									}
								});
							}
						}
					});
				}
			},
			// 置顶
			topping(item,index){
				let that = this;
				app._post_form('backlog/topBacklog', {backlog_id: item.backlog_id}, res => {
					that.$api.msg(res.msg);
					if(res.code==1){
						that.list.data.splice(index,1);
						that.list.data.unshift(item);
					}
				});
			},
			// 删除
			toDelete(item,index){
				let that = this;
				if(item.parent_id==0){
					uni.showModal({
						title: '友情提示',
						content: '确认删除该待办？',
						confirmColor: '#E82E2E',
						success: (res) => {
							if(res.confirm){
								app._post_form('backlog/delete', {backlog_id: item.backlog_id}, res => {
									that.$api.msg(res.msg);
									if(res.code==1){
										that.list.data.splice(index,1);
									}
								});
							}
						}
					});
				}else{
					this.$api.msg('该待办无编辑权限！')
				}
			},
			//倒计时
			countDown(list){
				let data = list.data;
				let now_time = Math.round(new Date() / 1000);
				for (let key in data) {
					data[key].show = false
					
					let end_time = data[key].end_time;
							end_time = Math.round(new Date(end_time.replace(/\-/g, '/')) / 1000);
							
					//待办
					if(data[key].status==0){
						//未超时间
						if(now_time < end_time){
							data[key].time = end_time - now_time;
							data[key].isOver = 0;
						}else{
							data[key].isOver = 1;
						}
					}else{
						
					}
				}
				return list
			},
			//去编辑
			toDtail(item){
				if(this.tabOn==0){
					if(item.parent_id==0){
						uni.navigateTo({
							url: 'add/index?type=1&backlog_id=' + item.backlog_id
						});
					}else{
						this.$api.msg('该待办无编辑权限！')
					}
				}
			},
			// switchTab
			switchTab(e){
				this.tabOn = e.index;
				this.page = 1;
				this.list = [];
				this.loadding= false;
				this.pullUpOn= true;
				this.getList()
			},
			//倒计时回调
			endOfTime(){
				// this.getList();
			},
			//more
			showMore(index){
				let item = this.list.data[index];
				item.show = !item.show;
				this.$set(this.list.data,index, item);
			},
			toAdd(){
				uni.navigateTo({
					url: 'add/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "index";
</style>
