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
                        <Input v-model="formItem.config.area" placeholder="建筑面积" />
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
            <FormItem label="均价（万元）">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.minPrice" placeholder="输入价格" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">单价（元/㎡）</Col>
                    <Col span="7">
                        <Input v-model="formItem.config.price" placeholder="输入价格" />
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="上下架">
                <Row>
                   <Col span="7">
                        <RadioGroup v-model="formItem.remark2">
                            <Radio label="上架">上架</Radio>
                            <Radio label="下架">下架</Radio>
                        </RadioGroup>
                    </Col>
                   
                </Row>
            </FormItem>
        
            <FormItem label="标签">
                <Row>
                    <Col span="7">
                        <CheckboxGroup v-model="formItem.config.tag">
                            <Checkbox label="无双税"></Checkbox>
                            <Checkbox label="地铁"></Checkbox>
                            <Checkbox label="优质"></Checkbox>
                        </CheckboxGroup>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">在售状态</Col>
                    <Col span="7">
                        <RadioGroup v-model="formItem.config.status">
                            <Radio label="代售">代售</Radio>
                            <Radio label="在售">在售</Radio>
                            <Radio label="停售">停售</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </FormItem>
            
            <FormItem label="开盘时间">
                <Row>
                    <Col span="7">
                        <DatePicker type="date" placeholder="Select date" v-model="formItem.config.kpDate"></DatePicker>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">交房时间</Col>
                    <Col span="7">
                        <DatePicker type="date" placeholder="Select date" v-model="formItem.config.jfDate"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="优惠咨询">
                <Row>
                    <Col span="7">
                        <Input v-model="formItem.config.proNum" placeholder="优惠咨询" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">许可证</Col>
                    <Col span="7">
                        <Input v-model="formItem.config.idcard" placeholder="许可证" />
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="特色">
                <Row>
                    <Col span="7">
                        <Select v-model="formItem.config.floorType" >
                            <Option v-for="(item,index) in floorTypes" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">房源类型</Col>
                    <Col span="7">
                        <Select v-model="formItem.config.decorate" >
                            <Option v-for="(item,index) in  decorates" :key="index" :value="item">{{item}}</Option>
                        </Select>
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
            <FormItem label="户型列表">
                <Button type="primary" @click="adds = true,idns = false">添加户型</Button>
                <el-table :data="formItem.config.huxin" style="width: 100%">
                            <el-table-column  label="图片" >
                                <template slot-scope="scope">
                                    <img :src="scope.row.img" width="50px" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column prop="title"  label="标题" ></el-table-column>
                            <el-table-column prop="houseStyle"  label="户型" ></el-table-column>
                            <el-table-column prop="price"  label="参考价格" ></el-table-column>
                            <el-table-column prop="area"  label="面积" ></el-table-column>
                            <el-table-column prop="chaoxiang"  label="朝向" ></el-table-column>
                            <el-table-column prop="huxinjiegou"  label="户型结构" ></el-table-column>
                            <el-table-column prop="youshi"  label="优势" ></el-table-column>
                            <el-table-column prop="buzu"  label="不足" ></el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <el-button-group>
                                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="tempIndex = scope.$index,adds = true,tempData = scope.row,tempModal = 'xt',idns = true"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delHuxin(scope.$index)"></el-button>
                                    </el-button-group>
                                </template>
                            </el-table-column>
                </el-table>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submitForm()">提交</Button>
            </FormItem>
        </Form>
        <Modal v-model="adds" width="600" >        
            <div>
               <Form :model="formItem" :label-width="80">
                   <FormItem label="图片信息">
                       <div v-if="!tempData.img" style="width:120px;height:150px;background:#f3f3f3;border-radius:2px;cursor:pointer" class="panel-center item-center" @click="tempModal = 'xt',swGalleryModal = true">添加户型图</div>
                       <div v-if="tempData.img" :style="'cursor:pointer;width:120px;height:150px;background:#f3f3f3;background-size:cover;background-position:center;background-image:url('+tempData.img+')'" @click="tempModal = 'xt',swGalleryModal = true"></div>
                   </FormItem>
                   <FormItem label="标题">
                       <Input v-model="tempData.title" placeholder="标题"  />
                   </FormItem>
                   <FormItem label="户型">
                       <Select v-model="tempData.houseStyle" >
                            <Option v-for="(item,index) in  houseTypes" :key="index" :value="item">{{item}}</Option>
                        </Select>
                   </FormItem>
                   <FormItem label="参考价格">
                       <Input v-model="tempData.price" placeholder="参考价格"  />
                   </FormItem>
                   <FormItem label="面积（㎡）">
                       <Input v-model="tempData.area" placeholder="面积"  />
                   </FormItem>
                   <FormItem label="朝向">
                       <Select v-model="tempData.chaoxiang" >
                            <Option v-for="(item,index) in  orientations" :key="index" :value="item">{{item}}</Option>
                        </Select>
                   </FormItem>
                   <FormItem label="户型结构">
                       <Input v-model="tempData.huxinjiegou" placeholder="户型结构"  />
                   </FormItem>
                   <FormItem label="优势">
                       <Input v-model="tempData.youshi" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="优势"></Input>
                   </FormItem>
                   <FormItem label="不足">
                       <Input v-model="tempData.buzu" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="不足"></Input>
                   </FormItem>
               </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="submitJg()">确定</Button>
            </div>
        </Modal>
        <Modal v-model="swGalleryModal" width="1000" >        
            <div v-if="swGalleryModal">
                <swGallery></swGallery>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" v-if="tempModal == 'cover'" long @click="getModelCover()">确定</Button>
                <Button type="primary" size="large" v-if="tempModal == 'oth'" long @click="getModelImgs()">确定</Button>
                <Button type="primary" size="large" v-if="tempModal == 'xt'" long @click="getModelXt()">确定</Button>
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
      idns: false,
      tempIndex: 0,
      tempData: {
        img: "",
        title: "",
        houseStyle: "",
        price: "",
        area: "",
        chaoxiang: "",
        huxinjiegou: "",
        youshi: "",
        buzu: ""
      },
      adds: false,
      loading: false,
      tempModal: "cover",
      swGalleryModal: false,
      status: ["代售", "在售", "停售"],
      decorates: ["住宅", "别墅", "写字楼", "商铺", "底商"],
      floorTypes: ["五证齐全", "低密度", "品牌房企", "车位充足"],
      orientations: ["朝南", "朝北", "朝东", "朝西", "南北"],
      houseTypes: ["一室", "二室", "三室", "四室", "四室以上"],
      danwei: ["元", "元/月", "元/㎡", "万"],
      formItem: {
        title: "",
        minPrice: "",
        company: "万元",
        images: [],
        config: {
          name: "",
          phone: "",
          province: "",
          city: "",
          areas: "",
          address: "",
          lng: "",
          lat: "",
          cover: "",
          price: "",
          area: "",
          kpDate: "",
          jfDate: "",
          proNum: "",
          status: "",
          idcard: "",
          huxin: [],
          floorType: "",
          decorate: "",
          tag:[]
        },
        note: "",
        remark2: "上架",
        remark1: "新房"
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
            res.params.result[0].config.huxin = JSON.parse(
              res.params.result[0].config.huxin
            );
            that.formItem = res.params.result[0];
            if(res.params.result[0].config.tag){
                that.formItem.config.tag = JSON.parse(res.params.result[0].config.tag)
            }else{
                that.formItem.config.tag = []
            }
            that.cityList = pos.getCity(that.formItem.config.province);
            that.areaList = pos.getArea(that.formItem.config.city);
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    delHuxin(index) {
      this.formItem.config.huxin.splice(index, 1);
    },
    submitJg() {
      var jk = JSON.stringify(this.tempData);
      if (this.idns) {
        this.formItem.config.huxin[this.tempIndex] = JSON.parse(jk);
        this.$Message.success("修改成功");
      } else {
        this.formItem.config.huxin.push(JSON.parse(jk));

        this.$Message.success("添加成功");
      }
      this.adds = false;
    },
    getLwd() {
      var that = this;
      var myGeo = new window.BMap.Geocoder();
      myGeo.getPoint(
        this.formItem.config.province +
          this.formItem.config.city +
          this.formItem.config.areas +
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
          remark1: "新房",
          remark2: this.formItem.remark2
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.$Message.success(res.msg);
            that.$router.push({
              path: "/houseAgentNewHouse"
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
    },
    getModelXt() {
      this.tempData.img =
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].host +
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].path;
      this.swGalleryModal = false;
    }
  }
};
</script>
