<template>
	<scroll-view class="retailShop container" scroll-y @scroll="scroll" ref="retailShop" :scroll-top="scrollTop">
		<navigationBar title="我的店铺" extClass="nav" id="top"></navigationBar>
		<div :style="{filter: maskBoxShow ?  'blur(' + filterVal + 'rpx)' : '', '-webkit-filter': maskBoxShow ?  'blur(' + filterVal + 'rpx)' : ''}">
			<div class="navBox" :style="{opacity: opacity}">
				<navigationBar id="top" :back="false" title="我的店铺" background="linear-gradient(232deg,rgba(245,91,91,1) 0%,rgba(232,46,46,1) 100%)"
				 color="white" isHelpme helpmeColor="#fff">
					<view slot="left" class="navLeft">
						<text @tap.stop="shareShop">
							<text class="iconfont2 icon-share2"></text>分享
						</text>
					</view>
				</navigationBar>
			</div>
			<!-- 气泡 -->
			<!-- #ifdef MP-WEIXIN -->
			<tui-bubble-popup direction="top" :top="topHeight+48 + 'px'" right="84rpx" :mask="false" :show="showBubble" triangleTop="-20rpx" triangleRight="60rpx" borderWidth="14rpx 14rpx" width="520rpx" radius="12rpx" :flexEnd="true" backgroundColor="#2A2A30">
				<view class="tui-chat-text f-26">
					<text class="flex-box">添加到我的小程序，下次使用更方便</text>
					<view class="iconfont2 icon-shanchu1 f-28 m-l-10 oh" @tap="clickBubble(2)"></view>
				</view>
			</tui-bubble-popup>
			<!-- #endif -->
			<view class="bgBox">
				<view class="bg">
					<image src="https://pic.kaidanxia.com/2020-11-19/1104113bf1e5540.png"></image>
				</view>
				<view class="contentBox">
					<!-- <view class="titleBox pdBox" @tap.stop="back" :style="{'margin-top': topHeight + 'px'}">
						<text class="iconfont2 icon-fanhui"></text>
					</view> -->
					<!-- <view class="titleBox pdBox" @tap.stop="shareShop" :style="{'margin-top': topHeight + 'px'}">
						<text class="iconfont2 icon-share2"></text>分享店铺
					</view> -->
					<view class="pdBox">
						<view class="shopInfo shopInfo1" :style="noticeListShow ? 'height: 446rpx' : 'height:366rpx'">
							<view class="nameBox dis-flex">
								<view class="imgBox">
									<img :src="logo" alt="">
								</view>
								<view class="info" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/shopInformation/index')">
									<view class="dis-flex flex-y-center">
										<view class="title onelist-hidden">
											{{name}}
										</view>
										<text class="editBox m-l-20 app-red f-w">
											<!-- 编辑 -->
											<text class="iconfont2 icon-bianji f-24"></text>
										</text>
									</view>
									<view class="content twolist-hidden">
										{{notice || '欢迎来到' + name + '~'}}
									</view>
									<view class="yuEBox" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/balance/index/index')">
										<text class="iconfont2 icon-cash f-26 m-r-10"></text>
										<!-- {{balance.allMoney>0?'￥'+balance.allMoney:'余额'}} -->余额
									</view>
								</view>
							</view>
							<view class="dataBox dis-flex flex-y-center" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/dataSummary/index')">
								<view class="dataItem">
									<view class="num">{{saleTotal || '0.00'}}</view>
									<view class="dataTit">销售额</view>
								</view>
								<view class="dataItem" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/trajectory/index')">
									<view class="num">{{uvTotal || '0'}}</view>
									<view class="dataTit">访客数</view>
								</view>
								<view class="dataItem">
									<view class="num">{{pvTotal || '0'}}</view>
									<view class="dataTit">浏览量</view>
								</view>
								<text class="iconfont2 icon-gengduobeifen2 f-24"></text>
							</view>
							
							<!-- 会员（店主） -->
							<view v-if="store_is_super==1" class="memberBox" @tap.stop="toMember" :style="noticeListShow ? 'bottom: 80rpx' : 'bottom:0'">
							 <image class="memberBgImg" :src="memberBgImg[member].img"></image>
							  <view class="memberText dis-flex flex-y-end flex-x-between">
							    <view class="memberTit f-w-300">
							      <image v-if="isiOS" :src="memberBgImg[member].iconIos" mode="widthFix"></image>
							      <image v-else :src="memberBgImg[member].icon" mode="widthFix"></image>
							    </view>
							    <view class="memberDate f-28" :style="{color: memberBgImg[member].color}" v-if="vip_expire!=''&&member>1">{{vip_expire}}到期</view>
							    <view class="buyMember" :style="{color: memberBgImg[member].tipColor, background: memberBgImg[member].tipBgColor}">
							      {{memberBgImg[member].tipText}}
							    </view>
							  </view>
							</view>
							<!-- 店铺信息（无店铺/有店铺是店员） -->
							<view v-else class="memberBox memberBox2" @tap.stop="toOpenAshop">
							  <image class="memberBgImg" src="https://pic.kaidanxia.com/2021-03-11/134236e77e65590.png"></image>
							  <view class="memberText dis-flex flex-y-end flex-x-between">
								<view class="memberTitle onelist-hidden flex-box">
										{{store_is_super==0?store.name+'·店员':'我要开店'}}
									</view>
								<view class="buyMember buyMember2" v-if="store_is_super==-1">立即开店</view>
							  </view>
							</view>
							<div v-show="noticeListShow">
								<div class="noticeBox dis-flex flex-y-center" @tap.stop="toOtherPage2('/pages/myGoods/todoList/index')">
									<!-- <text class="iconfont2 icon-suona1 f-30"></text> -->
									<text class="iconfont2 icon-Todolist f-26"></text>
									<div class="noticeContent">
										<swiper vertical autoplay circular interval="3000" class="tui-swiper">
											<swiper-item v-for="(item,index) in noticeList" :key="index" class="tui-swiper-item">
												<view class="tui-news-item f-24 col-3">{{item}}</view>
											</swiper-item>
										</swiper>
									</div>
									<text class="iconfont2 icon-gengduobeifen2 f-24 col-3"></text>
								</div>
							</div>
						</view>
					</view>
				</view>
			</view>
			<view class="pdBox pdTipBox" v-if="common_menus.length > 0">
				<view class="shopInfo shopInfo1">
					<div class="title dis-flex flex-y-center flex-x-between">
						<div>常用功能</div>
						<div>
							<cust-switch :checked="showCommon" @change="showCommonChange"></cust-switch>
						</div>
					</div>
					<div v-show="showCommon">
						<div class="content dis-flex flex-wrap">
							<template  v-for="(items, indexs) in common_menus">
								<div class="itemBox" :key="indexs" @tap.stop="listClick(items)">
									<div class="imgBox">
										<text class="f-48 iconfont2" :class="items.icon" :style="{color: items.is_active ? items.active_color : items.disable_color}"></text>
										<template v-if="items.is_notice">
											<text v-if="items.notice_num > 0" class="redDot1">{{items.notice_num}}</text>
											<text v-else class="redDot"></text>
										</template>
									</div>
									<div class="itemName">
										{{items.alias}}
									</div>
								</div>
							</template>
						</div>
						<div style="height:40rpx"></div>
					</div>
				</view>
    			<div class="tipsBox" @tap.stop="showIncrement"><text class="iconfont2 icon-xingzhuang f-26" style="margin-right:6rpx"></text>立即关注开单虾公众号，及时接收订单信息等相关推送消息。</div>
			</view>
			<view class="pdBox m-box">
				<div class="otherBox dis-flex flex-y-center flex-x-between">
					<div class="otherItem" @tap.stop="myShop">
						<div class="imgBox">
							<image src="https://pic.kaidanxia.com/2021-04-12/132336c4f347463.png"></image>
						</div>
						<div class="otherInfo">
							<div class="otherTitle">我的店铺</div>
						</div>
					</div>
					<div class="line"></div>
					<div class="otherItem" @tap.stop="shareShop">
						<div class="imgBox">
							<image src="https://pic.kaidanxia.com/2021-04-12/13233503c171901.png"></image>
						</div>
						<div class="otherInfo">
							<div class="otherTitle">分享店铺</div>
						</div>
					</div>
					<div class="line"></div>
					<div class="otherItem" @tap.stop="toOtherPage2('/pages/makeMoney/sellerIndex/index')">
						<div class="imgBox">
							<image src="https://pic.kaidanxia.com/2021-04-12/1323354607a8982.png"></image>
						</div>
						<div class="otherInfo">
							<div class="otherTitle">分享赚钱</div>
						</div>
					</div>
				</div>
			</view>
			<view class="pdBox m-box" v-if="list.length > 0">
				<div class="showAll dis-flex flex-y-center flex-x-between">
					<div>展开全部功能</div>
					<div>
      					<cust-switch :checked="showAll" @change="showAllChange"></cust-switch>
					</div>
				</div>
			</view>
			<div v-show="showAll">
				<view class="pdBox m-box" v-for="(item, index) in list" :key="index">
					<view class="shopInfo">
						<div class="title">{{item.module}}</div>
						<div class="content dis-flex flex-wrap">
							<template  v-for="(items, indexs) in item.itemsList">
								<div class="itemBox" :key="indexs" v-if="!item.isMore || indexs < 4" @tap.stop="listClick(items)">
									<div class="imgBox">
										<text class="f-48 iconfont2" :class="items.icon" :style="{color: items.is_active ? items.active_color : items.disable_color}"></text>
										<template v-if="items.is_notice">
											<text v-if="items.notice_num > 0" class="redDot1">{{items.notice_num}}</text>
											<text v-else class="redDot"></text>
										</template>
									</div>
									<div class="itemName">
										{{items.alias}}
									</div>
								</div>
							</template>
						</div>
						<div class="showMore" v-if="item.itemsList.length > 4" @tap.stop="showMore(item)">
							<text class="iconfont2" :class="item.isMore ? 'icon-jiantou-xia' : 'icon-shuangjiantou-shang'"></text>
						</div>
					</view>
				</view>
			</div>
			<div class="CanvaBox m-box">
				<div class="Canva">
					<swiper :autoplay="true" :circular="true" :duration="1500" previous-margin="10rpx" next-margin="10rpx">
						<swiper-item @tap.stop="showCanva">
							<div class="swiperItem dis-flex flex-x-center">
								<image src="https://pic.kaidanxia.com/2020-09-11/161201d3cd88318.gif" mode="widthFix"></image>
							</div>
						</swiper-item>
						<!-- <swiper-item @tap.stop="showActive">
							<div class="swiperItem dis-flex flex-x-center">
								<image lazy-load mode="aspectFill" src="https://pic.kaidanxia.com/2020-11-25/1618201dcb73632.gif"></image>
							</div>
						</swiper-item> -->
					</swiper>
				</div>
			</div>
			<div class="pdBox m-box" v-if="is_super==1&&(task.company!=1||task.goods!=1||task.identity!=1)">
				<view class="shopInfo">
					<div class="title">店铺指引</div>
					<div class="content">
						<div class="listBox dis-flex flex-y-center" v-if="task.identity!=1">
							<view class="imgBox">
								<text class="iconfont2 icon-personal f-38"></text>
							</view>
							<view class="widthBox">
								
							</view>
							<view class="infoBox dis-flex flex-y-center">
								<view class="infoContentBox">
									<view class="infoTitle">
										个人信息认证
									</view>
									<view class="infoNotice">
										店铺资料页提交<text class="col-m" @tap.stop="toIdentity">身份认证</text>
									</view>
								</view>
								<view class="butBox">
									<view class="optBut" v-if="task.identity!=1" @tap.stop="toIdentity">去完成</view>
									<view class="optBut" v-if="task.identity==1">已完成</view>
								</view>
							</view>
						</div>
						<div class="listBox dis-flex flex-y-center" v-if="task.company!=1">
							<view class="imgBox">
								<text class="iconfont2 icon-enterprise f-34"></text>
							</view>
							<view class="widthBox">
								
							</view>
							<view class="infoBox dis-flex flex-y-center">
								<view class="infoContentBox">
									<view class="infoTitle">
										商户认证
									</view>
									<view class="infoNotice">
										店铺资料页提交<text class="col-m" @tap.stop="toEnterprise">企业认证</text>
									</view>
								</view>
								<view class="butBox">
									<view class="optBut" v-if="task.company!=1" @tap.stop="toEnterprise">去完成</view>
									<view class="optBut" v-if="task.company==1">已完成</view>
								</view>
							</view>
						</div>
						<div class="listBox dis-flex flex-y-center pad-b-none" v-if="task.goods!=1">
							<view class="imgBox">
								<text class="iconfont2 icon-commodity4 f-34"></text>
							</view>
							<view class="widthBox">
								
							</view>
							<view class="infoBox dis-flex flex-y-center border-none">
								<view class="infoContentBox">
									<view class="infoTitle">
										上架商品
									</view>
									<view class="infoNotice">
										上架您的第一件商品
									</view>
								</view>
								<view class="butBox">
									<view class="optBut" v-if="task.goods!=1" @tap.stop="toAddGood()">去完成</view>
									<view class="optBut" v-if="task.goods==1">已完成</view>
								</view>
							</view>
						</div>
					</div>
				</view>
			</div>
			<div v-show="isLoading">
				<loading></loading>
			</div>
		</div>
		<view v-show="maskBoxShow" id="maskBox">
			<view class="maskBox dis-flex flex-y-center" :style="{opacity: maskOpacity}">
				<view class="maskBoxShow">
					<view class="maskTitle">
						{{maskTitle}}
					</view>
					<view class="maskContent">
						{{maskContent}}
					</view>
					<view class="maskBut" @tap.stop="maskBut">
						{{maskButText}}
					</view>
				</view>
			</view>
		</view>
		<assistant ref="assistant" v-if="assistantShow">
			<!-- #ifdef MP-WEIXIN -->
			<cell v-if="showQun" class="submit1" plugid='eab421e2efa432619dfd8d674719d81d'/>
			<!-- #endif -->
		</assistant>
    
		<!-- 自定义tabbar -->
		<!-- <foot-tabBar ref="footTabBar" dIndex='2' :homeStyle="homeStyle"></foot-tabBar> -->
		<buyMember ref="buyMember" :title="buyMemberTitle"></buyMember>
		
		
		<template v-if="vipType>1&&vipType!=''">
			<guidePage ref="guidePage" v-if="vipType!='' &&!maskBoxShow" :title="'retailShop'+vipType" :fixed="false"></guidePage>
		</template>
		<canva ref="canva"></canva>
		<popup-wx ref="popupWx"></popup-wx>
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</scroll-view>
</template>

<script>
	const App = getApp().globalData;
	import footTabBar from '@/components/foot-tabBar';
	import loading from '@/components/loading';
	import guidePage from '@/components/guide-page';
	import buyMember from '@/components/myGoodsCommon/buyMember';
	import canva from '@/components/robin-editor/canva';
	import popupWx from '@/components/popup-wx/index';
	import custSwitch from '@/components/cust-switch/index.vue';
	import assistant from './assistant/index.vue';
	import popupTips from '@/components/popup-tips/index';
	
	let baseImageUrl = '/static/images/shop/'
	export default {
		data() {
			return {
				assistantShow: false,
				myShopInfo: {
					wxapp_id: '',
					wxapp_name: ''
				},
				subLoad: false,
				showQun: true,
				mtitle:'',
				mcontent:'',
				member: App.member,
				maskType: '1',
				qrcode: '',
				showCommon: true,
				showAll: false,
				maskBoxShow: false,
				maskTitle: '',
				maskContent: '',
				maskButText: '',
				filterVal: 6,
				vipType: '',
				task: '',
				taskNum: '',
				name: '',
				logo: '',
				notice: '',
				saleTotal: '',
				pvTotal: '',
				uvTotal: '',
				topHeight: 0,
				opacity: 0,
				maskOpacity: 1,
				noticeList: [],
				noticeListShow: false,
				buyMemberTitle: '',
				scrollTop: 0,
				list: [],
				common_menus: [],
				isLoading: true,
				shopLock: true,
				homeStyle: '',
				balance: {//余额信息
					available_amount: 0,
					pending_amount: 0,
					sub_mchid: ""
				},
				is_super: 1,//是否为店员
				showBubble: false,//默认显示气泡
				
				store_is_super: '',
				member: '',
				vip_expire: '',
				
				memberBgImg: {
				  0:{
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
				  1:{
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
									member_power: [{icon:'icon-Merchandising',title:'商品管理',isUse: true},{icon:'icon-roam',title:'订单流转',isUse: true},{icon:'icon-data',title:'数据汇总',isUse: true},
										// {icon:'icon-glanceover',title:'浏览轨迹',isUse: false},{icon:'icon-retailstore',title:'发展渠道',isUse: false,},
									],
									noUseStyle:'color:#fff;background:linear-gradient(306deg, rgba(114,113,113,1) 0%, rgba(105,105,105,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
				  },
				  2:{
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
									member_power: [{icon:'icon-Merchandising',title:'商品管理',isUse: true},{icon:'icon-roam',title:'订单流转',isUse: true},{icon:'icon-data',title:'数据汇总',isUse: true},{icon:'icon-glanceover',title:'浏览轨迹',isUse: true},
										// {icon:'icon-retailstore',title:'发展渠道',isUse: false,},
									],
									noUseStyle:'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
				  },
				  3:{
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
									member_power: [{icon:'icon-Merchandising',title:'商品管理',isUse: true},{icon:'icon-roam',title:'订单流转',isUse: true},{icon:'icon-data',title:'数据汇总',isUse: true},{icon:'icon-glanceover',title:'浏览轨迹',isUse: true},
										// {icon:'icon-retailstore',title:'发展渠道',isUse: false,},
									],
									noUseStyle:'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
				  },
				  4:{
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
									member_power: [{icon:'icon-Merchandising',title:'商品管理',isUse: true},{icon:'icon-roam',title:'订单流转',isUse: true},{icon:'icon-data',title:'数据汇总',isUse: true},{icon:'icon-glanceover',title:'浏览轨迹',isUse: true},{icon:'icon-retailstore',title:'发展渠道',isUse: true,},],
									noUseStyle:'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
				  },
				  5:{
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
									member_power: [{icon:'icon-Merchandising',title:'商品管理',isUse: true},{icon:'icon-roam',title:'订单流转',isUse: true},{icon:'icon-data',title:'数据汇总',isUse: true},{icon:'icon-glanceover',title:'浏览轨迹',isUse: true},{icon:'icon-retailstore',title:'发展渠道',isUse: true,},],
									noUseStyle:'color:#fff;background:linear-gradient(306deg, rgba(109,73,34,1) 0%, rgba(109,73,34,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;'
				  }
				},
			};
		},

		components: {
			'foot-tabBar': footTabBar,
			loading,
			guidePage,
			buyMember,
			canva,
			popupWx,
			custSwitch,
			assistant,
			popupTips
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.$nextTick(() => {
				this.setListHeight()
				this.taskNum = options.task || ''
			})
		},
		created() {
			// this.shopLock = !!uni.getStorageSync("shopLock")
			// this.shopLock = false
			this.showAll = !!uni.getStorageSync("shopShowAll")
			this.showCommon = !uni.getStorageSync("shopShowCommon")
		},
		onShow() {
			this.homeStyle = App.homeStyle?App.homeStyle:'div';
			// this.shopLock = !!uni.getStorageSync("shopLock");console.log(this.shopLock)
			this.getShowData()
		},
		methods: {
			back() {
				uni.switchTab({
					url: '/pages/userIndex/index'
				});
			},
			completemessage(e){
				if(e.detail.errcode==0){
					this.mtitle = '申请成功';
					this.mcontent = '请打开微信,点击通知信息链接,即可加入';
					this.showQun = false;
					this.$refs.popupTips.open(()=>{
					});
				}
			},
			showCommonChange(e) {
				this.showCommon = e ? true : false
				e ? '' : this.showAllChange(true)
				uni.setStorageSync("shopShowCommon", !this.showCommon)
			},
			showAllChange(e) {
				this.showAll = e ? true : false
				uni.setStorageSync("shopShowAll", this.showAll)
				// App._post_form('shop.xrdealer.setting/detail',{
				// 	open_dealer: e ? 1 : 0
				// },res => {
				// 	this.$api.msg(res.msg)
				// });
			},
			myShop() {
				if (this.myShopInfo.wxapp_id) {
					App.myShopInfo = JSON.parse(JSON.stringify(this.myShopInfo))
					wx.setStorageSync("wxapp_id", App.myShopInfo.wxapp_id)
					wx.setStorageSync("myShopInfo", JSON.stringify(this.myShopInfo))
					App.wxapp_id = App.myShopInfo.wxapp_id;
					wx.setStorageSync("wxapp_id", App.myShopInfo.wxapp_id)
					uni.reLaunch({
						url:'/pages/index/index'
					})
				} else {
					this.$api.msg('暂无店铺信息')
				}
			},
			// 获取商户实时余额
			getMoney(){
				App._get('shop.commerce.amount/merchantCurrentBalance',{}, res => {
					this.balance = {
						available_amount: res.data.available_amount||0,
						pending_amount: res.data.pending_amount||0,
						sub_mchid: res.data.sub_mchid||"",
						allMoney: res.data.total_amount||0,
					};
				});
			},
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
			toAddGood() {
				uni.navigateTo({
					url: '/pages/myGoods/goodsAdd/index'
				});
			},
			toIdentity() {
				if(this.task.identity==2){
					uni.navigateTo({
						url: '/pages/user/myinfo/index'
					});
				}else{
					uni.navigateTo({
						url: '/pages/user/identity/index'
					});
				}
			},
			toEnterprise() {
				uni.navigateTo({
					url: '/pages/user/enterprise/index'
				});
			},
			shareShop() {
				uni.navigateTo({
					url: '/pages/user/distribution/share/index?name=goods'
				})
        
				// let data = {
				// 	opeText: 'weChat, weChatFriends, upLoad',
				// }
				// this.$refs.shareBottom.open(data);
			},
			showCanva() {
				uni.navigateTo({
					url: '/pages/user/canvas/index'
				});
			},
			showActive() {
				uni.navigateTo({
					url: '/pages/activity/giveMember/index'
				});
			},
            toCanva() {
                /* #ifdef MP-WEIXIN */
                uni.navigateToMiniProgram({
                    appId: 'wx47bb17ae9c1d7bd3',
                    path: 'pages/anonymous-templates/anonymous-templates',
                    envVersion: 'release',
                    success: () => {
                        // console.log('success')
                    },
                    fail: () => {
                        // console.log('fail')
                    },
                    complete: () => {
                        // console.log('complete')
                    },
                })
				/* #endif */
				/* #ifdef APP-PLUS || H5 */
				this.$refs.canva.open()
				/* #endif */
            },
			
			toMember() {
			  App.toMember()
			},
			maskBut() {
				// if (this.vipType == '') {
    //     			App.toMember()
				// } else {
					if (this.subLoad) {
						return
					}
					this.subLoad = true
					App._post_form('user/createShop', {
						device: App.ios ? 'ios' : 'android'
					}, (result) => {
						this.subLoad = false
						uni.setStorageSync("shopLock", '1')
						this.shopLock = 1
						this.unitsData(result.data)
						let time = setInterval(() => {
							if (this.filterVal > 0) {
								this.filterVal -= 1
							}
							if (this.maskOpacity > 0) {
								this.maskOpacity = (this.maskOpacity * 100 - 1) / 100
							}
							if (this.filterVal <= 0 && this.maskOpacity <= 0) {
								this.maskBoxShow = false
								this.filterVal = 6
								this.maskOpacity = 0.9
								clearInterval(time)
							}
						}, 15);
					}, (res) => {
						this.subLoad = false
						this.$api.msg(res.msg)
					})
					
					// 更新主题tabbar
					this.$store.commit('getTheme',App)
				// }
			},
			// 购买会员
			tipsCallback() {
        		App.toMember()
			},
			/**
			 * 设置商品列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						topHeight = res[0].height - 48; // swiper高度
					this.topHeight = topHeight
					// #ifdef MP-WEIXIN
					this.clickBubble(1)
					// #endif
				});
			},
			showMore(item) {
				item.isMore = !item.isMore
			},
			// 展示数据
			getShowData() {
				App._get('shop.setting/store', {}, (result) => {
					this.shopLock = !!result.data.status
					uni.setStorageSync("shopLock", result.data.status)
					this.isLoading = false
					this.assistantShow = true
					this.unitsData(result.data)
					// 更新主题tabbar
					this.$store.commit('getTheme',App);
					if (this.$refs.assistant) {
						this.$refs.assistant.getData()
					}
				}, false, () => {
					this.isLoading = false
				})
				  App._get('user.index/detail', {}, (result) => {
				    if (result.code == '1') {
						// 店铺信息
						if(result.data.store){
							let store = result.data.store;
							if(JSON.stringify(store)=="{}"){
								this.store_is_super = -1;//未登录/没有店铺
							}else if(JSON.stringify(store.salesclerk)=="{}"){
								this.store_is_super = 1;//店主
							}else{
								this.store_is_super = 0;//店员
							}
						}
						this.vip_expire = result.data.userInfo.vip_expire?result.data.userInfo.vip_expire.slice(0,11):'';
						this.member = result.data.userInfo.vip || '0'
				    }
				  });
			},
			unitsData(data) {
				
				let values = data.values || {}
				this.name = values.name || ''
				this.logo = values.logo || ''
				this.notice = values.notice || ''
				this.saleTotal = values.saleTotal || 0
				this.pvTotal = values.pvTotal || 0
				this.uvTotal = values.uvTotal || 0
				this.vipType = values.vip || ''
				this.task = values.task || ''
				this.is_super = values.is_super;
				if (values.wxapp_id) {
					this.myShopInfo = {
						wxapp_id: values.wxapp_id,
						wxapp_name: values.name
					}
				}
				let newList = data.menus.all_menus || []
				let common_menus = data.menus.common_menus || []
				let newCommon_menus = []
				common_menus.forEach(item => {
					if (item.is_active) {
						newCommon_menus.push(item)
					}
				})
				
				this.common_menus = newCommon_menus
				newList.forEach(item => {
					let itemsList = []
					item.items.forEach(items => {
						if (items.is_active) {
							itemsList.push(items)
						}
					})
					item.itemsList = itemsList
				})
				
				let  list = newList
				list.forEach(item => {
					if (item.itemsList.length > 4) {
						let isMore = true
						this.list.forEach(items => {
							if (item.module == items.module) {
								isMore = items.isMore
							}
						})
						item.isMore = isMore
					} else {
						item.isMore = false
					}
				})
				this.list = list
				this.vipTypeChange()
				this.$nextTick(() => {
					if (this.taskNum) {
						this.scrollTop = 2000
					}
				})
				let backlogs = values.backlogs || []
				let noticeList = []
				backlogs.forEach(item => {
					noticeList.push(item.backlog_title)
				})
				this.noticeList = noticeList
				if (this.noticeList.length > 0) {
					this.noticeListShow = true
				} else {
					this.noticeListShow = false
				}
				// 余额
				this.balance = {
					available_amount: values.balance.available_amount||0,
					pending_amount: values.balance.pending_amount||0,
					allMoney: values.balance.total_amount||0,
					sub_mchid: values.balance.sub_mchid||"",
				};
			},
			vipTypeChange() {
				if (!this.shopLock) {
					if (this.vipType == '') {
						this.maskTitle = '您还没有店铺'
						this.maskContent = '领' + this.member + '极速开店，马上开始'
						// if (App.ios) {
						// 	uni.showLoading()
						// 	App._post_form('vip.collection/getExperienceVip', {}, (result) => {
						// 		this.getShowData()
						// 	}, false, () => {
						// 		uni.hideLoading()
						// 	})
						// } else {
						this.maskButText = '立即创建店铺'
						this.maskBoxShow = true
						// }
					} else {
						if (this.vipType == '1') {
							this.maskTitle = '您已领取虾米' + this.member
						} else if (this.vipType == '2') {
							this.maskTitle = '您已领取体验' + this.member
						} else if (this.vipType == '3') {
							this.maskTitle = '您已领取明虾' + this.member
						} else if (this.vipType == '4') {
							this.maskTitle = '您已领取龙虾' + this.member
						}
						this.maskContent = '相应期限内您可以享受' + this.member + '权益！'
						this.maskButText = '立即解锁店铺'
						this.maskBoxShow = true
					}
				}
			},
			// 滚动
			scroll(e) {
				let scrollTop = e.detail.scrollTop
				if (scrollTop > (50 + this.topHeight)) {
					this.opacity = 1
				} else {
					if (scrollTop < 50) {
						this.opacity = 0
					} else {
						this.opacity = (scrollTop - 20) / 50
					}
				}
			},
			listClick(item) {
				if (item.name == 'Drawingartifact') {
					this.toCanva()
				} else if (item.is_active) {
					this.toOtherPage(item.page)
				} else {
					if (item.warn_type == 1) {
						this.$api.msg(item.warning)
					} else if (item.warn_type == 2) {
						this.buyMemberTitle = item.warning
						this.$refs.buyMember.open()
					}
				}
			},
			toOtherPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			// 店员特殊处理
			toOtherPage2(url) {
				// &&(url=='/pages/retailShop/shopAbout/shopInformation/index'||url=='/pages/retailShop/shopAbout/balance/index/index'||url=='/pages/retailShop/shopAbout/dataSummary/index'||url=='/pages/retailShop/shopAbout/trajectory/index'||url=='/pages/myGoods/todoList/index'||url=='/pages/makeMoney/sellerIndex/index')
				if(this.is_super!=1){
					this.$api.msg('抱歉，您暂无此权限哦~')
				}else{
					uni.navigateTo({
						url: url
					});
				}
			},
			// #ifdef MP-WEIXIN
			clickBubble(type){
				// 显隐
				if(type==1){
					let bubble = uni.getStorageSync('guideBubble') || false;
					if(!bubble){
						this.showBubble = true;
					}else{
						return
					}
				}
				// 点击关闭
				if(type==2){
					if(this.showBubble){
						this.showBubble = false;
						uni.setStorageSync('guideBubble',true)
					}else{
						
					}
				}
			},
			// #endif
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
	.submit1{
		position: absolute;
		top: 0;
		right: 0;
		width: 300rpx;
		opacity: 0;
	}
</style>
