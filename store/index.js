import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const tabbar = [{
			icon: 'icon-Fill1',
			minishop_icon: 'icon-homepage1',
			minishop_icon2: 'icon-homepage2',
			sportshop_icon: 'icon-homepage',
			active_color:'',
			disable_color:'',
			text: '首页',
			url: '/pages/index/index'
		},{
		// 	icon: 'icon-theheart',
		// 	minishop_icon: 'icon-Optimization1',
		// 	minishop_icon2: 'icon-Optimization2',
		// 	active_color:'',
		// 	disable_color:'',
		// 	text: '优选',
		// 	url: '/pages/optimization/index'
		// },{
			icon: 'icon-classification3',
			minishop_icon: 'icon-classification2',
			minishop_icon2: 'icon-classification11',
			sportshop_icon: 'icon-classification4',
			active_color:'',
			disable_color:'',
			text: '分类',
			url: '/pages/category/index'
		},
		// {
		// 	icon: 'icon-shop',
		// 	minishop_icon: 'icon-personalstores1',
		// 	minishop_icon2: 'icon-personalstores2',
		// 	sportshop_icon: 'icon-shop5',
		// 	active_color:'',
		// 	disable_color:'',
		// 	text: '店铺',
		// 	url: '/pages/retailShop/index'
		// },
		{
			icon: 'icon-bianzu2',
			minishop_icon: 'icon-ShoppingCart1',
			minishop_icon2: 'icon-ShoppingCart2',
			sportshop_icon: 'icon-shopping',
			active_color:'',
			disable_color:'',
			text: '购物车',
			url: '/pages/flow/index'
		},{
			icon: 'icon-bianzu',
			minishop_icon: 'icon-my1',
			minishop_icon2: 'icon-my2',
			sportshop_icon: 'icon-my',
			active_color:'',
			disable_color:'',
			text: '我的',
			url: '/pages/userIndex/index'
	},];
const store = new Vuex.Store({
	state: {
		theme:'',//主题
		tabbarList: [],//主题tabbar
		isGiveMember: true,//送会员活动
		optimizateSearch: '',
	},
	mutations: {
		// 获取主题tabbar
		getTheme(state,app){
			app._get('page/miniMenus',{},res => {
				let tabbarList = tabbar;
				let data = res.data;
				if(data&&data.length>0){
					
					let _color = data[0].active_color;
					state.theme = {
						// name: theme.name,
						color: _color,
						themeStyle: `
							--color: `+_color+`;
						`,
					}
					
					for (let k in tabbarList) {
						for (let i in data) {
							if(k == i){
								tabbarList[k].icon = data[i].icon;
								tabbarList[k].url = data[i].page;
								tabbarList[k].text = data[i].alias;
								tabbarList[k].active_color = data[i].active_color;
								tabbarList[k].disable_color = data[i].disable_color;
							}
						}
					}
				}
				// if(uni.getStorageSync('shopLock')!=1){
				// 	tabbarList[2].text = '我要开店';
				// }else{
				// 	tabbarList[2].text = '店铺';
				// }
				state.tabbarList = tabbarList;
				console.log(tabbarList)
			});
		},
		// 送会员活动状态
		changeGiveMember(state,aa){
			this.state.isGiveMember = aa;
		},
		// 送会员活动状态
		changeData(state,data){
			this.state[data.k] = data.v ||'';
		},
	},
	actions: {
		
	},
	modules: {
		
	}
})

export default store