<template>
	<view class="apply">
		<!-- 自定义标题栏 -->
		<navigationBar title="渠道详情" isHelpme extClass="nav" id="top"></navigationBar>
		<scroll-view scroll-y @scrolltolower="bindDownLoad" :style="'height: ' + scrollHeight  + 'px;'" style="padding-top: 20rpx;">
			<div class="heardBox">
				<div class="infoBox dis-flex flex-x-between">
					<div class="dis-flex flex-y-center">
						<div class="imgBox">
							<image :src="dealer_user_info.avatarUrl" mode="aspectFill"></image>
						</div>
						<div class="info">
							<div class="userName">{{dealer_user_info.nickName}}</div>
							<div class="state">{{dealer_user_info.is_use ? '启用中' : '禁用中'}}</div>
						</div>
					</div>
					<div class="optBox dis-flex">
						<div class="but noUse" v-if="dealer_user_info.is_use" @tap.stop="toBlock('1')">禁用</div>
						<div class="but use" v-else @tap.stop="toBlock()">启用</div>
						<div class="but noMoney" @tap.stop="clearBill()" v-if="billInfo.bill_id">销账</div>
					</div>
				</div>
				<div class="numBox dis-flex flex-y-center flex-x-between">
					<div class="numItem">
						<div class="num">{{numInfo.order_num || '0'}}</div>
						<div class="numTip">订单数</div>
					</div>
					<div class="numItem">
						<div class="num">{{numInfo.total_profit || '0'}}</div>
						<div class="numTip">总收益</div>
					</div>
					<div class="numItem">
						<div class="num">{{numInfo.finish_order_num || '0'}}</div>
						<div class="numTip">已结算</div>
					</div>
					<div class="numItem">
						<div class="num">{{numInfo.dealing_order_num || '0'}}</div>
						<div class="numTip">待结算</div>
					</div>
					<div class="numItem">
						<div class="num">{{billInfo.money ? billInfo.money.show || '0' : '0'}}</div>
						<div class="numTip">当前欠款
							<text class="iconfont2 icon-time1 f-24 col-m" style="margin-left:10rpx"></text>
						</div>
					</div>
				</div>
			</div>
			<div class="discount dis-flex flex-y-center flex-x-between" @tap.stop="openNum">
				<div class="title">结算方式</div>
				<div>
					<text class="discountNum2" v-if="dealer_user_info.dealer_type == '0'">{{dealer_user_info.dealer_discount}}折</text>
					<text class="discountNum3" v-else-if="dealer_user_info.dealer_type == '1'">渠道价</text>
					<text class="discountNum1" v-else>未设置</text>
					<text class="iconfont2 icon-gengduobeifen2"></text>
				</div>
			</div>
			<div class="discount dis-flex flex-y-center flex-x-between">
				<div class="title">注册时间</div>
				<div>{{dealer_user_info.createTime}}</div>
			</div>
			<view class="container">
				<div class="tabsBox dis-flex flex-y-center">
					<div class="tabItem" :class="tabs == '1' ? 'active' : ''" @tap.stop="tabs = '1'">
					订单
					<div class="line"></div>
					</div>
					<div class="tabItem" :class="tabs == '2' ? 'active' : ''" @tap.stop="tabs = '2'">
					记账
					<div class="line"></div>
					</div>
				</div>
				<div v-show="tabs == '1'">
						<div class="orderListBox">
						<template v-if="orderList.length > 0">
							<div class="orderTitle dis-flex flex-y-center">
								<div class="orderNum">序号</div>
								<div class="orderTime">订单号/时间</div>
								<div class="orderPrice">订单金额</div>
							</div>
							<div class="orderList dis-flex flex-y-center flex-x-between" v-for="(item, index) in orderList" :key="index" @tap.stop="toOrderDetail(item)" :style="index == orderList.length - 1 ? 'border:0;' : ''">
								<div class=" dis-flex flex-y-center">
									<div class="orderNum orderListNum">{{index + 1}}</div>
									<div class="orderTime">
									<div class="order_no">{{item.order_no}}</div>
									<div class="create_time">{{item.createTime}}</div>
									</div>
									<div class="orderPrice">{{item.pay_price}}</div>
								</div>
								<div class="listMore">
									<div class="listMoreBox">
									<text class="iconfont2 icon-Top"></text>
									</div>
								</div>
							</div>
							<view class="no-more f-24 col-9" v-if="no_more">开单虾技术支持～</view>
						</template>
						<div class="nodata" v-else>
							<tui-no-data imgUrl="/static/images/no_content.png" :fixed="false" :imgWidth="380" :imgHeight="328">
							<div>
								暂无数据
							</div>
							</tui-no-data>
						</div>
						</div>
				</div>
				<div v-show="tabs == '2'">
						<div class="orderListBox">
						<template v-if="billList.length > 0">
							<div class="orderTitle dis-flex flex-y-center">
								<div class="orderNum">序号</div>
								<div class="orderTime">订单号/时间</div>
								<div class="orderPrice">本单欠款</div>
							</div>
							<div class="orderList dis-flex flex-y-center flex-x-between" v-for="(item, index) in billList" :key="index" @tap.stop="toOrderDetail(item)" :style="index == orderList.length - 1 ? 'border:0;' : ''">
								<div class=" dis-flex flex-y-center">
									<div class="orderNum orderListNum">{{index + 1}}</div>
									<div class="orderTime">
									<div class="order_no">{{item.order_no}}</div>
									<div class="create_time">{{item.createTime}}</div>
									</div>
									<div class="orderPrice">{{item.money.show}}</div>
								</div>
								<div class="listMore dis-flex flex-y-center">
									<div class="delBox" @tap.stop="delOrder(item.id)">
										<text class="iconfont2 icon-shanchu"></text>
									</div>
									<div class="listMoreBox">
										<text class="iconfont2 icon-Top"></text>
									</div>
								</div>
							</div>
							<view class="no-more f-24 col-9" v-if="no_more">开单虾技术支持～</view>
						</template>
						<div class="nodata" v-else>
							<tui-no-data imgUrl="/static/images/no_content.png" :fixed="false" :imgWidth="380" :imgHeight="328">
							<div>
								暂无数据
							</div>
							</tui-no-data>
						</div>
						</div>
				</div>
			</view>
		</scroll-view>
		<!-- 无数据 -->
		<!-- <tui-no-data imgUrl="https://pic.kaidanxia.com/2020-08-17/2020081716461121da54339.png" :imgWidth="264" :imgHeight="264">
			<view class="col-9">暂无数据</view>
		</tui-no-data> -->
		<popup-input ref="popupInput"></popup-input>
		<!-- 销账弹窗 -->
		<popup-tips ref="popTips1" type="custom" confirmText="确定">
			<view class="popTips-title f-32 col-f tb-lr-center">销账</view>
			<view class="mcontent">
				<view class="col-6 f-32">当前欠款：<text class="col-3">{{billInfo.money ? billInfo.money.show || 0 : 0}}</text></view>
				<view class="writeOff_value m-top30">
					<input v-model="moneyVal" class="writeOff-money col-3 f-28" type="text" placeholder-style="color:#999" placeholder="请输入销账金额"/>
				</view>
				<view class="writeOff_value f-28 col-3 m-top30" @tap="dateCheck">
					{{setDateTime}}<text class="iconfont2 icon-calendar1 fr"></text>
				</view>
				<view class="col-6 f-26 m-t-40">选择收款方式</view>
				<view class="wayList dis-flex flex-x-between">
					<template v-for="way in wayList">
						<view class="way-item m-top30 col-3 f-24" :class="wayId==way.id?'on':''" :key="way.id" @tap.stop="changeWay(way.id)">
							<text :class="'m-r-10 iconfont2 '+way.icon" :style="'color:'+way.color"></text>
							{{way.text}}
						</view>
					</template>
				</view>
			</view>
		</popup-tips>
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<!-- 日期选择 -->
		<tui-datetime ref="dateTime" :type="1" cancelColor="#999" color="#333" @confirm="dateChange"></tui-datetime>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	let App = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default {
		data() {
			return {
				mtitle: '',
				mcontent: '',
				scrollHeight: 0,

				wayId: '',
				moneyVal: '',
				setDateTime: '',
				
				wayList: [{id:2,icon:'icon-WeChat1',color:'#24AF41',text:'微信'},{id:3,icon:'icon-Alipay',color:'#00A9F2',text:'支付宝'},{id:1,icon:'icon-paybycard',color:'#FF9917',text:'刷卡'},{id:0,icon:'icon-cash',color:'#F78383',text:'现金'},],

				dealer_user_info: {},
				numInfo: {},
				billInfo: {},
				tabs: '1',
				orderList: [],
				billList: [],
				user_id: '',
				id: '',
				last_page: 1,
				page: 1,
				last_billPage: 1,
				billPage: 1,
				no_more: false,
				no_billMore: false
			};
		},

		components: {
			popupInput,
			popupTips,
			guidePage
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.user_id = options.user_id
			this.id = options.id
			this.$nextTick(() => {
				this.setListHeight()
			})
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getOrderList()
			this.dealer()
			this.getInfo()
		},
		methods: {
			setListHeight() {
			  const query = wx.createSelectorQuery();
			  query.select('#top').boundingClientRect();
			  query.selectViewport().scrollOffset();
			  query.exec(res => {
				let systemInfo = wx.getSystemInfoSync(),
					rpx = systemInfo.windowWidth / 750,
					// tap高度
				scrollHeight = systemInfo.windowHeight - res[0].height - 20*rpx; // swiper高度

				this.scrollHeight = scrollHeight
			  });
			},
			//默认现在
			initSelectValue() {
				let time = null;
				time = new Date();
				let year = time.getFullYear(),
						month = this.formatNum(time.getMonth() + 1),
						day = this.formatNum(time.getDate()),
						hour = this.formatNum(time.getHours()),
						minute = this.formatNum(time.getMinutes()),
						second = this.formatNum(time.getSeconds());
				let setDateTime = `${year}-${month}-${day} ${hour}:${minute}`;
				this.setDateTime = setDateTime;
			},
			formatNum (num) {
				return num < 10 ? '0' + num : num + '';
			},
			clearBill() {
				this.initSelectValue()
				this.$refs.popTips1.open(()=>{
					let moneyVal = this.moneyVal!=''? this.moneyVal*100 : 0;
					if(moneyVal == ''){
						this.$api.msg('销账金额不能为空');
						return false
					}
					let bill_money = this.billInfo.money.value || 0
					if(moneyVal > bill_money){
						this.$api.msg('销账金额不能大于欠款数');
						return false
					}
					let data = {
						bill_id: this.billInfo.bill_id,
						money: this.moneyVal,
						time: this.setDateTime,
						way: this.wayId
					}
					if(moneyVal == bill_money){
						this.mtitle = '提示'
						this.mcontent = '请确认当前所有欠款已完结？';
						this.$refs.popupTips.open(()=>{
							this.destroyBill(data);
						});
					}else{
						this.destroyBill(data);
					}
				});
			},
			destroyBill(data){
				App._post_form('shop.wxapp.bill/destroyBill', data, res => {
					this.$api.msg(res.msg);
					this.getInfo()
				});
			},
			dateChange(e) {
				this.setDateTime = e.result;
			},
			//切换收款方式
			changeWay(id){
				this.wayId = id
			},
			// 选择时间
			dateCheck(){
				this.$refs.dateTime.show();
			},
			// 是否拉黑
			toBlock(is_use){
				let that = this;
				let title='';
				if(is_use){
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
							App._post_form(url, {id: that.id}, res => {
								that.$api.msg(res.msg);
								that.getInfo()
							});
						}
					}
				})
			},
			toOrderDetail(item) {
 				uni.navigateTo({
					url: '/pages/myGoods/order/detail/index?order_no=' + item.order_no
				});
			},
			openNum() {
				uni.navigateTo({
					url: '/pages/user/distribution/discount/index?id=' + this.dealer_user_info.id + '&dealer_type=' + this.dealer_user_info.dealer_type + '&dealer_discount=' + this.dealer_user_info.dealer_discount
				})
				// this.$refs.popupInput._open(this.dealer_user_info.dealer_discount || '', (val) => {
				// 	let url = 'shop.wxapp.dealer_user/editDiscount';
				// 	App._post_form(url, {
				// 		id: this.id,
				// 		discount: val
				// 	}, res => {
				// 		this.$api.msg(res.msg);
				// 		this.getInfo()
				// 	});
				// })
			},
			getInfo() {
				App._get('shop.wxapp.dealer_user/detail', {
					dealer_user_id: this.user_id
				}, res => {
					if (res.code === 1) {
						this.dealer_user_info = res.data.dealer_user_info ? res.data.dealer_user_info[0] : {}
						this.billInfo = res.data.billInfo || {}
						this.dealer_user_info.createTime = this.dealer_user_info.create_time.substring(0, 16)
						this.numInfo = res.data || {}
						this.getBillList()
					} else {
						this.$api.msg(res.msg)
					}
				});
			},
			getOrderList () {
				App._get('shop.wxapp.dealer_user/dealerOrderList', {
					page: this.page,
					dealer_user_id: this.user_id
				}, (result) => {
					let list = result.data.list.data || []
					this.last_page = result.data.list.last_page || 1
					list.forEach(item => {
						item.createTime = item.create_time.substring(0, 16)
					})
					if (this.page == 1) {
						this.orderList = list
					} else {
						this.orderList = this.orderList.concat(list)
					}
				})
			},
			getBillList () {
				App._get('shop.wxapp.bill/getBillOrders', {
					page: this.billPage,
					dealer_wxapp_id: this.dealer_user_info.dealer_wxapp_id
				}, (result) => {
					let list = result.data.list.data
					this.last_billPage = result.data.list.last_page || 1
					list.forEach(item => {
						item.createTime = item.create_time.substring(0, 16)
					})
					if (this.billPage == 1) {
						this.billList = list
					} else {
						this.billList = this.billList.concat(list)
					}
				})
			},
			delOrder(id){
				this.mtitle = '提示'
				this.mcontent = '确定删除该订单？'
				this.$refs.popupTips.open(()=>{
					App._post_form('shop.wxapp.bill/delOrder', {id: id}, res => {
						this.$api.msg(res.msg);
						this.getBillList()
						this.getInfo()
					});
				});
			},
			bindDownLoad() {
				if (this.tabs == '1') {
					// 已经是最后一页
					if (this.page >= this.last_page) {
						this.no_more = true
						return false;
					} // 加载下一页列表
					this.page++;
					this.getOrderList()
				} else {
					// 已经是最后一页
					if (this.billPage >= this.last_billPage) {
						this.no_billMore = true
						return false;
					} // 加载下一页列表
					this.billPage++;
					this.getBillList()
				}
			},
			dealer() {
				App._post_form('shop.wxapp.click_record/reportClickRecord', {
					module: 'dealer'
				}, res => {
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
