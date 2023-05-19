<template>
	<!--screen-->
	<view class="tui-header-screen">
		<view class="tui-screen-top">
			<view class="tui-top-item tui-icon-ml" :class="[tabIndex == 0 ? 'tui-active tui-bold' : '']" @tap="screen(0)">
				<view>{{ selectedName }}</view>
				<tui-icon :name="selectH > 0 ? 'turningup' : 'turningdown'" :size="16" :color="tabIndex == 0 ? '#E82E2E' : '#333'"></tui-icon>
			</view>
			<view class="tui-top-item" :class="[tabIndex == 1 ? 'tui-active tui-bold' : '']" @tap="screen(1)">
				<view>{{ selectedName2 }}</view>
				<tui-icon :name="selectH2 > 0 ? 'turningup' : 'turningdown'" :size="16" :color="tabIndex == 1 ? '#E82E2E' : '#333'"></tui-icon>
			</view>
			<view class="tui-top-item" :class="[tabIndex == 2 ? 'tui-active tui-bold' : '']" @tap="screen(2)">
				<view>收益</view>
				<view class="tui-relative">
					<text class="angle_top" :class="priceSort==1?'priceOn':''"></text>
					<text class="angle_bottom" :class="priceSort==-1?'priceOn':''"></text>
				</view>
			</view>
	
			<!--下拉选择列表--时间-->
			<view class="tui-dropdownlist" :class="[selectH > 0 ? 'tui-dropdownlist-show' : '']" :style="{ height: selectH + 'rpx' }">
				<view
					class="tui-dropdownlist-item tui-icon-middle col-3"
					:class="[item.selected ? 'tui-bold app-red' : '']"
					v-for="(item, index) in dropdownList"
					:key="index"
					@tap.stop="dropdownItem(item.val)"
				>
					<text class="tui-ml tui-middle">{{ item.name }}</text>
					<tui-icon name="check" :size="16" color="#E82E2E" :bold="true" v-if="item.selected"></tui-icon>
				</view>
			</view>
			<view class="tui-dropdownlist-mask" :class="[selectH > 0 ? 'tui-mask-show' : '']" @tap.stop="hideDropdownList"></view>
			<!--下拉选择列表--时间-->
			
			<!--下拉选择列表--等级-->
			<view class="tui-dropdownlist" :class="[selectH2 > 0 ? 'tui-dropdownlist-show' : '']" :style="{ height: selectH2 + 'rpx' }">
				<view
					class="tui-dropdownlist-item tui-icon-middle col-3"
					:class="[item.selected ? 'tui-bold app-red' : '']"
					v-for="(item, index) in dropdownList2"
					:key="index"
					@tap.stop="dropdownItem2(index)"
				>
					<text class="tui-ml tui-middle">{{ item.name }}</text>
					<tui-icon name="check" :size="16" color="#E82E2E" :bold="true" v-if="item.selected"></tui-icon>
				</view>
			</view>
			<view class="tui-dropdownlist-mask" :class="[selectH2 > 0 ? 'tui-mask-show' : '']" @tap.stop="hideDropdownList"></view>
			<!--下拉选择列表--等级-->
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data() {
			return {
				tabIndex: -1, //顶部筛选索引
				selectedName: '时间',
				selectH: 0,
				dropdownList: [
					{
						name: '全部',
						selected: true,
						val: 'all'
					},
					{
						name: '今日',
						selected: false,
						val: '0'
					},
					{
						name: '昨日',
						selected: false,
						val: '-1'
					},
					{
						name: '近七日',
						selected: false,
						val: '-7'
					}
				],
				selectedName2:'等级',
				selectH2: 0,
				dropdownList2: [
					{
						name: '全部',
						selected: true,
						val: 'all'
					},
					{
						name: '高级',
						selected: false,
						val: '3'
					},
					{
						name: '中级',
						selected: false,
						val: '2'
					},
					{
						name: '初级',
						selected: false,
						val: '1'
					}
				],
				priceSort: 0,
				
			}
		},
		methods: {
			screen(index) {
				this.hideDropdownList();
				if (index == 0) {
					// this.priceSort = 0;
					this.showDropdownList(0);
				} else if (index == 1) {
					// this.priceSort = 0;
					this.showDropdownList(1);
				} else if (index == 2) {
					this.showDropdownList(2);
					this.priceSort = this.priceSort==1? -1 : 1;
					
					let data = this.getData() ||'';
					this.$emit('compelete',data)
				}
			},
			// 时间选择
			// dropdownItem(index) {
			// 	let arr = this.dropdownList;
			// 	for (let i = 0; i < arr.length; i++) {
			// 		if (i === index) {
			// 			arr[i].selected = true;
			// 		} else {
			// 			arr[i].selected = false;
			// 		}
			// 	}
			// 	this.dropdownList = arr;
			// 	this.selectedName = arr[index].name;
			// 	this.selectH = 0;
				
			// 	let data = this.getData() ||'';
			// 	this.$emit('compelete',data)
			// },
			// 时间传入
			dropdownItem(val) {
				let arr = this.dropdownList;
				let name = '';
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].val === val) {
						arr[i].selected = true;
						name = arr[i].name;
					} else {
						arr[i].selected = false;
					}
				}
				this.dropdownList = arr;
				this.selectedName = name;
				this.selectH = 0;
				this.tabIndex = 0;
				
				let data = this.getData() ||'';
				this.$emit('compelete',data)
			},
			// 选框显示
			showDropdownList(index) {
				if(index==0){
					this.selectH = 320;
				}
				if(index==1){
					this.selectH2 = 320;
				}
				this.tabIndex = index;
			},
			hideDropdownList() {
				this.selectH = 0;
				this.selectH2 = 0;
			},
			// 等级选择
			dropdownItem2(index) {
				let arr = this.dropdownList2;
				for (let i = 0; i < arr.length; i++) {
					if (i === index) {
						arr[i].selected = true;
					} else {
						arr[i].selected = false;
					}
				}
				this.dropdownList2 = arr;
				this.selectedName2 = arr[index].name;
				this.selectH2 = 0;
				
				let data = this.getData() ||'';
				this.$emit('compelete',data)
			},
			getData(){
				let data = {};
				for (let i in this.dropdownList) {
					if(this.dropdownList[i].selected){
						data.date = this.dropdownList[i].val;
					}
				}
				for (let i in this.dropdownList2) {
					if(this.dropdownList2[i].selected){
						data.level = this.dropdownList2[i].val;
					}
				}
				if(this.priceSort==1){
					data.sort = 'asc';
				}else if(this.priceSort==-1){
					data.sort = 'desc';
				}else{
					data.sort = '';
				}
				return data;
			},
		}
	}
</script>

<style lang="scss">
	.tui-bold {
		font-weight: bold;
	}
	.tui-active {
		color: $red;
	}
	.tui-screen-top{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
	}
	.tui-screen-top {
		height: 88rpx;
		position: relative;
		background: #fff;
	}
	.tui-top-item {
		height: 88rpx;
		line-height: 88rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tui-topitem-active {
		color: $red;
	}
	.tui-relative{
		position: relative;
		width: 16rpx;
		height: 100%;
		margin-left: 10rpx;
	}
	.angle_top {
		content: '';
		width: 0;
		height: 0;
		display: block;
		border-style: solid;
		border-width: 0 8rpx 12rpx;
		border-color: transparent transparent #DEDEDE;
		position: absolute;
		top: 32rpx;
		right: 0;
	}
	.angle_bottom {
		content: '';
		width: 0;
		height: 0;
		display: block;
		border-style: solid;
		border-width: 0 8rpx 12rpx;
		border-color: transparent transparent #DEDEDE;
		position: absolute;
		transform: rotate(180deg);
		bottom: 28rpx;
		right: 0;
	}
	.priceOn{
		border-color: transparent transparent $red;
	}
	/*顶部下拉选择 综合*/
	.tui-dropdownlist {
		width: 100%;
		position: absolute;
		background-color: #fff;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 30rpx;
		left: 0;
		top: 88rpx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 9;
	}
	.tui-dropdownlist-show {
		visibility: visible;
	}
	.tui-dropdownlist-item {
		height: 80rpx;
		font-size: 26rpx;
		padding: 0 20rpx;
		border-top: 1rpx solid #eee;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tui-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}
</style>
