<template>
	<view>
		<!-- 顶部背景 -->
		<view class="ob_background">
			<image src="../../../static/LYFW/scenicSpotTickets/addOrder/orderBackground.png" mode="aspectFill"></image>
		</view>


		<view class="cover-container">
			<view class="MP_information1">
				<view class="MP_title">{{orderInfo.ticketTitle}}</view>
				<text class="MP_text">费用包含：{{orderInfo.ticketContain}}</text>

				<view class="MP_selectionDate">
					<view class="MP_title">使用时间</view>
					<text class="MP_text">{{orderInfo.orderDate}} &nbsp; {{orderInfo.orderDateReminder}} &nbsp; 仅限当天</text>
				</view>

				<view class="MP_selectionDate" :hidden="hiddenValues==0">
					<view class="MP_title">购票人信息</view>
					<view class="MP_userInformation" v-for="(item,index) in orderInfo.appUserInfoList" :key="index">
						<text>{{item.userName}}</text>
						<text class="Mp_sex">{{item.userSex}}</text>
						<text class="Mp_square">{{item.userType}}</text>
						<text class="Mp_square" v-if="item.userDefault == true">本人</text>
						<text class="Mp_square" v-if="item.userEmergencyContact == true">紧急联系人</text>
						<text class="Mp_text">身份证：{{item.userCodeNum}}</text>
						<text class="Mp_text">手机号：{{item.userPhoneNum}}</text>
					</view>
				</view>

				<view class="MP_selectionDate" :hidden="hiddenValues==0">
					<view class="MP_title">费用详情</view>
					<view class="MP_cost" v-if="adultIndex>=1">
						<text>成人票</text>
						<text class="MP_number">×{{adultIndex}}</text>
						<text class="MP_userCost">{{adultTotalPrice}}</text>
					</view>

					<view class="MP_cost" v-if="childrenIndex>=1">
						<text>儿童票</text>
						<text class="MP_number">×{{childrenIndex}}</text>
						<text class="MP_userCost">¥{{childrenTotalPrice}}</text>
					</view>

					<!-- 保险 -->
					<view class="MP_cost" v-if="orderInfo.orderInsure==true">
						<text>太平洋门票意外险 经济款</text>
						<text class="MP_number">×{{orderInfo.length}}</text>
						<text class="MP_total">¥{{orderInfo.orderInsurePrice}}</text>
					</view>

					<!-- 优惠券 -->
					<view class="MP_cost" v-if="orderInfo.couponPrice>0">
						<text>{{orderInfo.couponTitle}}</text>
						<text class="MP_number">×1</text>
						<text class="MP_total">-&nbsp;¥{{orderInfo.couponPrice}}</text>
					</view>


					<view class="MP_cost">
						<text class="MP_total">共计&nbsp;¥{{orderInfo.orderActualPayment}}</text>
					</view>

				</view>

				<view class="jdticon icon-xia" style="padding: 24upx 0upx; text-align: center; margin-top: 64upx;" @click="hide(0)"
				 :hidden="hiddenValues==1"></view>
				<view class="jdticon icon-shang" style="padding: 24upx 0upx; text-align: center; margin-top: 64upx;" @click="hide(1)"
				 :hidden="hiddenValues==0"></view>

			</view>

			<view class="MP_information2">
				<view class="MP_optionBar">
					<text class="Mp-icon jdticon icon-weixinzhifu"></text>
					<text class="Mp_title">微信</text>
					<radio class="Mp_box" :checked="channeIndex===0" :color="'#36cb59'" @click="Selection"></radio>
				</view>
			</view>

			<view class="MP_information2">
				<view class="MP_optionBar">
					<text class="Mp-icon jdticon icon-alipay"></text>
					<text class="Mp_title">支付宝</text>
					<radio class="Mp_box" :checked="channeIndex===1" :color="'#01aaef'" @click="Selection"></radio>
				</view>
			</view>

			<view class="MP_information3" @click="payment">
				支付{{orderInfo.orderActualPayment}}元
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				hiddenValues: '0', //隐藏状态值
				channel: [{
					name: '微信'
				}, {
					name: '支付宝'
				}],
				channeIndex: 0, //选择支付方式
				orderInfo: [{
					orderNumber: '',
					orderType: '',
					orderActualPayment: '',
					orderDateReminder: '',
					orderDate: '',
					orderCountdown: '',
					orderInsure: '',
					orderInsurePrice: '',

					ticketId: '',
					ticketName: '',
					ticketOpenUp: '',
					ticketTitle: '',
					ticketContain: '',
					ticketAdultPrice: '',
					ticketChildPrice: '',

					couponID: '',
					couponTitle: '',
					couponPrice: '',
					couponCondition: '',

					appUserInfoList: [{
						userID: '',
						userType: '',
						userName: '',
						userSex: '',
						userCodeNum: '',
						userPhoneNum: '',
						userDefault: '',
						userEmergencyContact: '',
					}]

				}],


				adultIndex: '', //成人数量
				childrenIndex: '', //儿童数量	
				adultTotalPrice: '', //成人总价
				childrenTotalPrice: '', //儿童总价


			}
		},
		onLoad(options) { 
			uni.request({
					url: 'http://218.67.107.93:9210/api/app/getScenicspotOrderDetail?orderNumber=' + JSON.parse(options.orderNumber),
					method: 'POST',
					success: (res) => {
						console.log(res)
						this.orderInfo = res.data.data;
						this.screenUser();
					}
				})
		},
		methods: {
			//隐藏操作
			hide(e) {
				if (e == 0) {
					this.hiddenValues = 1;
				} else {
					this.hiddenValues = 0;
				}
			},

			//同意购买-点击事件
			Selection: function() {
				if (this.channeIndex == 0) {
					this.channeIndex = 1;
				} else {
					this.channeIndex = 0;
				}
			},

			//数组提取
			screenUser: function() {
				let adult = this.orderInfo.appUserInfoList.filter(item => {
					return item.userType == '成人';
				})
				let children = this.orderInfo.appUserInfoList.filter(item => {
					return item.userType == '儿童';
				})

				this.adultIndex = adult.length;
				this.childrenIndex = children.length;
				this.adultTotalPrice = adult.length * this.orderInfo.ticketAdultPrice;
				this.childrenTotalPrice = children.length * this.orderInfo.ticketChildPrice;
			},

			//调起支付
			payment() {
				// uni.requestPayment({
				// 	provider: 'alipay',
				// 	orderInfo: {
				// 		"orderNumber": this.orderNumber,
				// 		"ticket": this.ticket,
				// 		"date": this.date,
				// 		"dateReminder": this.dateReminder,
				// 		"addressData": this.addressData,
				// 		"actualPayment": this.actualPayment,
				// 		"coupon": this.coupon,
				// 		"channe": this.channel[this.channeIndex],
				// 	},
				// 	success: function(res) {
				// 		console.log('success:' + JSON.stringify(res));
				// 	},
				// 	fail: function(err) {
				// 		console.log('fail:' + JSON.stringify(err));
				// 	}
				// })

				uni.redirectTo({
					url: '/pages/LYFW/scenicSpotTickets/successfulPayment?orderNumber=' + JSON.stringify(this.orderInfo.orderNumber)
				})

			}


		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F5F5;
		padding-bottom: 40upx;
	}

	//背景图样式
	.ob_background {
		position: absolute;
		width: 100%;
		height: 320upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	//整体容器样式
	.cover-container {
		position: relative;
		top: 148upx;
		padding: 32upx 30upx;
	}

	/* #ifdef MP-WEIXIN */
	//整体容器样式 -微信版
	.cover-container {
		top: 64upx;
	}

	/* #endif */

	//公共样式 - 适用多个数据框
	.MP_information1 {
		border-radius: 16upx;
		background: #FFFFFF;
		padding: 44upx 32upx;
		padding-bottom: 24upx;
		font-size: 32upx;
		box-shadow: 0px 0.2px 0px #aaa;

		.MP_title {
			font-size: 34upx;
			display: flex;
			font-weight: bold;
			// margin-top: 20upx;
		}

		.MP_text {
			color: #888;
			font-size: 28upx;
			margin-top: 20upx;
			display: block; // 让字体换行
		}
	}

	//公共样式2 - 适用单选框
	.MP_information2 {
		border-radius: 16upx;
		background: #FFFFFF;
		padding: 36upx 32upx;
		font-size: 32upx;
		box-shadow: 0px 0.2px 0px #aaa;
		margin-top: 24upx;

		.kj {
			font-size: 34upx;
			display: flex;
			font-weight: bold;
			margin-top: 8upx;
		}

		.MP_text {
			font-size: 26upx;
			margin-top: 20upx;
			display: block; // 让字体换行
		}

		//选项框样式
		.MP_optionBar {
			.Mp_title {
				font-size: 32upx;
				margin-left: 20upx;
			}

			.Mp_text {
				margin-top: 6upx;
				float: right;
				font-size: 28upx;
				color: #f85e52;
			}

			.Mp_textBlue {
				margin-left: 16upx;
				font-size: 26upx;
				color: #3EABFC;
			}

			.Mp_box {
				float: right;
				position: relative;
				bottom: 6upx;
				right: -12upx;
			}

			.Mp_icon {
				width: 100upx;
				font-size: 52upx;
			}

			.icon-weixinzhifu {
				color: #36cb59;
			}

			.icon-alipay {
				color: #01aaef;
			}
		}
	}

	//公共样式3 - 适用按钮
	.MP_information3 {
		padding: 24upx 0;
		border-radius: 64upx;
		background: #FF6600;
		text-align: center;
		color: #FFFFFF;
		font-size: 38upx;
		font-weight: 400;
		box-shadow: 0px 0.2px 0px #aaa;
		margin-top: 80upx;
	}

	//使用时间/费用详情
	.MP_selectionDate {
		margin-top: 24upx;
		margin-bottom: 24upx;
		border-top: 1px #F5F5F5 dashed;

		.MP_title {
			margin-top: 24upx;
			font-size: 34upx;
			display: flex;
			font-weight: bold;
		}

		.MP_text {
			color: #888;
			font-size: 28upx;
			display: block; // 让字体换行
		}

		.MP_cost {
			display: block; // 让字体换行
			margin: 20upx 0;
			font-size: 28upx;
			color: #888;

			.MP_number {
				margin-left: 16upx;
			}

			.MP_userCost {
				float: right;
			}

			.MP_total {
				color: #f85e52;
				float: right;
			}
		}
	}

	// 出行人信息
	.MP_userInformation {
		margin-top: 32upx;

		.Mp_sex {
			margin-left: 24upx;
		}

		.Mp_text {
			font-size: 28upx;
			display: block;
			color: #888;
			margin-top: 20upx;
		}

		.Mp_square {
			margin-left: 24upx;
			padding: 2upx 20upx;
			background: #3DABFC;
			font-size: 26upx;
			color: #fff;
			text-align: center;
			border-radius: 8upx;
		}

		.Mp_delete {
			float: right;
			color: #f85e52;
			font-size: 34upx;
		}

		.Mp_addTo {
			float: left;
			font-size: 30upx;
			margin-left: 64upx;
			width: 200upx;
		}

		.Mp_Selection {
			font-size: 30upx;
			margin-right: 64upx;
			width: 200upx;
		}
	}
</style>
