<template>
	<view class="content">
		<form @submit="formSubmit" style="width: 100%;">
			<view class="box1">
				<view class="itemClass">
					<view class="fontStyle">姓名	</view>
					<input placeholder="与证件姓名一致" class="inputClass" :value="user.userName" name="userName" /> 
				</view>
				<view class="itemClass borderTop">
					<view class="fontStyle">性别</view>
					<radio-group class="inputClass" name="userSex">
						<label v-for="(item, index) in sexMode" :key="index" @click="radioClick(index)" > 
							<radio style="transform: scale(0.7)" :value="user.userSex" :checked="index===user.userSex" />{{item.title}}
						</label>  
					</radio-group>
				</view>
				<view class="itemClass borderTop">
					<view class="fontStyle">手机号码</view>
					<input
						type="number"
						placeholder="请输入手机号码"
						maxlength="11"
						class="inputClass"
						:value="user.userPhoneNum"
						name="userPhoneNum"
					/>				
				</view>
			</view>
			<view class="codeClass">证件</view>
			<view class="box2">
				<view class="itemClass">
					<view class="fontStyle" style="font">身份证</view>
				</view>
				<view class="itemClass borderTop">
					<view class="fontStyle">证件号</view>
					<input
						placeholder="请保持与证件号码一致"
						class="inputClass"
						:value="user.userCodeNum"
						name="userCodeNum"
						type="idcard"
						maxlength="18"
					/>	
				</view>
				
				<view class="itemClass borderTop">
					<view class="fontStyle">有效期至</view>
					<view class="inputClass">
						<picker mode="date" :value="user.date" @change="bindDateChange" name="date">
							<view>{{user.date}}</view>
						</picker>
					</view>
				</view>
				
				<view class="itemClass borderTop">
					<text class="fontStyle">额外凭证</text>
					<picker class="inputClass" name="prove"  mode="selector" @change="proveChange" :range="proveType" :value="user.prove">
						{{selector}}
					</picker>
				</view>
			</view>
			
			<!-- 上传证件 -->
			<view class="frontClass" v-if="selector=='军人' || selector=='教师' || selector=='学生'" @click="getPhoto1">
				<view v-if="auditState1==0">
					<image src="../../static/GRZX/addImg.png" class="addClass"></image>
					<text class="fontClass">点击上传证件的正面</text>
				</view>
				<view v-if="auditState1==1">
					<image class="imgClass" :src="user.frontImg" name="frontImg"  mode="aspectFill"></image>
					<!-- <image class="auditClass" src="../../static/GRZX/auditImg.png"></image> -->
					<text class="stateClass">待审核</text>
				</view>
				<view v-if="auditState1==2">
					<image class="imgClass" :src="user.frontImg" name="frontImg"  mode="aspectFill"></image>
					<text class="stateClass">审核通过</text>
				</view>
				<view v-if="auditState1==3">
					<image class="imgClass" :src="user.frontImg" name="frontImg"  mode="aspectFill"></image>
					<text class="stateClass">审核未通过</text>
				</view>
			</view>
			<view class="backClass" v-if="selector=='军人' || selector=='教师' || selector=='学生'" @click="getPhoto2">
				<view v-if="auditState2==0">
					<image src="../../static/GRZX/addImg.png" class="addClass"></image>
					<text class="fontClass">点击上传证件的主页</text>
				</view>
				<view v-if="auditState2==1">
					<image class="imgClass" :src="user.backImg" name="backImg"  mode="aspectFill"></image>
					<text class="stateClass">待审核</text>
				</view>
				<view v-if="auditState2==2">
					<image class="imgClass" :src="user.backImg" name="backImg"  mode="aspectFill"></image>
					<text class="stateClass">审核通过</text>
				</view>
				<view v-if="auditState2==3">
					<image class="imgClass" :src="user.backImg" name="backImg"  mode="aspectFill"></image>
					<text class="stateClass">审核未通过</text>
				</view>
			</view>
			
			
			<view class="personClass">
				<view class="fontStyle">设置为本人</view>
				<view class="checkBox">
					<checkbox-group name="userDefault" @change="checkChange">
						<label>
							<checkbox :checked="user.userDefault" :value="user.userDefault" />
						</label>
					</checkbox-group>
				</view>
			</view>
			<view v-if="!user.show" style="margin-bottom: 150upx;"></view>
			<view v-if="user.show" class="emergencyClass">
				<view class="fontStyle">紧急联系人</view>
				<view class="checkBox">
					<checkbox-group name="userEmergencyContact">
						<label>
							<checkbox :checked="user.userEmergencyContact" :value="user.userEmergencyContact"/>
						</label>
					</checkbox-group>
				</view>
			</view>
			
			<button form-type="reset" class="btndelete" @click="resetClick">重置</button>
			<button form-type="submit" class="btnsubmit">保存</button>		
		</form>
		<view class="title">
			<image src="../../static/GRZX/btnReturn.png" class="returnClass" @click="returnClick"></image>
			<text class="textClass" @click="returnClick">常用信息设置</text>
		</view>
	</view>
</template>

<script>
	import wPicker from "@/components/GRZX/w-picker/w-picker.vue";
	export default {
		data(){
			return{
				auditState1:'',
				auditState2:'',
				sexMode :[
					{title:'男'},
					{title:'女'}
				],
				proveType:['请选择','军人','教师','学生'],
				selector:'请选择',
				user:{
					userID:'',
					userName:'',	
					userSex:0,
					userPhoneNum:'',
					userCodeNum:'',
					date:'',
					userDefault:false,
					show:true,
					userEmergencyContact:false,
					date:'请选择',
					prove:1,
					frontImg:'',
					backImg:'',
				},
				userType:'',
				address:'',
			}
		},
		onLoad (options){
			var type=options.type;
			this.type=options.type;
			if(options.type=="edit"){
				this.loadData(type);
			}
		},
		components:{
		     wPicker
		},
		methods:{
			async loadData(type){
				var that=this;
				uni.getStorage({
					key:'editPassenger',
					success:function(res){
						console.log(res,"res")
						that.user.userName=res.data.userName;
						if(res.data.userSex=="男"){
							that.user.userSex=0;
						}else{
							that.user.userSex=1;
						}
						that.user.userCodeNum =res.data.userCodeNum ;
						that.user.date=res.data.date;
						that.user.userDefault=res.data.userDefault;
						that.user.show=!res.data.userDefault;
						that.user.userEmergencyContact =res.data.userEmergencyContact ;
						that.user.userPhoneNum=res.data.userPhoneNum;
						that.user.userID=res.data.userID;
						if(res.data.userType=="军人"||res.data.userType=="教师"||res.data.userType=="学生"){
							that.selector=res.data.userType;
							that.user.frontImg=res.data.frontImg;
							that.user.backImg=res.data.backImg;
							that.auditState1=res.data.auditState;
							that.auditState2=res.data.auditState;
							// that.auditState1=2;  //测试
							// that.auditState2=2;	//测试
						}
						
					}
				})
			}, 
			radioClick:function(e){
				this.user.sex = e;
			},
			formSubmit:function(e){
				//console.log(e.target.value,"00.00")
				var data1=e.target.value;
				data1.date=this.user.date;
				var that=this;
				if(this.user.userSex==0){
					data1.userSex="男";
				}else{
					data1.userSex="女";
				}
				if(data1.userDefault==null||data1.userDefault==""){
					data1.userDefault=false;
				}else{
					data1.userDefault=true;
				}
				if(this.user.show){
					if(data1.userEmergencyContact==null||data1.userEmergencyContact==""){
						data1.userEmergencyContact=false;
					}else{
						data1.userEmergencyContact=true;
					}
				}else{
					data1.userEmergencyContact=false;
				}
				var codeNum=data1.userCodeNum;
				if(codeNum.length==18){
					var birth=codeNum.substring(6, 10) + "-" + codeNum.substring(10, 12) + "-" + codeNum.substring(12, 14);
					var  r=birth.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
					var  d=new Date(r[1],r[3]-1,r[4]);     
					if(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])   
					{   
						var Y=new  Date().getFullYear();   
						var age=Y-r[1];
					} 
					if(that.selector=="军人"){
						data1.userType="军人";
						data1.frontImg=that.user.frontImg;
						data1.backImg=that.user.backImg;
						data1.auditState=that.auditState1;
					}else if(that.selector=="教师"){
						data1.userType="教师";
						data1.frontImg=that.user.frontImg;
						data1.backImg=that.user.backImg;
						data1.auditState=that.auditState1;
					}else if(that.selector=="学生"){
						data1.userType="学生";
						data1.frontImg=that.user.frontImg;
						data1.backImg=that.user.backImg;
						data1.auditState=that.auditState1;
					}else if(age>=65){
						data1.userType="老人";
					}else if(age>=18&&age<65){
						data1.userType="成人";
					}else{
						data1.userType="儿童";
					}
					data1.hiddenIndex=0;
					var array=[];
					if(this.type=='edit'){	
						//array.push(data);
						uni.getStorage({
							key:'passList',
							success(res) {
								for(var i=0;i<res.data.length;i++){
									if(that.user.userID==res.data[i].userID){
										array.push(data1);
									}else{
										array.push(res.data[i]);
									}
								}
								uni.setStorage({
									key:'passList',
									data:array,
								})
							}
						})
						uni.navigateBack();
					}else if(this.type=='add'){
						var randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
						data1.userID=randomNum;
						array.push(data1);
						uni.getStorage({
							key:'passList',
							success(res) {
								for(var i=0;i<res.data.length;i++){
									array.push(res.data[i]);
								}
								uni.setStorage({
									key:'passList',
									data:array,
								})
							},
							fail() {
								uni.setStorage({
									key:'passList',
									data:array,
								})
							}
						})
						uni.navigateBack();
					}else{
						var randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
						data1.userID=randomNum;
						array.push(data1);
						uni.getStorage({
							key:'passList',
							success(res) {
								for(var i=0;i<res.data.length;i++){
									array.push(res.data[i]);
								}
								uni.setStorage({
									key:'passList',
									data:array,
								})
							},
							fail() {
								uni.setStorage({
									key:'passList',
									data:array,
								})
							}
						})
						uni.navigateBack();
					}
				}else{
					uni.showToast({
						icon:'none',
						title:'输入的身份证有误，请检查'
					})
				}
			},
			bindDateChange:function(e){
				this.user.date = e.target.value;
			},
			proveChange:function(e){
				this.selector=this.proveType[e.detail.value];
				// console.log(this.user.frontImg,"1")
				// console.log(this.user.backImg,"2")
				if(this.selector=='军人' || this.selector=='教师' || this.selector=='学生'){
					this.auditState1=0;
					this.auditState2=0;
					this.user.frontImg="";
					this.user.backImg="";
				}
			},
			resetClick:function(e){
				this.user.date="请选择";
			},
			checkChange:function(e){
				//console.log(e.detail.value,"xuanzhong");
				if(e.detail.value=="false"||e.detail.value=="true"){ //选中
					this.user.show=false;
				}else{	//未选中
					this.user.show=true;
				}
			},
			returnClick(){
				uni.navigateBack();
			},
			getPhoto1(){  	//证件正面
				var that=this;
				
				uni.chooseImage({
					count:1,
					success(res) {
						var tempFilePaths = res.tempFilePaths;
						uni.saveFile({
						  tempFilePath: tempFilePaths[0],
							success: function (res1) {
								that.user.frontImg=res1.savedFilePath;
								that.auditState1=1;
							}
						});
					}
				})
			},
			getPhoto2(){	//证件主页
				var that=this;
				
				uni.chooseImage({
					count:1,
					//sourceType:['album'],
					success(res) {
						//console.log(res,"res11");
						var tempFilePaths = res.tempFilePaths;
						uni.saveFile({
						  tempFilePath: tempFilePaths[0],
							success: function (res1) {
								that.user.backImg=res1.savedFilePath;
								that.auditState2=1;
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F6F8FC;
	}
	.content {
		// position: relative;
		display: flex;
		width: 100%;
	}
	.title{
		width: 100%;
		height: 144upx;
		position: fixed;
		left: 3.47%;
		top: 0upx;
		background-color: #F6F8FC;
	}
	.returnClass{
		width: 22upx;
		height: 40upx;
		display: flex;
		flex-direction: row;
		position: absolute;
		top: 100upx;
	}
	.textClass{
		color: #333333;
		font-size: 38upx;
		height: 44upx;
		line-height: 44upx;
		margin-top: 0upx;
		margin-left: 0upx;
		position: absolute;
		left: 36upx;
		top: 95upx;
	}
	
	.box1{ //姓名，性别，手机号
		display: flex;
		flex-direction: column;
		width: 93.07%;
		height: 330upx;
		margin-top: 170upx;
		margin-left: 3.47%;
		background-color: #FFFFFF;
		border-radius: 25upx;
	}
	.box2{		//证件相关信息
		display: flex;
		flex-direction: column;
		width: 93.07%;
		margin-top: 20upx;
		margin-left: 3.47%;
		background-color: #FFFFFF;
		border-radius: 25upx;
	}
	.itemClass{  
		width: 618upx;
		height: 110upx;
		margin-left: 40upx;
		margin-top: 0upx;
		
	}
	.codeClass{  //证件
		margin-top: 20upx;
		margin-left: 3.33%;
		font-size:32upx;
		font-family:Source Han Sans SC;
		font-weight:400;
		color:#2C2D2D;
		//font-weight: bold;
	}
	
	.fontStyle{   //文字样式
		color: #2C2D2D;
		font-size: 30upx;
		position: absolute;
		left: 9%;
		line-height: 108upx;
	}

	.personClass{	//是否为本人
		width: 93.07%;
		height: 110upx;
		background-color: #FFFFFF;
		margin-top: 20upx;
		margin-left: 3.47%;
		//margin-bottom: 150upx;
		border-radius: 25upx;
	}
	.emergencyClass{	//是否为紧急联系人
		width: 93.07%;
		height: 110upx;
		background-color: #FFFFFF;
		margin-top: 20upx;
		margin-left: 3.47%;
		margin-bottom: 150upx;
		border-radius: 25upx;
	}
	.btndelete{	//重置
		width: 40%;
		height: 108upx;
		background-color: #FFFFFF;
		color: #F75674;
		position: fixed;
		bottom: 0upx;
		left: 0%;
		border-radius: 0upx;
		text-align: center;
		line-height: 108upx;
		font-size: 35upx;
	}
	.btnsubmit{		//保存
		width: 60%;
		height: 108upx;
		background-color: #FC4B4B;
		color: #FFFFFF;
		position: fixed;
		bottom: 0upx;
		left: 40%;
		border-radius: 0upx;
		text-align: center;
		line-height: 108upx;
		font-size: 35upx;
	}
	.inputClass{
		position: absolute;
		width: 50%;
		height: 108upx;
		font-size: 32upx;
		right: 9%;
		line-height: 108upx;
		text-align: right;
	}
	.checkBox{ 
		line-height: 108upx;
		position: absolute;
		right: 9%;
	}
	.borderTop{  
		border-top: 1upx solid #EAEAEA;
	}
	.frontClass{  //证件正面
		width: 93.07%;
		height: 440upx;
		margin-top: 20upx;
		margin-left: 3.47%;
		border: 1upx solid #EAEAEA;
		background-color: #FFFFFF;
		border-radius: 25upx;
		position: relative;
	}
	.backClass{ //证件主页
		width: 93.07%;
		height:	440upx;
		margin-top: 20upx;
		margin-left: 3.47%;
		border: 1upx solid #EAEAEA;
		background-color: #FFFFFF;
		border-radius: 25upx;
		position: relative;
	}
	.addClass{	//添加图片
		width: 100upx;
		height: 100upx;
		position: absolute;
		left: 42%;
		top:150upx;
	}
	.fontClass{		//字体（证件）
		text-align: center;
		width: 100%;
		font-size: 32upx;
		position: absolute;
		top:270upx;
		color:#cdcdcd;
	}
	.imgClass{
		width: 100%;
		height: 440upx;
		border-radius: 25upx;
	}
	.auditClass{ //审核的背景图
		position: absolute;
		right: 0upx;
		top: 0;
		width: 100upx;
		height: 30upx;
	}
	.stateClass{	//审核状态的文字样式
		position: absolute;
		left: 20upx;
		top: 0;
		//width: 112upx;
		height: 52upx;
		line-height: 52upx;
		font-size: 32upx;
		color: #ff0000;
	}
</style>
