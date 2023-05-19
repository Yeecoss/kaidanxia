<template>
	<view class="container">
		<!-- 自定义标题栏 -->
		<navigationBar :back="false" title="全部分类" extClass="nav" id="top"></navigationBar>
		<view class="tui-searchbox">
			<!-- <view class="tui-search-input" @tap="search">
				<icon type="search" :size="13" color="#999"></icon>
				<text class="tui-search-text">搜索Thorui商品</text>
			</view> -->
		</view>
		<template v-if="tabbar.length">
			<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-into-view="scrollViewId" :style="{ height: height + 'px', top: top + 'px' }">
				<view :id="`id_${index}`" v-for="(item, index) in tabbar" :key="index" class="tab-bar-item" :class="[currentTab == index ? 'active' : '']" @tap.stop="swichNav(index)">
					<view class="tabbar_icon m-r-10" v-if="item.icon" :style="'background: linear-gradient(to bottom,'+item.top_color+','+item.bottom_color+');-webkit-background-clip: text;-webkit-text-fill-color: transparent;'">
						<text class="iconfont2 f-30 col-f" :class="item.icon"></text>
					</view>
					<text class="onelist-hidden">{{ item.name }}</text>
				</view>
			</scroll-view>
			<block v-for="(item0, index0) in tabbar" :key="index0">
				<scroll-view scroll-y class="right-box" :style="{ height: height + 'px', top: top + 'px' }" v-if="currentTab == index0" @scrolltolower="onBottom">
					<!--内容部分 start 自定义可删除-->
					<template v-if="item0.list!=''">
					</template>
					<view class="page-view" v-if="item0.list!=''">
						<view class="class-box" v-if="item0.category_id=='hot'||item0.category_id=='rmd'||item0.category_id=='tag'">
							<view class="class-item" v-for="(item,index) in item0.list" :key="index">
								<view @tap.stop="productList(item)" class="class-name dis-flex flex-y-center flex-x-between">
									<view class="f-28 col-6 onelist-hidden oh flex-box m-r-30">{{ item.name }}<text class="f-26">({{item.total}})</text></view>
									<view class="f-24 col-6 oh">更多<text class="iconfont2 icon-more1 f-24"></text></view>
								</view>
								<view class="g-container">
									<template v-for="(vo, k) in item.data">
										<view class="g-box m-b-30 dis-flex flex-x-between" :key="k" @tap.stop="toDetail(vo)">
											<view class="g-box-pic">
												<image lazy-load mode="aspectFill" :src="vo.goods.goods_image" class="g-image" />
											</view>
											<view class="g-box-info flex-box m-l-20">
												<view class="g-title onelist-hidden f-28 col-3">{{vo.goods.goods_name}}</view>
												<view class="f-24 col-6 m-t-4 m-t-10">销量{{vo.goods.goods_sales||0}}</view>
												<view class="app-red f-24 m-t-4 m-t-10">¥{{vo.goods.min_price||0}}</view>
												<view class="prolist-add t-c" @tap.stop="openDialog(vo)"><text class="iconfont2 icon-increase"></text></view>
											</view>
										</view>
									</template>
								</view>
							</view>
						</view>
						<!-- 非热销等 -->
						<view class="class-box" v-else>
							<template v-if="item0.list">
								<view class="class-item" v-for="(item,index) in item0.list.data" :key="index">
									<view @tap.stop="productList(item)" class="class-name dis-flex flex-y-center flex-x-between">
										<view class="f-28 col-6 onelist-hidden oh flex-box m-r-30">{{ item.name }}<text class="f-26">({{item.total}})</text></view>
										<view class="f-24 col-6 oh">更多<text class="iconfont2 icon-more1 f-24"></text></view>
									</view>
									<view class="g-container">
										<template v-for="(vo, k) in item.data">
											<view class="g-box m-b-30 dis-flex flex-x-between" :key="k" @tap.stop="toDetail(vo)">
												<view class="g-box-pic">
													<image lazy-load mode="aspectFill" :src="vo.goods.goods_image" class="g-image" />
												</view>
												<view class="g-box-info flex-box m-l-20">
													<view class="g-title onelist-hidden f-28 col-3">{{vo.goods.goods_name}}</view>
													<view class="f-24 col-6 m-t-4 m-t-10">销量{{vo.goods.goods_sales||0}}</view>
													<view class="app-red f-24 m-t-4 m-t-10">¥{{vo.goods.min_price||0}}</view>
													<view class="prolist-add t-c" @tap.stop="openDialog(vo)"><text class="iconfont2 icon-increase"></text></view>
												</view>
											</view>
										</template>
									</view>
								</view>
							</template>
								<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
								<!-- <tui-loadmore v-if="loadding" :index="2" type="primary"></tui-loadmore> -->
								<tui-nomore v-if="(!pullUpOn && item0.list.data!='') || page==item0.list.last_page" text="开单虾技术支持" backgroundColor="#fff"></tui-nomore>
						</view>
					</view>
					<!-- 无数据 -->
					<view class="g-container-nodata min_h_100 p-t-30 dis-flex flex-x-center flex-y-center" v-if="item0.list==''||(item0.list&&item0.list.data=='')">
						<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" :fixed="false">
							<view class="col-9">暂无数据</view>
						</tui-no-data>
					</view>
					<!--内容部分 end 自定义可删除-->
				</scroll-view>
			</block>
		</template>
		<!-- 无分类数据 -->
		<view class="g-container-nodata min_h_100 p-t-30 dis-flex flex-x-center flex-y-center" v-else>
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
				<view class="col-9">亲, 没有相关内容</view>
			</tui-no-data>
		</view>
		<!-- 确认购买弹窗 -->
		<proSpecs ref="proSpecs"></proSpecs>
		<!-- 自定义tabbar -->
		<foot-tabBar ref="footTabBar" dIndex='1' :homeStyle="homeStyle"></foot-tabBar>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import footTabBar from '@/components/foot-tabBar';
	import proSpecs from '@/components/goods/proSpecs/pro-specs';
	export default {
		components: {
			footTabBar,
			proSpecs,
		},
		data() {
			return {
				tabbar: [],
				height: 0, //scroll-view高度
				top: 0,
				currentTab: 0, //预设当前项的值
				scrollViewId: "id_0",
				list: [],//右边列表
				page: 1,
				loadding: false,
				pullUpOn: true,
				homeStyle: 'div',
			};
		},
		onLoad(options) {
			let that = this;
			// 设置分类列表高度
			that.$nextTick(() => {
				that.setListHeight();
				that.getList()
				// that.currentTab = 0;
				// that.scrollViewId = "id_0";
			});
		},
		onShow() {
			let that = this;
			that.homeStyle = app.homeStyle?app.homeStyle:'div';
		},
		methods: {
			//获取数据
			getList(){
				app._get('category/list',{}, res => {
					this.tabbar = res.data || [];
					if(this.tabbar.length){
						this.getGoodsList()
					}
				});
			},
			// 获取列表
			getGoodsList(){
				if(this.page==1){
					uni.showLoading({
					  title: '拼命加载中',
						mask: true
					});
				}
				let _item = this.tabbar[this.currentTab];
				let data = {
					category_id: _item.category_id,
					page: this.page
				};
				app._get('category/goodsList',data, res => {
					this.loadding = false;
					// 判断特殊
					if(_item.category_id=='hot'||_item.category_id=='rmd'||_item.category_id=='tag'){
						this.$set(_item,'list',res.data || []);
					}else{
						if(this.page==1){
							this.$set(_item,'list',res.data || []);
						}else{
							let _list = JSON.parse(JSON.stringify(_item.list.data));
							let data = res.data;
							data.data = _list.concat(data.data);
							_item.list = data;
						}
						// if(this.tabbar[cur].list==undefined){}
					}
				},null, () => {
					uni.hideLoading()
				});
			},
			// 上拉加载下一页
			onBottom () {
				let that = this;
				let _item = that.tabbar[that.currentTab];
				if(_item.category_id!='hot'&&_item.category_id!='rmd'&&_item.category_id!='tag'){
					let last_page = _item.list.last_page;
					if (!that.pullUpOn) return;
						that.loadding = true;
					if (that.page >= last_page) {
						that.loadding = false;
						that.pullUpOn = false;
					} else {
						that.page = ++that.page;
						// that.loadding = false;
						that.loadding = true;
						that.getGoodsList();
					}
				}
			},
			//立即购买
			openDialog(item) {
				this.$refs.proSpecs._open(item)
			},
			// 设置分类列表高度
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						scrollHeight = systemInfo.windowHeight - res[0].height - 49 - 10; // swiper高度
						// #ifdef MP-WEIXIN
						scrollHeight = systemInfo.windowHeight - res[0].height - 49 - 10; // swiper高度
						// #endif
			
						this.height = scrollHeight;
						this.top = res[0].height + 10
				});
			},
			// 点击标题切换当前页时改变样式
			swichNav(cur) {
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur;
					if(this.tabbar[cur].list==undefined){//||this.tabbar[cur].list.length<=0
						this.page = 1;
						this.getGoodsList()
						this.checkCor();
					}else{
						this.page = this.tabbar[cur].list.current_page;
					}
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor() {
				if (this.currentTab > 6) {
					this.scrollViewId = `id_${this.currentTab - 2}`;
				} else {
					this.scrollViewId = `id_0`;
				}
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/goods/index?goods_id=' + item.wxapp_goods_id
				});
			},
			productList(item) {
				let url = '';
				if(item.category_id == "tag"){
					url = '/pages/goods/tagGoodsList/tagGoodsList?tag='+item.name;
				}else{
					url = '/pages/category/extend/list?source=category&category_id='+item.category_id
				}
				uni.navigateTo({
					url: url
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import 'index';
</style>
