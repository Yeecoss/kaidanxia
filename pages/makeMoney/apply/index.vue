<template>
	<view class="min_h_100 applyBox">
		<!-- 自定义标题栏 -->
		<navigationBar title="店小二申请" extClass="nav" id="top"></navigationBar>
		<div v-if="is_pass == 1" class="state state1">
			申请已通过
		</div>
		<div v-else-if="is_pass == 2" class="state state2">
			抱歉，您已被拒绝。
		</div>
		<view v-else class="content" :style="{top: top + 'px'}">
			<view class="nameBox">
				<view class="nameBg">
					<image src="https://pic.kaidanxia.com/2020-12-24/1614439c9f73502.png" mode="aspectFit"></image>
				</view>
				<view class="imgBox">
					<image mode="aspectFill" :src="logo"></image>
				</view>
				<view class="shopName">
					{{name}}
				</view>
			</view>
			<view class="title">
				<view class="titleBg">
					MAKE MONEY
				</view>
				邀请你成为店小二
				<br>
				分享就可以赚钱
			</view>
			<view class="tip">
				推广商品给你的亲朋好友，成功下单后你最高<br>
				将获得商品售价的
				<text class="col-m f-40 f-w">{{highest_percent}}%</text>
				的返现收益，<br>
				该店铺单个商品最高返现金额为：
				<text class="col-m f-40 f-w">{{highest_commission}}元</text>
			</view>
			<view class="contentImg">
				<image src="https://pic.kaidanxia.com/2020-12-24/161444bd5561622.png" mode="aspectFit"></image>
			</view>
			<view class="listBox">
				<view class="listTitle">
					活动规则
				</view>
				<view class="list dis-flex">
					<view class="listIcon dis-flex flex-y-center flex-x-center">
						<view class="itemIcon">
							1
						</view>
					</view>
					<view class="flex-box">
						申请成功之后，则永久成为该店铺店小二，通过分享店铺、分享商品等方式给他人，他人下单后都可以获得收益；
					</view>
				</view>
				<view class="list dis-flex">
					<view class="listIcon dis-flex flex-y-center flex-x-center">
						<view class="itemIcon">
							2
						</view>
					</view>
					<view class="flex-box">
						可以申请成为多个店铺的店小二，收益比例以店主设置为准；
					</view>
				</view>
				<view class="list dis-flex">
					<view class="listIcon dis-flex flex-y-center flex-x-center">
						<view class="itemIcon">
							3
						</view>
					</view>
					<view class="flex-box">
						客户下单购买确认收货后即可获得收益；
					</view>
				</view>
				<view class="list dis-flex">
					<view class="listIcon dis-flex flex-y-center flex-x-center">
						<view class="itemIcon">
							4
						</view>
					</view>
					<view class="flex-box">
						在店小二个人中心可进行提现。
					</view>
				</view>
			</view>
		</view>
		<div class="bottomBox dis-flex flex-y-center flex-x-center" v-if="is_pass != 1">
			<div class="bottomBut" @tap="submit">{{is_pass == 2 ? '重新' : '确认'}}申请</div>
		</div>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				is_pass: 0,
				highest_percent: 0,
				highest_commission: '0.00',
				name: '',
				logo: '',
				top: '50'
			}
		},
		onLoad(options) {
			this.getData()
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		methods: {
			/**
			 * 设置商品列表高度
			 */
			setListHeight() {
			  const query = wx.createSelectorQuery();
			  query.select('#top').boundingClientRect();
			  query.selectViewport().scrollOffset();
			  query.exec(res => {
				this.top = res[0].height
			  });
			},
			getData() {
				app._get('share.make_money/applyWaiter', {}, (result) => {
					if (result.code == 1) {
						this.is_pass = result.data.is_pass || 0
						this.highest_percent = result.data.highest_percent || 0
						this.highest_commission = result.data.highest_commission || 0
						this.name = result.data.wxapp.name || ''
						this.logo = result.data.wxapp.logo || ''
					} else {
						this.$api.msg(result.msg)
					}
				}, () => {
					uni.hideLoading()
				})
			},
			submit() {
				app._post_form('share.make_money/applyWaiter', {}, (result) => {
					if (result.code == 1) {
						if (result.data.is_pass && result.data.is_pass == 1) {
							let stime = 1
							let str = '审核中...1s'
							this.$api.msg(str)
							let time = setInterval(() => {
								stime ++
								str = '审核中...' + stime + 's'
								if (stime == 4) {
									this.$api.msg('审核通过！')
									clearInterval(time)
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/makeMoney/index?store_wxapp_id=' + app.wxapp_id
										})
									}, 500)
								} else {
									this.$api.msg(str)
								}
							}, 1000)
						} else {
							this.$api.msg(result.msg)
							setTimeout(() => {
								uni.navigateBack();
							}, 500)
						}
					}
				}, () => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
