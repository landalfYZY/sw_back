<template>
  <transition name="fade" mode="out-in">
    <div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" style="max-width:500px" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.idCard" style="max-width:500px" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.phone" style="max-width:500px" placeholder="手机"></el-input>
        </el-form-item>
        <el-form-item label="入学年限">
          <el-input v-model="form.goSchoolTime" style="max-width:500px" placeholder="入学年限"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="form.classes" style="max-width:500px" placeholder="班级"></el-input>
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
          name: '',
          idCard: '',
          phone: '',
          goSchoolTime: '',
          classes: '',
          schoolId: JSON.parse(localStorage.getItem('school')).result.sunwouId
        }
      }
    },
    mounted() {
      that = this;
    },
    methods: {
      onSubmit() {
        $.ajax({
          url: sessionStorage.getItem("API") + "payaccount/addOnes",
          type: "POST",
          data: that.form,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Message.success(res.msg);
              that.$router.push({
                path: "/educationPaymentSchoolStudentsList"
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