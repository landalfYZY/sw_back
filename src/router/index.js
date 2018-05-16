import Vue from 'vue'
import Router from 'vue-router'

/**
 * user interface pages
 */
import main from '../components/common/main'
import login from '../components/common/login'
import appmsg from '../components/common/appmsg'
import uiConsoleGallery from '../components/common/ui_console_gallery'
import miniprogram from '../components/common/miniprogram'
import wxuser from '../components/common/wxuser'
/**
 * 单商家房产中介通用模板
 */
import houseAgentOverview from '../components/houseAgent/overview'  //信息总览
import houseAgentRecommend from '../components/houseAgent/recommend' //推荐
import houseAgentHandRoom from '../components/houseAgent/handRoom' //推荐
import houseAgentHandRoomAdd from '../components/houseAgent/handRoomAdd'
import houseAgentNewHouse from '../components/houseAgent/newHouse'
import houseAgentNewHouseAdd from '../components/houseAgent/newHouseAdd'
import houseAgentHandRoomUpdate from '../components/houseAgent/handRoomUpdate'
import houseAgentNewHouseUpdate from '../components/houseAgent/newHouseUpdate'
import houseAgentRentRoomAdd from '../components/houseAgent/rentRoomAdd'
import houseAgentRentRoom from '../components/houseAgent/rentRoom'
import houseAgentRentRoomUpdate from '../components/houseAgent/rentRoomUpdate'
import houseAgentDetailRecommend from '../components/houseAgent/detailRecommend' //详情页推荐
import houseAgentUserPublish from '../components/houseAgent/userPublish'

/**
 * 美文小程序
 */
import richText from '../components/articleProgram/rich_text'
import richTextList from '../components/articleProgram/rich_text_list'
import articleUpdate from '../components/articleProgram/article_update'

/**
 * 教育缴费
 */
import educationPaymentOverview from '../components/educationPayment/overview'
import educationPaymentSchoolList from '../components/educationPayment/schoolList'
import educationPaymentSchoolAdd from '../components/educationPayment/schoolAdd'
import educationPaymentstudentList from "../components/educationPayment/studentList";
import educationPaymentBankCardList from "../components/educationPayment/bankCardList";
import educationPaymentPayItemList from "../components/educationPayment/payItemList";
import educationPaymentPaymentList from "../components/educationPayment/paymentList";
import educationPaymentSchoolLogin from '../components/educationPayment/schoolPayment/login'
import educationPaymentSchoolStudentsAdd from "../components/educationPayment/schoolPayment/addStudents";
import educationPaymentSchoolStudentsList from '../components/educationPayment/schoolPayment/studentsList'
import educationPaymentSchoolMain from '../components/educationPayment/schoolPayment/main'
import educationPaymentSchoolOverview from "../components/educationPayment/schoolPayment/overview"
import educationPaymentSchoolBankCardList from "../components/educationPayment/schoolPayment/bankCardList";
import educationPaymentSchoolPaymentList from "../components/educationPayment/schoolPayment/paymentList"
import educationPaymentSchoolPaymentAdd from "../components/educationPayment/schoolPayment/paymentAdd";
import educationPaymentSchoolPayItemList from "../components/educationPayment/schoolPayment/payItemList";

/**
 * 智慧点餐
 */
import wiseMealOverview from '../components/wiseMeal/overview'
import wiseMealShopAdd from '../components/wiseMeal/shopAdd'
import wiseMealShopList from '../components/wiseMeal/shopList'
import wiseMealShopUpdate from '../components/wiseMeal/shopUpdate'
import wiseMealMember from '../components/wiseMeal/member'
import wiseMealRechargeRule from '../components/wiseMeal/rechargeRule'
import wiseMealCategory from '../components/wiseMeal/category'
import wiseMealGoodsList from '../components/wiseMeal/goodsList'
import wiseMealGoodsAdd from '../components/wiseMeal/goodsAdd'
import wiseMealGoodsUpdate from '../components/wiseMeal/goodsUpdate'
import wiseMealRecharge from '../components/wiseMeal/recharge'
import wiseMealOrderlist from '../components/wiseMeal/orderlist'
import wiseMealCarousel from '../components/wiseMeal/carousel'
/**
 * 预定代购
 */
import bookingAndPurchaseOverview from '../components/bookingAndPurchase/overview'
import bookingAndPurchaseCategory from '../components/bookingAndPurchase/category'
import bookingAndPurchaseCountry from '../components/bookingAndPurchase/country'
import bookingAndPurchaseGoodsList from '../components/bookingAndPurchase/goodsList'
import bookingAndPurchaseGoodsAdd from '../components/bookingAndPurchase/goodsAdd'

Vue.use(Router)

export default new Router({
  routes: [
    { path:'/login',name:'login',component:login},
    { path:'/miniprogram',name:'miniprogram',component:miniprogram},
    { path: "/schoolLogin", name: "校园登录", component: educationPaymentSchoolLogin },
    { path: '/', name: 'main', component: main ,children:[
      //全局文件
      { path:'/appmsg',name:'小程序信息',component:appmsg},
      { path:'/richText',name:'文章',component:richText},
      { path:'/richTextList',name:'文章列表',component:richTextList},
      { path:'/uiConsoleGallery',name:'文件库',component:uiConsoleGallery},
      { path:'/articleUpdate',name:'更新文章',component:articleUpdate},
      { path:'/wxuser',name:'微信用户',component:wxuser},
      //单商家房产中介通用模板
      { path:'/houseAgentOverview',name:'信息总览',component:houseAgentOverview},
      { path:'/houseAgentRecommend',name:'首页推荐',component:houseAgentRecommend},
      { path:'/houseAgentHandRoom',name:'二手房列表',component:houseAgentHandRoom},
      { path:'/houseAgentHandRoomAdd',name:'新增二手房',component:houseAgentHandRoomAdd},
      { path:'/houseAgentNewHouse',name:'新房列表',component:houseAgentNewHouse},
      { path:'/houseAgentNewHouseAdd',name:'新增新房',component:houseAgentNewHouseAdd},
      { path:'/houseAgentHandRoomUpdate',name:'二手房修改',component:houseAgentHandRoomUpdate},
      { path:'/houseAgentNewHouseUpdate',name:'新房修改',component:houseAgentNewHouseUpdate},
      { path:'/houseAgentRentRoomAdd',name:'新增租房',component:houseAgentRentRoomAdd},
      { path:'/houseAgentRentRoom',name:'租房列表',component:houseAgentRentRoom},
      { path:'/houseAgentRentRoomUpdate',name:'修改租房信息',component:houseAgentRentRoomUpdate},
      { path:'/houseAgentDetailRecommend',name:'详情页推荐规则',component:houseAgentDetailRecommend},
      { path:'/houseAgentUserPublish',name:'用户发布信息',component:houseAgentUserPublish},
      //教育缴费
      { path: "/educationPaymentOverview", name: "信息总览", component: educationPaymentOverview },
      { path: "/educationPaymentSchoolList", name: "校园列表", component: educationPaymentSchoolList },
      { path: "/educationPaymentSchoolAdd", name: "新增校园", component: educationPaymentSchoolAdd },
      { path: "/educationPaymentstudentList", name: "学生列表", component: educationPaymentstudentList },
      { path: "/educationPaymentBankCardList", name: "银行卡列表", component: educationPaymentBankCardList },
      { path: "/educationPaymentPayItemList", name: "缴费项列表", component: educationPaymentPayItemList },
      { path: "/educationPaymentPaymentList", name: "学生缴费列表", component: educationPaymentPaymentList },
      //智慧点餐
      { path:'/wiseMealOverview',name:'信息总览',component:wiseMealOverview},
      { path:'/wiseMealShopAdd',name:'添加店铺',component:wiseMealShopAdd},
      { path:'/wiseMealShopUpdate',name:'修改店铺',component:wiseMealShopUpdate},
      { path:'/wiseMealShopList',name:'店铺列表',component:wiseMealShopList},
      { path:'/wiseMealMember',name:'收银员管理',component:wiseMealMember},
      { path:'/wiseMealRechargeRule',name:'充值规则',component:wiseMealRechargeRule},
      { path:'/wiseMealRecharge',name:'添加充值项',component:wiseMealRecharge},
      { path:'/wiseMealCategory',name:'商品类目',component:wiseMealCategory},
      { path:'/wiseMealGoodsList',name:'商品列表',component:wiseMealGoodsList},
      { path:'/wiseMealGoodsAdd',name:'新增商品',component:wiseMealGoodsAdd},
      { path:'/wiseMealGoodsUpdate',name:'修改商品',component:wiseMealGoodsUpdate},
      { path:'/wiseMealOrderlist',name:'订单列表',component:wiseMealOrderlist},
      { path:'/wiseMealCarousel',name:'广告图管理',component:wiseMealCarousel},
      //预定代购
      { path:'/bookingAndPurchaseOverview',name:'修改商品',component:bookingAndPurchaseOverview},
      { path:'/bookingAndPurchaseCategory',name:'类目列表',component:bookingAndPurchaseCategory},
      { path:'/bookingAndPurchaseCountry',name:'地区列表',component:bookingAndPurchaseCountry},
      { path:'/bookingAndPurchaseGoodsList',name:'商品列表',component:bookingAndPurchaseGoodsList},
      { path:'/bookingAndPurchaseGoodsAdd',name:'新增商品',component:bookingAndPurchaseGoodsAdd},
    ]},
    //缴费校园版面
    { path: "/school", name: "school", component: educationPaymentSchoolMain,
      children: [
        { path: "/educationPaymentSchoolStudentsAdd", name: "添加学生", component: educationPaymentSchoolStudentsAdd },
        { path: "/educationPaymentSchoolStudentsList", name: "学生列表", component: educationPaymentSchoolStudentsList },
        { path: "/educationPaymentSchoolOverview", name: "信息总览", component: educationPaymentSchoolOverview },
        { path: "/educationPaymentSchoolBankCardList", name: "银行卡列表", component: educationPaymentSchoolBankCardList },
        { path: "/educationPaymentSchoolPaymentList", name: "学生缴费列表", component: educationPaymentSchoolPaymentList },
        { path: "/educationPaymentSchoolPaymentAdd", name: "添加缴费", component: educationPaymentSchoolPaymentAdd },
        { path: "/educationPaymentSchoolPayItemList", name: "缴费项列表", component: educationPaymentSchoolPayItemList }
      ]
    }
  ]
})
