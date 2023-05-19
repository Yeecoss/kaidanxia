<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="结算优惠" isHelpme extClass="nav" id="top"></navigationBar>
		<!-- top -->
		<view class="top-wrap" :class="'top-wrap'+dealer_type">
			<view class="top-con bgf">
				<!-- tab -->
				<view class="tab bgf dis-flex">
					<template v-for="(item,index) in tabs">
						<view class="tab-item f-30" :class="dealer_type==item.val?'on':''" :key="index" @tap="changeTab(item.val)">
							<text class="text">{{item.text}}</text>
						</view>
					</template>
				</view>
				<!-- 搜索框 -->
				<view class="wrap30 search" v-if="dealer_type==1">
					<search @search="search" placeholder="搜索商品"></search>
				</view>
			</view>
		</view>
		<!-- 渠道价 -->
		<scroll-view scroll-y class="main box-sizing" v-if="dealer_type==1 && list.data!=''">
			<view class="batch-btn-wrap radius16 bgf m-t-20 dis-flex flex-y-center flex-x-between">
				<view class="label f-30 col-3">全部商品批量</view>
				<view class="batch-btn f-24 t-c" @tap.stop="settingVal(1)">批量设置</view>
			</view>
			<!-- list -->
			<view class="list bgf radius16 m-t-20" v-for="(item,index) in list.data" :key="index">
				<view class="product dis-flex">
					<view class="pro-pic">
						<image lazy-load :src="item.goods.goods_image||default_img" mode="aspectFill"></image>
					</view>
					<view class="pro-info m-l-10 flex-box oh">
						<view class="pro-name f-26 col-3 twolist-hidden">{{item.goods.goods_name}}</view>
					</view>
					<view class="batch-btn list-batch-btn f-24 t-c oh" @tap.stop="settingVal(0,index)">批量设置</view>
				</view>
				<!-- 表格标题 -->
				<view class="su-table-box">
					<view class="su-tr dis-flex flex-y-center flex-x-between">
						<view :class="'su-th '+'su-wid'+ind" v-for="(ite,ind) in th" :key="ind">{{ite}}</view>
					</view>
					<template v-for="(vo,k) in item.goods.sku">
						<template v-if="k==0">
							<view class="su-tr dis-flex flex-y-center flex-x-between" :key="k">
								<view class="su-td su-wid0">{{vo.str}}</view>
								<view class="su-td su-wid1">¥{{vo.goods_price||0}}</view>
								<view class="su-td dis-flex flex-y-center" @tap.stop="setSkuItem(1,index,k)">
									¥<view class="table-input">{{vo.dealer_price}}</view>
								</view>
								<view class="su-td dis-flex flex-y-center" @tap.stop="setSkuItem(2,index,k)">
									¥<view class="table-input">{{vo.dealer_reduce_account}}</view>
								</view>
							</view>
						</template>
						<template v-if="k>0&&item.isOpen">
							<view class="su-tr dis-flex flex-y-center flex-x-between" :key="k">
								<view class="su-td su-wid0">{{vo.str}}</view>
								<view class="su-td su-wid1">¥{{vo.goods_price||0}}</view>
								<view class="su-td dis-flex flex-y-center" @tap.stop="setSkuItem(1,index,k)">
									¥<view class="table-input">{{vo.dealer_price}}</view>
								</view>
								<view class="su-td dis-flex flex-y-center" @tap.stop="setSkuItem(2,index,k)">
									¥<view class="table-input">{{vo.dealer_reduce_account}}</view>
								</view>
							</view>
						</template>
					</template>
				</view>
				<view class="list-switch t-c" v-if="item.goods.sku.length>1" @tap="changeOpen(item)">
					<text class="iconfont2 f-60" :class="item.isOpen?'icon-shuangjiantou-shang':'icon-jiantou-xia'"></text>
				</view>
			</view>
			<!-- 加载loadding-->
			<!-- <view class="no-more f-24 col-9" v-if="loadding">加载中...</view> -->
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5"></tui-nomore>
		</scroll-view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''&&dealer_type==1">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 折扣 -->
		<view class="discount f-30 col-3 bgf wrap30 m-t-20 dis-flex flex-y-center" v-if="dealer_type==0">
			<view class="label">折扣</view>
			<view class="control min-h100 dis-flex flex-y-center m-l-40">
				<input class="f-28 min-h100" :class="discount?'':'col-9'" type="digit" v-model="discount" requried placeholder="请输入折扣" @blur="changeDiscount"/>
				<text class="m-l-40">折</text>
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30 bgf dis-flex flex-y-center">
				<view class="foot-btn f-32 col-f flex-box" @tap.stop="toSure">确定</view>
			</view>
		</view>
		
		<!-- 批量-渠道价/渠道优惠弹窗 -->
		<popup-tips ref="valModel" type="custom" confirmText="确定">
			<view class="sheTab f-32 tb-lr-center">
				<view class="col-9" :class="batchType==1?'on':''" @tap.stop="batchTypeChange(1)">渠道价</view>
				<view class="col-9" :class="batchType==2?'on':''" @tap.stop="batchTypeChange(2)">渠道优惠</view>
			</view>
			<view class="mcontent szMoney">
				<input class="f-28 bgf8" type="digit" v-model="batchVal" :placeholder="batchType==1?'请输入渠道价':'请输入渠道优惠'" @blur.stop="valFix('batchVal',batchVal)"/>
			</view>
			<!-- <view class="pop-btn pop-btn-block">
			  <view @tap.stop="cancel" class="cancel">渠道价</view>
			  <view @tap.stop="confirm" class="submit">渠道优惠</view>
			</view> -->
		</popup-tips>
		<popup-input :title="inputTitle" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 提示框 -->
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			search,
			popupInput,
			popupTips,
			guidePage
		},
		data() {
			return {
				default_img: '/static/images/default-avatar.jpg',
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				inputTitle: '',//弹窗输入标题
				maxlength: '-1',
				inputType: 'digit',
				tabs:[{text:'渠道价',val:1},{text:'折扣',val:0}],
				dealer_type:1,//默认渠道优惠
				keyword: '',
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
				discount:'',//折扣
				// 表格标题
				th: ["规格", "价格", "渠道价", "渠道优惠",],
				id: '',
				// 批量-渠道价/渠道优惠
				batchType:1,
				batchVal:'',
			}
		},
		onLoad(options) {
			this.id = options.id||'';
			this.dealer_type = options.dealer_type||1;
			this.discount = options.dealer_discount||'';
			this.getList()
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false;
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			// 提交
			toSure(){
				let data =  {
					id: this.id,
					dealer_type: this.dealer_type,
				}
				if(this.dealer_type==0&&this.discount==''){
					this.$api.msg('请先输入折扣！')
					return false
				}
				if(this.dealer_type==1){
					data.goods = this.getGoods()
				}else{
					data.discount = this.discount;
				}
				app._post_json_form('shop.wxapp.dealer_user/editDiscount', data, res => {
					this.$api.msg(res.msg)
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				});
			},
			// 获取商品列表
			getList (){
				let that = this;
				let data = {
					wxapp_dealer_user_id: that.id,
					page: that.page,
					search: that.keyword,
				};
				app._get('shop.goods/getOpenDealerGoods',data, res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data.list;
					if(data.data.length>0){
						data.data = that.initData(data.data);
					}
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
			initData(list){
				for (let i = 0; i < list.length; i++) {
					list[i].isOpen = false;//默认关闭
					
					let spec_list = list[i].goods.sku;
					if(list[i].goods.spec_type==20){
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						for (let i2 in spec_list) {
							let arr = spec_list[i2].spec_sku_id.split('_');
							let str =[];
							for (let i3 in arr) {
								for (let k1 in spec_attr) {
									for (let k2 in spec_attr[k1].spec_items) {
										let item = spec_attr[k1].spec_items[k2];
										if(arr[i3] == item.item_id){
											str.push(item.spec_value)
										}
									}
								}
							}
							spec_list[i2].str = str.toString();
							// 渠道优惠
							let dealer_reduce = spec_list[i2].wholesale_reduce_amount?spec_list[i2].wholesale_reduce_amount:0;
							spec_list[i2].dealer_reduce_account = Number(dealer_reduce).toFixed(2);
							// 渠道价
							let dealer_price = spec_list[i2].wholesale_goods_price?spec_list[i2].wholesale_goods_price:0;
							spec_list[i2].dealer_price = Number(dealer_price).toFixed(2);
						}
					}else{
						for (let i2 in spec_list) {
							spec_list[i2].str = '单规格';
							// 渠道优惠
							let dealer_reduce = spec_list[i2].wholesale_reduce_amount?spec_list[i2].wholesale_reduce_amount:0;
							spec_list[i2].dealer_reduce_account = Number(dealer_reduce).toFixed(2);
							// 渠道价
							let dealer_price = spec_list[i2].wholesale_goods_price?spec_list[i2].wholesale_goods_price:0;
							spec_list[i2].dealer_price = Number(dealer_price).toFixed(2);
						}
					}
				}
				return list
			},
			// tab切换
			changeTab(index){
				this.dealer_type = index;
			},
			search(val){
				this.keyword = val;
				this.page = 1;
				this.loadding= false;
				this.pullUpOn= true;
				this.getList()
			},
			// 展开
			changeOpen(item){
				item.isOpen = !item.isOpen;
			},
			// 设置折扣
			changeDiscount(){
				if(this.discount>10){
					this.discount = 10
				}else if(this.discount<=0){
					this.discount = ''
				}else{
					this.discount = Number(this.discount).toFixed(2)
				}
			},
			batchTypeChange(index){
				this.batchType = index
			},
			// 值验证
			valFix(dataName,val){
				this[dataName] = Number(val).toFixed(2)
			},
			// 批量设置batchSetting
			settingVal(type,index){
				if(type==1){
					this.$refs.valModel.open(() => {
						this.setAllVal(this.batchType,Number(this.batchVal),-1)
						this.batchVal = '';
					});
				}else{
					this.$refs.valModel.open(() => {
						this.setAllVal(this.batchType,Number(this.batchVal),index)
						this.batchVal = '';
					});
				}
			},
			setAllVal(batchType,val,index){
				let list = this.list.data;
				if(index!=-1){
					let spec_list = list[index].goods.sku;
					for (let i2 in spec_list) {
						let goods_price = Number(spec_list[i2].goods_price);
						let val1 = goods_price<val? goods_price: (val<0? 0: val);
						// 渠道价
						if(batchType==1){
							spec_list[i2].dealer_price = val1.toFixed(2);
							spec_list[i2].dealer_reduce_account = (goods_price - val1).toFixed(2);
						}else{
							// 渠道优惠
							spec_list[i2].dealer_reduce_account = val1.toFixed(2);
							spec_list[i2].dealer_price = (goods_price - val1).toFixed(2);
						}
					}
				}else{
					for (let i = 0; i < list.length; i++) {
						let spec_list = list[i].goods.sku;
						for (let i2 in spec_list) {
							let goods_price = Number(spec_list[i2].goods_price);
							let val1 = goods_price<val? goods_price: (val<0? 0: val);
							// 渠道价
							if(batchType==1){
								spec_list[i2].dealer_price = val1.toFixed(2);
								spec_list[i2].dealer_reduce_account = (goods_price - val1).toFixed(2);
							}else{
								// 渠道优惠
								spec_list[i2].dealer_reduce_account = val1.toFixed(2);
								spec_list[i2].dealer_price = (goods_price - val1).toFixed(2);
							}
						}
					}
				}
				this.list.data = list;
			},
			// 单个规格设置
			setSkuItem(batchType,index,k){
				let list = this.list.data;
				let spec_list = list[index].goods.sku;
				let skuItem = spec_list[k];
				
				let inpVal = batchType==1? skuItem.dealer_price: skuItem.dealer_reduce_account;
				this.inputTitle = batchType==1?'渠道价':'渠道优惠';
				let goods_price = Number(skuItem.goods_price);
				this.$refs.popupInput._open(inpVal,(val) => {
					val = Number(Number(val).toFixed(2));
					val = goods_price<val? goods_price: (val<0? 0: val);
					// 渠道价
					if(batchType==1){
						skuItem.dealer_price = val.toFixed(2);
						skuItem.dealer_reduce_account = (goods_price - val).toFixed(2);
					}else{
						// 渠道优惠
						skuItem.dealer_reduce_account = val.toFixed(2);
						skuItem.dealer_price = (goods_price - val).toFixed(2);
					}
					this.list.data = list;
				});
			},
			getGoods(){
				let list = this.list.data;
				let goodsList = [];
				for (let i = 0; i < list.length; i++) {
					let spec_list = list[i].goods.sku;
					for (let i2 in spec_list) {
						let obj = {
							wxapp_goods_id: list[i].wxapp_goods_id,
							goods_sku_id: spec_list[i2].goods_sku_id,
							spec_sku_id: spec_list[i2].spec_sku_id,
							wholesale_reduce_amount: spec_list[i2].dealer_reduce_account,
						};
						goodsList.push(obj)
					}
				}
				return goodsList;
			},
		},
	}
</script>

<style lang="scss">
	@import 'index';
</style>
