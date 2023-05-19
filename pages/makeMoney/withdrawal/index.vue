<template>
	<scroll-view class="bgf5" style="height:100%;">
		<!-- 自定义标题栏 -->
		<navigationBar title="提现" extClass="nav" id="top"></navigationBar>
		<view class="allNum">
			{{allNum}}
			<text class="numTip">元</text>
		</view>
		<view class="inputBox">
			<view class="inputTit dis-flex flex-y-center flex-x-between">
				<view class="inputName">
					提现余额
				</view>
				<view class="allGet" @tap="allGet">
					全部提现
				</view>
			</view>
			<!-- <view class="inputItem dis-flex flex-y-center">
				<view class="inputTip">
					￥
				</view>
				<view class="inputItem1 dis-flex flex-y-center">
					<input class="input" type="digit" v-model="num" />
				</view>
			</view> -->
			<view class="dis-flex moneyVal">
				<text class="inputTip f-44">¥</text>
				<input class="flex-box m-l-10 f-44" type="digit" v-model="num"/>
			</view>
			<view class="tipBox f-24" style="color:#2A2A30">
				<text class="iconfont2 icon-jingshi f-24 col-m" style="margin-right:6rpx"></text>
				满5元即可提现，提现后48小时到账；每周三为提现日。
			</view>
		</view>
		<div class="f-24 vipTip dis-flex" style="color:#DF9638" v-if="vip <= 1">
			<div style="width:40rpx">
				<text class="f-24 iconfont2 icon-jingshi"></text>
			</div>
			<div>
				免费会员提现额度为1688，您当前剩余提现余额额度为{{remain_withdraw_amount}},会员无限制，<text class="col-m" @tap="openVip">立即开通></text>
			</div>
		</div>
		<view class="submitBut" @tap="submit">
			确认提现
		</view>
		<view class="list dis-flex flex-y-center flex-x-between" @tap="toProfitList">
			<view>
				总收益记录
			</view>
			<view>
				<text class="iconfont2 icon-gengduobeifen2 f-24"></text>
			</view>
		</view>
		<view class="list dis-flex flex-y-center flex-x-between" style="margin-top: 20rpx;" @tap="toWithdrawalList">
			<view>
				提现记录
			</view>
			<view>
				<text class="iconfont2 icon-gengduobeifen2 f-24"></text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				allNum: 0,
				remain_withdraw_amount: 0,
				store_wxapp_id: 0,
				num: 0,
				vip: 2
			}
		},
		
		mounted: function(options) {
		},
		onShow() {
			this.getDetail()
		},
		onLoad(options) {
			this.store_wxapp_id = options.store_wxapp_id || 0
		},
		methods: {
			getDetail() {
				app._get('share.withdraw/index', {
					store_wxapp_id: this.store_wxapp_id
				}, (result) => {
					if (result.code == 1) {
						this.allNum = result.data.available_money || 0
						this.remain_withdraw_amount = result.data.remain_withdraw_amount || 0
						this.vip = result.data.vip || 0
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			openVip() {
				uni.navigateTo({
					url: '/pages/user/member/member-special/index'
				})
			},
			submit() {
				if (this.num == 0) {
					this.$api.msg('提现金额不能为0')
					return
				}
				app._post_form('share.withdraw/apply', {
					money: this.num
				}, (result) => {
					if (result.code == 1) {
						this.$api.msg(result.msg)
						uni.navigateBack({
							delta: 1
						});
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			allGet() {
				let allNum = this.allNum + ''
				this.num = parseFloat(allNum.replace(',', ''))
			},
			toWithdrawalList() {
				uni.navigateTo({
					url: '/pages/makeMoney/withdrawal/withdrawalList/index'
				})
			},
			toProfitList() {
				uni.navigateTo({
					url: '/pages/makeMoney/withdrawal/profitList/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
