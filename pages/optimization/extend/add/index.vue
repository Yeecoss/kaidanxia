<template>
	<view class="bgf7">
		<!-- 自定义标题栏 -->
		<navigationBar :title="navtitle" extClass="nav" id="top"></navigationBar>
		<view class="topwrap">
			<tui-tabs :tabs="tabs" :currentTab="tabOn" @change="changeTab" itemWidth="50%" color="#333" selectedColor="#E82E2E" :height="88" :sliderWidth="80" :size="30" :padding="0" :sliderHeight="4" sliderBgColor="#E82E2E" :isFixed="true"></tui-tabs>
		</view>
		<!--main -->
		<view class="container">
			<view class="listBox" style="background:white">
				<!-- 上传图片-单/多图 -->
				<view class="list dis-flex flex-wrap">
					<view class="control upload">
						<tui-upload ref="upload" source="optimization" :limit="1" :videoLimit="0" addText="封面图" :value="formData.cover_image" isShop @complete="complete"></tui-upload>
					</view>
				</view>
				<!-- 文本或数值类型展示 -->
				<view class="list dis-flex">
					<!-- <view class="label">填写标题</view> -->
					<view class="control dis-flex flex-x-between" @tap.stop="openItem('title')">
						<view class="onelist-hidden" :class="formData.title!=''?'':'col-9 f-28'" style="max-width: 80%;">{{formData.title? formData.title: '填写标题'}}</view>
						<text class="col-9">{{formData.title.length}}/{{field.title.maxlength}}</text>
					</view>
				</view>
				<!-- 文本或数值类型展示 -->
				<view class="list dis-flex border-top" v-if="tabOn==1">
					<!-- <view class="label">添加摘要</view> -->
					<view class="control dis-flex" @tap.stop="openItem('abstract')">
						<view class="twolist-hidden" :class="formData.abstract!=''?'':'col-9 f-28'">{{formData.abstract?formData.abstract : '添加摘要'}}</view>
					</view>
				</view>
				<!-- 链接类型展示 -->
				<!-- <view class="list dis-flex border-top">
					<view class="label label-tag" @tap.stop="openItem('tag')"><view class="onelist-hidden col-6"># {{formData.tag?formData.tag : '添加标签'}}</view></view>
					<view class="control" @tap.stop="toTag('tag')">
						<text class="col-6">选择标签</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view> -->
			</view>
			
			<view class="listBox" style="background:white">
				<!-- 链接类型展示 -->
				<view class="list dis-flex">
					<view class="label">编辑{{tabOn==0?'种草':'社区'}}内容</view>
					<view class="control" @tap.stop="editContent('content')">
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<!-- 链接类型展示 -->
				<view class="list dis-flex" v-if="tabOn==0">
					<view class="label">关联商品</view>
					<view class="control text_align_r" @tap.stop="openItem('pro_relate')">
						<template v-if="formData.pro_relate.length">已选<text class="red">{{formData.pro_relate.length}}</text>(件)</template>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<!-- 关联商品 -->
				<template v-if="tabOn==0">
					<view class="wrap30 related-pros" v-if="formData.pro_relate.length">
						<view class="related-item dis-flex" v-for="(item, index) in formData.pro_relate" :key="index" @tap="showSpecs(item, index)">
							<view class="del-pro dis-flex flex-y-center m-r-20" @tap.stop="delPro(index)"><text class="iconfont2 icon-subtract"></text></view>
							<view class="related-pic"><image lazy-load :src="item.goods_image" mode="aspectFill"></image></view>
							<view class="related-info oh flex-box">
								<view class="f-28 onelist-hidden">{{item.goods_name}}</view>
							</view>
						</view>
					</view>
				</template>
				<!-- 文本或数值类型展示 -->
				<view class="list dis-flex">
					<view class="label">虚拟阅读量</view>
					<view class="control" @tap.stop="openItem('read_num')">
						{{formData.read_num?formData.read_num:''}}
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>显示的阅读量 = 实际阅读量 + 虚拟阅读量</view>
				<view class="list dis-flex">
					<view class="label">文章状态(是否显示）</view>
					<view class="control dis-flex flex-x-end flex-y-center">
						<cust-switch ref="switch" :checked="formData.article_status" @change="switchCange($event,'article_status')"></cust-switch>
					</view>
				</view>
			</view>
			
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap="toSubmit">发布</view>
			</view>
		</view>
		
    <popup-input ref="popupInput" :inputType="inputType" :title="title" :maxlength="maxlength" :placeholder="placeholder" :showlength="showlength"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
	</view>
</template>

<script>
	import custSwitch from '@/components/cust-switch/index.vue';
	import popSpecs from '@/components/printing/pop-specs/index';
	import popupInput from '@/components/popup-input/index';
	const app = getApp().globalData;
	
	export default {
		components: {
			custSwitch,
			popSpecs,
			popupInput,
		},
		data() {
			return {
				navtitle: '新增优选',
				index: 1,//提示框
				type: 0,//默认是新增
				tabs:[{status: 0,name: '种草'},{status: 1,name: '社区'}],
				tabOn: 0,//默认是种草
				article_id: '',//文章id
				baseImages: [],
				formData: {
					cover_image: [],//封面图
					title: '',//标题
					tag: '',//添加标签
					abstract: '',//摘要
					pro_relate: [],//关联商品
					content: '',//编辑内容
					read_num: '',//虚拟阅读量
					article_status: true,//文章状态
				},
				inputType: '',
				title: '',
				maxlength: -1,
				placeholder: '',
				showlength: false,
				// 字段
				field: {
				  title:  {
				    type: 'text',
				    name: '填写标题',
				    fieldName: 'title',
						maxlength:'60'
				  },
					tag: {
				    type: 'text',
				    name: '添加标签',
				    fieldName: 'tag',
						maxlength:'12',
						showlength: true,
						placeholder:'#请输入标签'
					},
					abstract: {
				    type: 'largeText',
				    name: '添加摘要',
				    fieldName: 'abstract',
						maxlength:'-1'
				  },
					pro_relate: {
				    type: 'link',
				    name: '',
				    fieldName: 'pro_relate',
						linkUrls: '/pages/optimization/extend/relatePro/index',
					},
					read_num: {
				    type: 'number',
				    name: '虚拟阅读量',
				    fieldName: 'read_num',
					},
				},
				api: null,//富文本api
				
			}
		},
		onLoad(options) {
			let that = this;
			if(options.type){
				that.type = options.type;
				that.navtitle = options.type==1 ? '编辑优选': '新增优选';
				that.isEdit = 1;
			}
			that.tabOn = options.tabOn ? options.tabOn: that.tabOn;
			that.article_id = options.article_id ? options.article_id: '';
			if(options.article_id){
					that.getInfo();
			}
		},
		methods: {
			// 提交
			toSubmit(){
				let that = this;
				let formData = that.formData;
				let data = {}, url = '';
					data.article_title = formData.title;
					data.image_id = formData.cover_image!=''?formData.cover_image[0].wxapp_file_id:'';
					data.article_content = formData.content;
					data.virtual_views = formData.read_num || 0;
					data.article_status = formData.article_status? 1 : 0;
					if(that.type==1){data.article_id = that.article_id}
				if(data.image_id==''){
					that.$api.msg('请选择封面图！');
					return false;
				}
				if(data.article_title==''){
					that.$api.msg('标题不能为空！');
					return false;
				}
				if(data.article_content==''){
					that.$api.msg('编辑内容不能为空！');
					return false;
				}
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				if(that.tabOn == 0){//种草
					url = that.type == 1? 'shop.article.goods/edit' : 'shop.article.goods/add';
				}else{
					url = that.type == 1? 'shop.article.market/edit' : 'shop.article.market/add';
					data.summary = formData.abstract;
				}
				if(that.tabOn == 0){//种草
					// data.wxapp_goods_id = formData.pro_relate.toString();await that.initGood(res.data.goodList)
					data.wxapp_goods_id = that.initGood(formData.pro_relate).toString();
				}
				app._post_form(url, data, res => {
					that.$refs.toast.showTips({msg: res.msg})
					if(res.code==1){
						setTimeout(()=>{uni.navigateBack()},1000)
					}
				},res =>{
					uni.hideLoading()
				});
			},
			//获取文章详情
			getInfo(){
				let that = this;
				let url = that.tabOn == 0? 'shop.article.goods/edit' : 'shop.article.market/edit';
				app._get(url, {article_id: that.article_id}, async res => {
					let data = res.data.model || res.data.article;
					that.formData = {
						cover_image: that.initImg(data.image),
						title : data.article_title,
						abstract : data.summary,
						// pro_relate : res.data.goodList? await that.initGood(res.data.goodList) : [],
						pro_relate : res.data.goodList? res.data.goodList : [],
						content : data.article_content,
						read_num : data.show_views,
						article_status: data.article_status==1? true : false,
					}
					this.$nextTick(() => {
						if(!data.article_status){that.$refs.switch.checkedItem();}
						if(data.image){that.$refs.upload.unit();}
					})
				})
			},
			initImg(obj) {
				let baseImages = []
				baseImages.push({
					type: obj.file_media,
					path: obj.file_path,
					file_id: obj.file_id,
					wxapp_file_id: obj.wxapp_file_id,
				})
				return baseImages
			},
			materialChange(data){
				this.formData.cover_image = data
				this.$nextTick(() => {
					this.$refs.upload.unit();
				})
			},
			initGood(list){
				let data = [];
				list.forEach(item => {
					data.push(item.wxapp_goods_id);
				});
				return data;
			},
			// 切换tab
			changeTab(e){
				if(!this.isEdit){
					this.tabOn = this.tabs[e.index].status;
				}else{
					this.$api.msg('不能更改类型！')
				}
			},
			// 输入
			openItem(fieldName) {
				let that = this;
				let field = that.field[fieldName];
				that.inputType = field.type;
				that.title = field.name;
				if(that.inputType=='link'){
					uni.navigateTo({
					  url: field.linkUrls
					});
				}else{
					that.maxlength = field.maxlength || '-1';
					that.placeholder = field.placeholder || '';
					that.showlength = field.showlength || false;
					that.$refs.popupInput._open(that.formData[fieldName], (val) => {
						that.formData[fieldName] = val
					})
				}
			},
			//switch
			switchCange(e,fieldName) {
			  this.formData[fieldName] = e;
			},
			// 上传图片
			complete(e){
				this.formData.cover_image = e.imgArr;
			},
			// 编辑富文本内容
			editContent(fieldName){
				let val = this.formData.content.replace(/%/g, '%25');
				val = encodeURIComponent(val)
				uni.navigateTo({
					url: '/pages/robinEditor/robinEditor?val='+ val
				})
			},
			//关联商品
			proCheck(data){
				// this.formData.pro_relate = data;
				let list = [];
				for (let i in data) {
					let obj = {
						goods_image: data[i].goods.goods_image,
						goods_name: data[i].goods.goods_name,
						goods_price: data[i].goods.goods_sku.goods_price,
						goods_sales: data[i].goods.goods_sales,
						image: data[i].goods.goods_image,
						line_price: data[i].goods.goods_sku.line_price,
						wxapp_goods_id: data[i].wxapp_goods_id
					}
					list.push(obj)
				}
				this.formData.pro_relate = list;
			},
			//删除关联商品
			delPro(index){
				this.formData.pro_relate.splice(index, 1)
			},
			// 内容
			editorChange(res){
				this.formData.content = res;
			},
			toTag(fieldName){
				uni.navigateTo({
					url: '/pages/myGoods/history_label/index'
				})
			},
			// 标签
			tagChange(res){
				this.formData.tag = res;
			},
		},
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import "index.scss";
	.editor{
		flex: 1;overflow: hidden;
	}
	.red{color: $red;}
</style>
