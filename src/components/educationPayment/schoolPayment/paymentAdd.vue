<template>
  <transition name="fade" mode="out-in">
    <div>
      <Form ref="transData" :label-width="80" :rules="ruleValidate" :model="transData">
        <FormItem label="入学年份" prop="goSchoolTime">
          <Select v-model="transData.goSchoolTime" style="width:150px;">
            <Option :value="item.goSchoolTime" :label="item.goSchoolTime" v-for="(item,key,index) in gradeList" :key="item.goSchoolTime">
                <span>{{item.goSchoolTime}}</span>
            </Option>
          </Select>
      <Button type="primary" @click="navTo('/educationPaymentSchoolStudentsList')" style="width:150px;">按学生选择</Button>
        </FormItem>
        <FormItem label="缴费金额" prop="WIDtotal_amount">
          <Input v-model="transData.WIDtotal_amount" style="width:150px;" placeholder="输入缴费金额"></Input>￥
        </FormItem>
        <FormItem label="缴入账户" prop="bankCardId">
          <Select v-model="transData.bankCardId">
            <Option :value="item.number" :label="item.registName" v-for="(item,key,index) in bankCardList" :key="item.sunwouId">
              <div class="panel-between">
                <span>{{item.registName}}</span>
                <span style="color:#ccc">{{item.bankName}}</span>
                <span style="color:#ff0000">{{item.number}}</span>
                <span style="color:#ccc">{{item.remake}}</span>
              </div>
            </Option>
          </Select>
        </FormItem>
        <FormItem label="缴费说明" prop="WIDsubject">
          <Input v-model="transData.WIDsubject" type="textarea" placeholder="缴费内容说明"></Input>
        </FormItem>
        <FormItem label="截止日期" prop="endTime">
          <DatePicker type="date" placeholder="选择缴费截止日期" @on-change="handleChange" v-model="transData.endTime"></DatePicker>
        </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit()">Submit</Button>
          </FormItem>
      </Form>
    </div>
  </transition>
</template>
<script>
  let that;
  export default {
    data() {
      return {
        ruleValidate: {
          WIDtotal_amount: [
            { required: true, message: '缴费金额不能为空', trigger: 'blur' }
          ],
          WIDsubject: [
            { required: true, message: '缴费说明不能为空！', trigger: 'blur' },
          ],
          endTime: [
            { required: true, message: '缴费截止日期不能为空！', trigger: 'blur' },
          ],
          bankCardId: [
            { required: true, message: '缴入账户不能为空！', trigger: 'blur' },
          ],
          goSchoolTime: [
            { required: true, message: '缴费入学年限不能为空！', trigger: 'blur' },
          ],
        },
         transData: {
          WIDtotal_amount: '',
          payType: "缴费",
          goSchoolTime:'',
          schoolId: JSON.parse(localStorage.getItem('school')).result.sunwouId,
          WIDsubject: '',
          bankCardId: "",
          endTime: "",
        },
        bankCardList:[],
        gradeList:[]
      }
    },
    mounted() {
      that = this;
      that.getBankCardList();
      that.getGradeList();
    },
    methods: {
      navTo(path, query, params, target) {
        this.$router.push({
          path: path,
          query: query,
          params: params,
          target: target
        });
      },
      handleChange(date) {
        console.info(date)
        that.transData.endTime = date;
      },
      handleSubmit() {
        that.$refs['transData'].validate((valid)=>{
          if(valid){
            $.ajax({
              url: sessionStorage.getItem("API") + "trans/add",
              type: "POST",
              data: that.transData,
              dataType: "json",
              success(res) {
                if (res.code) {
                  that.$Message.success(res.msg);
                  that.$router.push({
                    path: "/educationPaymentSchoolPaymentList"
                  });
                } else {
                  that.$Message.error(res.msg);
                }
              }
            });
          }else{
                that.$Message.error('表单验证错误!');
          }
        });
        
      },
       getBankCardList() {
        let bankQuery = {
          fields: [],
          wheres: [{ value: 'schoolId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('school')).result.sunwouId },
          { value: 'isDelete', opertionType: 'equal', opertionValue: false }],
          sorts: [],
          pages: {
            currentPage: 1,
            size: 1000
          }
        };
        $.ajax({
          url: sessionStorage.getItem("API") + "bankcrad/find",
          type: "POST",
          data: {
            query: JSON.stringify(bankQuery)
          },
          dataType: "json",
          success(res) {
            if (res.code) {
              that.bankCardList = res.params.result;
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      getGradeList() {
        $.ajax({
          url: sessionStorage.getItem("API") + "payaccount/goSchoolTimeList",
          type: "POST",
          data: {
            schoolId: JSON.parse(localStorage.getItem('school')).result.sunwouId
          },
          dataType: "json",
          success(res) {
            if (res.code) {
              that.gradeList = res.params.list;
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
    }
  }
</script>