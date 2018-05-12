<template>
  <transition name="fade" mode="out-in">
      <div>
          <Form :model="formItem" :label-width="100">
            <FormItem label="标题">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.title" placeholder="输入标题" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">面积(㎡)</Col>
                    <Col span="7">
                        <Input v-model="formItem.config.area" placeholder="输入标题" />
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="联系人">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.config.name" placeholder="联系人" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">联系方式</Col>
                    <Col span="7">
                        <Input v-model="formItem.config.phone" placeholder="联系方式" />
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="租金（元/月）">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.minPrice" placeholder="输入价格" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">朝向</Col>
                    <Col span="7">
                        <Select v-model="formItem.config.orientation" >
                            <Option v-for="(item,index) in orientations" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="户型">
                <Row>
                    
                    <Col span="7">
                    <Row>
                        <Col span="8">
                            <Select v-model="formItem.config.houseType" >
                                <Option v-for="(item,index) in houseTypes" :key="index" :value="item">{{item}}</Option>
                            </Select>
                        </Col>
                        <Col span="8">
                            <Select v-model="formItem.config.houseType2" >
                                <Option v-for="(item,index) in houseTypes2" :key="index" :value="item">{{item}}</Option>
                            </Select>
                        </Col>
                        <Col span="8">
                            <Select v-model="formItem.config.houseType3" >
                                <Option v-for="(item,index) in houseTypes3" :key="index" :value="item">{{item}}</Option>
                            </Select>
                        </Col>
                    </Row>
                        
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">出租方式</Col>
                    <Col span="7">
                        <Select v-model="formItem.config.czfs" >
                            <Option v-for="(item,index) in czfs" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                </Row>
                
            </FormItem>
            <FormItem label="标签">
                <Row>
                    <Col span="7">
                        <CheckboxGroup v-model="formItem.config.tag">
                            <Checkbox label="随时看房"></Checkbox>
                            <Checkbox label="满五年"></Checkbox>
                            <Checkbox label="满二年"></Checkbox>
                            <Checkbox label="无双税"></Checkbox>
                            <Checkbox label="地铁"></Checkbox>
                            <Checkbox label="优质"></Checkbox>
                        </CheckboxGroup>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">电梯</Col>
                    <Col span="7">
                        <RadioGroup v-model="formItem.config.elevator">
                            <Radio label="有">有</Radio>
                            <Radio label="无">无</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="楼型">
                <Row>
                    <Col span="7">
                        <Select v-model="formItem.config.floorType" >
                            <Option v-for="(item,index) in floorTypes" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">装修</Col>
                    <Col span="7">
                        <Select v-model="formItem.config.decorate" >
                            <Option v-for="(item,index) in  decorates" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="年代">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.config.year" placeholder="年代" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">挂牌时间</Col>
                    <Col span="7">
                        <DatePicker type="date" placeholder="Select date" v-model="formItem.config.listingDate"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="小区">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.config.village" placeholder="小区名称" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">上下架</Col>
                    <Col span="7">
                        <RadioGroup v-model="formItem.remark2">
                            <Radio label="上架">上架</Radio>
                            <Radio label="下架">下架</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="地址">
                <Row>
                    <Col span="7">
                        <Row>
                            <Col span="8">
                                <el-select v-model="formItem.config.province"  filterable allow-create default-first-option placeholder="省份" @change="getCity">
                                    <el-option v-for="item in provinceList" :key="item.value"
                                    :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </Col>
                            <Col span="8" v-show="cityList.length > 0">
                                <el-select v-model="formItem.config.city"  filterable allow-create default-first-option placeholder="城市" @change="getArea">
                                    <el-option v-for="item in cityList" :key="item.value"
                                    :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </Col>
                            <Col span="8" v-show="areaList.length > 0">
                                <el-select v-model="formItem.config.areas"  filterable allow-create default-first-option placeholder="区域" >
                                    <el-option v-for="item in areaList" :key="item.value"
                                    :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="9">
                        <Input v-model="formItem.config.address" placeholder="输入详细地址" >
                            <Button slot="append" icon="ios-search" @click="getLwd()">获取经纬度</Button>
                        </Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="经度">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.config.lng" placeholder="获取需要"  />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">纬度</Col>
                    <Col span="7">
                        <Input v-model="formItem.config.lat" placeholder="获取需要"  />
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="简单描述">
                <Row>
                    <Col span="16">
                        <Input v-model="formItem.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="简单描述"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="封面">
                <div v-if="formItem.config.cover == ''" @click="tempModal = 'cover',swGalleryModal = true" style="width:200px;height:150px;background:#f3f3f3;cursor:pointer;" class="panel-center item-center">
                    添加封面
                </div>
                <div v-if="formItem.config.cover != ''" @click="tempModal = 'cover',swGalleryModal = true" :style="'width:200px;height:150px;cursor:pointer;background-image:url('+formItem.config.cover+');background-size:cover;background-position:center'"></div>
            </FormItem>
            <FormItem label="图片信息">
                <div class="panel-start">
                    <div @click="tempModal = 'oth',swGalleryModal = true" style="width:100px;height:100px;background:#f3f3f3;font-size:30px;cursor:pointer;margin-right:20px" class="panel-center item-center">+</div>
                    <div class="ghj" v-for="(item,index) in formItem.images" :key="index" :style="'background-image:url('+item.url+');background-size:cover;background-position:center'">
                        <div style="width:100px;height:30px;background:rgba(0,0,0,0.5);margin-top:70px" class="panel-center"> 
                            <div class="panel-center item-center asd" @click="index == 0 ? '':preImage(index)"><Icon v-show="index != 0" type="arrow-left-a" color="#ffffff"></Icon></div>
                            <div class="panel-center item-center asd" @click="delImage(index)"><Icon type="trash-a" color="#ffffff"></Icon></div>
                            <div class="panel-center item-center asd" @click="index == (formItem.images.length-1) ? '':nextImage(index)"><Icon v-show="(formItem.images.length-1 ) != index" type="arrow-right-a" color="#ffffff"></Icon></div>
                        </div>
                    </div>
                </div>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submitForm()">提交</Button>
            </FormItem>
        </Form>
        <Modal v-model="swGalleryModal" width="1000" >        
            <div v-if="swGalleryModal">
                <swGallery></swGallery>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="tempModal == 'cover' ? getModelCover():getModelImgs()">确定</Button>
            </div>
        </Modal>
      </div>
  </transition>
</template>
<style>
.ghj {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.asd {
  width: 100px;
  height: 30px;
  cursor: pointer;
}
.asd:hover {
  background: rgba(0, 0, 0, 0.7);
}
</style>

<script>
import swGallery from "../common/ui_console_gallery.vue";
var pos = require("../../assets/js/city.js");
export default {
  components: {
    swGallery
  },
  data() {
    return {
      provinceList: [],
      cityList: [],
      areaList: [],
      loading: false,
      tempModal: "cover",
      swGalleryModal: false,
      decorates: ["毛坯", "精装修", "简装修", "豪华装修"],
      floorTypes: ["板楼", "塔楼", "塔板结合"],
      orientations: ["朝南", "朝北", "朝东", "朝西", "南北"],
      houseTypes: ["一室", "二室", "三室", "四室", "四室以上"],
      houseTypes2: ["一厅", "二厅", "三厅", "四厅"],
      houseTypes3: ["一卫", "二卫", "三卫", "四卫"],
      danwei: ["元", "元/月", "元/㎡", "万"],
      czfs: ["押一付一", "押一付三", "半年付", "年付"],
      formItem: {
        title: "",
        minPrice: "",
        company: "万元",
        images: [],
        config: {
            name:'',
            phone:'',
          czfs: "",
          province: "",
          city: "",
          areas: "",
          address: "",
          lng: "",
          lat: "",
          cover: "",
          listingDate: "",
          decorate: "",
          orientation: "",
          houseType: "",
          houseType2: "",
          houseType3: "",
          tag: [],
          year: "",
          price: "",
          elevator: "",
          floorType: "",
          area: "",
          village: ""
        },
        note: "",
        remark2: "上架"
      }
    };
  },
  mounted() {
    this.provinceList = pos.getProvince();
    this.getMsg();
  },
  methods: {
    getCity(e) {
      this.cityList = pos.getCity(e);
    },
    getArea(e) {
      this.areaList = pos.getArea(e);
    },
    getMsg() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "exh/find",
        type: "POST",
        data: {
          query: JSON.stringify({
            fields: [],
            wheres: [
              {
                value: "userId",
                opertionType: "equal",
                opertionValue: localStorage.getItem("userId")
              },
              {
                value: "miniId",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "isDelete",
                opertionType: "equal",
                opertionValue: false
              },
              {
                value: "sunwouId",
                opertionType: "equal",
                opertionValue: this.$route.query.id
              }
            ],
            sorts: [],
            pages: {
              currentPage: 1,
              size: 10
            }
          })
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            res.params.result[0].images = JSON.parse(
              res.params.result[0].images
            );
            that.formItem = res.params.result[0];
            that.cityList = pos.getCity(that.formItem.config.province);
            that.areaList = pos.getArea(that.formItem.config.city);
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    getLwd() {
      var that = this;
      var myGeo = new window.BMap.Geocoder();
      myGeo.getPoint(
         this.formItem.config.province +
              this.formItem.config.city +
              this.formItem.config.area +
              this.formItem.config.address,
        function(point) {
          if (point) {
            that.formItem.config.lat = point.lat;
            that.formItem.config.lng = point.lng;
          }
        },
        this.formItem.config.city
      );
    },
    submitForm() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "exh/update",
        type: "POST",
        data: {
          sunwouId: this.$route.query.id,
          title: this.formItem.title,
          userId: localStorage.getItem("userId"),
          minPrice: this.formItem.minPrice,
          company: this.formItem.company,
          images: JSON.stringify(this.formItem.images),
          configs: JSON.stringify(this.formItem.config),
          note: this.formItem.note,
          miniId: localStorage.getItem("miniId"),
          position: this.formItem.config.address,
          remark1: "租房",
          remark2: this.formItem.remark2
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.$Message.success(res.msg);
            that.$router.push({
              path: "/houseAgentRentRoom"
            });
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    preImage(index) {
      var temp = this.formItem.images[index].url;
      this.formItem.images[index].url = this.formItem.images[index - 1].url;
      this.formItem.images[index - 1].url = temp;
    },
    nextImage(index) {
      var temp = this.formItem.images[index].url;
      this.formItem.images[index].url = this.formItem.images[index + 1].url;
      this.formItem.images[index + 1].url = temp;
    },
    delImage(index) {
      this.formItem.images.splice(index, 1);
    },
    getModelCover() {
      this.formItem.config.cover =
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].host +
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].path;
      this.swGalleryModal = false;
    },
    getModelImgs() {
      var li = JSON.parse(sessionStorage.getItem("imgUrls"));
      for (var i in li) {
        this.formItem.images.push({ url: li[i].host + li[i].path });
      }
      sessionStorage.removeItem("imgUrls");
      this.swGalleryModal = false;
    }
  }
};
</script>
