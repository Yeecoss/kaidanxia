<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="比例设置" extClass="nav" id="top"></navigationBar>
		<view class="contentBox">
			<view class="list">
				<view class="title dis-flex flex-y-center">
					<view class="titleIcon">
						1
					</view>
					<view>
						初级店小二
					</view>
				</view>
				<view class="inputBox dis-flex flex-y-center">
					<view>
						分佣比例:
					</view>
					<input type="digit" v-model="commissions[0].percent" />
					<view>
						%
					</view>
				</view>
			</view>
			<view class="list">
				<view class="title dis-flex flex-y-center">
					<view class="titleIcon">
						2
					</view>
					<view>
						中级店小二
					</view>
				</view>
				<view class="dis-flex flex-y-center flex-x-between">
					<view class="inputBox dis-flex flex-y-center">
						<view>
							分佣比例:
						</view>
						<input type="digit" v-model="commissions[1].percent" />
						<view>
							%
						</view>
					</view>
					<view class="inputBox dis-flex flex-y-center">
						<view>
							升级条件满:
						</view>
						<input type="digit" v-model="commissions[1].sale_total" />
						<view>
							元
						</view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="title dis-flex flex-y-center">
					<view class="titleIcon">
						3
					</view>
					<view>
						高级店小二
					</view>
				</view>
				<view class="dis-flex flex-y-center flex-x-between">
					<view class="inputBox dis-flex flex-y-center">
						<view>
							分佣比例:
						</view>
						<input type="digit" v-model="commissions[2].percent" />
						<view>
							%
						</view>
					</view>
					<view class="inputBox dis-flex flex-y-center">
						<view>
							升级条件满:
						</view>
						<input type="digit" v-model="commissions[2].sale_total" />
						<view>
							元
						</view>
					</view>
				</view>
			</view>
			<view class="tipBox">
				<view class="tipTitle">
					规则说明
				</view>
				<view class="tipContent">
					<view class="tipList">
						<view class="dot"></view>
						分佣设置不得低于0.1%，不得高于30%
					</view>
					<view class="tipList">
						<view class="dot"></view>
						升级条件是指，初级店小二销售满一定金额后，才可升级为中级店小二，以此类推
					</view>
					<view class="tipList">
						<view class="dot"></view>
						举例说明：商品单价为100元，快递费10元，初级店小二分佣比例为10%，用户实付款110元，店小二只参与商品价格100元的分佣，快递费不做分佣。
					</view>
				</view>
			</view>
		</view>
		<view class="submitBut" @tap="submit">
			确定
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
				commissions: [
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
					}
				]
			}
		},
		mounted: function(options) {
			this.getData()
		},
		methods: {
			getData() {
				app._get('share.share_money/getCommissionSet', {}, (result) => {
					if (result.code == 1) {
						let commissions = result.data || []
						if (commissions.length == 3) {
							this.commissions = [
								{
									sale_total: commissions[0].sale_total || 0,
									percent: commissions[0].percent || 0
								},
								{
									sale_total: commissions[1].sale_total || 0,
									percent: commissions[1].percent || 0
								},
								{
									sale_total: commissions[2].sale_total || 0,
									percent: commissions[2].percent || 0
								}
							]
						} else {
							this.commissions = [
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
								}
							]
						}
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			submit() {
				app._post_json_form('share.share_money/setCommission', {
					commissions: this.commissions
				}, (result) => {
					if (result.code == 1) {
						this.$api.msg(result.msg)
						setTimeout(() => {
						 uni.navigateBack()
						}, 500)
					} else {
						this.$api.msg(result.msg)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
