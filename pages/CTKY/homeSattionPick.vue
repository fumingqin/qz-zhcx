<template>
	<view>
		<!-- 顶部搜索框 -->
		<view class="topSerchView">
			<view class="SearchBar" elevation='5px' style="">
				<input class="addressInput" @input="onInput" placeholder="请输入关键字搜索" />
			</view>
		</view>
		<!-- 搜索列表 -->
		<view class="stationList" :style="{ 'height':scrollHeight }" v-if="isShowList">
			<block v-for="(item,index) in keywordList" :key="index">
				<view class="listItem" @tap="itemClick(index)">
					<rich-text :nodes="item.htmlStr"></rich-text>
				</view>
			</block>
		</view>
		<!-- 联动列表 -->
		<view class="list_box" v-if="isShowAllList">
			<!-- 左边的列表 -->
			<view class="left">
				<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }">
					<view class="item" 
						v-for="(item,index) in stationArray"
						:key="index" 
						:class="{ 'active':index==leftIndex }" 
						:data-index="index"
						@tap="leftTap"
					>{{item}}</view>
		        </scroll-view>
			</view>
			<!-- 右边的列表 -->
			<view class="main" v-if="isShowAllList">
				<swiper class="swiper" :style="{ 'height':scrollHeight }" 
					:current="leftIndex" @change="swiperChange"
					 vertical="true" duration="300">
					<swiper-item v-for="(item,index) in mainArray" :key="index">
						<scroll-view  scroll-y="true" :style="{ 'height':scrollHeight }">
							<view class="item">
								<view class="goods" v-for="(item2,index2) in item.list" :key="index2">
									<view>
										<view @tap="detailStationTap(item2)">第{{index2+1}}个车站</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollHeight:'500px',
				stationArray:[],
				leftArray:[],
				mainArray:[],
				leftIndex:0,
				keywordList: [],
				isShowAllList:true,//是否显示联动列表
				isShowList:false,//是否显示站点列表
			}
		},
		onLoad(){
			/* 设置当前滚动容器的高，若非窗口的高度，请自行修改 */
			uni.getSystemInfo({
				success:(res)=>{
					this.scrollHeight=`${res.windowHeight}px`;
				}
			});
			this.stationArray = ['泉州', '晋江', '石狮', '惠安', '南安', '安溪', '永春', '德化', '厦门'];
		},
		mounted(){
			this.getListData();
		},
		methods: {
			// 监听输入
			onInput(event){
				var keyword = event.detail?event.detail.value:event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowList = false;
					this.isShowAllList = true;
					return;
				}
				this.isShowList = true;
				this.isShowAllList = false;
				//以下示例截取淘宝的关键字，请替换成你的接口
				uni.request({
					url: 'https://suggest.taobao.com/sug?code=utf-8&q=' + keyword, //仅为示例
					success: (res) => {
						this.keywordList = [];
						this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
						
					}
				});
			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//点击下拉站点
			itemClick(index){
				//获取点击选项的文字
				var key = this.keywordList[index].keyword;
				console.log(key);
			},
			//点击站点
			detailStationTap(item){
				console.log(item);
			},
			/* 获取列表数据 */
			getListData(){
				// Promise 为 ES6 新增的API ，有疑问的请自行学习该方法的使用。
				new Promise((resolve,reject)=>{
					/* 因无真实数据，当前方法模拟数据。正式项目中将此处替换为 数据请求即可 */
					uni.showLoading();
					setTimeout(()=>{
						/* 因无真实数据，当前方法模拟数据 */
						let [left,main]=[[],[]];
						
						for(let i=0;i<10;i++){
							left.push(`${i+1}类商品`);
							
							let list=[];
							let max = Math.floor(Math.random()*15) || 8;
							for(let j=0;j<max;j++){
								list.push(j);
							}
							main.push({
								title:`第${i+1}类商品标题`,
								list
							})
						}
						
						// 将请求接口返回的数据传递给 Promise 对象的 then 函数。
						resolve({left,main});
					},1000);
				}).then((res)=>{
					console.log('-----------请求接口返回数据示例-------------');
					console.log(res);
					
					uni.hideLoading();
					this.leftArray=res.left;
					this.mainArray=res.main;
				});
			},
			/* 左侧导航点击 */
			leftTap(e){
				let index=e.currentTarget.dataset.index;
				this.leftIndex=Number(index);
			},
			/* 轮播图切换 */
			swiperChange(e){
				let index=e.detail.current;
				this.leftIndex=Number(index);
			}
		}
	}
</script>

<style lang="scss">
	.topSerchView {
		height: 100rpx;
		background-color: #DBDBDB;
		padding-top: 20rpx;
	}
	.SearchBar {
		background-color: #FFFFFF;
		margin-right: 20rpx;
		margin-left: 20rpx;
		box-shadow: 0px 4px 9px 1px rgba(204, 204, 204, 1);
		flex-direction: row;
		border-radius: 9px;
		padding: 20rpx;
		align-items: center;
		justify-content: space-between;
	}
	//地址搜索输入
	.addressInput {
		color: #999999;
		font-size: 30rpx;
		font-weight: 300;
	}
	//站点列表
	.stationList {
		background-color: #FFFFFF;
		line-height: 80rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		height: 100rpx;
		.listItem{
			margin-left: 20rpx;
			border-bottom: 1rpx solid #eeeeee;
		}
	}
.list_box{
	display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
	font-size: 28rpx;
	
	.left{
		width: 200rpx;
		background-color: #f6f6f6;
		line-height: 80rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		text-align: center;
		.item{
			padding-left: 20rpx;
			position: relative;
			&:not(:first-child) {
				margin-top: 1px;
			
				&::after {
					content: '';
					display: block;
					height: 0;
					border-top: #d6d6d6 solid 1px;
					width: 620upx;
					position: absolute;
					top: -1px;
					right: 0;
					transform:scaleY(0.5);	/* 1px像素 */
				}
			}
			
			&.active,&:active{
				color: #42b983;
				background-color: #fff;
			}
		}
	}
	.main{
		background-color: #fff;
		padding-left: 20rpx;
		width: 0;
		flex-grow: 1;
		box-sizing: border-box;
		
		.swiper{
			height: 500px;
		}

		
		.item{
			padding-bottom: 10rpx;
		}
	}
	.goods{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		margin-bottom: 10rpx;
		border-bottom: 1rpx solid #eeeeee;
		line-height: 80rpx;
	}
}
</style>
