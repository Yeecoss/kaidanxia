<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="兑换会员" extClass="nav" id="top"></navigationBar>
		<view class="main bgf">
			<view class="f-30 col-3 m-b-40 f-w">兑换专属优惠价</view>
			<view :class="['memberTab m-b-60 p-b-40 '+'memberTab'+index,memberTab==index?'active':'']" @tap="memberChange(index)" v-for="(item, index) in member" :key="index">
				<view class="member-title t-c f-32 f-w">{{item.title}}</view>
				<view class="dis-flex flex-y-center flex-x-center m-top30 m-b-30">
					<view class="col-3 f-28">¥<text class="f-48">{{item.money}}/年</text></view>
					<view class="sheng f-24 t-c m-l-20">{{item.sheng}}</view>
				</view>
				<view class="f-32 t-c col-6">{{item.text}}</view>
			</view>
			<button type="default" class="pay-btn" :class="'pay-btn'+memberTab" :disabled="disabled" @tap="exchange">{{disabled?'余额不足':'立即兑换'}}</button>
		</view>
		<!-- 兑换规则 -->
		<view class="main bgf wrap30 m-t-20">
			<view class="f-30 col-3 m-b-30 f-w">兑换规则</view>
			<view class="f-28 col-9 line-height-40 m-b-20">1、该价格为赚钱店小二专属兑换价格，只有店铺店小二才能兑换</view>
			<view class="f-28 col-9 line-height-40 m-b-20">2、账户余额要大于兑换会员价格</view>
		</view>
		
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent"></popup-tips>
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			popupTips
		},
		data() {
			return {
				mtitle:'',
				mcontent:'',
				member: [
					{vip: 4, title: '龙虾会员·年卡', money:'1198', sheng:'立省300元', text:'原价¥1498/年-优惠¥300=¥1198/年'},
					{vip: 3, title: '明虾会员·年卡', money:'398', sheng:'立省100元', text:'原价¥498/年-优惠¥100=¥398/年'},
				],
				memberTab: 0,
				disabled: true,
				userInfo: {},
				available_money: 0,
			}
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			// 获取余额
			getInfo() {
				app._get('user.index/detail', {}, (res) => {
					if (res.code == '1') {
						this.userInfo = res.data.userInfo|| {};
						this.available_money = res.data.userInfo.available_money|| 0;
						this.compare();
					}
				});
			},
			// 购买会员
			exchange(){
				this.mtitle = "提示";
				this.mcontent = "确认购买？";
				this.$refs.popupTips.open(() => {
					app._post_form('vip.collection/buyUserBalance',{vip: this.member[this.memberTab].vip}, res => {
						this.$refs.toast.showTips({msg: res.msg});
						this.getInfo()
					});
				});
			},
			// 切换选项
			memberChange(index){
				this.memberTab = index;
				this.compare();
			},
			compare(){
				if(this.available_money > this.member[this.memberTab].money){
					this.disabled = false;
				}else{
					this.disabled = true;
				}
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
