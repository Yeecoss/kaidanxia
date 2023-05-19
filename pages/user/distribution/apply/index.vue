<template>
	<view class="apply">
		<!-- 自定义标题栏 -->
		<navigationBar title="渠道申请" extClass="nav" id="top"></navigationBar>
		<view class="container">
			<div class="userBox">
				<div class="userItem dis-flex flex-y-center" v-for="(item, index) in userList" :key="index">
					<div class="imgBox" :class="isShow ? '' : 'filter'">
						<image class="img" :src="item.avatarUrl"></image>
					</div>
					<div class="info">
						<div class="name" :class="isShow ? '' : 'filter'">
							{{item.nickName}}
						</div>
						<div class="time">
							{{item.create_time}}
						</div>
					</div>
					<div class="num">
						{{item.dealer_num}}次
						<div class="unlock" v-if="!isShow" @tap.stop="toMember(item)">
						升级权益
						</div>
					</div>
				</div>
          		<view v-if="no_more" class="no-more f-24 col-9">开单虾技术支持～</view>
			</div>
		</view>
		<!-- 无数据 -->
		<tui-no-data v-if="userList==''" imgUrl="https://pic.kaidanxia.com/2020-08-17/2020081716461121da54339.png" :imgWidth="264" :imgHeight="264">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
	</view>
</template>

<script>
	let App = getApp().globalData;

	export default {
		data() {
			return {
      	triggered: false,
				userList: [],
				page: 1,
				last_page: 1,
				no_more: false,
				isShow: false
			};
		},

		components: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getVip()
			this.getList()
			this.dealer()
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh: function () {
			this.page = 1;
			this.getList(() => {
				uni.stopPullDownRefresh();
			});
		},
		// 上拉加载下一页
		onReachBottom () {
			this.bindDownLoad()
		},
		methods: {
			bindDownLoad() {
				// 已经是最后一页
				if (this.page >= this.last_page) {
					this.no_more = true
					return false;
				} // 加载下一页列表
				this.page ++;
				this.getList();
			},
			refresherrefresh() {
				this.triggered = true
				this.getList(() => {
					this.triggered = false
				});
			},
			// 获取列表
			getList(next) {
				App._get('shop.wxapp.dealer_user/apply', {
					page: this.page
				}, res => {
					let data = res.data.list.data;
					this.last_page = res.data.list.last_page;
					if (this.page == 1) {
						this.userList = data;
					} else {
						this.userList = this.userList.concat(data);
					}
					next ? next() : ''
				});
			},
			dealer() {
				App._post_form('shop.wxapp.click_record/reportClickRecord', {
					module: 'dealer'
				}, res => {
				});
			},
			getVip() {
				App._get('user.index/vipDetail', {}, (result) => {
					let vip = result.data.userInfo.vip || ''
					this.isShow = (vip == '4')
				})
			},
			toMember() {
        		App.toMember()
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
