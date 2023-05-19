<template>
	<view class="pad_lr30">
		<!-- 自定义标题栏 -->
		<navigationBar title="选择参与人" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<checkbox-group class="goods-list" @change.stop="choose">
				<view class="list f-28 col-3" v-for="(item,index) in list" :key="index">
					<label class="check-wrap default-check dis-flex flex-y-center">
						<checkbox class="checkbox" :value="item.user_id+''" :checked="item.checked" />
						<view class="user_img m-l-20">
							<image lazy-load :src="item.avatarUrl" mode="aspectFill"></image>
							<view :class="'user_sex iconfont2 f-20 '+[item.gender==1?'icon-boy':'icon-girl']"></view>
						</view>
						<view class="user_info m-l-20 dis-flex flex-y-center">
							<view class="user_name onelist-hidden f-28 col-3">{{item.nickName}}</view>
							<view class="user-status f-24 col-f m-l-20" :class="item.type!=2?'ispart':''">{{item.type==2?'渠道':'团队'}}</view>
						</view>
					</label>
				</view>
			</checkbox-group>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.length==0">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 底部 -->
		<view class="footer" v-if="list.length">
			<view class="foot wrap30 dis-flex flex-y-center flex-x-between">
				<checkbox-group class="check-wrap default-check checked-all f-28 col-3 dis-flex flex-y-center" @change="chooseAll">
					<label class="check-wrap default-check dis-flex flex-y-center">
						<checkbox :checked="isAll"/>全选
					</label>
				</checkbox-group>
				<view class="foot-btn f-28 col-f" @tap.stop="toSubmit">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp().globalData;
	export default {
		data() {
			return {
				list: [],//列表
				checkList: [],//选中的id
				isAll: false,
			}
		},
		onLoad(options) {
			
			let that = this;
			app._get('backlog/getDistributor',{}, res => {
				that.list = res.data || [];
				
				if(options){
					that.checkList = JSON.parse(decodeURIComponent(options.listData));
					that.choose(that.checkList);
				}
			});
		},
		methods: {
			// 提交
			toSubmit(){
				let that = this;
				that.pageBack(that.checkList);
			},
			// 选中
			choose(e) {
				let that = this;
				var items = this.list,
						values = e.detail.value;
						
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i];
					if(values.includes(item.user_id.toString())){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
				//  是否全部勾选，判断全选与否状态
				let checkList = [];
				this.list.forEach(item => {
					item.checked == true? checkList.push(item.user_id.toString()): ''
				});
				let allChecks = checkList.length == this.list.length;
				this.isAll = allChecks ? true:false;
				this.checkList = checkList;
			},
			// 全选
			chooseAll(e){
				let that = this;
				if (e.detail.value.length == 0) {
						that.list.map(item => that.$set(item, 'checked', false))
						that.isAll= false;
				} else {
						that.list.map(item => that.$set(item, 'checked', true))
						that.isAll= true;
				}
				var checkList = [];
				that.list.forEach(item => {
					item.checked == true? checkList.push(item.user_id.toString()): ''
				});
				that.checkList = checkList;
			},
			//返回
			pageBack(data){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.userChange){
					prevPage.$vm.userChange(data)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import "../../freight/address";
	@import "index";
</style>
