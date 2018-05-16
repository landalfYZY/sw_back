<template>
  <transition name="fade" mode="out-in">
      <div>
          <Form :model="formItem"  label-position="top">
            
            <FormItem label="类目">
                <Select v-model="cate" style="width:300px;" placeholder="请选择一个类目" >
                    <Option v-for="item in cateList" :value="item.sunwouId" :key="item.sunwouId">{{ item.name }}</Option>
                </Select>
            </FormItem>
             <FormItem label="轮播图">
               <div class="panel-start">
                  <div @click="tempc = 'cover',swGalleryModal = true" style="width:120px;height:120px;background:#f3f3f3;cursor:pointer;margin-right:15px" class="panel-center item-center">
                      添加图片
                  </div>
                  <div  v-for="(item,index) in images" :key="index" :style="'width:120px;height:120px;margin-right:15px;background-image:url('+item.url+');background-size:cover;background-position:center'">
                      <div class="panel-between item-center" style="height:40px;background:rgba(0,0,0,0.5);margin-top:80px;">
                        <div class="tgb" @click="index > 0 ? preChange(index):''"><Icon v-show="index > 0" type="arrow-left-a" size="15" color='#ffffff'></Icon></div>
                        <div class="tgb" @click="delImgs(index)"><Icon type="trash-a" size="15" color='#ffffff'></Icon></div>
                        <div class="tgb" @click="index < images.length-1 ? nextChange(index):''"><Icon v-show="index < images.length-1" type="arrow-right-a" size="15" color='#ffffff'></Icon></div>
                      </div>
                  </div>
                </div>
            </FormItem>
            <FormItem label="商品名称">
                <Input v-model="formItem.name" placeholder="商品名称" style="max-width:500px" />
            </FormItem>
            <FormItem label="商品最低价格">
                <Input v-model="formItem.price" placeholder="商品最低价格" style="max-width:500px" />
            </FormItem>
            <!-- <FormItem label="是否需要打包费">
                <el-switch
                    v-model="formItem.boxFalg"
                    active-text="是"
                    inactive-text="否">
                    </el-switch>
            </FormItem> -->
            <FormItem label="是否上架">
                <el-switch
                    v-model="formItem.show"
                    active-text="是"
                    inactive-text="否">
                    </el-switch>
            </FormItem>
            <FormItem label="商品详情">
                <quill-editor style="height:300px" v-model="formItem.content"
                        ref="myQuillEditor"
                        :options="editorOption">
                  <div id="toolbar" slot="toolbar">
                    <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-strike"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>
                    <span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>
                    <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>
                    <span class="ql-formats"><select class="ql-size">
                      <option value="small"></option>
                      <option selected></option>
                      <option value="large"></option>
                      <option value="huge"></option>
                    </select></span>
                    <span class="ql-formats"><select class="ql-header">
                      <option value="1"></option>
                      <option value="2"></option>
                      <option value="3"></option>
                      <option value="4"></option>
                      <option value="5"></option>
                      <option value="6"></option>
                      <option selected="selected"></option>
                    </select></span>
                    <span class="ql-formats"><select class="ql-color">
                      <option selected="selected"></option>
                      <option value="#e60000"></option>
                      <option value="#ff9900"></option>
                      <option value="#ffff00"></option>
                      <option value="#008a00"></option>
                      <option value="#0066cc"></option>
                      <option value="#9933ff"></option>
                      <option value="#ffffff"></option>
                      <option value="#facccc"></option>
                      <option value="#ffebcc"></option>
                      <option value="#ffffcc"></option>
                      <option value="#cce8cc"></option>
                      <option value="#cce0f5"></option>
                      <option value="#ebd6ff"></option>
                      <option value="#bbbbbb"></option>
                      <option value="#f06666"></option>
                      <option value="#ffc266"></option>
                      <option value="#ffff66"></option>
                      <option value="#66b966"></option>
                      <option value="#66a3e0"></option>
                      <option value="#c285ff"></option>
                      <option value="#888888"></option>
                      <option value="#a10000"></option>
                      <option value="#b26b00"></option>
                      <option value="#b2b200"></option>
                      <option value="#006100"></option>
                      <option value="#0047b2"></option>
                      <option value="#6b24b2"></option>
                      <option value="#444444"></option>
                      <option value="#5c0000"></option>
                      <option value="#663d00"></option>
                      <option value="#666600"></option>
                      <option value="#003700"></option>
                      <option value="#002966"></option>
                      <option value="#3d1466"></option>
                    </select></span>
                    <span class="ql-formats"> <select class="ql-background">
                      <option value="#000000"></option>
                      <option value="#e60000"></option>
                      <option value="#ff9900"></option>
                      <option value="#ffff00"></option>
                      <option value="#008a00"></option>
                      <option value="#0066cc"></option>
                      <option value="#9933ff"></option>
                      <option selected="selected"></option>
                      <option value="#facccc"></option>
                      <option value="#ffebcc"></option>
                      <option value="#ffffcc"></option>
                      <option value="#cce8cc"></option>
                      <option value="#cce0f5"></option>
                      <option value="#ebd6ff"></option>
                      <option value="#bbbbbb"></option>
                      <option value="#f06666"></option>
                      <option value="#ffc266"></option>
                      <option value="#ffff66"></option>
                      <option value="#66b966"></option>
                      <option value="#66a3e0"></option>
                      <option value="#c285ff"></option>
                      <option value="#888888"></option>
                      <option value="#a10000"></option>
                      <option value="#b26b00"></option>
                      <option value="#b2b200"></option>
                      <option value="#006100"></option>
                      <option value="#0047b2"></option>
                      <option value="#6b24b2"></option>
                      <option value="#444444"></option>
                      <option value="#5c0000"></option>
                      <option value="#663d00"></option>
                      <option value="#666600"></option>
                      <option value="#003700"></option>
                      <option value="#002966"></option>
                      <option value="#3d1466"></option>
                    </select></span>
                    <span class="ql-formats"><select class="ql-font">
                      <option selected="selected"></option>
                      <option value="serif"></option>
                      <option value="monospace"></option>
                    </select></span>
                    <span class="ql-formats">
                      <select class="ql-align">
                      <option selected="selected"></option>
                      <option value="center"></option>
                      <option value="right"></option>
                      <option value="justify"></option>
                    </select>
                    </span>
                    <span class="ql-formats">
                        <button type="button" class="ql-clean"></button>
                    </span>
                    <span class="ql-formats">
                        <button type="button" class="ql-link"></button>
                    </span>
                    <span class="ql-formats">
                        <button type="button" @click="imgClick">
                          <Icon type="image"  size="18"></Icon>
                        </button>
                    </span>
                    <span class="ql-formats">
                        <button type="button" @click="imgClick"><Icon type="ios-film" size="18"></Icon></button>
                    </span>
                  </div>
              </quill-editor>
            </FormItem>
            
            <FormItem style="margin-top:100px">
                <Button type="primary"  :loading="loading" @click="submitForm()">创建商品</Button>
            </FormItem>
        </Form>
        <Modal v-model="swGalleryModal" width="1000" >        
            <div v-if="swGalleryModal">
                <swGallery></swGallery>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="tempc == 'cover' ? getModelCover():getModelImgs()">确定</Button>
            </div>
        </Modal>
        
      </div>
  </transition>
</template>
<style>
.tgb {
  width: 33.33%;
  text-align: center;
  cursor: pointer;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tgb:hover {
  background: rgba(0, 0, 0, 0.3);
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
      tempc:'cover',
      editorOption: {
        modules: {
          toolbar: "#toolbar"
        }
      },
      images: [],
      shopList: [],
      shop: "",
      guigeForm: {
        name: "",
        value: []
      },
      cateList: [],
      cate: "",
      guigemodelsd: false,
      tempindex: 0,
      guigemodel: false,
      loading: false,
      tempModal: "cover",
      swGallerys: false,
      swGalleryModal: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      formItem: {
        tempId: "",
        appid: localStorage.getItem("miniId"),
        shopid: "",
        categoryid: "",
        price: "",
        image: "",
        name: "",
        content:"",
        boxFalg: false,
        attribute: [],
        show: true
      }
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.getCate();
    if (this.$route.query.id) {
      this.shop = this.$route.query.id;
    }
  },
  methods: {
    getModelImgs() {
      var li = JSON.parse(sessionStorage.getItem("imgUrls"));
      var gs = "";
      for (var i in li) {
        if (
          li[i].subtype == "png" ||
          li[i].subtype == "jpg" ||
          li[i].subtype == "jpeg" ||
          li[i].subtype == "gif"
        ) {
          this.editor.insertEmbed(i, "image", li[i].host + li[i].path);
        } else if (
          li[i].subtype == "rmvb" ||
          li[i].subtype == "mp4" ||
          li[i].subtype == "avi"
        ) {
          this.editor.insertEmbed(i, "video", li[i].host + li[i].path);
        } else {
          gs += li[i].subtype + " ";
        }
      }
      if (gs != "") {
        this.$Modal.error({
          title: "格式错误",
          content: "富文本不支持" + gs
        });
      }

      this.swGalleryModal = false;
      sessionStorage.removeItem("imgUrls");
    },
    imgClick() {
      this.tempc = 'rich'
      this.swGalleryModal = true;
    },
    //往前移
    preChange(index) {
      var temp = this.images[index - 1].url;
      this.images[index - 1].url = this.images[index].url;
      this.images[index].url = temp;
    },
    //往后移
    nextChange(index) {
      var temp = this.images[index + 1].url;
      this.images[index + 1].url = this.images[index].url;
      this.images[index].url = temp;
    },
    //删除
    delImgs(index) {
      this.images.splice(index, 1);
    },
    delMo(index) {
      this.guigeForm.value.splice(index, 1);
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
                value: "type",
                opertionType: "equal",
                opertionValue: "category"
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
    submitForm() {
      this.formItem.tempId = this.shop;
      this.formItem.categoryid = this.cate;
      this.formItem.attribute = JSON.stringify(this.formItem.attribute);
      this.formItem.image = JSON.stringify(this.images)
      var that = this;
      if (this.shop == "") {
        this.$Message.error("请选择一家店铺");
      } else if (this.cate == "") {
        this.$Message.error("请选择一个类目");
      } else if (this.formItem.image == "") {
        this.$Message.error("请选择至少一张照片");
      } else if (this.formItem.name == "") {
        this.$Message.error("商品名称不能为空");
      } else if (this.formItem.price == "") {
        this.$Message.error("最低价格不能为空");
      } else {
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
                  that.$router.push({
                    path: "/bookingAndPurchaseGoodsList"
                  });
                },
                onCancel: () => {
                  
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
      for (var i in JSON.parse(sessionStorage.getItem("imgUrls"))) {
        this.images.push({url:
          JSON.parse(sessionStorage.getItem("imgUrls"))[i].host +
            JSON.parse(sessionStorage.getItem("imgUrls"))[i].path
        });
      }
      this.swGalleryModal = false;
    }
  }
};
</script>
