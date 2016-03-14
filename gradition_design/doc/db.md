# 数据库
gradition-gp

集合列表：
* account

## 集合
### accout
	{
    	ID: 0, // 用户的id，number 型
        phone: 123.. // 注册所用手机号，strng 型
        username:    // 用户名，string 型
        password:    // 用户密码，string 型
    }

### good 商品
	{
    	ID: 0, // 商品的ID number
        goodName: '', // 商品的名字 string
        goodDesc: '', // 商品的描述 strng
        goodType: '', // 商品类型 number 1: 代金券；2. 套餐；3.N选M 套餐
        goodCont: '', // 套餐商品的内容
        goodImg: [], // 商品图片
        goodCount: , 0 // 商品卖出数量 number
        tips: {
        	startDate: 0, // 活动开始时间 number
        	endDate: 0, // 活动结束时间  number
            useTime: { // 具体时间，精确到时、分 object
            	openTime: // 营业时间 String
                other:  // 其他使用提示语，提示语为 string
            },
            book: [''], // array 预约提示语 string
            rule: [''], // 使用规则，数组的元素为 string
            other: [''] // 温馨提示，数组元素为 string
        },
        points: {
        	sum: 5, // 商品评价的分数
        },
        oldPrice: 0, // 旧的价格 number
        currPrice: 0, // 现在的价格 number
        evalID: 0, // 评价列表的ID number
        shopID: 0 , // 商店的ID
    }

### 商家
    {
    	ID: 0, // 商家的ID  number
        shopName: '', // 商家的名字
        shopPlace: '', // 商家的地点
        shopPhone: 0, // 商家的电话
        shopImg: [], //商家的图片
        isChain: true, // 是否是连锁店
        chainID: 0, // 连锁店的ID
        goodList: [
        	{
            	goodID: 0, // 商品的ID
                goodName: '', // 商品的名称
                oldPrice: 0, // 旧的价格
                currPrice: 0 // 现在的价格
            }
        },
        evalID: 0 // 商店评价ID,
        points: {
        	eat: 0, // 口味的分数
            envir: 0, // 环境的分数
            service: 0, // 服务的分数
            sum: 0 // 综合评分，就是上面三个评分的平均分
		}
	}
### evaluate 评价
	{
    	ID: 0, // 评价的ID
    	points: 0, // 评分
        tag: { // 标签
        	good: {
            	img: 10, // 有图 number
                weidao: 20 // 味道不错 number
                taidu: 10, // 态度
                huanjing: 50, // 环境
                jiage: 10, // 价格
            },
            shop: {
            	jiaqian: 10, // 价钱合理
                weidaohao: 10, // 味道好
                weidaoyiban: 5, // 味道一般
                taiduyiban: 5, // 态度一般
                taiduhao: 10, // 态度好
                fenliangduo: 10, // 份量多
                fenliangshao: 5, // 分量少
            }
        },
        cont: [
        	{
            	username: '12111', // 用户名 string
                date: 0, // 时间戳 number
                points: { // 分数 object
                	eat: 0, // 口味的分数
                    envir: 0, // 环境的分数
                    service: 0, // 服务的分数
                    sum: 0 // 综合评分，就是上面三个评分的平均分
				}
                word: '' // 评论内容 strng
            },
            {} // ...
        ]
    }