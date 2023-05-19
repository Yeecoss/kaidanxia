<template>
	<view>
		<view class="main_goods" v-for="(item, index) in activeList" :key="index">
		  <!-- 商品图片 -->
			<picture-group v-if="item.wxappgoods" :images="item.wxappgoods.goods.image"></picture-group>
					  
		  <view class="main_goods_right">
		    <!-- 商品标题 -->
		    <view class="main_goods_title_box">
		      <view>
		        <text class="main_goods_title twolist-hidden">{{ item.wxappgoods.goods.goods_name }}</text>
		      </view>
		      <text class="more f-24 col-m" @tap.stop="onTargetActive(item.active_id)">更多<text class="iconfont2 icon-gengduobeifen2 f-24"></text></text>
		    </view>
		    <!-- 商品信息 -->
		    <view class="main_goods_desc">
		      <view class="desc_footer dis-flex flex-y-center">
		        <text class="price_x col-m">¥{{ item.floor_price }}</text>
		        <text class="price_y cl-9">¥{{ item.wxappgoods.goods.goods_sku.goods_price }}</text>
		      </view>
		      <!-- 参与的用户头像 -->
		      <view v-if="item.helps_count > 0" class="peoples dis-flex">
		        <view class="user-list dis-flex">
		          <view v-for="(help, index2) in item.helps" :key="index2" class="user-item-avatar">
		            <image lazy-load :src="help.avatarUrl"></image>
		          </view>
		        </view>
		        <view class="people__text">
		          <text>{{ item.helps_count }}人正在砍价</text>
		        </view>
		      </view>
					<!-- 砍价进度 -->
					<view class="task-rate" v-if="currentTab==1">
					  <block v-if="item.status">
							<block v-if="!item.is_floor">
								<text>已砍</text>
								<text class="col-m">{{ item.cut_money }}元，</text>
								<text></text>
								<text>只差</text>
								<text class="col-m">{{ item.surplus_money }}元</text>
								<text></text>
							</block>
							<block v-if="item.is_floor">
								<text>已砍至最低</text>
								<text class="col-m">{{ item.floor_price }}元</text>
								<text></text>
							</block>
					  </block>
					</view>
					<!-- 任务状态 -->
					<view class="task-status dis-flex flex-y-center" v-if="currentTab==1">
						<!-- 倒计时 -->
						<view v-if="item.status" class="count-down dis-flex flex-y-center">
							<view class="clock-text">
								<text class="iconfont2 icon-shijian"></text>
								<text>剩余</text>
							</view>
							<view class="clock">
									<tui-countdown :time="countDownList0[index]" color="#333" borderColor="#D0D0D0" :size="22" colonColor="#333" :colonSize="24" :scale="true"></tui-countdown>
							</view>
						</view>
						<view v-if="!item.status" class="task-status__text">
							<text class="col-m">{{ item.is_buy ? '砍价成功' : '已结束' }}</text>
						</view>
					</view>
		      <!-- 规格 -->
		      <view class="sku f-24">
		        <template v-if="item.wxappgoods.goods && item.wxappgoods.goods.goods_multi_spec && item.wxappgoods.goods.goods_multi_spec.spec_attr">
		          <view class="sku_item dis-flex flex-y-center" v-for="(vo, index2) in item.wxappgoods.goods.goods_multi_spec.spec_attr" :key="index2">
		            <text class="sku_title col-9">{{vo.group_name}}</text>
								<view class="onelist-hidden flex-box">
									<text v-for="(vo1, vindx) in vo.spec_items" :key="vindx">
										{{vo1.spec_value}}{{(vo.spec_items.length-1) > vindx ? '/' : ''}}
									</text>
								</view>
		          </view>
		        </template>
		      </view>
		    </view>
		    <!-- 操作按钮 -->
		    <view class="optbox">
					<view class="oper-item f-24 col-6" @tap="upload(item.wxappgoods.goods.image)"><text class="iconfont2 icon-download f-30 m-r-10"></text>下载</view>
					<template v-if="currentTab==1">
						<button class="settlement" v-if="item.status" @tap="onTargetTask(item.task_id)">继续砍价</button>
						<button disabled class="settlement" v-else>已结束</button>
					</template>
					<template v-else>
						<button class="settlement" @tap.stop="openDialog(item)">立即参加</button>
					</template>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import pictureGroup from '@/components/goods/picture-group/index';
	export default{
		components: {
			pictureGroup,
		},
		props:{
			currentTab: [String,Number],
			barginList: {
				type: Array,
				default:()=> {
					return []
				}
			},
			// 倒计时列表
			countDownList: {
				type: Array,
				default:()=> {
					return []
				}
			},
		},
		data() {
			return {
				activeList: this.barginList,
				countDownList0: this.countDownList,
				checkList: [],//选中的数据
				isAll: false,
			}
		},
		watch: {
		  barginList: function observer(newVal,oldVal) {
				if (newVal) {
					this.activeList = newVal;
				}else{
					this.activeList = oldVal;
				}
		  },
		  countDownList: function observer(newVal,oldVal) {
				if (newVal) {
					this.countDownList0 = newVal;
				}else{
					this.countDownList0 = oldVal;
				}
		  },
		},
		methods:{
			openDialog(item){
				this.$emit('openDialog', item)
			},
			onTargetTask(task_id){
				this.$emit('onTargetTask', task_id)
			},
			upload(files){
				this.$emit('upload', files)
			},
			onTargetActive(active_id){
				uni.navigateTo({
				  url: `../goods/index?active_id=${active_id}`
				});
			},
		}
	}
</script>

<style lang="scss">
	@import 'barginGood';
</style>
