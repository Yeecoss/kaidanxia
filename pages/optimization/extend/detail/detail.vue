<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar lLidth="width:60rpx" extClass="nav">
			  <view slot="center" class="left-title dis-flex flex-y-center">
					<view class="user-img"><image :src="wxapp.logo" mode="aspectFill"></image></view>
					<view>{{wxapp.wxapp_name}}</view>
			  </view>
		</navigationBar>
		
		<!-- banner -->
		<view class="banner">
			<image lazy-load :src="banner" mode="aspectFill"></image>
			<view class="edit-btn f-24 col-3" @tap.stop="toEdit" v-if="is_owner"><text class="iconfont2 icon-bianji f-24"></text>管理</view>
		</view>
		<view class="wrap30 wrap">
			<view class="good-data">
				<view class="goods-name twolist-hidden f-30 col-3">
					{{info.article_title}}
				</view>
				<view class="goods-data dis-flex flex-y-center flex-x-between">
					<view class="publishTime f-24 col-9">{{info.create_time}}</view>
					<view class="read-num f-24 col-9"><text class="iconfont2 icon-eye f-24"></text>{{info.show_views}}</view>
				</view>
				<!-- 标签 -->
				<!-- <view class="tag-wrap dis-flex flex-wrap">
					<view class="f-24 m-r-10">#夏季穿搭</view>
				</view> -->
			</view>
			<!-- 详情富文本 -->
			<view class="detail">
				<!-- 商品描述 -->
				<goods-describe :article_content="info.article_content" :isTitle="false"></goods-describe>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="wrap30 goods-list" v-if="relate_list && relate_list!=''">
			<view class="goods-list-title f-30 col-3">相关商品</view>
			<navigator class="goods-list-item dis-flex flex-y-center" v-for="item in relate_list" :key="item.wxapp_goods_id" :url="'/pages/goods/index?goods_id='+item.wxapp_goods_id">
				<view class="goods-list-pic"><image lazy-load :src="item.goods_image" mode="aspectFill"></image></view>
				<view class="good-list-data">
					<view class="f-24 col-3 onelist-hidden">{{item.goods_name}}</view>
					<view class="good-list-price f-24">¥{{item.goods_price}}</view>
				</view>
				<view><text class="iconfont2 icon-gengduobeifen2 col-6 f-24"></text></view>
			</navigator>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="operation-wrap">
			<view class="operation dis-flex flex-y-center">
				<view class="oper-item f-24" :class="ifCollect?'on':''" @tap="toCollect"><text class="iconfont2 icon-delete2 f-34"></text>关注</view>
				<view class="oper-item f-24" @tap="upload"><text class="iconfont2 icon-download f-34"></text>下载</view>
				<view  class="oper-item f-24" @tap="onToggleTrade"><text class="iconfont2 icon-relay f-34"></text>分享</view>
			</view>
		</view>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" @click="clickNext" @cancel="cancel"></tui-actionsheet>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<!-- <guidePage title="attenDetailPage"></guidePage> -->
		<!-- 分享弹窗 -->
		<share-bottom ref="shareBottom" pageType="optimization"></share-bottom>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	import goodsDescribe from '@/components/goods/goods-describe/index';
	import downloadFile from '@/components/download-file';
	// import guidePage from '@/components/guide-page';
	import shareBottom from '@/components/share-bottom/index';
	export default {
		components: {
			goodsDescribe,
			downloadFile,
			// guidePage,
			shareBottom
		},
		data() {
			return {
				ifCollect:false,//默认没有收藏
				banner:'',
				is_owner: 0,//是否为文章编辑者
				wxapp:'',//头部店铺信息
				relate_list: [],//相关产品
				type: '',//默认是种草wantbuy？营销marketing?详情
				article_id: '',//文章id
				info:'',//页面信息
				showSheet: false,//是否显示操作菜单
				itemList: [{text: '编辑',color: '#333'},{text: '删除',color: '#333'},],
				index: 1,//提示框
				fileArray: [],//要下载的图片视频列表
			}
		},
		onLoad(option) {
			//切换店铺
			if (option.wid) {
				app.wxapp_id = option.wid;
				wx.setStorageSync("wxapp_id", option.wid)
			}
			
			let that = this;
			that.type = option.type
			that.article_id = option.article_id;
			// #ifdef MP
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline'],
				success(res) {},
				fail(e) {}
			})
			// #endif
		},
		onShow() {
			let that = this;
			that.getInfo(that.type,that.article_id);
		},
		// 设置菜单中的转发按钮触发转发事件时的转发内容
		// #ifdef MP
		onShareAppMessage (res) {
			let shareObj = {      
				title: this.info.article_title,
				path: '/pages/optimization/extend/detail/detail?type='+ this.type + '&article_id=' + this.article_id+'&wid='+ this.info.wxapp_id,
				// imageUrl: this.info.image.file_path
			};
			// 返回shareObj
			return shareObj;
		},
		onShareTimeline(){
			let shareObj = {
				title: this.info.article_title,
				query: 'type='+ this.type + '&article_id=' + this.article_id+'&wid='+ this.info.wxapp_id,
				imageUrl: this.info.image.file_path
			};
			return shareObj;
		},
		// #endif
		methods: {
			// 获取详情信息
			getInfo(type,id){
				let that = this;
				var data = {article_id: id}, 
						url = (type=='wantbuy')? 'content.article.goods/detail': type=='marketing' ? 'content.article.market/detail':'';
				app._get(url,data,res => {
					let article = res.data.article;
					if(article.show_views>10000){
						article.show_views = (article.show_views-article.show_views%1000)/10000+'W';
					}
					that.info = article;
					that.wxapp = res.data.wxapp;
					that.relate_list = res.data.article.goods_relation;
					that.banner = res.data.article.image.file_path;
					that.ifCollect = res.data.is_collection? true: false;
					that.is_owner = res.data.is_owner;
				})
			},
			//点击收藏
			toCollect(){
				let that = this;
				let url = that.ifCollect ? 'user.collection/del' : 'user.collection/add';
				app._post_form(url, {type: that.type == 'wantbuy'? 3: 4,object_id: that.article_id}, res => {
					that.ifCollect = !that.ifCollect;
					this.$api.msg(res.msg);
				});
			},
			// 点击下载
			upload(){
				const that = this;
				let con = that.info.article_content;
				var imgs = [], videos = [];
				con.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
					imgs.push(capture);
				});
				con.replace(/<video [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
					videos.push(capture);
				});
				let files = imgs.concat(videos);
				if(files!=''){
					uni.showModal({
						title: '友情提示',
						content: '是否下载该文章的图片/视频？',
						confirmColor: '#E82E2E',
						confirmText: '是',
						cancelText: '否',
						success: (res) => {
							if(res.confirm){
								that.$refs.download._downloadFileS(imgs);
							}
						}
					});
				}else{
					that.$api.msg('该文章暂无可下载的图片/视频');
				}
			},
			comfirmStatusS (promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res?"保存成功~":'取消保存')
				})
			},
			//打开关闭分享弹窗
			onToggleTrade(){
				let data = {
					// opeText: this.type=='marketing' ?'weChat, weChatFriends' : 'upGoods,copyGoods,weChat, weChatFriends',
					opeText: this.type=='marketing' ?'copyGoods,weChat, weChatFriends' : 'copyGoods,weChat, weChatFriends',
					optimiInfo: this.info,
					optimiType: this.type
				}
				this.$refs.shareBottom.open(data);
			},
			//分享到
			toShare(title){
				let that = this;
				if(title == '微信好友'){
					uni.share({
							provider: "weixin",
							scene: "WXSceneSession",
							type: 0,
							href: '/pages/optimization/extend/detail/detail?type='+ that.type + '&article_id=' + that.article_id,
							title: that.info.article_title,
							// summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
							imageUrl: that.info.image.file_path,
							success: function (res) {
								that.$api.msg('分享到'+title)
								// console.log("success:" + JSON.stringify(res));
							},
							fail: function (err) {
								// console.log("fail:" + JSON.stringify(err));
							}
					});
				}else if(title == '微信好友'){
					uni.share({
							provider: "weixin",
							scene: "WXSenceTimeline",
							type: 0,
							href: '/pages/optimization/extend/detail/detail?type='+ that.type + '&article_id=' + that.article_id,
							title: that.info.article_title,
							// summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
							imageUrl: that.info.image.file_path,
							success: function (res) {
								that.$api.msg('分享到'+title)
								// console.log("success:" + JSON.stringify(res));
							},
							fail: function (err) {
								// console.log("fail:" + JSON.stringify(err));
							}
					});
				}
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				if(e.index == 0){
					that.showSheet = false;
					let tabOn = that.type == 'wantbuy' ? 0: 1;
					uni.navigateTo({
						url: '/pages/optimization/extend/add/index?type=1&tabOn='+ tabOn + '&article_id=' + that.article_id,
					})
				}
				// 删除种草文章
				if(e.index == 1){
					that.showSheet = false;
					uni.showModal({
						title: '确定删除种草文章？',
						confirmColor: '#E82E2E',
						success: (res) => {
							if(res.confirm){
								let url = that.type == 'wantbuy' ? 'shop.article.goods/delete': 'shop.article.market/delete';
								app._post_form(url, {article_id: that.article_id}, res => {
									that.$api.msg(res.msg);
									if(res.code==1){
										setTimeout(uni.navigateBack(),1500)
									}
								})
							}
						}
					})
				}
			},
			// 打开底部菜单
			toEdit(){
				this.showSheet = true;
			},
			//关闭底部菜单
			cancel(){
				let that = this;
				that.showSheet = false;
			},
			//返回
			// pageBack(data){
			// 	// 返回上一页传递选中的数据
			// 	let pages = getCurrentPages();
			// 	let prevPage = pages[pages.length - 2]; //上一个页面
			// 	if(prevPage.$vm.listChange){
			// 		prevPage.$vm.listChange(data)
			// 	}
			// 	uni.navigateBack();
			// },
			
		}
	}
</script>


<style lang="scss">
	@import "detail.scss";
</style>
