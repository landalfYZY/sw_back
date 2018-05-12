//房产中介
var houseAgent = [{
    label: '全局信息',
    icon: '',
    children: [
      // {label:'信息总览',path:'/houseAgentOverview'},
      {
        label: '小程序信息',
        path: '/appmsg'
      },
      {
        label: '文件库',
        path: '/uiConsoleGallery'
      },

    ]
  },
  {
    label: '推荐管理',
    icon: '',
    children: [
      // {label:'首页推荐',path:'/houseAgentRecommend'},
      {
        label: '推荐规则',
        path: '/houseAgentDetailRecommend'
      }
    ]
  },
  {
    label: '二手房管理',
    icon: '',
    children: [{
        label: '二手房列表',
        path: '/houseAgentHandRoom'
      },
      {
        label: '新增二手房',
        path: '/houseAgentHandRoomAdd'
      }
    ]
  },
  {
    label: '新房管理',
    icon: '',
    children: [{
        label: '新房列表',
        path: '/houseAgentNewHouse'
      },
      {
        label: '新增新房',
        path: '/houseAgentNewHouseAdd'
      }
    ]
  },
  {
    label: '租房管理',
    icon: '',
    children: [{
        label: '租房列表',
        path: '/houseAgentRentRoom'
      },
      {
        label: '新增租房',
        path: '/houseAgentRentRoomAdd'
      }
    ]
  },
  {
    label: '用户管理',
    icon: '',
    children: [{
        label: '用户发布信息',
        path: '/houseAgentUserPublish'
      },
      {
        label: '用户信息',
        path: '/wxuser'
      },
    ]
  }
]
//文章
var articleProgram = [{
    label: '全局信息',
    icon: '',
    children: [{
        label: '小程序信息',
        path: '/appmsg'
      },
      {
        label: '文件库',
        path: '/uiConsoleGallery'
      },
    ]
  },
  {
    label: '文章管理',
    icon: '',
    children: [{
        label: '文章列表',
        path: '/richTextList'
      },
      {
        label: '文章编辑',
        path: '/richText'
      }
    ]
  },
]
//教育缴费
var educationPayment = [
  {
    label: "全局信息",
    icon: "",
    children: [
      {
        label: "信息总览",
        path: "/educationPaymentOverview"
      },
      {
        label: "小程序信息",
        path: "/appmsg"
      },
      {
        label: "文件库",
        path: "/uiConsoleGallery"
      }
    ]
  },
  {
    label: "校园管理",
    icon: "",
    children: [
      {
        label: "校园列表",
        path: "/educationPaymentSchoolList"
      },
      {
        label: "新增校园",
        path: "/educationPaymentSchoolAdd"
      }
    ]
  },
  {
    label: "学生缴费",
    icon: "",
    children: [
      {
        label: "学生列表",
        path: "/educationPaymentstudentList"
      },
      {
        label: "学生缴费列表",
        path: "/educationPaymentPaymentList"
      },
      {
        label: "缴费项列表",
        path: "/educationPaymentPayItemList"
      }
    ]
  },
  {
    label: "银行卡管理",
    icon: "",
    children: [
      {
        label: "银行卡列表",
        path: "/educationPaymentBankCardList"
      }
    ]
  }
];
//智慧点餐
var wiseMeal = [{
    label: '全局信息',
    icon: '',
    children: [{
        label: '信息总览',
        path: '/wiseMealOverview'
      },
      {
        label: '小程序信息',
        path: '/appmsg'
      },
      {
        label: '文件库',
        path: '/uiConsoleGallery'
      },
    ]
  },
  {
    label: '店铺管理',
    icon: '',
    children: [{
        label: '店铺列表',
        path: '/wiseMealShopList'
      },
      {
        label: '新增店铺',
        path: '/wiseMealShopAdd'
      }
    ]
  },
  {
    label: '用户管理',
    icon: '',
    children: [{
        label: '收银员管理',
        path: '/wiseMealMember'
      },
      {
        label: '用户列表',
        path: '/wxuser'
      }
    ]
  },
  {
    label: '商品管理',
    icon: '',
    children: [{
        label: '商品类目',
        path: '/wiseMealCategory'
      }, {
        label: '商品列表',
        path: '/wiseMealgoodsList'
      },
      {
        label: '新增商品',
        path: '/wiseMealGoodsAdd'
      }
    ]
  },
  {
    label: '充值管理',
    icon: '',
    children: [{
        label: '充值规则',
        path: '/wiseMealRechargeRule'
      }, {
        label: '新增充值项',
        path: '/wiseMealRecharge'
      }
    ]
  },
  {
    label: '订单管理',
    icon: '',
    children: [{
        label: '订单列表',
        path: '/wiseMealOrderlist'
      }
    ]
  }
]

var bookingAndPurchase = [
  {
    label: '全局信息',
    icon: '',
    children: [{
        label: '信息总览',
        path: '/bookingAndPurchaseOverview'
      },
      {
        label: '小程序信息',
        path: '/appmsg'
      },
      {
        label: '文件库',
        path: '/uiConsoleGallery'
      },
    ]
  },
  {
    label: '地区与类目',
    icon: '',
    children: [{
        label: '地区列表',
        path: '/bookingAndPurchaseCountry'
      },
      {
        label: '类目列表',
        path: '/bookingAndPurchaseCategory'
      }
    ]
  },
  {
    label: '商品管理',
    icon: '',
    children: [{
        label: '商品列表',
        path: '/bookingAndPurchaseGoodsList'
      },
      {
        label: '新增商品',
        path: '/bookingAndPurchaseGoodsAdd'
      }
    ]
  },
  {
    label: '用户管理',
    icon: '',
    children: [
      {
        label: '用户列表',
        path: '/wxuser'
      }
    ]
  },
]
module.exports = {
  houseAgent: houseAgent,
  articleProgram: articleProgram,
  educationPayment: educationPayment,
  wiseMeal: wiseMeal,
  bookingAndPurchase:bookingAndPurchase
}
