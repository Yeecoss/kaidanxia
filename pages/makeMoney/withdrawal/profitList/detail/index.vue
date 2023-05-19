<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="店铺收益" extClass="nav" id="top" background="transparent"></navigationBar>
		 <scroll-view scroll-y :style="'height: ' + scrollHeight  + 'px;'" @scrolltolower="bindDownLoad">
			 <view class="heardBox">
			 	<view class="allNum">
			 		{{total_commission}}
			 	</view>
				<view class="allNumTip">
					店铺{{is_today ? '今日' : '总'}}收益(元)
				</view>
			 </view>
			 <view class="listBox" v-for="(item, index) in list" :key="index">
			 	<view class="listTitle">
			 		{{item.time}}
			 	</view>
			 	<view class="listItem" v-for="(items, indexs) in item.list" :key="indexs">
					<view class="numItemBox dis-flex flex-y-center">
						<view class="imgBox">
							<image :src="items.avatarUrl" mode="aspectFill"></image>
						</view>
						<view class="dis-flex flex-y-center flex-x-between" style="flex:1">
							<view class="numItem">
								<view class="numTitle1">
									{{items.nickName}}
								</view>
								<view class="numCount1">
									商品数：{{items.total_num || 0}}
								</view>
							</view>
							<view class="line"></view>
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
									收益(元)
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
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				list: [],
				page: 1,
				last_page: 1,
				no_more: false,
				is_today: 0,
				seller_wxapp_id: '',
				total_commission: '0.00',
				scrollHeight: 0
			}
		},
		mounted(e) {
			this.$nextTick(() => {
			  this.setListHeight()
			})
		},
		onLoad(e) {
			if (e.seller_wxapp_id){
				this.seller_wxapp_id = e.seller_wxapp_id || []
			}
			if (e.is_today){
				this.is_today = e.is_today || 0
			}
			this.getData()
		},
		methods: {
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
			    scrollHeight = systemInfo.windowHeight - res[0].height; // swiper高度
			
			    this.scrollHeight = scrollHeight
			  });
			},
			getData(){
				app._get('share.make_money/getWxappCommission', {
					page: this.page,
					is_today: this.is_today,
					store_wxapp_id: this.seller_wxapp_id
				}, (result) => {
					if (result.code == 1) {
						this.last_page = result.data.list.last_page || 1
						this.total_commission = result.data.total_commission || 0.00
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
