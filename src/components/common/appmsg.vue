<template>
  <transition name="fade" mode="out-in">
      <div>
        <Form :model="data" :label-width="100">
            <FormItem label="小程序头像">
                <Row>
                    <Col span="7">
                        <div class="panel-start item-end">
                            <div v-show="!data.logo" style="width:80px;height:80px;border-radius:80px;background:#f3f3f3"></div>
                            <img v-show="data.logo" :src="data.logo" width="80px" height="80px" style="border-radius:80px">
                            <div style="margin-left:30px">
                                <div style="width:200px;color:#888">修改后不影响在微信内显示的小程序头像，改头像只在该平台内有效。</div>
                                <el-button type="text"  @click="swGalleryModal = true,tempImage = 'logo'">修改</el-button>
                            </div>
                        </div>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">小程序二维码</Col>
                    <Col span="7">
                        <div class="panel-start item-end">
                            <div v-show="!data.qrSec" style="width:80px;height:80px;border-radius:80px;background:#f3f3f3"></div>
                            <img v-show="data.qrSec" :src="data.qrSec" width="80px" height="80px" style="border-radius:80px">
                            <div style="margin-left:30px">
                                <div style="width:200px;color:#888">请提供真实有效的小程序码。</div>
                                <el-button type="text" @click="swGalleryModal = true,tempImage = 'qrSec'">修改</el-button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="小程序名称">
                <Row>
                    <Col span="7">
                        <Input v-model="data.appName" placeholder="小程序名称" />
                    </Col>
                   
                </Row>
            </FormItem>
            <FormItem label="APPID">
                <Row>
                    <Col span="7">
                        <Input v-model="data.appid" placeholder="APPID" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">APP Secret</Col>
                    <Col span="7">
                        <Input v-model="data.appSecret" placeholder="APP Secret" />
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="微信商户号">
                <Row>
                    <Col span="7">
                        <Input v-model="data.merchantNumber" placeholder="微信商户号" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">微信商户密钥</Col>
                    <Col span="7">
                        <Input v-model="data.merchantSecret" placeholder="微信商户密钥" />
                    </Col>
                </Row>
            </FormItem>
            <!-- <FormItem label="小程序简介" >
                <Row>
                    <Col span="16">
                        <Input v-model="data.remarkConfig.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="简单描述"></Input>
                    </Col>
                </Row>
            </FormItem> -->
            <FormItem :label="appfor == 'wiseMeal' ? '充值规则':'百度地图AK'" >
                <Row v-if="appfor != 'wiseMeal'">
                    <Col span="4">
                        <Input v-model="data.baiduApiKey" placeholder="百度地图AK" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">腾讯地图AK</Col>
                    <Col span="4">
                        <Input v-model="data.tencentApiKey" placeholder="腾讯地图AK" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">高德地图AK</Col>
                    <Col span="4">
                        <Input v-model="data.gaodeApiKey" placeholder="高德地图AK" />
                    </Col>
                </Row>
                <Row v-if="appfor == 'wiseMeal'">
                    <Col span="16">
                        <Input v-model="data.baiduApiKey" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="充值规则" />
                    </Col>
                </Row>
            </FormItem>
            <div style="border-bottom:1px solid #e1e1e1;width:100%;margin-bottom:20px"></div>
            <FormItem label="管理员姓名" v-for="(item,index) in data.remakeConfig" :key="index" >
                <Row>
                    <Col span="4">
                        <Input v-show="item.admin" v-model="item.admin.name" placeholder="管理员姓名" />
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px">管理员手机号</Col>
                    <Col span="4">
                        <Input v-show="item.admin" v-model="item.admin.phone" placeholder="管理员手机号" />
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submitUpdate()">保存修改</Button>
            </FormItem>
        </Form>
        <div style="border-bottom:1px solid #e1e1e1;width:100%"></div>
        <div class="panel-start">
            <div class="panel-start">
                <div style="color:#aaaaaa;line-height:40px">注册时间:</div>
                <div style="line-height:40px;margin-left:10px">2018-05-06</div>
            </div>
            <div class="panel-start" style="margin-left:100px">
                <div style="color:#aaaaaa;line-height:40px">到期时间:</div>
                <div style="line-height:40px;margin-left:10px">2019-05-06</div>
            </div>
        </div>

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
import swGallery from "./ui_console_gallery.vue";
export default {
  components: {
    swGallery
  },
  data() {
    return {
      appfor:'',
      sshow: false,
      tempImage: "",
      swGalleryModal: false,
      data: {
        remakeConfig: [
          {
            admin: {
              name: "",
              phone: ""
            },
            recommend: [
              { label: "二手房推荐", value: "", oth: [] },
              { label: "新房房推荐", value: "", oth: [] },
              { label: "租房推荐", value: "", oth: [] },
              { label: "首页推荐", value: "", oth: [] }
            ]
          }
        ],
        qrSec: "",
        logo: "",
        appName: "",
        appid: "",
        appSecret: "",
        tencentApiKey: "",
        baiduApiKey: "",
        merchantSecret: "",
        merchantNumber: "",
        gaodeApiKey: ""
      }
    };
  },
  mounted() {
      this.appfor = localStorage.getItem('relation');
      console.log(this.appfor)
    this.getMiniPro();
  },
  methods: {
    getModelCover() {
      this.data[this.tempImage] =
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].host +
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].path;
      this.swGalleryModal = false;
    },
    getMiniPro() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "miniPro/find",
        type: "post",
        data: {
          query: JSON.stringify({
            wheres: [
              {
                value: "sunwouId",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "userid",
                opertionType: "equal",
                opertionValue: localStorage.getItem("userId")
              }
            ]
          })
        },
        dataType: "json",
        success(res) {
          if (res.params.result[0].remakeConfig) {
            res.params.result[0].remakeConfig = JSON.parse(
              res.params.result[0].remakeConfig
            );
            if(res.params.result[0].remakeConfig[0].admin){
                sessionStorage.setItem('adminName',res.params.result[0].remakeConfig[0].admin.name)
                sessionStorage.setItem('adminPhone',res.params.result[0].remakeConfig[0].admin.phone)
            }
            
          } else {
            res.params.result[0].remakeConfig = [
              {
                admin: {
                  name: "",
                  phone: ""
                },
                recommend: [
                  { label: "二手房推荐", value: "", oth: [] },
                  { label: "新房房推荐", value: "", oth: [] },
                  { label: "租房推荐", value: "", oth: [] },
                  { label: "首页推荐", value: "", oth: [] }
                ]
              }
            ];
          }

          that.data = res.params.result[0];
          
        }
      });
    },
    submitUpdate() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "miniPro/update",
        type: "post",
        data: {
          appid: this.data.appid,
          appName: this.data.appName,
          appSecret: this.data.appSecret,
          merchantNumber: this.data.merchantNumber,
          merchantSecret: this.data.merchantSecret,
          userid: localStorage.getItem("userId"),
          sunwouId: localStorage.getItem("miniId"),
          tencentApiKey: this.data.tencentApiKey,
          baiduApiKey: this.data.baiduApiKey,
          gaodeApiKey: this.data.gaodeApiKey,
          qrSec: this.data.qrSec,
          logo: this.data.logo,
          remakeConfig: JSON.stringify(this.data.remakeConfig)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.getMiniPro();
            that.$Message.success("修改成功");
            localStorage.setItem("appName", this.data.appName);
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    }
  }
};
</script>
