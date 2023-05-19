<template>
	<div class="pageBox">
		<!-- https://dev-shop.kaidanxia.com -->
		<!-- http://localhost:9090 -->
		<web-view v-if="showView" :src="baseUrl" frameborder="0" @message="message"></web-view>
		<view class="showTip dis-flex flex-y-center flex-x-center" v-if="showTip">
				<view>
					若页面未返回，请手动返回上一页
				</view>
		</view>
	</div>
</template>
<script>
	let App = getApp().globalData;
	export default {
		data() {
			return {
				files: '',
				scrollHeight: 0,
				baseUrl: App.siteroot +'canva.html',
				indexId: '',
				width: '',
				height: '',
				showView: false,
				showTip: true
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.indexId = options.indexId || ''
			if (options.type) {
				this.baseUrl += '?type=' + options.type
			}
			if (options.width) {
				this.baseUrl += '&width=' + options.width
			}
			if (options.height) {
				this.baseUrl += '&height=' + options.height
			}
			this.showView = true
		},
		mounted() {},
		methods: {
			message(data) {
				data.detail.data.forEach(element => {
					if (element.url) {
						this.upload(element.url)
					}
				});
			},
			backPage(url) {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if (prevPage.$vm.canvaChange) {
					prevPage.$vm.canvaChange(this.indexId, url)
				}
				uni.navigateBack({
					success(res) {
					},
					fail(res) {
					}
				});
				this.showView = false
				this.showTip = true
			},
			// 点击下载
			upload(files){
				if (files.length == 0) {
					return false
				}
				uni.saveImageToPhotosAlbum({
					filePath: files,
					success: (res) => {
						this.$api.msg("保存成功~")
					},
					fail: (res) => {
						this.$api.msg('取消保存')
					},
					complete: () => {
						setTimeout(() => {
							this.backPage(files)
						}, 500)
					}
				})

			}
		}
	}
</script>
<style lang="scss" scoped>
	.pageBox {
		width: 100%;
		height: 100%;
	}
	.showTip{
		height: 100%;
		width: 100%;
		text-align: center;
	}
</style>
