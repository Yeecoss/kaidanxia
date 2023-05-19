<template>
	<view>
		<block v-for="(item, itemIndex) in diyItems" :key="itemIndex">

			<!-- banner轮播 -->
			<block v-if="item.type === 'banner'">
				<view class="wrap30 bgf">
					<diy-banner :itemIndex="itemIndex" :itemStyle="item.style" :params="item.params" :dataList="item.data"></diy-banner>
				</view>
			</block>

			<!-- 单图组 -->
			<block v-if="item.type === 'imageSingle'">
				<view class="wrap30">
					<diy-imageSingle :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-imageSingle>
				</view>
			</block>

			<!-- 视频组 -->
			<block v-if="item.type === 'video'">
				<view class="wrap30 bgf">
				<diy-video :itemIndex="itemIndex" :itemStyle="item.style" :params="item.params"></diy-video>
				</view>
			</block>

			<!-- 文章组 -->
			<block v-if="item.type === 'article'">
				<diy-article :itemIndex="itemIndex" :params="item.params" :dataList="item.data"></diy-article>
			</block>

			<!-- 头条快报 -->
			<!-- <block v-if="item.type === 'special'">
				<diy-special :itemIndex="itemIndex" :itemStyle="item.style" :params="item.params" :dataList="item.data"></diy-special>
			</block> -->

			<!-- 店铺公告 -->
			<block v-if="item.type === 'notice'">
				<view class="wrap30 m-t-20">
					<diy-notice :animation="animation" :params="item.data"></diy-notice>
				</view>
			</block>

			<!-- 空白组 -->
			<block v-if="item.type === 'blank'">
				<diy-blank :itemIndex="itemIndex" :itemStyle="item.style"></diy-blank>
			</block>

			<!-- 辅助线 -->
			<block v-if="item.type === 'guide'">
				<diy-guide :itemIndex="itemIndex" :itemStyle="item.style"></diy-guide>
			</block>

			<!-- 在线客服 -->
			<block v-if="item.type === 'service'">
				<diy-service :itemIndex="itemIndex" :itemStyle="item.style" :params="item.params"></diy-service>
			</block>

			<!-- 富文本 -->
			<block v-if="item.type === 'richText'">
				<diy-richText :itemIndex="itemIndex" :itemStyle="item.style" :params="item.params"></diy-richText>
			</block>

			<!-- 导航组 -->
			<block v-if="item.type === 'navBar'">
				<view class="wrap30 navBar">
					<diy-navBar :user="user" :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-navBar>
				</view>
			</block>

			<!-- 图片橱窗 -->
			<block v-if="item.type === 'window'">
				<diy-window :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-window>
			</block>

			<!-- 商品组 -->
			<block v-if="item.type === 'goods'">
				<view class="wrap30" v-if="item.params.source === 'recommend' || item.params.source === 'hot'">
					<diy-sharpGoods :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data" :params="item.params"></diy-sharpGoods>
				</view>
				<view class="wrap30" v-else>
					
					<tui-nomore v-if="item.data!=''" backgroundColor="#f8f8f8" text="商品展示"></tui-nomore>
					<product-water :list="item.data"></product-water>
				</view>
			</block>

			<!-- 优惠券组 -->
			<block v-if="item.type === 'coupon'">
				<diy-coupon :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-coupon>
			</block>

			<!-- 拼团商品 -->
			<!-- <block v-if="item.type === 'sharingGoods'">
				<diy-sharingGoods :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-sharingGoods>
			</block> -->

			<!-- 砍价商品 -->
			<block v-if="item.type === 'bargainGoods'">
				<diy-bargainGoods :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-bargainGoods>
			</block>

			<!-- 秒杀商品 -->
			<block v-if="item.type === 'sharpGoods'">
				<view class="wrap30">
					<diy-sharpGoods ref="diySharpGoods" :itemIndex="itemIndex" :itemStyle="item.style" :itemData="item.data" :params="item.params"></diy-sharpGoods>
				</view>
			</block>

			<!-- 线下门店 -->
			<block v-if="item.type === 'shop'">
				<diy-shop :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-shop>
			</block>

			<!-- 关注公众号 -->
			<block v-if="item.type === 'officialAccount'">
				<diy-officialAccount :itemIndex="itemIndex" :itemStyle="item.style" :dataList="item.data"></diy-officialAccount>
			</block>

		</block>
	</view>
</template>

<script>
import diyBanner from "./banner/banner";
import diyImageSingle from "./imageSingle/imageSingle";
import diyVideo from "./video/video";
import diyArticle from "./article/article";
import diySpecial from "./special/index";
import diyBlank from "./blank/blank";
import diyGuide from "./guide/guide";
import diyNavBar from "./navBar/navBar";
import diyWindow from "./window/window";
import diyCoupon from "./coupon/coupon";
import diyNotice from "./notice/notice";
import diyService from "./service/service";
import diyRichText from "./richText/richText";
import diySharingGoods from "./sharingGoods/sharingGoods";
import diyBargainGoods from "./bargainGoods/index";
import diySharpGoods from "./sharpGoods/index";
import diyShop from "./shop/index";
import diyOfficialAccount from "./officialAccount/index";
import productWater from "@/components/waterfall/product-water";

export default {
  data() {
    return {};
  },
  props: {
    diyItems: Object,
    user: {
      type: Object
    },
		animation: Boolean
  },
  components: {
    diyBanner,
    diyImageSingle,
    diyVideo,
    diyArticle,
    diySpecial,
    diyBlank,
    diyGuide,
    diyNavBar,
    diyWindow,
    diyCoupon,
    diyNotice,
    diyService,
    diyRichText,
    diySharingGoods,
    diyBargainGoods,
    diySharpGoods,
    diyShop,
    diyOfficialAccount,
		productWater,
  },
  options: {},
  methods: {}
};
</script>
<style lang="scss">
.navBar{
	background: linear-gradient(to bottom, #fff, #f8f8f8);
}	
</style>