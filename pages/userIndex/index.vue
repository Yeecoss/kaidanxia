<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user">
			<view class="user_bg ">
				<image mode="aspectFill" src="https://pic.kaidanxia.com/2020-10-14/174105fcc866316.png"></image>
			</view>
			<navigationBar extClass="nav" :back="false" background="transparent" :fixed="false">
				<view slot="left" class="cate_btn">
					个人中心
				</view>
			</navigationBar>
			<view class="user-header dis-flex flex-x-between  flex-y-center">
				<!-- 已登录 -->
				<view v-if="isLogin" class="user-header-cont" @tap="toInfo">
					<view class="user-header-avatar">
						<!-- 微信头1像 -->
						<!-- <open-data lang="zh_CN" type="avatarUrl"></open-data> -->
						<image v-if="userInfo.avatarUrl && userInfo.avatarUrl != ''" imageDefault
							:src="userInfo.avatarUrl"></image>
						<image v-else src="/static/images/default-avatar.jpg"></image>
					</view>
					<view class="user-header-right">
						<!-- 微信昵称 -->
						<view class="nickName onelist-hidden">
							{{userInfo.nickName && userInfo.nickName != '' ? userInfo.nickName : '暂无昵称'}}</view>
						<!-- <open-data class="user-header-cont-name" lang="zh_CN" type="nickName"></open-data> -->
						<!-- 会员等级 -->
						<view v-if="userInfo.grade_id > 0 && userInfo.grade"
							class="user-header-grade dis-flex flex-y-center">
							<view class="user-grade_icon">
								<image lazy-load src="/static/images/grade_icon.png"></image>
							</view>
							<view class="user-grade_name">
								<text>{{ userInfo.grade.name }}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 未登录 -->
				<view v-else class="user-header-cont" @tap.stop="onLogin">
					<view class="user-header-avatar">
						<image lazy-load src="/static/images/default-avatar.jpg"></image>
					</view>
					<view class="user-header-cont-name" :style="'color:'+memberBgImg[member].topColor">点击登录</view>
				</view>
				<view class="myShop" @tap="toOpenAshop" v-if="isLogin">
					<text class="iconfont2 icon-Offlinestores"></text>
					我的店铺
				</view>
			</view>
			<!-- 会员（店主） -->
			<view v-if="isLogin&&(store_is_super==1)" class="memberBox" @tap.stop="toMember">
				<!-- <image class="memberBgImg" :src="memberBgImg[member].img"></image>
      <view class="memberText dis-flex flex-y-end flex-x-between">
        <view class="memberTit f-w-300">
          <image v-if="isiOS" :src="memberBgImg[member].iconIos" mode="widthFix"></image>
          <image v-else :src="memberBgImg[member].icon" mode="widthFix"></image>
        </view>
        <view class="memberDate f-28" :style="{color: memberBgImg[member].color}" v-if="vip_expire!=''&&member>1">{{vip_expire}}到期</view>
        <view class="buyMember" :style="{color: memberBgImg[member].tipColor, background: memberBgImg[member].tipBgColor}">
          {{memberBgImg[member].tipText}}
        </view>
      </view> -->
				<!-- <view class="member_power dis-flex flex-wrap">
        <view class="f-24" v-for="(vo,i) in memberBgImg[member].member_power" :key="i" :style="{color: memberBgImg[member].color}">
          <text :style="vo.isUse?'':memberBgImg[member].noUseStyle"><text :class="'iconfont2 f-24 m-r-10 '+vo.icon"></text>{{vo.title}}</text>
          
        </view>
      </view> -->
			</view>
			<!-- 店铺信息（无店铺/有店铺是店员） -->
			<view v-else class="memberBox memberBox2" @tap.stop="toOpenAshop">
				<!-- <image class="memberBgImg" src="https://pic.kaidanxia.com/2021-03-11/134236e77e65590.png"></image>
		  <view class="memberText dis-flex flex-y-end flex-x-between">
		    <view class="memberTitle onelist-hidden flex-box">
					{{isLogin&&(store_is_super==0)?store.name+'·店员':'我要开店'}}
				</view>
		    <view class="buyMember buyMember2" v-if="store_is_super==-1">立即开店</view>
		  </view> -->
			</view>
		</view>
		<!-- <view class="main" :style="'transform: translateY(-' + tansY + 'px)'" @touchstart="start" @touchmove="move" @touchend="end"> -->
		<view class="main">
			<!-- 订单导航栏 -->
			<!-- <view class="hudu"><image src="http://pic.kaidanxia.com/2020-07-29/20200729152147339dc8173.png" mode="widthFix"></image></view> -->
			<view class="order-navbar bgf">
				<view class="order-navbar-footer dis-flex">
					<template v-for="(item,index) in orderNavbar">
						<view class="order-navbar-item flex-box" :key="index" @tap.stop="onTargetOrder(item)">
							<view class="imgBox dis-flex flex-y-center">
								<text class="order-navbar__icon iconfont2" :class="item.icon"></text>
							</view>
							<text class="order-navbar__name">{{item.text}}</text>
							<text class="order-badge" v-if="orderCount[item.type] > 0">{{orderCount[item.type]}}</text>
						</view>
					</template>
				</view>
			</view>
			<!-- 菜单列表 -->
			<view class="menus-list pad_lr30">
				<view class="tipsBox" @tap.stop="showIncrement"><text class="iconfont2 icon-xingzhuang f-26"
						style="margin-right:6rpx"></text>立即关注开单虾公众号，及时接收订单信息等相关推送消息。</view>
				<view class="withdrawal" @tap.stop="toWithdrawal">
					<image lazy-load mode="aspectFill"
						src="https://pic.kaidanxia.com/2020-09-03/20200903191409354cd3247.gif"></image>
				</view>
				<view style="width:100%" class="dis-flex flex-wrap" v-for="(items, indexs) in menus" :key="indexs">
					<view class="menus-title col-3 f-32 f-w"><text>{{items.module}}</text></view>
					<view class="menus" v-for="(item, index) in items.items" :style="{width: 100/items.row_num+'%'}"
						:key="index" v-if="item.is_active && item.is_active == 1">
						<button @tap.stop="onTargetMenus(item)" class="btn-normal">
							<view class="imgBox dis-flex flex-y-center flex-x-center">
								<text class="iconfont2" :class="item.icon" :style="{color: item.active_color}"></text>
							</view>
							<text v-if="item.is_notice" class="redDot"></text>
							<view class="menus-item__left">
								<text class="menus-item__name f-26 col-6">{{ item.alias }}</text>
							</view>
							<!-- #ifdef MP-WEIXIN -->
							<template v-if="item.name == 'Officialcustomerservice' && showQun">
								<cell class="kefu_cell" :plugid='plugid' @completemessage="completemessage" />
							</template>
							<!-- #endif -->
						</button>
					</view>
				</view>
			</view>
		</view>
		<view v-show="isLoading">
			<loading></loading>
		</view>
		<!-- 自定义tabbar -->
		<foot-tabBar ref="footTabBar" dIndex='3' :homeStyle="homeStyle"></foot-tabBar>
		<share-bottom ref="shareBottom" pageType="userIndex"></share-bottom>
		<popup-tips ref="popupTips0" title="提示" content="请选择联系方式" confirmText="二维码" concelText="手机号"></popup-tips>
		<popup-tips ref="popupTips" :title="title" :content="content" confirmText="拨打" @tipsCallback="tipsCallback">
		</popup-tips>
		<popup-wx ref="popupWx"></popup-wx>
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import footTabBar from '@/components/foot-tabBar';
	import loading from '@/components/loading';
	import shareBottom from '@/components/share-bottom/index';
	import popupTips from '@/components/popup-tips/index';
	import popupWx from '@/components/popup-wx/index';


	export default {
		data() {
			return {
				member: '0',
				isLoading: true,
				memberBgImg: {
					0: {
						img: 'https://pic.kaidanxia.com/2020-10-15/1731130a8317416.png',
						text: '虾米' + App.member,
						icon: 'http://pic.kaidanxia.com/2020-07-31/20200731113046364285493.png',
						iconIos: 'http://pic.kaidanxia.com/2020-08-05/20200805195449884f79216.png',
						tipText: '立即领取',
						color: '#666666',
						tipColor: '#FFF5EA',
						tipBgColor: '#666666',
						topBgColor: 'linear-gradient(275deg,rgba(129,129,129,1) 0%,rgba(74,74,74,1) 100%)',
						topColor: '#fff',
					},
					1: {
						img: 'https://pic.kaidanxia.com/2020-10-15/1731130a8317416.png',
						text: '虾米' + App.member,
						icon: 'http://pic.kaidanxia.com/2020-07-31/20200731113046364285493.png',
						iconIos: 'http://pic.kaidanxia.com/2020-08-05/20200805195449884f79216.png',
						tipText: '立即查看',
						color: '#666666',
						tipColor: '#FFF5EA',
						tipBgColor: '#666666',
						topBgColor: 'linear-gradient(275deg,rgba(129,129,129,1) 0%,rgba(74,74,74,1) 100%)',
						topColor: '#fff',
						member_power: [{
								icon: 'icon-Merchandising',
								title: '商品管理',
								isUse: true
							}, {
								icon: 'icon-roam',
								title: '订单流转',
								isUse: true
							}, {
								icon: 'icon-data',
								title: '数据汇总',
								isUse: true
							},
							// {icon:'icon-glanceover',title:'浏览轨迹',isUse: false},{icon:'icon-retailstore',title:'发展渠道',isUse: false,},
						],
						noUseStyle: 'color:#fff;background:linear-gradient(306deg, rgba(114,113,113,1) 0%, rgba(105,105,105,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
					},
					2: {
						img: 'https://pic.kaidanxia.com/2020-10-15/173113e04505105.png',
						text: '明虾' + App.member,
						icon: 'http://pic.kaidanxia.com/2020-07-31/20200731113045279190420.png',
						iconIos: 'http://pic.kaidanxia.com/2020-08-05/202008051954507c3a34541.png',
						tipText: '立即查看',
						color: '#6D4922',
						tipColor: '#FFF5EA',
						tipBgColor: '#6D4922',
						topBgColor: 'linear-gradient(275deg,rgba(129,129,129,1) 0%,rgba(74,74,74,1) 100%)',
						topColor: '#fff',
						member_power: [{
								icon: 'icon-Merchandising',
								title: '商品管理',
								isUse: true
							}, {
								icon: 'icon-roam',
								title: '订单流转',
								isUse: true
							}, {
								icon: 'icon-data',
								title: '数据汇总',
								isUse: true
							}, {
								icon: 'icon-glanceover',
								title: '浏览轨迹',
								isUse: true
							},
							// {icon:'icon-retailstore',title:'发展渠道',isUse: false,},
						],
						noUseStyle: 'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
					},
					3: {
						img: 'https://pic.kaidanxia.com/2020-10-15/173113e04505105.png',
						text: '明虾' + App.member,
						icon: 'http://pic.kaidanxia.com/2020-07-31/20200731113045279190420.png',
						iconIos: 'http://pic.kaidanxia.com/2020-08-05/202008051954507c3a34541.png',
						tipText: '立即查看',
						color: '#6D4922',
						tipColor: '#FFF5EA',
						tipBgColor: '#6D4922',
						topBgColor: 'linear-gradient(275deg,rgba(129,129,129,1) 0%,rgba(74,74,74,1) 100%)',
						topColor: '#fff',
						member_power: [{
								icon: 'icon-Merchandising',
								title: '商品管理',
								isUse: true
							}, {
								icon: 'icon-roam',
								title: '订单流转',
								isUse: true
							}, {
								icon: 'icon-data',
								title: '数据汇总',
								isUse: true
							}, {
								icon: 'icon-glanceover',
								title: '浏览轨迹',
								isUse: true
							},
							// {icon:'icon-retailstore',title:'发展渠道',isUse: false,},
						],
						noUseStyle: 'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
					},
					4: {
						img: 'https://pic.kaidanxia.com/2020-10-15/1731148560d7340.png',
						text: '龙虾' + App.member,
						icon: 'http://pic.kaidanxia.com/2020-07-31/20200731113046b10e60526.png',
						iconIos: 'http://pic.kaidanxia.com/2020-08-05/20200805195451c81036633.png',
						tipText: '立即查看',
						color: '#FFE3C1',
						tipColor: '#FFF5EA',
						tipBgColor: '#6D4922',
						topBgColor: '#fff',
						topColor: '#333',
						topBgColor: 'linear-gradient(275deg,rgba(129,129,129,1) 0%,rgba(74,74,74,1) 100%)',
						topColor: '#fff',
						member_power: [{
							icon: 'icon-Merchandising',
							title: '商品管理',
							isUse: true
						}, {
							icon: 'icon-roam',
							title: '订单流转',
							isUse: true
						}, {
							icon: 'icon-data',
							title: '数据汇总',
							isUse: true
						}, {
							icon: 'icon-glanceover',
							title: '浏览轨迹',
							isUse: true
						}, {
							icon: 'icon-retailstore',
							title: '发展渠道',
							isUse: true,
						}, ],
						noUseStyle: 'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
					},
					5: {
						img: 'https://pic.kaidanxia.com/2020-10-15/1731148560d7340.png',
						text: '龙虾' + App.member,
						icon: 'http://pic.kaidanxia.com/2020-07-31/20200731113046b10e60526.png',
						tipText: '立即查看',
						color: '#FFE3C1',
						tipColor: '#FFF5EA',
						tipBgColor: '#6D4922',
						topBgColor: '#fff',
						topColor: '#333',
						topBgColor: 'linear-gradient(275deg,rgba(129,129,129,1) 0%,rgba(74,74,74,1) 100%)',
						topColor: '#fff',
						member_power: [{
							icon: 'icon-Merchandising',
							title: '商品管理',
							isUse: true
						}, {
							icon: 'icon-roam',
							title: '订单流转',
							isUse: true
						}, {
							icon: 'icon-data',
							title: '数据汇总',
							isUse: true
						}, {
							icon: 'icon-glanceover',
							title: '浏览轨迹',
							isUse: true
						}, {
							icon: 'icon-retailstore',
							title: '发展渠道',
							isUse: true,
						}, ],
						noUseStyle: 'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
					}
				},
				vip_expire: '',
				setting: {},
				menus: [],
				isLogin: false,
				userInfo: {},
				store: {}, //店铺信息
				store_is_super: -1,
				// 用户信息
				orderNavbar: [{
						type: 'all',
						url: '/pages/order/index?type=all',
						icon: 'icon-Allorders',
						text: '全部订单'
					},
					{
						type: 'payment',
						url: '/pages/order/index?type=payment',
						icon: 'icon-Tobepaid',
						text: '待付款'
					},
					{
						type: 'delivery',
						url: '/pages/order/index?type=delivery',
						icon: 'icon-Goodstobereceived',
						text: '待收货'
					},
					{
						type: 'refund',
						url: '/pages/order/refund/index',
						icon: 'icon-refund',
						text: '退款/售后'
					}
				],
				orderCount: {}, // 订单数量

				mtitle: '',
				mcontent: '',
				tansH: 140,
				tansY: 140,
				cY: '', //起始top
				// animationData: {},
				qrcode: '',
				title: '',
				content: '',
				isiOS: false, //是否为iOS
				homeStyle: '',
				plugid: 'eab421e2efa432619dfd8d674719d81d',
				showQun: true, //是否显示店主群
			};
		},

		components: {
			'foot-tabBar': footTabBar,
			loading,
			shareBottom,
			popupTips,
			popupWx
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			let that = this;
			that.$nextTick(() => {
				that.getTansH();
			})
			// #ifdef MP-WEIXIN || APP-PLUS
			wx.getSystemInfo({
				success: function success(res) {
					var ios = !!(res.system.toLowerCase().search('ios') + 1);
					that.isiOS = ios;
				}
			});
			// #endif
			// #ifndef MP-WEIXIN || APP-PLUS

			let u = navigator.userAgent;
			let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			that.isiOS = isiOS;
			// #endif
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// this.isLoading = true;
			this.homeStyle = App.homeStyle ? App.homeStyle : 'div';
			this.isLogin = App.checkIsLogin()

			this.showQun = true;
			// 获取当前用户信息
			this.getUserDetail();
			// 初始化一个动画
			// var animation = uni.createAnimation({
			// 		duration: 300,
			// 		transformOrigin: "50% 50% 0",
			// 		timingFunction: 'cubic-bezier(.215,.61,.355,1)',
			// })
			// this.animation = animation;
		},

		methods: {
			showIncrement() {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/user/otherPage/index?url=https://mp.weixin.qq.com/s/m3zeAgj2E3VqF7w5k-HfwQ'
				});
				// #endif
				// #ifndef MP-WEIXIN
				this.$refs.popupWx.open()
				// #endif
			},
			toWithdrawal() {
				uni.navigateTo({
					url: '/pages/user/member/invite/index'
				});
			},
			toInfo() {
				uni.navigateTo({
					url: '/pages/user/myinfo/index'
				});
			},
			/**
			 * 获取当前用户信息
			 */
			getUserDetail() {
				App._get('user.index/detail', {}, (result) => {
					if (result.code == '1') {

						this.menus = result.data.menus || []
						this.setting = result.data.setting
						this.orderCount = result.data.orderCount
						this.userInfo = result.data.userInfo;
						this.store = result.data.store || {}; //店铺信息
						// 店铺信息
						if (result.data.store) {
							let store = result.data.store;
							if (JSON.stringify(store) == "{}") {
								this.store_is_super = -1; //未登录/没有店铺
							} else if (JSON.stringify(store.salesclerk) == "{}") {
								this.store_is_super = 1; //店主
							} else {
								this.store_is_super = 0; //店员
							}
						}
						this.vip_expire = result.data.userInfo.vip_expire ? result.data.userInfo.vip_expire.slice(
							0, 11) : '';
						this.member = this.userInfo.vip || '0'
						if (!this.userInfo) {
							this.isLogin = false
						} else {
							if (!this.isLogin) {
								this.isLogin = App.checkIsLogin()
							}
						}
						this.$nextTick(() => {
							this.isLoading = false
						})
					}
				});
			},
			/**
			 * 订单导航跳转
			 */
			onTargetOrder(item) {
				let _this = this;

				if (!_this.onCheckLogin()) {
					return false;
				}

				// 转跳指定的页面
				uni.navigateTo({
					url: item.url
				});
			},

			/**
			 * 菜单列表导航跳转
			 */
			onTargetMenus(item) {
				let that = this;
				if (!that.onCheckLogin()) {
					return false;
				}
				if (item.name == 'Officialcustomerservice') {
					// that.$refs.popupTips0.open(()=>{
					// 	that.qrcode = 'http://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png';
					// 	that.$refs.shareBottom._popupShowImg('下载',that.qrcode)
					// },()=>{
					// 	that.official();
					// })
					// #ifndef MP-WEIXIN
					that.qrcode = 'https://pic.kaidanxia.com/2020-12-23/1518452c0af7367.png';
					that.$refs.shareBottom._popupShowImg('下载', that.qrcode)
					// #endif
				} else if (item.page && item.page != '') {
					uni.navigateTo({
						url: item.page
					});
				}
			},
			//
			official() {
				this.title = '官方电话'
				this.content = '021-54321599'
				this.$refs.popupTips.open()
			},
			//拨打电话
			tipsCallback() {
				uni.makePhoneCall({
					phoneNumber: this.content
				})
			},
			completemessage(e) {
				if (e.detail.errcode == 0) {
					this.mtitle = '申请成功';
					this.mcontent = '请打开微信,点击通知信息链接,即可加入';
					this.showQun = false;
					this.$refs.popupTips.open(() => {});
				}
			},
			/**
			 * 跳转积分明细页
			 */
			onTargetPoints(e) {
				let _this = this;

				if (!_this.onCheckLogin()) {
					return false;
				} // 记录formId


				App.saveFormId(e.detail.formId);
				uni.navigateTo({
					url: '../points/log/index'
				});
			},

			/**
			 * 跳转到登录页
			 */
			onLogin() {
				// uni.navigateTo({
				//   url: '../login/login',
				// });
				App.doLogin(2, () => {
					this.getUserDetail()
				});
			},

			/**
			 * 验证是否已登录
			 */
			onCheckLogin() {
				let _this = this;

				if (!_this.isLogin) {
					App.showError('很抱歉，您还没有登录');
					return false;
				}

				return true;
			},
			toMember() {
				App.toMember()
			},
			//
			getTansH() {
				const that = this;
				const query = uni.createSelectorQuery();
				query.select('.memberBgImg').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let tansH = res[0].height;
					that.tansH = tansH;
					that.tansY = tansH - tansH * 0.2;
					// let systemInfo = wx.getSystemInfoSync(),
					//     rpx = systemInfo.windowWidth / 750,
					//     // 计算rpx
					// tapHeight = Math.floor(rpx * 80); // swiper高度
					// uni.getSystemInfo({
					// 	success: function(systemInfo) {
					// 		let winHeight = systemInfo.windowHeight;
					// 		let barHeight = winHeight -  - res[0].height;
					// 		that.winHeight = winHeight - res[0].height;// - 60底部
					// 		that.indexBarHeight = barHeight;
					// 		that.indexBarItemHeight = barHeight / 25;
					// 		// that.indexBarItemHeight = 25 * that.list.length;
					// 		that.titleHeight = uni.upx2px(128) + res[0].height;
					// 	}
					// });
				});
			},
			//下滑动画
			start(e) {
				// this.animation = {};
				// this.animationData = {};
				this.cY = e.touches[0].clientY;
			},
			move(e) {
				let cY2 = parseInt(e.touches[0].clientY) - this.cY;
				let height = this.tansH - this.tansH * 0.2
				if (cY2 > 0) {
					if (cY2 >= height) {
						cY2 = this.tansH - this.tansH * 0.3;
					}
					let hY = height - cY2;
					this.$nextTick(() => {
						this.tansY = hY;
					});
				}
			},
			end(e) {
				let height = this.tansH - this.tansH * 0.2;
				if (this.tansY < height) {
					setTimeout(() => {
						this.tansY = height;
					}, 0)
					setTimeout(() => {
						this.tansY = this.tansH - this.tansH * 0.25;
					}, 350)
					setTimeout(() => {
						this.tansY = height;
					}, 450)
				}
				// 定义动画内容
				// setTimeout(function() {
				// 	this.animation.translateY(-140).step()
				// 	// 导出动画数据传递给data层
				// 	this.animationData = this.animation.export();
				// }.bind(this), 0)
				// setTimeout(function() {
				// 	this.animation.translateY(-130).step()
				// 	this.animationData = this.animation.export()
				// }.bind(this), 350)
				// setTimeout(function() {
				// 	this.animation.translateY(-140).step()
				// 	this.animationData = this.animation.export();
				// }.bind(this), 450)
			},
			// 立即开店
			toOpenAshop() {
				if (!this.isLogin) {
					this.onLogin()
				} else if (this.isLogin) {
					uni.navigateTo({
						url: '/pages/retailShop/index'
					})
				}
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
