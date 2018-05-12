<template>
  <transition name="fade" mode="out-in">
      <div>
          <Form :model="formItem"  label-position="top">
             <FormItem label="封面">
                <div v-if="formItem.shopImage == ''" @click="swGalleryModal = true" style="width:200px;height:150px;background:#f3f3f3;cursor:pointer;" class="panel-center item-center">
                    添加封面
                </div>
                <div v-if="formItem.shopImage != ''" @click="swGalleryModal = true" :style="'width:200px;height:150px;cursor:pointer;background-image:url('+formItem.shopImage+');background-size:cover;background-position:center'"></div>
            </FormItem>
            <FormItem label="店铺名称">
                <Input v-model="formItem.shopName" placeholder="店铺名称" style="max-width:500px"></Input>
            </FormItem>
            <FormItem label="餐盒费">
                <Input v-model="formItem.boxPrice" placeholder="餐盒费" style="max-width:500px"></Input>
            </FormItem>
            <FormItem label="地址">
                <Row>
                    <Col span="7">
                        <Row>
                            <Col span="8">
                                <el-select v-model="formItem.province"  filterable allow-create default-first-option placeholder="省份" @change="getCity">
                                    <el-option v-for="item in provinceList" :key="item.value"
                                    :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </Col>
                            <Col span="8" v-show="cityList.length > 0">
                                <el-select v-model="formItem.city"  filterable allow-create default-first-option placeholder="城市" @change="getArea">
                                    <el-option v-for="item in cityList" :key="item.value"
                                    :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </Col>
                            <Col span="8" v-show="areaList.length > 0">
                                <el-select v-model="formItem.area"  filterable allow-create default-first-option placeholder="区域" >
                                    <el-option v-for="item in areaList" :key="item.value"
                                    :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="9">
                        <Input v-model="formItem.shopAddress" placeholder="输入详细地址" >
                            <Button slot="append" icon="ios-search" @click="getLwd()">获取经纬度</Button>
                        </Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="经度">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.lng" placeholder="获取需要"  />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">纬度</Col>
                    <Col span="7">
                        <Input v-model="formItem.lat" placeholder="获取需要"  />
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="营业时间">
                <TimePicker confirm @on-change="timePickerChange" v-model="formItem.time"  format="HH:mm:ss" type="timerange" placement="bottom-end" placeholder="营业时间" style="width: 400px"></TimePicker>
            </FormItem>
            <FormItem label="假期规则">
                <RadioGroup v-model="formItem.shopRate">
                    <Radio label="无休">无休</Radio>
                    <Radio label="单休">单休</Radio>
                    <Radio label="双休">双休</Radio>
                    <Radio label="单双休">单双休</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="营业状态">
                <i-switch v-model="formItem.open" size="large">
                    <span slot="open">营业</span>
                    <span slot="close">打样</span>
                </i-switch>
            </FormItem>
            <FormItem label="店铺电话">
                <Input v-model="formItem.shopPhone" placeholder="店铺电话" style="max-width:500px"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary"  :loading="loading" @click="submitForm()">创建店铺</Button>
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
      loading: false,
      tempModal: "cover",
      swGalleryModal: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      formItem: {
        appid: localStorage.getItem("miniId"),
        shopPhone: "",
        shopImage: "",
        province: "浙江省",
        area: "",
        city: "杭州市",
        lat: "",
        lng: "",
        shopRate: "",
        shopAddress: "",
        shopName: "",
        startTime: "",
        endTime: "",
        open: false,
        time: "",
        boxPrice:""
      }
    };
  },
  mounted() {
    this.provinceList = pos.getProvince();
    this.getCity("浙江省");
    this.getArea("杭州市");
  },
  methods: {
    submitForm() {
      delete this.formItem.time;
      this.loading = true;
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "shop/add",
        type: "POST",
        data: this.formItem,
        dataType: "json",
        success(res) {
          if (res.code) {
            that.$Modal.confirm({
              title: "添加成功",
              content: "是否要继续添加？",
              okText: "确定",
              cancelText: "取消",
              onOk: () => {
              },
              onCancel: () => {
                that.$router.push({path:'/wiseMealShopList'});
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
    },
    timePickerChange() {
      this.formItem.startTime = this.formItem.time[0];
      this.formItem.endTime = this.formItem.time[1];
    },
    getModelCover() {
      this.formItem.shopImage =
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].host +
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].path;
      this.swGalleryModal = false;
    },
    getCity(e) {
      this.cityList = pos.getCity(e);
    },
    getArea(e) {
      this.areaList = pos.getArea(e);
    },
    getLwd() {
      var that = this;
      var myGeo = new window.BMap.Geocoder();
      myGeo.getPoint(
        this.formItem.province +
          this.formItem.city +
          this.formItem.area +
          this.formItem.shopAddress,
        function(point) {
          if (point) {
            that.formItem.lat = point.lat;
            that.formItem.lng = point.lng;
          }
        },
        this.formItem.city
      );
    }
  }
};
</script>
