<template>
	<view class="bgf8 min-h100" v-if="homeStyle=='saler'">
		<!-- 首页头部 -->
		<view class="header">
			<header
				class="wrap30 index-header dis-flex flex-y-center flex-x-between"
			>
				<view class="index-header-l">
					<navigator
						class="cate_btn dis-flex flex-y-center"
						openType="navigate"
						url="/pages/optimization/extend/attention/attention"
						hover-class="none"
					>
						<text class="iconfont2 icon-delete2"></text>
						<text class="text">关注</text>
					</navigator>
				</view>
		
				<view class="index-header-c dis-flex flex-y-center flex-x-center">
					<view class="on col-2" @tap="switchTab(0)">首页</view>
					<view class="col-6" @tap="switchTab(1)">优选</view>
					<view class="col-6" @tap="switchTab2" v-if="isCheckGoods">采购</view>
				</view>
		
				<view class="index-header-r dis-flex flex-y-center flex-x-end">
					<navigator
						class="search_btn"
						openType="navigate"
						url="/pages/search/index"
						hover-class="none"
					>
						<text class="iconfont2 icon-sousuo"></text>
						<text class="text">搜索</text>
					</navigator>
				</view>
			</header>
		</view>
		<!-- 内容 -->
		<view class="main">
			<view class="wrap30 bgf">
				<!-- banner轮播 -->
				<view class="p-t-20">
					<diy-banner itemIndex="0" :itemStyle="ban_style" :params="ban_params" :dataList="banner"></diy-banner>
				</view>
				<view class="m-t-20 f-26 col-6">{{wxapp.notice}}</view>
				<view class="saler_title"><image src="http://pic.kaidanxia.com/2020-08-14/20200814192349688288826.png" mode="widthFix"></image></view>
				<!-- 联系商家 -->
				<view class="lianxiShop f-28 tb-lr-center" @tap.stop="toShopInformation">
					<text class="iconfont2 icon-WeChat f-28 m-r-10"></text>联系店主
				</view>
				<!-- 导航组 -->
				<view class="saler-navBar dis-flex flex-x-between">
					<view class="saler-navBar-item f-28 col-3" v-for="(item,index) in salerNavBar" :key="index" @tap.stop="sNavBarChange(item)">
						<text class="iconfont2 m-r-10 f-26" :class="item.icon" :style="'color:'+item.icolor"></text>{{item.text}}
						<view class="item-status" v-if="item.status">
							<image :src="item.statusImg" mode="aspectFit"></image>
						</view>
					</view>
				</view>
			</view>
			<scroll-view class="list" v-if="list.data!=''">
				<template v-for="(item,index) in list.data">
					<good ref="good" :list="item" :key="index" :wxapp="wxapp" @openDialog="openDialog" @upload="upload" @toShare="toShare" @priview="priview"></good>
				</template>
			</scroll-view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5" text="开单虾技术支持～"></tui-nomore>
		</view>
		<view class="saler_nodata p-bottom" v-if="list.data==''">
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<!-- 确认购买弹窗 -->
		<view class="proSpec">
			<proSpecs ref="proSpecs"></proSpecs>
		</view>
		<!-- 分享同步 -->
		<share-bottom ref="shareBottom" pageType="goods"></share-bottom>
		<!-- 右拉筛选 -->
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
		<!-- 联系商家 -->
		<contact ref="contact"></contact>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import diyBanner from "../banner/banner";
	import popupTips from '@/components/popup-tips/index';
	import good from './good/good';
	import downloadFile from '@/components/download-file';
	import proSpecs from '@/components/goods/proSpecs/pro-specs';
	import shareBottom from '@/components/share-bottom/index';
	import rightDrawer from '@/components/goods/rightDrawer/index';
	import contact from '@/components/myGoodsCommon/contact/index';
	export default {
		components: {
			diyBanner,
			popupTips,
			good,
			downloadFile,
			proSpecs,
			shareBottom,
			rightDrawer,
			contact
		},
		props: {
			homeStyle: {
				type: String,
				default: ''
			},
			isCheckGoods: {
				type: Boolean,
				default: false
			},
		},
		data(){
			return{
				index: 1,
				mtitle:'',
				mcontent:'',
				page: 1,
				list: {},//列表
				loadding: false,
				pullUpOn: true,
				next: null,
				banner: [],
				ban_style: {btnColor: "#fff",btnShape: "round"},
				ban_params: {interval: "2800"},
				salerNavBar: [
					{id: 1,icon: 'icon-coupon1',icolor:'#E82E2E',text:'优惠券',url: '/pages/coupon/coupon',status:0,statusImg:'https://pic.kaidanxia.com/2021-05-10/09391412c656814.png'},
					{id: 2,icon: 'icon-seckill',icolor:'#F8B14A',text:'秒杀',url: '/pages/sharp/index/index',status:0,statusImg:'https://pic.kaidanxia.com/2021-05-10/093913b17684152.png'},
					{id: 3,icon: 'icon-Bargaining',icolor:'#0091FF',text:'砍价',url: '/pages/bargain/index/index',status:0,statusImg:'https://pic.kaidanxia.com/2021-05-10/093913939c61559.png'},
					{id: 4,icon: 'icon-screen2',icolor:'#333',text:'筛选',}
				],
				wxapp: {},
				otherObj: {},//筛选条件
			}
		},
		methods: {
			// 局部更新
			_show(next){
				this.page = 1;
				this.otherObj = {}
				this.next = next || null;
				this.getList();
			},
			//页面相关事件处理函数--监听用户下拉动作
			_onPullDownRefresh () {
				//延时为了看效果
				setTimeout(() => {
					this.list = {};
					this.page = 1;
					this.otherObj = {}
					this.getList();
					this.pullUpOn = true;
					this.loadding = false;
					uni.stopPullDownRefresh();
					this.$api.msg("刷新成功")
				}, 200)
			},
			// 上拉加载下一页
			_onReachBottom () {
				if (!this.pullUpOn) return;
					this.loadding = true;
				if (this.page >= this.list.last_page) {
					this.loadding = false;
					this.pullUpOn = false;
				} else {
					this.page = ++this.page;
					this.loadding = true;
					this.getList();
				}
			},
			// 获取列表
			getList (){
				let that = this;
				let data = that.otherObj;
				data.page = that.page;
				data.category_id = that.otherObj.category_id || 0;
				app._get('page/saler', data, res => {
					that.loadding = false;
					that.banner = res.data.banners;
					that.wxapp = res.data.wxapp;
					if(res.data.subscript){
						that.initNavBar(res.data.subscript);
					}
					let _list = that.list;
					let data = res.data.goodlist;
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
					that.next(res.data);
				});
			},
			// navBar角标
			initNavBar(subscript){
				if(subscript.coupon==1){
					this.salerNavBar[0].status = 1;
				}
				if(subscript.sharp==1){
					this.salerNavBar[1].status = 1;
				}
				if(subscript.bargain==1){
					this.salerNavBar[2].status = 1;
				}
			},
			//立即购买
			openDialog(item){
				this.$refs.proSpecs._open(item)
			},
			//导航组
			sNavBarChange(item){
				if(item.id==4){
					this.$refs.rightDrawer.screen()
				}else{
					uni.navigateTo({
						url: item.url
					})
				}
			},
			//筛选框确定
			rightDrawerChange(obj) {
				this.otherObj = obj;
				this.page = 1;
				// 获取商品列表
				this.getList();
			},
			// 点击下载
			upload(files){
				const that = this;
				let uploads = [];
				files.forEach(item => {
					uploads.push(item.file_path)
				});
				if(uploads!=''){
					uni.showModal({
						title: '友情提示',
						content: '是否下载该商品的图片/视频？',
						confirmColor: '#E82E2E',
						confirmText: '是',
						cancelText: '否',
						success: (res) => {
							if(res.confirm){
								that.$refs.download._downloadFileS(uploads);
							}
						}
					});
				}else{
					that.$api.msg('该商品暂无可下载的图片/视频');
				}
			},
			//下载回调
			comfirmStatusS (promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res?"保存成功~":'取消保存')
				})
			},
			//点击分享
			toShare(item){
				let data = {
					opeText: 'upGoods,copyGoods,weChat',
					isTwo: true,
					upGoods: item,
					styleList: '-1,1,4,8'
				}
				this.$refs.shareBottom.open(data);
			},
			// 店铺资料
			toShopInformation() {
				let obj = {
					wxapp_id: app.wxapp_id
				}
				app._get('wxapp/info', obj, (res) => {
					let values = res.data.shop || {}
					this.user = values
					this.$refs.contact.open(this.user)
				})
			},
			// 切换tab
			switchTab(id) {
				this.$emit('switchTab',id)
			},
			// 去采购
			switchTab2() {
			  uni.navigateTo({
			    url:"/pages/retailShop/shopAbout/shopDetail/index?wxapp_id=" + app.wxapp_id,
			  });
			},
			priview(e){
				this.$emit('priview',e)
			},
		}
	}
</script>

<style lang="scss">
	@import 'index.scss';
</style>
