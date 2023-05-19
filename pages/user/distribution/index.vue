<template>
	<view class="bgf7">
		<!-- 自定义标题栏 -->
		<navigationBar title="渠道中心" isHelpme extClass="nav" id="top"></navigationBar>
		<div class="tabsBox dis-flex flex-y-center flex-x-between">
			<div @tap.stop="toOther('goods')">
				<div class="imgBox" :class="vip == '4' ? 'imgBox1' : 'imgBoxNone'">
					<text class="iconfont2 icon-commodity3"></text>
				</div>
				<div class="itemTitle">
					渠道商品
				</div>
			</div>
			<div @tap.stop="toOther('apply')">
				<div class="imgBox imgBox2">
					<text class="iconfont2 icon-apply"></text>
					<text v-if="is_notice" class="redDot"></text>
				</div>
				<div class="itemTitle">
					渠道申请
				</div>
			</div>
			<div @tap.stop="toOther('share')">
				<div class="imgBox" :class="vip == '4' ? 'imgBox3' : 'imgBoxNone'">
					<text class="iconfont2 icon-extension"></text>
				</div>
				<div class="itemTitle">
					渠道推广
				</div>
			</div>
		</div>
		<view class="searchBox">
			<view class="dis-flex flex-y-center flex-x-between" style="height: 100%;">
				<view class="inputBox dis-flex flex-y-center">
					<text class="iconfont2 icon-searchfor col-9 f-26" style="margin-right: 24rpx;"></text>
					<input type="text" @blur="search" placeholder="搜索名称" placeholderStyle="color:#aba9a9;font-size:24rpx;" v-model="nickName" />
				</view>
				<view class="f-30" @tap="showSelectBox">
					筛选
					<text class="iconfont2 icon-screen f-30" style="margin-left: 10rpx;"></text>
				</view>
			</view>
		</view>
		<view class="selectBox" :style="'top: ' + tapTop  + 'px;'" v-show="showSelect" @tap="closeSelectBox">
			<view class="select" @tap.stop>
				<view class="selectListBox">
					<view class="selectListItem dis-flex flex-y-center flex-x-between">
						<view class="lable">
							状态
						</view>
						<view class="selectItem" :class="is_use === '0' ? 'active' : ''" @tap="checkItem('is_use', '0')">
							禁用中
						</view>
						<view class="selectItem" :class="is_use === '1' ? 'active' : ''" @tap="checkItem('is_use', '1')">
							启用中
						</view>
					</view>
					<view class="selectListItem dis-flex flex-y-center flex-x-between">
						<view class="lable">
							结算方式
						</view>
						<view class="selectItem" :class="dealer_type === '0' ? 'active' : ''" @tap="checkItem('dealer_type', '0')">
							折扣
						</view>
						<view class="selectItem" :class="dealer_type === '1' ? 'active' : ''" @tap="checkItem('dealer_type', '1')">
							渠道价
						</view>
					</view>
					<view class="selectListItem dis-flex flex-y-center flex-x-between">
						<view class="lable">
							收益
						</view>
						<view class="selectItem" :class="total_profit === 'up' ? 'active' : ''" @tap="checkItem('total_profit', 'up')">
							升序
						</view>
						<view class="selectItem" :class="total_profit === 'down' ? 'active' : ''" @tap="checkItem('total_profit', 'down')">
							降序
						</view>
					</view>
					<view class="selectListItem dis-flex flex-y-center flex-x-between">
						<view class="lable">
							订单数
						</view>
						<view class="selectItem" :class="order_num === 'up' ? 'active' : ''" @tap="checkItem('order_num', 'up')">
							升序
						</view>
						<view class="selectItem" :class="order_num === 'down' ? 'active' : ''" @tap="checkItem('order_num', 'down')">
							降序
						</view>
					</view>
					<view class="selectListItem dis-flex flex-y-center flex-x-between">
						<view class="lable">
							时间
						</view>
						<view class="selectItem" :class="create_time === 'up' ? 'active' : ''" @tap="checkItem('create_time', 'up')">
							升序
						</view>
						<view class="selectItem" :class="create_time === 'down' ? 'active' : ''" @tap="checkItem('create_time', 'down')">
							降序
						</view>
					</view>
				</view>
				<view class="selectBottom dis-flex flex-y-center flex-x-center">
					<view class="selectBut selectBut1" @tap="clearSelectBox">
						重置
					</view>
					<view class="selectBut selectBut2" @tap="submit">
						确定
					</view>
				</view>
			</view>
		</view>
		<scroll-view v-if="list.length > 0" :refresher-threshold="20" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
			<view class="list dis-flex flex-y-center" v-for="(item,index) in list" :key="index" @tap.stop="toDetail(item)">
				<div class="user_imgBox">
					<view class="user_img">
						<image class="imageDefault" v-if="item.avatarUrl" lazy-load :src="item.avatarUrl" mode="aspectFill"></image>
						<image class="imageDefault" v-else lazy-load src="../../../static/images/default-avatar.jpg" mode="aspectFill"></image>
						<view :class="'user_sex iconfont2 f-20 '+[item.gender=='女'?'icon-girl':'icon-boy']"></view>
					</view>
				</div>
				<view class="user_info">
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="user_name onelist-hidden f-28 col-3">{{item.nickName}}</view>
						<view :class="'block-btn ' +[item.is_use?'is_use':'']" @tap.stop="toBlock(item)">{{item.is_use?'禁用':'启用'}}</view>
					</view>
					<view class="user_spend m-top20 f-24 col-6">
						<text class="jifen b-r">
							状态：
							<text v-if="item.is_use" :style="{color: '#F8B14A'}">启用中</text>
							<text v-else :style="{color: '#E82E2E'}">禁用中</text>
						</text>
						<text class="jifen">{{item.createTime}}</text>
					</view>
					<view class="user_spend m-top20 f-24 col-6">
						<text class="jifen b-r">订单数:{{item.order_num}}</text>
						<text class="jifen b-r">总收益:{{item.total_profit}}</text>
						<text @tap.stop="openNum(item)">
							结算方式:
							
							<text class="num1" v-if="item.dealer_type && item.dealer_type == 1">
								渠道价
							</text>
							<text class="num" v-else-if="item.dealer_type === 0">
								{{item.dealer_discount}}折
							</text>
							<text class="num2" v-else>
								未设置
							</text>
						</text>
					</view>
				</view>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="!pullUpOn && list!=''" backgroundColor="transparent" text="开单虾技术支持～"></tui-nomore>
		</scroll-view>
		<view class="nodata" v-if="list==''">
			<!-- 无数据 -->
			<tui-no-data :imgUrl="vip<4?'https://pic.kaidanxia.com/2020-08-17/2020081716461121da54339.png':'http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png'" :imgWidth="264" :imgHeight="264" :btnText="vip<4?'去购买':''" @click="toMember">
				<view class="col-9" v-if="vip<4">您还没有成为渠道商，需购买龙虾会员~</view>
				<view class="col-9" v-else>暂无数据</view>
			</tui-no-data>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		<popup-input ref="popupInput"></popup-input>
		<guidePage ref="guidePage"></guidePage>
		<buyMember ref="buyMember" :title="'您还没有权限需购买' + member + '！'"></buyMember>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	import guidePage from '@/components/guide-page';
	import buyMember from '@/components/myGoodsCommon/buyMember';
	export default {
		components: {
			popupInput,
			guidePage,
			buyMember
		},
		data() {
			return {
				form: {
					is_use: '',
					dealer_type: '',
					total_profit: '',
					order_num: '',
					create_time: '',
				},
				is_use: '',
				dealer_type: '',
				total_profit: '',
				order_num: '',
				create_time: '',
				
				showSelect: false,
				index: 1,//提示框
				vip: 0,
				page: 1,
				is_notice: '',
				nickName: '',
				list: [],//列表
				loadding: false,
				pullUpOn: true,
				scrollHeight: 0,
				tapTop: 0,
				member: app.member,
			}
		},
		onShow() {
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
			this.getList();
			this.getInfo()
		},
		onLoad(options) {
			this.$nextTick(() => {
				this.setListHeight()
			})
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
		},
		methods: {
			checkItem(type, val) {
				if (this[type] === val) {
					this[type] = ''
				} else {
					this[type] = val
				}
			},
			submit() {
				this.showSelect = false
				this.form = {
					is_use: this.is_use,
					dealer_type: this.dealer_type,
					total_profit: this.total_profit,
					order_num: this.order_num,
					create_time: this.create_time
				}
				this.search()
			},
			showSelectBox() {
				this.showSelect = true
			},
			clearSelectBox() {
				this.showSelect = false
				this.is_use = ''
				this.dealer_type = ''
				this.total_profit = ''
				this.order_num = ''
				this.create_time = ''
				this.search()
			},
			closeSelectBox() {
				this.showSelect = false
			},
			search() {
				this.page = 1;
				this.getList();
			},
			setListHeight() {
			  const query = wx.createSelectorQuery();
			  query.select('#top').boundingClientRect();
			  query.selectViewport().scrollOffset();
			  query.exec(res => {
				let systemInfo = wx.getSystemInfoSync(),
					rpx = systemInfo.windowWidth / 750
					// tap高度
				this.tapTop = res[0].height + 248*rpx
				let scrollHeight = systemInfo.windowHeight - this.tapTop - 22*rpx; // swiper高度

				this.scrollHeight = scrollHeight
			  });
			},
			bindDownLoad() {
				if (!this.pullUpOn) return;
				this.loadding = true;
				if (this.page >= this.last_page) {
					this.loadding = false;
					this.pullUpOn = false;
				} else {
					this.page = ++this.page;
					this.loadding = false;
					this.getList();
				}
			},
			toDetail(item) {
 				uni.navigateTo({
					url: '/pages/user/distribution/detail/index?user_id=' + item.dealer_user_id + '&id=' + item.id
				});
			},
			toOther(name) {
				if ((name == 'goods' || name == 'share') && this.vip != 4) {
					this.$refs.buyMember.open()
					return false
				}
 				uni.navigateTo({
					url: '/pages/user/distribution/' + name + '/index'
				});
			},
			openNum(item) {
				uni.navigateTo({
					url: '/pages/user/distribution/discount/index?id=' + item.id + '&dealer_type=' + item.dealer_type + '&dealer_discount=' + item.dealer_discount
				})
				// this.$refs.popupInput._open(item.dealer_discount, (val) => {
				// 	let url = 'shop.wxapp.dealer_user/editDiscount';
				// 	app._post_form(url, {
				// 		id: item.id,
				// 		discount: val
				// 	}, res => {
				// 		this.$api.msg(res.msg);
				// 		this.page = 1
				// 		this.getList()
				// 	});
				// })
			},
			// 获取列表
			getList (){
				let data = {
					page: this.page
				}
				if (this.nickName != '') {
					data.nickName = this.nickName
				}
				if (this.form.is_use !== '') {
					data.is_use = this.form.is_use
				}
				if (this.form.dealer_type !== '') {
					data.dealer_type = this.form.dealer_type
				}
				if (this.form.total_profit != '') {
					data.total_profit = this.form.total_profit
				}
				if (this.form.order_num != '') {
					data.order_num = this.form.order_num
				}
				if (this.form.create_time != '') {
					data.create_time = this.form.create_time
				}
				
				app._get('shop.wxapp.dealer_user/index', data,res => {
					let data = res.data.list.data;
					this.last_page = res.data.list.last_page;
					this.is_notice = res.data.notice_module.is_notice || '';
					data.forEach(item => {
          				item.createTime = item.create_time.substring(0, 16)
					});
					if (this.page == 1) {
						this.list = data;
					} else {
						this.list = this.list.concat(data);
					}
				});
			},
			getInfo() {
				app._get('user.index/detail', {}, (result) => {
					if (result.code == '1') {
						this.vip = result.data.userInfo.vip || '0'
					}
				});
			},
			// 是否拉黑
			toBlock(item){
				let that = this;
				let title='',content='';
				if(item.is_use){
					title = '确定将该用户禁用？'
				}else{
					title = '确定将该用户启用？';
				}
				uni.showModal({
					title: title,
					confirmColor: '#E82E2E',
					success: (res) => {
						if (res.confirm) {
							let url = 'shop.wxapp.dealer_user/open';
							app._post_form(url, {id: item.id}, res => {
								that.$api.msg(res.msg);
								that.page = 1
								that.getList(true)
							});
						}
					}
				})
			},
			//去会员购买页
			toMember(){
        		app.toMember()
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index';
</style>
