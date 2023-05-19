<template>
	<view class="min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar lLidth="width:60rpx" centerAlign="justify-content: flex-start;" extClass="nav" isHelpme>
			  <view slot="center" class="left-title onelist-hidden t-l">赚钱店小二</view>
		</navigationBar>
		<div class="boxPad">
			<view class="nameBox dis-flex">
				<view class="imgBox">
					<image :src="user.avatar || '/static/images/defaultImg.png'" alt=""></image>
				</view>
				<div class="empty"></div>
				<view class="info dis-flex flex-y-center">
					<div class="infoBox">
						<view class="title">
							<text>{{user.name || '用户昵称'}}</text>
							<text class="mark" @tap="toDetail">
								{{user.level || '初级店小二'}}
								<text class="iconfont2 icon-shangjiantou"></text>
							</text>
						</view>
					</div>
				</view>
			</view>
			<div class="moneyCard">
				<view class="bgImg">
					<image src="https://pic.kaidanxia.com/2020-12-11/111943bda3e3866.png" mode="aspectFit"></image>
				</view>
				<div class="dis-flex flex-y-center">
					<div class="moneyBox m-r-60">
						<div class="moneyTitle" @tap="showTips(1)">未结算金额(元)
							<text class="iconfont2 icon-questionmark"></text>
						</div>
						<div class="money">{{user.pending || '0.00'}}</div>
					</div>
					<div class="moneyBox">
						<div class="moneyTitle">可提现金额(元)</div>
						<div class="money">{{user.available_money || '0.00'}}</div>
					</div>
				</div>
				<div class="moneyTip">
					<text class="iconfont2 icon-jingshi"></text>可提现金额为所有店铺可提现金额之和
				</div>
				<div class="toGetMoney" @tap="toGetMoney">去提现<text class="iconfont2 icon-shangjiantou"></text></div>
			</div>
			<view class="shopBox">
				<view class="dis-flex flex-y-center">
					<view class="imgBox">
						<image :src="wxapp.logo || '/static/images/defaultImg.png'" alt=""></image>
					</view>
					<div class="empty"></div>
					<view class="info dis-flex flex-y-center">
						<view>
							<div class="infoBox dis-flex flex-y-center">
								<view class="title">
									<text>{{wxapp.name || '店铺昵称'}}</text>
								</view>
								<view class="noUse" @tap="showTips(2)" v-if="wxapp.is_disable">
									已禁用
								</view>
							</div>
							<view v-if="!is_shared" class="closeTip">
								<text class="iconfont2 icon-jingshi"></text>该商家已关闭分享赚钱功能
							</view>
						</view>
					</view>
				</view>
				<div class="changeShop" @tap="changeShop">
					切换店铺
					<text class="iconfont2 icon-switch f-26" style="margin-left: 8rpx"></text>
				</div>
			</view>
			<div class="dataBox">
				<div class="dataList dis-flex flex-y-center">
					<div class="dataItem" @tap="toProfitList(true)">
						<div class="dataTitle">今日收益(元)</div>
						<div class="dataNum">{{numData.today_commission || '0.00'}}</div>
					</div>
					<div class="dataLine"></div>
					<div class="dataItem" @tap="toProfitList(false)">
						<div class="dataTitle">总收益(元)</div>
						<div class="dataNum">{{numData.total_commission || '0.00'}}</div>
					</div>
				</div>
				<div v-show="showMore">
					<div class="dataList dis-flex flex-y-center">
						<div class="dataItem" @tap="toOrder('today')">
							<div class="dataTitle">今日推广订单</div>
							<div class="dataNum">{{numData.today_order || '0'}}</div>
						</div>
						<div class="dataLine"></div>
						<div class="dataItem" @tap="toOrder">
							<div class="dataTitle">累计推广订单</div>
							<div class="dataNum">{{numData.total_order || '0'}}</div>
						</div>
					</div>
					<div class="dataList dis-flex flex-y-center">
						<div class="dataItem" @tap="toClients('today')">
							<div class="dataTitle">今日新增客户</div>
							<div class="dataNum">{{numData.today_clientele || '0'}}</div>
						</div>
						<div class="dataLine"></div>
						<div class="dataItem" @tap="toClients">
							<div class="dataTitle">累计客户</div>
							<div class="dataNum">{{numData.total_clientele || '0'}}</div>
						</div>
					</div>
				</div>
				<view class="showMore" @tap="showMoreLink">
					<text class="iconfont2" :class="showMore ? 'icon-shuangjiantou-shang' : 'icon-jiantou-xia'"></text>
				</view>
			</div>
			<view class="noticeList" @tap="toSalesGuidance">
				<view class="diy-notice bgf dis-flex flex-y-center flex-x-between f-26 col-3">
					<view class="title m-r-20"><text class="iconfont2 icon-Notice1 f-28"></text></view>
					<view class="flex-box">
						<swiper vertical autoplay circular interval="3000" class="tui-swiper">
							<swiper-item v-for="(item,index) in noticeList" :key="index" class="tui-swiper-item">
								<view class="tui-news-item f-24 col-3">{{item.article_title}}</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="moreNotice">
						<text class="iconfont2 icon-gengduobeifen2 f-24"></text>
					</view>
				</view>
			</view>
			<view class="shareBox">
				<view class="shareTitle">
					推广卖货
				</view>
				<view class="shareList">
					<view class="shareItem dis-flex flex-y-center">
						<view class="shareIcon dis-flex flex-y-center  flex-x-center">
							<image src="https://pic.kaidanxia.com/2020-12-11/1119441aef70034.png" mode="aspectFit"></image>
						</view>
						<view class="shareContent share_b dis-flex flex-y-center flex-x-between">
							<view>
								推广商品
							</view>
							<view class="shareBut" @tap="toShareGoods">
								去推广
							</view>
						</view>
					</view>
					<view class="shareItem dis-flex flex-y-center" @tap="toShareImg">
						<view class="shareIcon dis-flex flex-y-center  flex-x-center">
							<image src="https://pic.kaidanxia.com/2020-12-11/111944680af4712.png" mode="aspectFit"></image>
						</view>
						<view class="shareContent dis-flex flex-y-center flex-x-between">
							<view>
								分享赚钱
							</view>
							<view class="shareBut" @tap="toShareImg">
								去分享
							</view>
						</view>
					</view>
				</view>
			</view>
		</div>
		<popup-tips ref="popupTips" :title="tipsTitle" :content="tipsContent" :confirmText="confirmText" :showConcle="false"></popup-tips>
		
		<tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
			<view class="tui-drawer-box">
				<!-- #ifdef MP-WEIXIN || APP-PLUS -->
				<div class="topSpan" id="topSpan"></div>
				<!-- #endif -->
				<view class="drawerTitle">
					切换店铺
				</view>
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH + 'px'}">
					<div>
						<view class="drawerList">
							<view class="drawerItem" v-for="(item, index) in drawerList" :class="index == drawerActive ? 'drawerActiveItem' : ''" :key="index" @tap="selectShop(index)">
								<view class="dis-flex flex-y-center">
									<view class="shopImg">
										<image :src="item.wxapp.logo" mode="aspectFill"></image>
									</view>
									<view class="drawerShopName">
										{{item.wxapp.name}}
									</view>
								</view>
								<view class="drawerItemContent dis-flex flex-y-center flex-x-between">
									<view>
										<view class="drawerItemTitle">
											成交额(元)
										</view>
										<view class="drawerItemNum">
											{{item.sale_total}}
										</view>
									</view>
									<view class="drawerLine"></view>
									<view>
										<view class="drawerItemTitle">
											收益(元)
										</view>
										<view class="drawerItemNum">
											{{item.profit_total}}
										</view>
									</view>
									<view class="drawerLine"></view>
									<view>
										<view class="drawerItemTitle">
											订单数
										</view>
										<view class="drawerItemNum">
											{{item.order_total}}
										</view>
									</view>
								</view>
								<text v-if="index == drawerActive" class="checkIcon iconfont2 icon-choice1"></text>
							</view>
						</view>
					</div>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover" :hover-stay-time="150" @tap="closeDrawer()">取消</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150" @tap="submit()">确定</view>
					</view>
				</view>
			</view>
		</tui-drawer>
		<!-- <popup-input ref="popupInput" inputType="text" title="绑定提现账号" placeholder="请输入支付宝帐号" tips="该账号为支付宝提现账号，绑定后不可更改，请确认后再绑定！"></popup-input> -->
		<view v-show="showShareImg" >
			<view class="shareImgFixed dis-flex flex-y-center flex-x-center" @tap="closeShareImg">
				<view class="shareImgBox" @tap.stop>
					<swiper @change="setCurrent" class="swiperBox" previous-margin="75rpx" next-margin="30rpx">
						<swiper-item class="swiperItem" v-for="(item, index) in shareImgs" :key="index">
							<image :src="item" mode="aspectFit"></image>
						</swiper-item>
					</swiper>
					<view class="close" @tap="closeShareImg">
						<text class="iconfont2 icon-blacklist"></text>
					</view>
					<view class="shareBut" @tap="upload">
						保存图片
					</view>
				</view>
			</view>
		</view>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
  	<contact ref="contact"></contact>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	import downloadFile from '@/components/download-file';
	import popupTips from '@/components/popup-tips/index';
	// import popupInput from '@/components/popup-input/index';
 	import contact from '@/components/myGoodsCommon/contact/index';
	import { objForEach } from '../../utils/util';
	import guidePage from '@/components/guide-page';
	const app = getApp().globalData;
	export default {
		components: {
			popupTips,
			downloadFile,
			// popupInput,
			contact,
			guidePage
		},
		data() {
			return {
				showShareImg: false,
				store_wxapp_id: '',
				drawerActive: 0,
				drawerList: [],
				drawer: false,
				drawerH: 0,
				user: {},
				numData: {},
				is_shared: true,
				confirmText: '我知道了',
				tipsTitle: '',
				tipsContent: '',
				noticeList: [],
				showMore: false,
				
				wxapp: {},
				logo: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eriaibVfpicXgLfxBDRxO8coVCPFaZzuX5CujrcE4VASicp3ARhfgp0iaPbGAd1vdg2CVTC1I8aibYAQbIw/132',
				name: '白萝卜白白',
				nameTip: '女装示例店铺',
				shareImg: '',
				shareImgs: []
			}
		},
		mounted: function(options) {
			uni.getSystemInfo({
				success: res => {
		            let height = 100
		            // #ifdef MP-WEIXIN || APP-PLUS
		            height += 100
		            // #endif
					this.drawerH = res.windowHeight - uni.upx2px(height + 136);
				}
			});
		},
		onLoad(options) {
			this.store_wxapp_id = options.store_wxapp_id || app.wxapp_id
		},
		onShow() {
			this.getData()
		},
		methods: {
			setCurrent(e) {
				let curIdx = e.detail.current;
				this.shareImg = this.shareImgs[curIdx]
			},
			// 点击下载
			upload(){
				let files = this.shareImg || ''
				if (files.length == 0) {
					return false
				}
				const that = this;
				let uploads = [];
				uploads.push(files)
				that.$refs.download._downloadFileS(uploads);

			},
			//下载回调
			comfirmStatusS (promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res?"保存成功~":'取消保存')
				})
			},
			toShareImg() {
				if (this.is_shared == false) {
					this.$api.msg('该商家已关闭分享赚钱功能！')
					return
				}
				if (this.wxapp.disabled == 1) {
					this.$api.msg('您已被该商家禁用，暂不能进行分享赚钱操作！')
					return
				}
				if (this.shareImgs.length == 0) {
					this.$api.msg('未获取到店铺图片')
					return
				}
				this.showShareImg = true
			},
			closeShareImg() {
				this.showShareImg = false
			},
			getData() {
				let data = {}
				if (this.store_wxapp_id != '') {
					data.store_wxapp_id = this.store_wxapp_id
				}
				app._get('share.make_money/detail', data, (result) => {
					if (result.code == 1) {
						this.noticeList = result.data.guides || []
						this.drawerList = result.data.all_wxapp || []
						this.user = result.data.user || {}
						this.numData = result.data.detail || {}
						this.wxapp = result.data.wxapp || {}
						this.is_shared = this.wxapp.is_shared == 1 ? true : false
						this.store_wxapp_id = this.wxapp.wxapp_id
						this.getWxappPoster()
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			getWxappPoster(){
				app._get('wxapp/getWxappPoster', {
					store_wxapp_id: this.store_wxapp_id
				}, (result) => {
					if (result.code == 1) {
						let qrcode = result.data.qrcode || []
						this.shareImgs = qrcode
						this.shareImg = qrcode[0] || ''
					} else {
						this.shareImgs = []
						this.shareImg = ''
						this.$api.msg(result.msg)
					}
				})
			},
			back() {
				uni.navigateBack()
			},
			toDetail() {
				uni.navigateTo({
					url: '/pages/makeMoney/detail/index?wxapp_id=' + this.store_wxapp_id
				})
			},
			toProfitList(is_today) {
				let url = '/pages/makeMoney/withdrawal/profitList/detail/index?seller_wxapp_id=' + this.store_wxapp_id
				if (is_today) {
					url += '&is_today=1'
				}
				uni.navigateTo({
					url: url
				})
			},
			toOrder(type) {
				let url = '/pages/makeMoney/order/list/index?store_id=' + this.store_wxapp_id
				if (type == 'today') {
					url += '&date=0'
				}
				uni.navigateTo({
					url: url
				})
			},
			selectShop(index) {
				this.drawerActive = index
			},
			changeShop() {
				this.drawer = true
			},
			submit() {
				let item = this.drawerList[this.drawerActive] || {}
				if (item.wxapp_id && item.wxapp_id != this.store_wxapp_id) {
					this.store_wxapp_id = item.wxapp_id
					this.getData()
				}
				this.drawer = false
			},
			closeDrawer() {
				this.drawer = false
			},
			toSalesGuidance() {
				uni.navigateTo({
					url: '/pages/makeMoney/salesGuidance/list/index'
				})
			},
			toClients(type) {
				let url = '/pages/makeMoney/myClients/index?store_id=' + this.store_wxapp_id
				if (type == 'today') {
					url += '&date=0'
				}
				uni.navigateTo({
					url: url
				})
			},
			toGetMoney() {
				if (this.user.withdraw_account && this.user.withdraw_account != '') {
					uni.navigateTo({
						url: '/pages/makeMoney/withdrawal/index?store_wxapp_id=' +  + this.store_wxapp_id
					})
				} else {
					uni.navigateTo({
						url: '/pages/user/qrcodeWithdrawal/index'
					})
					// this.$refs.popupInput._open('', (val) => {
					// 	if (val == '') {
					// 		this.$api.msg('提现账号不能为空。')
					// 		return
					// 	}
					// 	app._post_form('share.withdraw/setAccount', {
					// 		withdraw_account: val
					// 	}, (result) => {
					// 		if (result.code == 1) {
					// 			this.$api.msg(result.msg)
					// 			uni.navigateTo({
					// 				url: '/pages/makeMoney/withdrawal/index'
					// 			})
					// 		} else {
					// 			this.$api.msg(result.msg)
					// 		}
					// 	})
					// })
				}
			},
			toShareGoods() {
				if (this.is_shared == false) {
					this.$api.msg('该商家已关闭分享赚钱功能！')
					return
				}
				if (this.wxapp.disabled == 1) {
					this.$api.msg('您已被该商家禁用，暂不能进行分享赚钱操作！')
					return
				}
				uni.navigateTo({
					url: '/pages/makeMoney/spreadGoods/list?store_id=' + this.store_wxapp_id
				})
			},
			showTips(type) {
				let next = null
				if (type == 1) {
					this.confirmText = '我知道了'
					this.tipsTitle = '未结算金额'
					this.tipsContent = '待订单确认收货后可提现'
				} else if (type == 2) {
					this.confirmText = '联系Ta'
					this.tipsTitle = '提示'
					this.tipsContent = '商家已限制您的分享赚钱功能，将不再进行新的收益结算。'
					next = () => {
						let obj = {
							service_qrcode: this.wxapp.service_qrcode || ''
						}
						obj = Object.assign(obj, this.wxapp.contact)
			 			this.$refs.contact.open(obj)
					}
				}
				this.$refs.popupTips.open(next)
			},
			showMoreLink() {
				this.showMore = !this.showMore
			},
			
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
