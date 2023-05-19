<template>
  <view class="bgf8">
    <!-- 自定义标题栏 -->
    <navigationBar :back="false" :background="homeStyle=='minishop'?'linear-gradient(to right, #F27257 0%, #FF9781 100%)':'#fff'" :color="homeStyle=='minishop'?'#fff':''">
      <view
        class="left-title dis-flex flex-y-center"
        slot="left"
        @tap.stop="choiceShop"
      >
        <view>
					<view class="shopIcon shopIcon-noani shopIcon-image" v-if="homeStyle == 'sportshop'">
						<image src="https://pic.kaidanxia.com/2021-04-23/134255b56fc3754.png" mode="aspectFill"></image>
					</view>
					<!-- <text v-if="homeStyle == 'sportshop'" class="shopIcon shopIcon-noani iconfont2 icon-bianzu7"> </text> -->
					<text v-else-if="homeStyle == 'minishop'" class="shopIcon iconfont2 icon-Chooseastore col-f"> </text>
          <text v-else class="shopIcon iconfont2 icon-shop4 app-red"> </text>
          <tui-bubble-popup
            position="absolute"
            top="70rpx"
            :mask="false"
						borderWidth="20rpx"
            :show="showTrue"
            triangleLeft="40rpx"
            triangleTop="-40rpx"
            width="340rpx"
            height="200rpx"
            :flexEnd="false"
						radius="8rpx"
            backgroundColor="white"
          >
            <view class="tui-chat-text">
              <view class="col-3">浏览过的店铺在这里哦！</view>
              <view class="col-m okBut" @tap.stop="closeShop">知道了</view>
            </view>
          </tui-bubble-popup>
        </view>
				<view v-if="homeStyle == 'minishop'" class="shopIcon-img"><image :src="wxapp.logo" mode="aspectFill"></image></view>
        <view class="text onelist-hidden" :class="homeStyle == 'minishop'?'col-f':''">{{ showTitle }}</view>
				<!-- 官方tag -->
        <image
          class="usShop"
          v-if="is_offical == 1"
          src="https://pic.kaidanxia.com/2020-08-20/20200820142205abb5d8132.png"
        ></image>
				<!-- 代理tag -->
        <image
          class="usShop"
          v-if="is_dealer == 1"
          src="https://pic.kaidanxia.com/2020-09-07/20200907110102eff6f0110.png"
        ></image>
      </view>
    </navigationBar>
    <!-- 首页的内容 -->
    <view v-show="typeOn == 0">
			<template v-if="homeStyle != 'minishop'&&homeStyle != 'sportshop'&&homeStyle != 'saler'">
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
				<!-- <header-top :homeStyle="homeStyle" :isCheckGoods="isCheckGoods" :typeOn="typeOn" @switchTab="switchTab"></header-top> -->
			</template>
			<!-- 卖手圈 -->
      <view v-if="homeStyle == 'saler'">
        <saler-page ref="salerPage" :homeStyle="homeStyle" :isCheckGoods="isCheckGoods" @switchTab="switchTab" @priview="priview"></saler-page>
      </view>
			<!-- 简约 -->
			<view v-if="homeStyle == 'minishop'">
				<small-store ref="minishop" :homeStyle="homeStyle" :isCheckGoods="isCheckGoods" @switchTab="switchTab"></small-store>
			</view>
			<!-- 运动潮服 -->
			<view v-if="homeStyle == 'sportshop'">
				<sports-store ref="sportshop" :homeStyle="homeStyle" :isCheckGoods="isCheckGoods" @switchTab="switchTab"></sports-store>
			</view>
      <!-- DIY组件默认模板 -->
      <view v-if="homeStyle == 'div'||homeStyle == ''">
        <diy-component
          :user="user"
          :diyItems="items" :animation="animation"
          ref="diyComponent"
        ></diy-component>
        <!-- 底线 -->
        <view class="title-footer p-r">
          <text class="f-24 col-9">开单虾技术支持～</text>
        </view>
        <!-- <guidePage v-if="homeStyle != ''" title="indexPage"></guidePage> -->
      </view>
			<!-- 活动弹窗 -->
			<activity-model ref="activityModel"></activity-model>
    </view>

    <!-- 关注的内容 -->
    <!-- <view v-show="typeOn == 1">
      <attention
        ref="attention"
        :isCheckGoods="isCheckGoods"
				:homeStyle="homeStyle"
        @typeTab="switchTab"
      ></attention>
      <guidePage title="attentionPage"></guidePage>
    </view> -->

    <!-- 自定义tabbar -->
    <foot-tabBar ref="footTabBar" dIndex="0" :homeStyle="homeStyle"></foot-tabBar>
    <!-- 提示框 -->
    <!-- <tui-tips position="center" ref="toast" v-if="index==1"></tui-tips> -->
    <view v-show="isLoading">
      <loading></loading>
    </view>
    <!-- 拉黑提示 -->
    <popup-tips
      ref="popupTips"
      :title="mtitle"
      :content="mcontent"
      confirmText="联系商家"
      concelText="返回个人中心"
    ></popup-tips>
    <!-- 赚钱功能-赚一赚 -->
    <view class="applyImg" v-if="is_shared==1" @tap="toApply">
      <image src="https://pic.kaidanxia.com/2020-12-22/170617bce027884.gif" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script>
const App = getApp().globalData;
// import headerTop from './extend/_header/index';
import diyComponent from "@/components/diy/index";
import salerPage from "@/components/diy/saler/index";
import smallStore from "@/pages/index/extend/small_store/index";
import sportsStore from "./extend/sports_store/index";
// import attention from "./extend/optimization/index";
import footTabBar from "@/components/foot-tabBar";
import loading from "@/components/loading";
// import guidePage from "@/components/guide-page";
import popupTips from "@/pages/index/blockModel/index";
import activityModel from "@/pages/index/activityModel/index";

export default {
  components: {
		// headerTop,
    diyComponent,
    salerPage,
    footTabBar,
    // attention,
    loading,
    // guidePage,
    popupTips,
		smallStore,
		sportsStore,
		activityModel
  },
  data() {
    return {
			// opcity: 0,
			// scrollH: 0, //滚动总高度
      showTrue: false,
      showTitle: '',
      title: "",
      wxapp: {},
      is_offical: "",
      is_dealer: "",
      user: {},
      // ifsea: false,
      //是否存在搜索
      // 页面参数
      options: {},
      // 页面元素
      items: {},
      page: {},
      scrollTop: 0,
      // frontColor: "",
      // backgroundColor: "",
      typeOn: 0,
      isLoading: true,
      index: 1, //提示框
      ifManage: false, //默认不显示多选框
      homeStyle: "div", //店铺模板
      isCheckGoods: false,
      mtitle: "",
      mcontent: "",
			ifPreview: false,//卖手圈预览
			
			// mbid: '',//赚一赚b的参数
			is_shared: 0,//默认赚关闭
			commission_pass: -1,//默认新用户 并未申请
			animation: false
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
		this.showTrue = !uni.getStorageSync('isShopTip')
    this.typeOn = 0;
    // 当前页面参数
    this.setData({
      options,
    });
		let scene = App.getSceneData(options);
		let mbid = options.mbid ? options.mbid : (scene.mbid? scene.mbid: ''); 
		let wxapp_id = options.wid ? options.wid : (scene.wid? scene.wid: ''); 
    if (options.wid) {
      App.wxapp_id = options.wid;
      wx.setStorageSync("wxapp_id", options.wid);
    }
		if(mbid!=''&&mbid!='undefined'){
			uni.setStorageSync('mbidObj',JSON.stringify({mbid: mbid,wxapp_id: wxapp_id}));
			App.bindMbid();
		}
    // #ifdef MP
    wx.showShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
      success(res) {},
      fail(e) {},
    });
    // #endif
		this.pageReport()
  },
  onShow() { 
    // if (this.typeOn == 0) {
			// 更新主题tabbar
			// App.$store.commit('getTheme',App)
			if(!this.ifPreview){
				this.animation = true;
				this.getSetting();
			}else{
				this.$nextTick(()=>{
					this.ifPreview = false
				})
			}
    // } else {
    //   this.$refs.attention._show();
    // }
	},
	onHide() {
		this.animation = false;
		this.is_shared = 0;
	},
  // 分享当前页面
  onShareAppMessage(res) {
		let user_id = uni.getStorageSync('user_id')||'';
		// 构建分享参数
		if(res.from=='button' && res.target.id){
			return {
				title: '商品详情',
				path: "/pages/goods/index?goods_id=" +res.target.id+'&mbid='+user_id,
				imageUrl: res.target.dataset.shareimg
			};
		}else{
			return {
				title: this.title,
				path: "/pages/index/index?wid=" + App.wxapp_id+'&mbid='+user_id,
			}
		}
  },
  onShareTimeline(res) {
		let user_id = uni.getStorageSync('user_id')||'';
    let shareObj = {
      title: this.title,
      query: "wid=" + App.wxapp_id+'&mbid='+user_id,
    };
    return shareObj;
  },
  // 下拉刷新
  onPullDownRefresh () {
    // 获取首页数据
    // if (this.typeOn == 0) {
			this.getSetting(true);
    // } else {
    //   this.$refs.attention._onPullDownRefresh();
    // }
  },
  onReachBottom() {
    // if (this.typeOn == 1) {
    //   this.$refs.attention._onReachBottom();
    // } else {
      if (this.homeStyle == "saler") {
        this.$refs.salerPage._onReachBottom();
      }
    // }
  },
  methods: {
		// 上报
		pageReport(){
			let obj = {
			  type: "1",
			  url: "pages/index/index",
			  wxapp_id: App.wxapp_id + "",
			};
			App._post_form("user/visit", obj, result => {
			  
			});
			let objFollowStore = {
			  wxapp_id: App.wxapp_id + "",
			};
			App._post_form("user/browseStore",{
			    browse: JSON.stringify(objFollowStore),
			  }, result => {}
			);
		},
		// 赚路径
	  toApply() {
			if(this.commission_pass==-1 || this.commission_pass==0||this.commission_pass==2){
				uni.navigateTo({
					url: '/pages/makeMoney/apply/index'
				});
			}else if(this.commission_pass==1){
				uni.navigateTo({
					url: '/pages/makeMoney/index?wxapp_id='+App.wxapp_id
				});
			}
	  },
    closeShop() {
			this.showTrue = false
			uni.setStorageSync('isShopTip', true)
		},
    //获取模板配置
    getSetting(stopPullDown) {
			let that = this;
			let datas = {
				wxapp_id: App.wxapp_id
			};
      App._get("wxapp/setting", datas, (res) => {
        //判断是否被拉黑
        if (res.code == 1000) {
          that.mtitle = "提示";
          that.mcontent = res.msg;
					let user = res.user;
					user.service_qrcode = res.wxapp.service_qrcode;
          that.$refs.popupTips.open(
            false,
            () => {
              App.wxapp_id = App.myShopInfo.wxapp_id;
              wx.setStorageSync("wxapp_id", App.myShopInfo.wxapp_id);
              uni.reLaunch({
                url: "/pages/userIndex/index",
              });
            },
            user
          );
          return false;
        }
        //店铺使用模板
        let info = res.data.wxapp;
				// 设置顶部导航栏栏
				that.title = info.wxapp_name;
				that.showTitle = that.title.length > 10 ? that.title.slice(0, 10) + '...' : that.title;
				that.setWxapp(res.data);//商家信息
				let obj = res.data.user || {};
				obj.service_qrcode = that.wxapp.service_qrcode
        that.user = obj;
				let homeStyle = info.homeStyle?info.homeStyle:'div';
        that.homeStyle = homeStyle;
				App.homeStyle = homeStyle;
				that.$nextTick(() => {
					if(info.homeStyle == 'div'||info.homeStyle == ''){
						that.getPageData(() => {
							if(stopPullDown){uni.stopPullDownRefresh();}
						});
					}
					if (info.homeStyle == "saler") {
					  that.$refs.salerPage._show((data) => {
					    that.isLoading = false;
							if(stopPullDown){uni.stopPullDownRefresh();}
					  });
					} 
					if(info.homeStyle == "minishop"){
						that.$refs.minishop._show((data) => {
						  that.isLoading = false;
							if(stopPullDown){uni.stopPullDownRefresh();}
						});
					} 
					if(info.homeStyle == 'sportshop'){
						that.$refs.sportshop._show((data) => {
						  that.isLoading = false;
							if(stopPullDown){uni.stopPullDownRefresh();}
						});
					} 
					// else {
					//   that.getPageData(() => {
					// 		if(stopPullDown){uni.stopPullDownRefresh();}
					// 	});
					// }
				})
				//活动信息
				if(res.data.popups.popups_id){
					that.$refs.activityModel._open(res.data.popups || {})
				}
				// 赚的参数
				that.is_shared = info.is_shared || 0;
				if(App.myShopInfo.wxapp_id==App.wxapp_id){
					that.is_shared = 0;
				}
				that.commission_pass = res.data.commission_pass || -1;
					
        //是否显示采购按钮
        if (App.myShopInfo) {
          if (
            App.myShopInfo.wxapp_id == App.wxapp_id ||
            that.wxapp.showDealerGoods == "off"
          ) {
            that.isCheckGoods = false;
          } else {
            that.isCheckGoods = true;
          }
        } else {
          that.isCheckGoods = true;
        }
      });
    },
    choiceShop() {
      uni.navigateTo({
        url: "/pages/retailShop/shopAbout/choiceShop/index",
      });
    },
    /**
     * 加载页面数据
     */
    getPageData (callback) {
      let that = this;

      App._get("page/index",{
          page_id: that.options.page_id || 0,
        }, result => {
          callback ? callback() : "";
					that.isLoading = false;
					
          that.page = result.data.page;
          that.items = result.data.items;
          if (that.$refs.diyComponent.$refs.diySharpGoods) {
            that.$refs.diyComponent.$refs.diySharpGoods.forEach((element) => {
              element.unit();
            });
          }
        }
      );
    },
		setWxapp(data){
			this.wxapp = data.wxapp;
			this.is_offical = data.wxapp.is_offical;
			this.is_dealer = data.wxapp.is_dealer;
		},
    /**
     * 设置顶部导航栏
     */
    setPageBar (data) {
      this.title = data.wxapp.wxapp_name;
			// this.showTitle = this.title.length > 10 ? this.title.slice(0, 10) + '...' : this.title
			return this.title.length > 10 ? this.title.slice(0, 10) + '...' : this.title
    },
    // 切换tab
    switchTab(id) {
      // this.typeOn = id;
      // if (this.typeOn == 1) {
      //   this.$refs.attention._show();
      // }
      if (id == 1) {
				uni.navigateTo({
					url: '/pages/optimization/index'
				})
      }else{
				this.typeOn = id;
			}
    },
    switchTab2() {
      uni.navigateTo({
        url:
          "/pages/retailShop/shopAbout/shopDetail/index?wxapp_id=" +
          App.wxapp_id,
      });
    },
    // 更新关注页面数据
    // listChange(res) {
    //   this.$refs.attention.listChange(res);
    // },
		priview(e){
			this.ifPreview = e;
		},
  },
};
</script>
<style lang="scss" scoped>
	@import "./index";
</style>