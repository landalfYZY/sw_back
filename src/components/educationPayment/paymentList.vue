<template>
  <transition name="fade" mode="out-in">
    <div>

      <div class="panel-between">
        <div class="panel-start">
          <button class="ui-btn ui-btn-default" @click="putOut">
            <Icon type="ios-cloud-download" color="green"></Icon>&nbsp;&nbsp;导出Excel</button>
          <!-- <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')">
            <Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button> -->

        </div>
        <div class="panel-end">
          <input type="text" v-model="searchText" class="search-input" placeholder="搜索">
          <button class="ui-btn ui-btn-default" @click="search()">&nbsp;&nbsp;
            <Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
        </div>
      </div>
      <el-table style="margin-top:15px;width: 100%" :data="list" >
        <el-table-column prop="payAccountName" label="姓名"> </el-table-column>
        <el-table-column prop="payIdCard" label="身份证"> </el-table-column>
        <el-table-column prop="subject" label="缴费项" :filters="payItemList" :filter-method="filterTagPayItem" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column prop="payItemCompany" label="发起单位" :filters="payItemCompanyList" :filter-method="filterTagPayItemCompany" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column prop="schoolName" label="学校" :filters="schoolList" :filter-method="filterTagSchool" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column prop="goSchoolTime" label="入学年限" :filters="gradeList" :filter-method="filterTagGrade" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column prop="classes" label="班级" :filters="classList" :filter-method="filterTagClass" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column prop="total_amount" label="金额"> </el-table-column>
        <el-table-column label="是否缴费" prop="trade_status" :filters="[{text:'已缴费',value:'EDU_SUCCESS'},{text:'未缴费',value:'waitPay'}]" :filter-method="filterTagPay" filter-placement="bottom-end">
          <template slot-scope="scope">
            <Icon type="checkmark-round" v-if="scope.row.trade_status=='EDU_SUCCESS'" color="green"></Icon>
            <Icon type="close-round" v-if="scope.row.trade_status!='EDU_SUCCESS'" color="red"></Icon>
          </template>
        </el-table-column>
        <el-table-column prop="refund_fee1" label="退款"> 
          <template slot-scope="scope">
             {{scope.row.refund_fee1?scope.row.refund_fee1:0}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <Button size="small" :disabled="scope.row.trade_status!='EDU_SUCCESS'" @click="returnFee(scope.row)">退款</Button>
            <!-- <el-dropdown size="mini" split-button type="default" trigger="click">
              <div @click="transadd(scope.row.idCard)">缴费</div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div style="width:100px;text-align:Center" @click="addToTui(scope.row.sunwouId)">修改</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="query.pages.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="query.pages.size" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <div class="clearfix"></div>
<div>
  <Modal v-model="returnModal" title="缴费用户信息" @on-ok="submitReturn" @on-cancel="cancel" ok-text="确定" cancel-text="取消">
    <el-form ref="payModal" :model="returnPay" label-width="100px">
      <el-form-item label="退款金额">
        <el-input-number v-model="returnPay.refund_fee1" :min="0" :max="returnPay.max" label="描述文字"></el-input-number>
      </el-form-item>
    </el-form>
  </Modal>
</div>
    </div>

  </transition>

</template>
<style>
  .uploadbtn {
    background: #f3f3f3;
    color: #444444;
    line-height: 35px;
    padding: 0 10px;
    border: 0;
    margin: 0;
    border-radius: 0;
  }

  .uploadbtn:hover {
    background: #e7e7e7;
  }

  .panel-between {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
  }
</style>

<script>
  let that;
  export default {
    data() {
      return {
        modal: false,
        ip: sessionStorage.getItem('API'),
        list: [],
        total: 0,
        searchText: "",
        multipleSelection: [],
        payItemList: [],
        gradeList: [],
        classList: [],
        returnModal:false,
        returnPay:{
          appid:'wx52824aa6f56489e9',
          appSecret:'73bf828a7cb0257fab919a9f580b6a3e',
          merchantNumber:'1503604781',
          merchantSecret:'LHJYMRYQCCNMBTHZSWWLKJYXGS717SUN',
          sunwouId:'',
          refund_fee1:0,
          max:0
        },
        schoolList: [],
        payItemCompanyList:[{ text: '教育局', value: '教育局' }],
        query: {
          fields: [],
          wheres: [
            { value: 'eduId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('user')).result.sunwouId },
            { value: 'isDelete', opertionType: 'equal', opertionValue: false },
             //{ value: 'payItemCompany', opertionType: 'equal', opertionValue: '' },
            // { value: 'eduId', opertionType: 'equal', opertionValue: undefined },
            // { value: 'eduId', opertionType: 'equal', opertionValue: undefined },
            // { value: 'eduId', opertionType: 'equal', opertionValue: undefined },
            // { value: 'eduId', opertionType: 'equal', opertionValue: undefined },
            // { value: 'eduId', opertionType: 'equal', opertionValue: undefined }
          ],
          sorts: [],
          pages: {
            currentPage: 1,
            size: 10
          }
        },
        transData: {
          WIDtotal_amount: '',
          payType: "缴费",
          payIdCard: [],
          WIDsubject: '',
          bankCardId: "",
          endTime: "",
        },
        ruleValidate: {
          WIDtotal_amount: [
            { required: true, message: '缴费金额不能为空', trigger: 'blur' }
          ],
          WIDsubject: [
            { required: true, message: '缴费说明不能为空！', trigger: 'blur' },
          ]
        }
      };
    },
    mounted() {
      that = this;
      that.getPaymentList();
      that.getPayItemList();
      that.getGradeList();
      that.getClassList();
      that.getSchoolList();
    },
    methods: {
      putOut(){

      },
      returnFee(payment){
        that.returnPay.sunwouId= payment.sunwouId;
        that.returnPay.max= payment.total_amount;
        that.returnModal=true;
      },
      submitReturn() {
        $.ajax({
          url: sessionStorage.getItem("API") + "minipay/refund",
          type: "POST",
          data: that.returnPay,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Message.success(res.msg);
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      cancel() {
        this.$Message.info('Clicked cancel');
      },
 
      search() {
        if (this.query.wheres.length == 2) {
          this.query.wheres.push({
            value: "payAccountName",
            opertionType: "like",
            opertionValue: this.searchText
          });
        } else {
          this.query.wheres[2].opertionValue = this.searchText;
        }
        this.getPaymentList();
      },
      filterTagPay(value, row) {
        console.info(value)
        if(value=='EDU_SUCCESS'){
          return row.trade_status === value;
        }else{
          return row.trade_status != 'EDU_SUCCESS';
        }
      },
      filterTagPayItem(value, row) {
        return row.payItemId === value;
      },
      filterTagGrade(value, row) {
        return row.goSchoolTime === value;
      },
      filterTagClass(value, row) {
        return row.classes === value;
      },
      filterTagSchool(value, row) {
        return row.schoolName === value;
      },
      filterTagPayItemCompany(value, row){
        return row.payItemCompany === value;
      },
      handleSizeChange(val) {
        this.query.pages.size = val;
        this.getPaymentList();
      },
      handleCurrentChange(val) {
        this.query.pages.currentPage = val;
        this.getPaymentList();
      },
      getPaymentList() {
        $.ajax({
          url: sessionStorage.getItem("API") + "trans/find",
          type: "POST",
          data: {
            query: JSON.stringify(that.query)
          },
          dataType: "json",
          success(res) {
            if (res.code) {
              that.list = res.params.result;
              that.total = res.params.total;
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      getPayItemList() {
        let query = {
          fields: [],
          wheres: [
            { value: 'isDelete', opertionType: 'equal', opertionValue: false }
          ],
          sorts: [],
          pages: {
            
          }
        };
        $.ajax({
          url: sessionStorage.getItem("API") + "payitem/find",
          type: "POST",
          data: {
            query: JSON.stringify(query)
          },
          dataType: "json",
          success(res) {
            if (res.code) {
              let payItemList = [];
              res.params.result.forEach(function (item, index) {
                let payItem = { text: item.payItem, value: item.sunwouId }
                payItemList.push(payItem);
              })
              that.payItemList = payItemList;
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
          data: { eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId },
          dataType: "json",
          success(res) {
            if (res.code) {
              let gradeList = [];
              res.params.list.forEach(function (item, index) {
                let grade = { text: item.goSchoolTime, value: item.goSchoolTime };
                gradeList.push(grade);
              })
              that.gradeList = gradeList;
            } else {
              that.$Message.error('获取年级组失败！！');
            }
          }
        });
      },
      getClassList() {
        $.ajax({
          url: sessionStorage.getItem("API") + "payaccount/classesList",
          type: "POST",
          data: { eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId },
          dataType: "json",
          success(res) {
            if (res.code) {
              let classList = [];
              res.params.list.forEach(function (item, index) {
                let calss = { text: item.classes, value: item.classes };
                classList.push(calss);
              })
              that.classList = classList;
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      getSchoolList() {
        $.ajax({
          url: sessionStorage.getItem("API") + "payaccount/schoolNameList",
          type: "POST",
          data: {eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId},
          dataType: "json",
          success(res) {
            if (res.code) {
              let schoolList = [];
              res.params.list.forEach(function (item, index) {
                let school = { text: item.schoolName, value: item.schoolName };
                schoolList.push(school);
              })
              that.schoolList = schoolList;
              that.payItemCompanyList=that.payItemCompanyList.concat(schoolList)
              
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      }
    }
  };
</script>