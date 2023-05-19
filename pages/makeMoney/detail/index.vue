<template>
	<view class="min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="赚钱店小二" extClass="nav" id="top"></navigationBar>
		<view class="nameCard">
			<view class="imgBox">
				<image :src="user.avatar || '/static/images/defaultImg.png'" mode=""></image>
			</view>
			<view class="name">
				{{user.level}}
			</view>
			<view class="jifenBox">
				<view class="jifenShowBg">
					<view class="jifenShow dis-flex flex-y-center flex-x-between">
						<view class="nodeBox" :class="nowIndex >= 0 ? 'nodeActive' : ''">
							<view class="nodeTitle">
								初级店小二
							</view>
						</view>
						<view class="nodeBox" :class="nowIndex >= 1 ? 'nodeActive' : ''">
							<view class="nodeTitle">
								中级店小二
							</view>
						</view>
						<view class="nodeBox" :class="nowIndex >= 2 ? 'nodeActive' : ''">
							<view class="nodeTitle">
								高级店小二
							</view>
						</view>
					</view>
					<view class="jifenLine" :style="{width: lineLength + 'rpx'}">
						
					</view>
				</view>
			</view>
		</view>
		<view class="ruleBox" v-if="showNext">
			<view class="ruleBg">
				<image src="https://pic.kaidanxia.com/2020-12-11/11194238bbc2673.png" mode="aspectFit"></image>
			</view>
			<view class="ruleTitle">
				满足一下规则可升级为{{beTo}}
			</view>
			<view class="ruleContent">
				推广金额达{{beToNum}}元(还差{{user.difference || '0.00'}}元)
			</view>
		</view>
		<view class="ruleList">
			<view class="title">
				等级规则
			</view>
			<view class="ruleItem dis-flex" style="margin-top: 42rpx;">
				<view class="orderNum">
					1
				</view>
				<view>
					<view class="content">
						初级店小二：成为开单虾用户
					</view>
					<view class="tip">
						收益比为{{wxapp_levels[0].percent}}%
					</view>
				</view>
			</view>
			<view class="ruleItem dis-flex" style="margin-top: 52rpx;">
				<view class="orderNum">
					2
				</view>
				<view>
					<view class="content">
						中级店小二：推广金额达{{wxapp_levels[1].sale_total}}元
					</view>
					<view class="tip">
						收益比为{{wxapp_levels[1].percent}}%
					</view>
				</view>
			</view>
			<view class="ruleItem dis-flex" style="margin-top: 50rpx;">
				<view class="orderNum">
					3
				</view>
				<view>
					<view class="content">
						高级店小二：推广金额达{{wxapp_levels[2].sale_total}}元
					</view>
					<view class="tip">
						收益比为{{wxapp_levels[2].percent}}%
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				lineLength: 0,
				nowIndex: 0,
				showNext: true,
				user: {},
				wxapp_levels: [
					{
						sale_total: 0,
						percent: 0
					},
					{
						sale_total: 0,
						percent: 0
					},
					{
						sale_total: 0,
						percent: 0
					},
				],
				beTo: '中级店小二',
				beToNum: 0,
				wxapp_id: '',
				nextNames: ['初级店小二', '中级店小二', '高级店小二']
			}
		},
		onLoad(options) {
			this.wxapp_id = options.wxapp_id || ''
			this.getData()
		},
		methods: {
			getData() {
				app._get('share.make_money/getLevelDetail', {
					store_wxapp_id: this.wxapp_id
				}, (result) => {
					if (result.code == 1) {
						this.user = result.data.user || {}
						if (this.user.wxapp_levels && this.user.wxapp_levels.length > 0) {
							this.wxapp_levels = [
								{
									sale_total: this.user.wxapp_levels[0].sale_total || 0,
									percent: this.user.wxapp_levels[0].percent || 0
								},
								{
									sale_total: this.user.wxapp_levels[1].sale_total || 0,
									percent: this.user.wxapp_levels[1].percent || 0
								},
								{
									sale_total: this.user.wxapp_levels[2].sale_total || 0,
									percent: this.user.wxapp_levels[2].percent || 0
								}
							]
						}
						this.unitBeTo()
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			unitBeTo() {
				let sale_total = parseFloat(this.user.sale_total || 0)
				let nextName = ''
				this.wxapp_levels.forEach((item, index) => {
					if (nextName == '') {
						if (parseFloat(item.sale_total || 0) > sale_total) {
							nextName = this.nextNames[index]
							this.beToNum = item.sale_total
							if (index == 1) {
								this.lineLength = parseInt(240 * sale_total / parseFloat(item.sale_total || 0))
							} else if (index == 2) {
								this.lineLength = parseInt(240 * (sale_total -  parseFloat(this.wxapp_levels[0].sale_total)) / (parseFloat(item.sale_total || 0)) -  parseFloat(this.wxapp_levels[0].sale_total)) + 240
							}
							this.nowIndex = index - 1
						} else if (index == this.wxapp_levels.length - 1) {
							this.lineLength = 480
							this.showNext = false
							this.nowIndex = index
						}
					}
				})
				if (nextName != '') {
					this.beTo = nextName
				}
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
