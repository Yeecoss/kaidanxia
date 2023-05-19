<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<view class="fixedBg">
			<image src="https://pic.kaidanxia.com/2020-12-11/1119436aff11583.png" mode="scaleToFill"></image>
		</view>
		<navigationBar title="总收益记录" extClass="nav" id="top" background="transparent" color="white" titleColor="white"></navigationBar>
		<view class="heardBox">
			<view class="allNum">
				{{total_commission}}
			</view>
			<view class="allNumTip" @tap="showTip">
				总收益(元)
				<text class="iconfont2 icon-guize"></text>
			</view>
		</view>
		<scroll-view scroll-y :style="'height: ' + scrollHeight  + 'px;'" style="margin-top: 20rpx;" @scrolltolower="bindDownLoad">
			<view class="scrollBox">
				<view class="listBox" v-for="(item, index) in list" :key="index">
					<view class="listTitle">
						{{item.time}}
					</view>
					<view class="listItem" v-for="(items, indexs) in item.list" :key="indexs" @tap="toDetail(items)">
						<view class="dis-flex flex-y-center">
							<view class="imgBox">
								<image :src="items.wxapp.logo" mode="aspectFill"></image>
							</view>
							<view class="shopName">
								{{items.wxapp.name}}
							</view>
						</view>
						<view class="numItemBox dis-flex flex-y-center flex-x-between">
							<view class="numItem">
								<view class="numTitle">
									订单总数
								</view>
								<view class="numCount">
									{{items.total_order || 0}}
								</view>
							</view>
							<view class="line"></view>
							<view class="numItem">
								<view class="numTitle">
									成交总额(元)
								</view>
								<view class="numCount">
									{{items.total_sale || 0.00}}
								</view>
							</view>
							<view class="line"></view>
							<view class="numItem">
								<view class="numTitle">
									总收益(元)
								</view>
								<view class="numCount">
									{{items.total_profit || 0.00}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="no_more" class="no-more f-24 col-9">开单虾技术支持～</view>
		</scroll-view>
		<popup-tips ref="popupTips" title="提示" content="用户订单确认收货后根据收益比例计入" :showConcle="false" confirmText="我知道了"></popup-tips>
	</view>
</template>

<script>
	import popupTips from '@/components/popup-tips/index';
	const app = getApp().globalData;
	export default {
		components: {
			popupTips
		},
		data() {
			return {
				page: 1,
				last_page: 1,
				no_more: false,
				list: [],
				total_commission: '0.00',
				scrollHeight: 0,
				logo: 'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eriaibVfpicXgLfxBDRxO8coVCPFaZzuX5CujrcE4VASicp3ARhfgp0iaPbGAd1vdg2CVTC1I8aibYAQbIw/132',
			}
		},
		mounted() {
			this.$nextTick(() => {
			  this.setListHeight()
			})
			this.getData()
		},
		methods: {
			showTip() {
				this.$refs.popupTips.open()
			},
			bindDownLoad() {
				// 已经是最后一页
				if (this.page >= this.last_page) {
					this.no_more = true
					return false;
				} // 加载下一页列表
				this.page ++;
				this.getData();
			},
			setListHeight() {
			  const query = wx.createSelectorQuery();
			  query.select('#top').boundingClientRect();
			  query.selectViewport().scrollOffset();
			  query.exec(res => {
			    let systemInfo = wx.getSystemInfoSync(),
			        rpx = systemInfo.windowWidth / 750,
			        // tap高度
			    scrollHeight = systemInfo.windowHeight - res[0].height - 230 * rpx; // swiper高度
			
			    this.scrollHeight = scrollHeight
			  });
			},
			toDetail(item) {
				uni.navigateTo({
					url: './detail/index?seller_wxapp_id=' + item.seller_wxapp_id
				})
			},
			getData(){
				app._get('share.make_money/getTotalCommissionList', {
					page: this.page
				}, (result) => {
					if (result.code == 1) {
						this.total_commission = result.data.total_commission || 0.00
						this.last_page = result.data.list.last_page || 1
						let newlist = result.data.list.data || []
						let _list = []
						
						if(this.page!=1){
							_list = this.list
						}
							
						newlist.forEach(items => {
							let isHave = false
							_list.forEach(item => {
								if (item.create_time.indexOf(items.time) != -1) {
									isHave = true
									item.list.push(items)
								}
							})
							if (!isHave) {
								let itemList = []
								itemList.push(items)
								_list.push({
									create_time: items.create_time,
									time: items.create_time.substring(0, 11),
									list: itemList
								})
							}
						})
						this.list = _list
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
