<template>
	<view class="min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar extClass="nav" isHelpme id="top" title="分享赚钱"></navigationBar>
		<div class="boxPad">
			<view class="shopBox">
				<view class="dis-flex">
					<view class="imgBox">
						<image :src="wxapp.logo" alt=""></image>
					</view>
					<div class="empty"></div>
					<view class="info dis-flex flex-y-center">
						<div class="infoBox">
							<view class="title">
								<text>{{wxapp.wxapp_name}}</text>
							</view>
						</div>
					</view>
				</view>
				<div class="changeShop" @tap="changeShop">
					分佣比设置
					<text class="iconfont2 icon-setup1 f-26" style="margin-left: 8rpx"></text>
				</div>
			</view>
			<div class="moneyCard" @tap="toDataMoney">
				<view class="bgImg">
					<image src="https://pic.kaidanxia.com/2020-12-11/111943bda3e3866.png" mode="aspectFit"></image>
				</view>
				<div class="dis-flex flex-y-center">
					<div class="moneyBox m-r-60">
						<div class="moneyTitle">销售总额(元)
						</div>
						<div class="money">{{gather.sale_total}}</div>
					</div>
					<div class="moneyBox">
						<div class="moneyTitle">分佣总额(元)</div>
						<div class="money">{{gather.commission_total}}</div>
					</div>
				</div>
			</div>
			<div class="dataBox">
				<div class="dataList dis-flex flex-y-center dataListMb">
					<div class="dataItem" @tap="toOrder('today')">
						<div class="dataTitle">今日推广订单</div>
						<div class="dataNum">{{gather.today_order}}</div>
					</div>
					<div class="dataLine"></div>
					<div class="dataItem" @tap="toOrder">
						<div class="dataTitle">累计推广订单</div>
						<div class="dataNum">{{gather.total_order}}</div>
					</div>
				</div>
				<div class="dataList dis-flex flex-y-center">
					<div class="dataItem" @tap="toProfitList('today')">
						<div class="dataTitle">今日店小二</div>
						<div class="dataNum">{{gather.today_waiter}}</div>
					</div>
					<div class="dataLine"></div>
					<div class="dataItem" @tap="toProfitList">
						<div class="dataTitle">累计店小二</div>
						<div class="dataNum">{{gather.total_waiter}}</div>
					</div>
				</div>
			</div>
			<view class="activeBox dis-flex flex-y-center flex-x-end">
				<view class="dis-flex flex-y-center flex-box">
					<view class="activeImg">
						<image src="https://pic.kaidanxia.com/2020-12-15/171020e11fa0818.png" mode="aspectFit"></image>
					</view>
					<view class="activeContent">
						<view class="activeTitle">
							推广活动
						</view>
						<view class="activeTip">
							分享店铺发展你的店小二
						</view>
					</view>
				</view>
				<view class="activeBut" @tap="toShare">
					去推广
				</view>
			</view>
			<view class="shareBox">
				<view class="shareList">
					<view class="shareItem dis-flex flex-y-center">
						<view class="shareContent share_b dis-flex flex-y-center flex-x-between">
							<view class="f-30">
								店小二申请
							</view>
							<view class="shareBut" @tap.stop="toGuanli">
								去管理
							</view>
						</view>
					</view>
					<view class="shareItem1">
						<view class="shareContent dis-flex flex-y-center flex-x-between">
							<view class="f-30">
								分享赚钱
							</view>
							<view class="shareBut1 dis-flex flex-y-center flex-x-center">
								<cust-switch :checked="open_share" @change="isOpenChange" size="large"></cust-switch>
							</view>
						</view>
						<view class="shareItemTip">
							<text class="iconfont2 icon-jingshi"></text>
							开启后所有进店用户都可以申请成为你的店小二
						</view>
					</view>
				</view>
			</view>
		</div>
		
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	import custSwitch from '@/components/cust-switch/index.vue';
	import guidePage from '@/components/guide-page';
	const app = getApp().globalData;
	export default {
		components: {
			custSwitch,
			guidePage
		},
		data() {
			return {
				gather: {
					commission_total: '0.00',
					sale_total: '0.00',
					today_order: 0,
					today_waiter: 0,
					total_order: 0,
					total_waiter: 0
				},
				wxapp: {
					is_shared: 0,
					logo: "",
					wxapp_id: '',
					wxapp_name: ""
				},
				open_share: false
			}
		},
		mounted: function(options) {
		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				app._get('share.share_money/detail', {
					wxapp_id: 10088
				}, (result) => {
					if (result.code == 1) {
						let gather = result.data.gather || {}
						this.gather = {
							commission_total: gather.commission_total || '0.00',
							sale_total: gather.sale_total || '0.00',
							today_order: gather.today_order || 0,
							today_waiter: gather.today_waiter || 0,
							total_order: gather.total_order || 0,
							total_waiter: gather.total_waiter || 0
						}
						this.wxapp = result.data.wxapp || {
							is_shared: 0,
							logo: "",
							wxapp_id: '',
							wxapp_name: "",
						}
						if (this.wxapp.is_shared == 1) {
							this.open_share = true
						} else {
							this.open_share = false
						}
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			toShare() {
				if (!this.open_share) {
					this.$api.msg('请先开启分享赚钱功能')
					return
				}
				uni.navigateTo({
					url: '/pages/user/distribution/share/index?name=goods'
				})
			},
			toDataMoney() {
				uni.navigateTo({
					url: '/pages/makeMoney/sellerIndex/dataChart/index'
				})
			},
			toProfitList(type) {
				let url = '/pages/makeMoney/mySalesman/list'
				if (type == 'today') {
					url += '?date=0'
				}
				uni.navigateTo({
					url: url
				})
			},
			toOrder(type) {
				let url = '/pages/makeMoney/order/listA/index'
				if (type == 'today') {
					url += '?date=0'
				}
				uni.navigateTo({
					url: url
				})
			},
			toGuanli(){
				uni.navigateTo({
					url: '/pages/makeMoney/mySalesman/apply/index'
				})
			},
			changeShop() {
				uni.navigateTo({
					url: '/pages/makeMoney/sellerIndex/setMoney/index'
				})
			},
			submit() {},
			isOpenChange(val) {
				this.open_share = val
				app._post_form('share.share_money/changeShared', {
					is_shared: val ? 1 : 0
				}, (result) => {
					if (result.code == 0) {
						this.open_share = !val
					}
					this.$api.msg(result.msg)
				}, () => {
					this.open_share = !val
				})
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
