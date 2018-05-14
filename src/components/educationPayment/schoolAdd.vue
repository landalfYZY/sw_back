<template>
  <transition name="fade" mode="out-in">
      <div>
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="校园名称">
                <el-input v-model="form.scName" style="max-width:500px" placeholder="校园名称"></el-input>
            </el-form-item>
            <el-form-item label="校园地址">
                <el-input v-model="form.scAddress" style="max-width:500px" placeholder="校园地址"></el-input>
            </el-form-item>
            <el-form-item label="登录账号">
                <el-input v-model="form.scAccount" style="max-width:500px" placeholder="登录账号"></el-input>
            </el-form-item>
            <el-form-item label="登录密码">
                <el-input v-model="form.scKey" style="max-width:500px" placeholder="登录密码"></el-input>
            </el-form-item>
            <el-form-item label="校园联系人">
                <el-input v-model="form.scAdminName" style="max-width:500px" placeholder="校园联系人"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="form.scAdminPhone" style="max-width:500px" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
          </el-form>
      </div>
  </transition>
</template>
<script>
  let that;
  export default {
    data() {
      return {
        form: {
          scName: '',
          scAccount: '',
          scKey: '',
          scAddress: '',
          scAdminName: '',
          scAdminPhone: '',
          scConfig: '',
          eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId
        }
      }
    },
     mounted() {
       that=this;
     },
    methods: {
      onSubmit() {
            $.ajax({
          url: sessionStorage.getItem("API") + "schoolaccount/add",
          type: "POST",
          data: that.form,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Message.success(res.msg);
              that.$router.push({
                path: "/educationPaymentSchoolList"
              });
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      }
    }
  }
</script>