<template>
  <transition name="fade" mode="out-in">
      <div>
          <Form :model="formItem"  label-position="top">
            <FormItem label="店铺">
                <Select v-model="shop" style="width:300px;" placeholder="请选择一家店铺" @on-change="changeShop()">
                    <Option v-for="item in shopList" :value="item.sunwouId" :key="item.sunwouId">{{ item.shopName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="类目">
                <Select v-model="cate" style="width:300px;" placeholder="请选择一个类目" >
                    <Option v-for="item in cateList" :value="item.sunwouId" :key="item.sunwouId">{{ item.name }}</Option>
                </Select>
            </FormItem>
             <FormItem label="封面">
                <div v-if="formItem.image == ''" @click="swGalleryModal = true" style="width:200px;height:150px;background:#f3f3f3;cursor:pointer;" class="panel-center item-center">
                    添加封面
                </div>
                <div v-if="formItem.image != ''" @click="swGalleryModal = true" :style="'width:200px;height:150px;cursor:pointer;background-image:url('+formItem.image+');background-size:cover;background-position:center'"></div>
            </FormItem>
            <FormItem label="商品名称">
                <Input v-model="formItem.name" placeholder="商品名称" style="max-width:500px" />
            </FormItem>
            <FormItem label="商品最低价格">
                <Input v-model="formItem.price" placeholder="商品最低价格" style="max-width:500px" />
            </FormItem>
            <FormItem label="是否需要打包费">
                <el-switch
                    v-model="formItem.boxFalg"
                    active-text="是"
                    inactive-text="否">
                    </el-switch>
            </FormItem>
            <FormItem label="是否上架">
                <el-switch
                    v-model="formItem.show"
                    active-text="是"
                    inactive-text="否">
                    </el-switch>
            </FormItem>
            <FormItem label="规格">
                <Button type="info" @click="guigemodel = true">添加规格</Button>
                <el-table style="width: 100%" :data="formItem.attribute" >
                    <el-table-column prop="name" label="规格名称" > </el-table-column>
                    <el-table-column label="规格参数" > 
                        <template slot-scope="scope">
                            <el-tag style="margin-right:2px" v-for="(item,index) in scope.row.value" :key="index" size="mini" :type="item.price > 0 ? 'success':'warning'">{{item.label+' '+item.price}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200"> 
                        <template slot-scope="scope"> 
                            <ButtonGroup shape="circle">
                                <Button type="ghost" icon="edit" @click="guigemodelsd = true,tempindex = scope.$index,guigeForm = scope.row"></Button>
                                <Button type="ghost" icon="ios-trash" @click="delGui(scope.$index)"></Button>
                            </ButtonGroup>
                        </template>
                    </el-table-column>
                </el-table>
            </FormItem>
            
            <FormItem>
                <Button type="primary"  :loading="loading" @click="submitForm()">创建商品</Button>
            </FormItem>
        </Form>
        <Modal v-model="swGalleryModal" width="1000" >        
            <div v-if="swGalleryModal">
                <swGallery></swGallery>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="getModelCover()">确定</Button>
            </div>
        </Modal>
        <Modal v-model="guigemodel" ok-text="提交" cancel-text="取消" title="添加规格" width="600" @on-ok="submitGui()">
            <Form :model="guigeForm" label-position="top">
                <FormItem label="规格名称">
                    <Input v-model="guigeForm.name" />
                </FormItem>
                <FormItem label="规格参数">
                    <Button type="dashed" @click="guigeForm.value.push({label:'',price:''})">添加一项</Button>
                    <Row style="margin-top:10px" v-for="(item,index) in guigeForm.value" :key="index">
                        <Col span="2" style="text-align:center">标签</Col>
                        <Col span="8"><Input v-model="item.label" placeholder="标签" /></Col>
                        <Col span="2" style="text-align:center">价格</Col>
                        <Col span="8"><Input v-model="item.price" placeholder="价格" /></Col>
                        <Col span="4" style="text-align:center"><Button type="ghost" @click="delMo(index)">删除</Button></Col>
                    </Row>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="guigemodelsd" ok-text="提交" cancel-text="取消" title="修改规格" width="600" @on-ok="submitGuiUpdate()">
            <Form :model="guigeForm" label-position="top">
                <FormItem label="规格名称">
                    <Input v-model="guigeForm.name" />
                </FormItem>
                <FormItem label="规格参数">
                    <Button type="dashed" @click="guigeForm.value.push({label:'',price:''})">添加一项</Button>
                    <Row style="margin-top:10px" v-for="(item,index) in guigeForm.value" :key="index">
                        <Col span="2" style="text-align:center">标签</Col>
                        <Col span="8"><Input v-model="item.label" placeholder="标签" /></Col>
                        <Col span="2" style="text-align:center">价格</Col>
                        <Col span="8"><Input v-model="item.price" placeholder="价格" /></Col>
                        <Col span="4" style="text-align:center"><Button type="ghost" @click="delMo(index)">删除</Button></Col>
                    </Row>
                </FormItem>
            </Form>
        </Modal>
      </div>
  </transition>
</template>
<script>
import swGallery from "../common/ui_console_gallery.vue";
var pos = require("../../assets/js/city.js");
export default {
  components: {
    swGallery
  },
  data() {
    return {
      shopList: [],
      shop: "",
      guigeForm: {
        name: "",
        value: []
      },
      cateList: [],
      cate: "",
      guigemodelsd:false,
      tempindex:0,
      guigemodel: false,
      loading: false,
      tempModal: "cover",
      swGalleryModal: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      formItem: {
        appid: localStorage.getItem("miniId"),
        shopid: "",
        categoryid: "",
        price: "",
        image: "",
        name:'',
        boxFalg:false,
        attribute: [],
        show:true
      }
    };
  },
  mounted() {
    this.getShopList();
    if (this.$route.query.id) {
      this.shop = this.$route.query.id;
    }
  },
  methods: {
    delMo(index){
      this.guigeForm.value.splice(index,1)
    },
    submitGuiUpdate(){
      var temp = [];
      for(var i in this.guigeForm.value){
          if(this.guigeForm.value[i].label == '' || this.guigeForm.value[i].value == ''){
              temp.push(i)
          }
      }
      for(var i=temp.length-1;i>=0;i--){
          this.guigeForm.value.splice(i,1)
      }
      if(this.guigeForm.value.length>0 && this.guigeForm.name != ''){
          this.formItem.attribute[this.tempindex] = JSON.parse(JSON.stringify(this.guigeForm));
      }
      
    },
    delGui(index) {
      this.formItem.attribute.splice(index, 1);
    },
    submitGui() {
      var temp = [];
      for(var i in this.guigeForm.value){
          if(this.guigeForm.value[i].label == '' || this.guigeForm.value[i].value == ''){
              temp.push(i)
          }
      }
      for(var i=temp.length-1;i>=0;i--){
          this.guigeForm.value.splice(i,1)
      }
      if(this.guigeForm.value.length>0 && this.guigeForm.name != ''){
          this.formItem.attribute.push(JSON.parse(JSON.stringify(this.guigeForm)));
      }
      
    },
    getCate() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "productcategory/find",
        type: "POST",
        data: {
          query: JSON.stringify({
            fields: ["name"],
            wheres: [
              {
                value: "appid",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "shopid",
                opertionType: "equal",
                opertionValue: this.shop
              },
              {
                value: "isDelete",
                opertionType: "equal",
                opertionValue: false
              }
            ],
            sorts: [],
            pages: {
              currentPage: 1,
              size: 100
            }
          })
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.cateList = res.params.list;
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    changeShop() {
      if (this.shop != "") {
        this.getCate();
      }
    },
    getShopList() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "shop/find",
        type: "POST",
        data: {
          query: JSON.stringify({
            fields: ["shopName"],
            wheres: [
              {
                value: "appid",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "isDelete",
                opertionType: "equal",
                opertionValue: false
              }
            ],
            sorts: [],
            pages: {
              currentPage: 1,
              size: 100
            }
          })
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.shopList = res.params.list;
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    submitForm() {
      this.formItem.shopid = this.shop;
      this.formItem.categoryid = this.cate;
      this.formItem.attribute = JSON.stringify(this.formItem.attribute)
      var that = this;
      if(this.shop == ""){
          this.$Message.error("请选择一家店铺")
      }else if(this.cate =='') {
          this.$Message.error("请选择一个类目")
      }else if(this.formItem.image == ''){
          this.$Message.error("请选择一张照片")
      }else if(this.formItem.name == ''){
          this.$Message.error("商品名称不能为空")
      }else if(this.formItem.price == ''){
          this.$Message.error("最低价格不能为空")
      }else{
          this.loading = true;
          $.ajax({
            url: sessionStorage.getItem("API") + "product/add",
            type: "POST",
            data: this.formItem,
            dataType: "json",
            success(res) {
            if (res.code) {
                that.$Modal.confirm({
                title: "添加成功",
                content: "是否要继续添加？",
                okText: "前往列表",
                cancelText: "继续添加",
                onOk: () => {
                    that.$router.push({ path: "/wiseMealGoodsList",query:{id:that.shop} });
                },
                onCancel: () => {
                    that.formItem.attribute = JSON.parse(that.formItem.attribute)
                }
                });
            } else {
                that.$Message.error(res.msg);
            }
            },
            complete() {
            that.loading = false;
            }
        });
      }
      
    },
    getModelCover() {
      this.formItem.image =
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].host +
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].path;
      this.swGalleryModal = false;
    }
  }
};
</script>
