<template>
  <transition name="fade" mode="out-in">
    <div>
      
      <div class="console-title">
        <div class="draw-line"></div>
        <div class="title">文章修改</div>
      </div>
      <div v-if="!this.data.cover" class="coverStyle" @click="swGallerys = true">添加封面</div>
      <div v-if="this.data.cover" class="coverStyle" :style="'background-image:url('+this.data.cover+');background-size:cover;background-position:center'"></div>
      <Form :model="data" label-position="top">
                    <FormItem label="文章标题">
                        <Input v-model="data.title" placeholder="文章标题" />
                    </FormItem>
                    <FormItem label="简述">
                        <Input v-model="data.sonTitle" placeholder="简述" />
                    </FormItem>
                    <FormItem label="作者">
                        <Input v-model="data.author" placeholder="作者" />
                    </FormItem>
                    <FormItem label="权限">
                        <RadioGroup v-model="data.access">
                          <Radio label="公开"></Radio>
                          <Radio label="私有"></Radio>
                      </RadioGroup>
                    </FormItem>
      </Form>
      <div style="margin-bottom:10px">编辑文本</div>
      <quill-editor style="height:300px" v-model="content"
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
      <div class="pubibtn" @click="submitForm()">发表文章</div>
      <Modal v-model="swGalleryModal" width="1000" >        
            <div v-if="swGalleryModal">
                <swGallery ></swGallery>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="getModelImgs()">确定</Button>
            </div>
        </Modal>
        <Modal v-model="swGallerys" width="1000" >        
            <div v-if="swGallerys">
                <swGallery></swGallery>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="getModelCover()">确定</Button>
            </div>
        </Modal>
    </div>
  </transition>
</template>
<style>
.coverStyle {
  width: 200px;
  height: 200px;
  background: #f3f3f3;
  text-align: center;
  line-height: 200px;
  margin-bottom: 15px;
  color: #888888;
  cursor: pointer;
}
.pubibtn {
  width: 200px;
  line-height: 60px;
  text-align: center;
  background: #0099ff;
  color: #ffffff;
  float: right;
  margin-top: 100px;
  margin-bottom: 50px;
  cursor: pointer;
}
</style>

<script>
import swGallery from "../common/ui_console_gallery.vue";
export default {
  components: {
    swGallery
  },
  data() {
    return {
      swGallerys: false,
      data: {
        userid: localStorage.getItem("userId"),
        title: "",
        sonTitle: "",
        author: "",
        cover: "",
        richText: "",
        access: "",
        type: ""
      },
      swGalleryModal: false,
      content: "",
      editorOption: {
        modules: {
          toolbar: "#toolbar"
        }
      }
    };
  },
  methods: {
    submitForm() {
      this.data.richText = this.content;
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "art/updateById",
        type: "POST",
        data: this.data,
        dataType: "json",
        success(res) {
          if (res.code) {
            that.$Message.success(res.msg);
            that.$router.push({ path: "/richTextList" });
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    getModelCover() {
      this.data.cover =
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].host +
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].path;
      this.swGallerys = false;
      sessionStorage.removeItem("imgUrls");
    },
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
      this.swGalleryModal = true;
    },
    getMsg() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "art/find",
        type: "POST",
        data: {query:JSON.stringify({
          fields: [], wheres: [ { value: "sunwouId", opertionType: "equal", opertionValue: this.$route.query.id },
              { value: "isDelete", opertionType: "equal", opertionValue: false } ],
            sorts: [], pages: { currentPage: 1,  size: 10 } 
        })},
        dataType: "json",
        success(res) {
          if (res.code) {
            that.data = res.params.result[0];
            that.content = res.params.result[0].richText
          } else {
            that.$Message.error(res.msg);
          }
        },
        complete() {}
      });
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.getMsg();
  }
};
</script>
