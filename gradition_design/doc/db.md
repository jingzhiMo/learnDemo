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
        goodPolicy: [0, 0, 0, 0]
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
        goodID: ,// 评价该商品的ID
        shopID: ,// 评价该商家的ID
        orderID: , // 评价的订单的ID
        cont: {
            username: '12111', // 用户名 string
            date: 0, // 时间戳 string
            points: { // 分数 object
                eat: 0, // 口味的分数
                envir: 0, // 环境的分数
                service: 0, // 服务的分数
                sum: 0 // 综合评分，就是上面三个评分的平均分
            }
            imgList： [], // 图片的列表
            word: '' // 评论内容 strng
        }
    }
    
### order 订单
	{
    	ID: 'o-121312', // 订单的ID
        goodID: '', // 订单对应着的商品ID，
        good: { // 订单的商品信息
            goodCount: '', // 购买商品的数量
            goodName: '', // 购买的时候，商品的名称
            goodImg: '', // 商品的图片
            goodType: '', // 商品类型
            goodCont: '', // 商品的 
            goodDesc: ''  // 购买的时候，商品的描述
            oldPrice: '', // 购买的时候，的旧价格
            currPrice: '', // 购买的时候，的价格
        }
        shopID: '', // 订单的商家对应的ID
        accountID: '', // 该订单属于的用户的ID
        evalID: '', // 评价的ID
        status: 1, // 订单的状态 1: 待付款；2：已付款，未评价；3. 已付款，已评价；4.已取消或过期；
        beginTime: '', // 开始的时间戳
        endTime: '', // 结束的时间戳
        siglePrice: '', // 单个商品的价格
        sumPrice: '' // 该订单总价
    }