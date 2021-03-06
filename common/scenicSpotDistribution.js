//景区分类
const cateList = [
	//一级分类
	{
		id: 1,
		name: '武夷山市'
	}, 
	{
		id: 2,
		name: '延平区'
	},
	{
		id: 3,
		name: '顺昌县'
	},
	{
		id: 4,
		name: '浦城县'
	},
	{
		id: 5,
		name: '光泽县'
	},
	{
		id: 6,
		name: '松溪县'
	},
	{
		id: 7,
		name: '政和县'
	},
	{
		id: 8,
		name: '邵武市'
	},
	{
		id: 9,
		name: '建瓯市'
	},
	{
		id: 10,
		name: '建阳区'
	},
	//二级分类
		//武夷山市
	{
		id: 5,
		pid: 1,
		name: '武夷山风景名胜区'
	},
	{
		id: 6,
		pid: 1,
		name: '大安源'
	},
	{
		id: 8,
		pid: 1,
		name: '茶博园',
	},
	{
		id: 9,
		pid: 1,
		name: '自遊小镇',
	},
	{
		id: 10,
		pid: 1,
		name: '香江茗苑',
	},
	{
		id: 11,
		pid: 1,
		name: '青龙大瀑布',
	},
	{
		id: 12,
		pid: 1,
		name: '天上宫',
	},
	{
		id: 14,
		pid: 1,
		name: '武夷精舍',
	},
	{
		id: 15,
		pid: 1,
		name: '武夷源',
	},
	{
		id: 16,
		pid: 1,
		name: '五夫古镇',
	},
	{
		id: 17,
		pid: 1,
		name: '柳永纪念馆',
	},
	{
		id: 18,
		pid: 1,
		name: '列宁公园',
	},
	{
		id: 19,
		pid: 1,
		name: '龙川大峡谷',
	},
	{
		id: 20,
		pid: 1,
		name: '慧苑禅寺',
	},
	{
		id: 21,
		pid: 1,
		name: '山下梅村',
	},
		//延平区
	{
		id: 22,
		pid: 2,
		name: '溪源峡谷',
	},
	{
		id: 23,
		pid: 2,
		name: '三千八百坎',
	},
	{
		id: 24,
		pid: 2,
		name: '杉湖岛度假区',
	},
	{
		id: 25,
		pid: 2,
		name: '九峰山公园',
	},
	{
		id: 26,
		pid: 2,
		name: '峡阳古镇',
	},
	{
		id: 27,
		pid: 2,
		name: '茫荡山',
	},
	{
		id: 28,
		pid: 2,
		name: '明翠阁',
	},
		//顺昌县
	{
		id: 29,
		pid: 3,
		name: '华阳山',
	},
	{
		id: 30,
		pid: 3,
		name: '宝山',
	},
	{
		id: 31,
		pid: 3,
		name: '张墩乡村',
	},
	{
		id: 32,
		pid: 3,
		name: '高老庄摄影基地',
	},
	{
		id: 33,
		pid: 3,
		name: '元坑古镇',
	},
		//浦城县
	{
		id: 34,
		pid: 4,
		name: '中国包酒文化博览园',
	},
		//光泽县
	{
		id: 35,
		pid: 5,
		name: '乌君山',
	},
		//松溪县
	{
		id: 39,
		pid: 6,
		name: '湛卢山',
	},
		//政和县
	{
		id: 36,
		pid: 7,
		name: '佛子山',
	},
	{
		id: 37,
		pid: 7,
		name: '凤头楠木林',
	},
	{
		id: 39,
		pid: 7,
		name: '石圳村',
	},
	{
		id: 42,
		pid: 7,
		name: '洋后厝桥',
	},
	{
		id: 43,
		pid: 7,
		name: '后山廊桥',
	},
	{
		id: 44,
		pid: 7,
		name: '云根书院',
	},
	{
		id: 45,
		pid: 7,
		name: '洞宫山',
	},
		//邵武市 
	{
		id: 46,
		pid: 8,
		name: '和平古镇',
	},
	{
		id: 47,
		pid: 8,
		name: '天成奇峡',
	},
	{
		id: 48,
		pid: 8,
		name: '瀑布林生态',
	},{
		id: 49,
		pid: 8,
		name: '云灵山',
	},
	{
		id: 50,
		pid: 8,
		name: '温泉度假区',
	},
	{
		id: 51,
		pid: 8,
		name: '熙春园',
	},
	{
		id: 52,
		pid: 8,
		name: '小隐竹源',
	},
	{
		id: 53,
		pid: 8,
		name: '中央苏区纪念馆',
	},
	{
		id: 54,
		pid: 8,
		name: '李忠定公祠',
	},
	{
		id: 55,
		pid: 8,
		name: '宝严寺',
	},
	{
		id: 56,
		pid: 8,
		name: '民俗馆',
	},
	{
		id: 57,
		pid: 8,
		name: '华严寺',
	},
	{
		id: 58,
		pid: 8,
		name: '清真寺',
	},
		//建瓯市
	{
		id: 59,
		pid: 9,
		name: '鼓楼',
	},
	{
		id: 60,
		pid: 9,
		name: '归宗岩',
	},
	{
		id: 61,
		pid: 9,
		name: '东岳庙',
	},
		//建阳区
	{
		id: 62,
		pid: 10,
		name: '花花世界',
	},
	{
		id: 63,
		pid: 10,
		name: '黄坑',
	},
	{
		id: 64,
		pid: 10,
		name: '考亭书院',
	},
]

export default {
	cateList,
	
}