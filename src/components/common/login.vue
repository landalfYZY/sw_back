<template>
  <transition name="fade" mode="out-in">
      <div :style="'width:100%;height:100vh;background-image:url('+bg+');background-size:cover;background-position:center'">
        <div style="width:100%;height:100vh;background:rgba(0,0,0,0.6)">
          <div style="width:300px;margin:auto;padding-top:100px;text-align:center">
            <div style="font-size:20px;color:#ffffff">大家地理管理系统</div>
            <div style="font-size:16px;color:#ffffff">dajia LOGIN</div>
            <Input style="margin-top:20px" v-model="phone" placeholder="手机号" size="large" />
            <Input style="margin-top:30px" v-model="passWord" type="password" placeholder="密码" size="large" />
            <div style="height:42px;width:100%;overflow:hidden;margin-top:30px">
              <Button  size="large" type="success" :loading="loading" long >登录</Button>
              <div id="captchaBox" style="position:relative;top:-42px;opacity:0"></div>
            </div>
            <div style="width:300px;text-align:left;margin-top:30px">
              <a style="color:#f3f3f3" href="https://www.sunwou.com" target="blank">大家地理首页</a>
            </div>
          </div>
          <div style="margin:auto;color:#aaa;width:500px;text-align:Center;margin-top:100px">
            浙江大家地理信息科技有限公司©2017 双沃科技 浙ICP备18011227号
          </div>
        </div>
      </div>
  </transition>
</template>
<style>
div{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>

<script>
import '../../assets/js/gt'
export default {
  data(){
    return {
      loading:false,
      phone:'',
      passWord:'',
      bg:sessionStorage.getItem('STATIC_API')+'static/bg3.jpg'
    }
  },
  mounted(){
    this.getYzm()
  },
  methods:{
    getYzm() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "user/firVali", // 加随机数防止缓存
        type: "get",
        dataType: "json",
        success: function(data) {
          if (data.code) {
            initGeetest(
              {
                // 以下 4 个配置参数为必须，不能缺少
                gt: data.params.gt,
                challenge: data.params.challenge,
                offline: !data.code, // 表示用户后台检测极验服务器是否宕机
                new_captcha: true, // 用于宕机时表示是新验证码的宕机
                product: "popup", // 产品形式，包括：float，popup
                width: "120%"
                // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
              },
              function(captchaObj) {
                captchaObj.appendTo("#captchaBox");
                captchaObj.onReady(function() {
                  $("#wait").hide();
                });
                captchaObj.onSuccess(function(res) {
                  var result = captchaObj.getValidate();
                  $.ajax({
                    url: sessionStorage.getItem("API") + "user/login",
                    type: "post",
                    dataType: "json",
                    data: {
                      phone: that.phone,
                      passWord: that.passWord,
                      geetest_challenge: result.geetest_challenge,
                      geetest_seccode: result.geetest_seccode,
                      geetest_validate: result.geetest_validate
                    },
                    success(res) {
                      if (res.code) {
                        if (that.loadPass) {
                          localStorage.setItem("loadPass", true);
                          localStorage.setItem("phone", that.data.phone);
                          localStorage.setItem("passWord", that.data.passWord);
                        } else {
                          localStorage.setItem("loadPass", false);
                          localStorage.removeItem("phone");
                          localStorage.removeItem("passWord");
                        }
                        localStorage.setItem(
                          "user",
                          JSON.stringify(res.params)
                        );
                        localStorage.setItem(
                          "userId",
                          res.params.result.sunwouId
                        );
                        that.$Message.success(res.msg);
                        
                        that.$router.push({ path: "/" });
                        
                      } else {
                        that.$Message.error(res.msg);
                        captchaObj.reset();
                      }
                    }
                  });
                });
                captchaObj.onError(function() {
                  captchaObj.reset();
                });
                captchaObj.onClose(function() {
                  captchaObj.reset();
                });
              }
            );
          } else {
            that.$Message.error(data.msg);
            captchaObj.reset();
          }
        }
      });
    },
    
    navTo(path,query,params,target){
      this.$router.push({path:path,query:query,params:params,target:target});
    },
  }
}
</script>
