<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar :title="navtitle" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('title')">
						<text class="f-28" :class="formData.title? '': 'col-9'">{{formData.title ? formData.title : field.title.name}}</text>
						<text class="col-9">{{field.title.tip}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="control" @tap.stop="openItem('detail')">
						<text :class="formData.detail? '': 'col-9'">{{formData.detail ? formData.detail : field.detail.name}}</text>
					</view>
				</view>
			</view>
			
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">结束时间</view>
					<view class="control" @tap="dateChange(formData.end_time,'end_time')">
						<text :class="formData.end_time?'':'col-9'">{{formData.end_time != '' ? formData.end_time : '请选择结束时间'}}</text>
					</view>
				</view>
			</view>
			
			<!-- <view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">选择参与人</view>
					<view class="control text-right" @tap="openItem('user')">
						<template v-if="formData.user">已选<text class="red">{{formData.user.length}}</text>人</template>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
			</view> -->
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30">
					<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
				</view>
			</view>
		</view>
		<!-- 日期选择 -->
		<tui-datetime ref="dateTime" :type="1" cancelColor="#999" color="#333"
		 :setDateTime="setDateTime" @confirm="change"></tui-datetime>
		 
		<popup-input :title="title" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	import popupInput from '@/components/popup-input/index';
	const app = getApp().globalData;
	export default {
		components: {
			popupInput,
		},
		data() {
			return {
				navtitle: '添加待办',
				type: 0,//默认是新增
				index: 1,//提示框
				setDateTime:'',//初始日期
				timeCurrent:'',
				formData: {
					title: '',//名称
					detail: '',//内容
					end_time: '',//结束时间
					user: '',//选择参与人
				},
				title: '',//弹窗输入标题
				maxlength: '-1',
				inputType: '',
				// 字段
				field: {
				  title:  {
				    type: 'text',
				    name: '填写标题',
				    fieldName: 'title',
				    maxlength: '20',
						tip: '0/20'
				  },
				  detail:  {
				    type: 'largeText',
				    name: '添加内容',
				    fieldName: 'detail',
				  },
					user:  {
				    type: 'link',
				    name: '选择参与人',
				    fieldName: 'user',
						linkUrls: '/pages/myGoods/todoList/players/players',
				  },
				},
				backlog_id:'',
			}
		},
		onLoad(options) {
			let that = this;
			if(options.type){
				that.type = options.type;
				that.navtitle = options.type==1 ? '编辑待办': '添加待办';
			}
			that.backlog_id = options.backlog_id ? options.backlog_id: '';
			if(options.backlog_id){
				that.getInfo();
			}
		},
		methods: {
			// 提交
			toSubmit(){
				let that = this;
				if(that.formData.title==''){
					that.$api.msg('请填写标题！');
					return false;
				}
				if(that.formData.end_time==''){
					that.$api.msg('请填写结束时间！');
					return false;
				}
				uni.showLoading({
					title: '加载中',
					mask: false
				});
				let data = {
					backlog_title: that.formData.title,
					backlog_content: that.formData.detail,
					end_time: that.formData.end_time,
					// team: that.formData.user.toString(),//目前不需要，注：罗
				};
				if(that.type==1){data.backlog_id = that.backlog_id}
				let url = that.type==1? 'backlog/edit' : 'backlog/add';
				app._post_form(url, data, res => {
					that.$refs.toast.showTips({msg: res.msg,type: 'translucent'})
					if(res.code==1){
						setTimeout(()=>{uni.navigateBack()},1000)
					}
				},false, res =>{
					uni.hideLoading()
				});
			},
			
			//获取文章详情
			getInfo(){
				let that = this;
				app._get('backlog/detail', {backlog_id: that.backlog_id}, res => {
					that.formData = {
						title: res.data.detail.backlog_title,//名称
						detail: res.data.detail.backlog_content,//内容
						end_time: res.data.detail.end_time,//结束时间
						// user: res.data.detail.team? that.initUser(res.data.detail.team) : [],//选择参与人
					}
				});
			},
			initUser(list){
				let data = [];
				list = list.split(',');
				for (let k in list) {
					let item = parseInt(list[k]);
					data.push(item)
				}
				return data
			},
			// 输入
			openItem(fieldName) {
				let that =this;
				let field = that.field[fieldName];
				that.inputType = field.type
				that.title = field.name
				if(that.inputType=='link'){
					let user={
						detail: {
							value: JSON.stringify(that.formData.user)
						}
					};
					uni.navigateTo({
					  url: field.linkUrls + '?listData=' + encodeURIComponent(JSON.stringify(user))
					});
				}else{
					that.maxlength = field.maxlength || '-1'
					that.$refs.popupInput._open(that.formData[fieldName], (val) => {
						that.formData[fieldName] = val
					})
				}
			},
			// 选择时间
			dateChange(e,text){
				this.setDateTime = e;
				this.timeCurrent = text;
				this.$refs.dateTime.show();
			},
			change(e) {
				this.formData[this.timeCurrent] = e.result;
			},
			userChange(data){
				this.formData.user = data;
			},
		}
	}
</script>

<style lang="scss">
	@import "@/pages/myGoods/coupon/detail";
	.red{
		color: $red;
	}
</style>
