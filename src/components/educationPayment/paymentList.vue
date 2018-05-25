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
      <el-table style="margin-top:15px;width: 100%" :data="list" @filter-change="filterChange">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="payAccountName" label="姓名"> </el-table-column>
        <el-table-column prop="payIdCard" label="身份证"> </el-table-column>
        <el-table-column prop="subject" label="缴费项" :filters="payItemList" :filter-method="filterTagPayItem" filter-placement="bottom-end"
          column-key="payItemId">
        </el-table-column>
        <el-table-column prop="payItemCompany" label="发起单位" :filters="payItemCompanyList" :filter-method="filterTagPayItemCompany"
          filter-placement="bottom-end" column-key="payItemCompany">
        </el-table-column>
        <el-table-column prop="schoolName" label="学校" :filters="schoolList" :filter-method="filterTagSchool" filter-placement="bottom-end"
          column-key="schoolName">
        </el-table-column>
        <el-table-column prop="goSchoolTime" label="入学年限" :filters="gradeList" :filter-method="filterTagGrade" filter-placement="bottom-end"
          column-key="goSchoolTime">
        </el-table-column>
        <el-table-column prop="classes" label="班级" :filters="classList" :filter-method="filterTagClass" filter-placement="bottom-end"
          column-key="classes">
        </el-table-column>
        <el-table-column prop="total_amount" label="金额"> </el-table-column>
        <el-table-column label="是否缴费" prop="trade_status" :filters="[{text:'已缴费',value:'EDU_SUCCESS'},{text:'未缴费',value:'waitPay'}]"
          :filter-method="filterTagPay" filter-placement="bottom-end" column-key="trade_status">
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
        <el-table-column prop="factPayMoney" label="实际缴费">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <Button size="small" :disabled="scope.row.trade_status!='EDU_SUCCESS'" @click="returnFee(scope.row)">退款</Button>
            <Button size="small" type="error" v-if="!scope.row.isShow" @click="down(scope.row)">下架</Button>
            <Button size="small" type="success" v-if="scope.row.isShow" @click="up(scope.row)">上架</Button>
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
        :current-page="query.pages.currentPage" :page-sizes="[20, 500, 1000, 5000]" :page-size="query.pages.size" layout="total, sizes, prev, pager, next, jumper"
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
        returnModal: false,
        returnPay: {
          appid: 'wx52824aa6f56489e9',
          appSecret: '73bf828a7cb0257fab919a9f580b6a3e',
          merchantNumber: '1503604781',
          merchantSecret: 'LHJYMRYQCCNMBTHZSWWLKJYXGS717SUN',
          sunwouId: '',
          refund_fee1: 0,
          max: 0
        },
        schoolList: [],
        payItemCompanyList: [{ text: '教育局', value: '教育局' }],
        query: {
          fields: [],
          wheres: [
            { value: 'eduId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('user')).result.sunwouId },
            { value: 'isDelete', opertionType: 'equal', opertionValue: false },
            { value: 'payItemCompany', opertionType: 'like', opertionValue: '' },
            { value: 'payItemId', opertionType: 'like', opertionValue: "" },
            { value: 'classes', opertionType: 'like', opertionValue: '' },
            { value: 'goSchoolTime', opertionType: 'like', opertionValue: '' },
            { value: 'schoolName', opertionType: 'like', opertionValue: '' },
            { value: 'trade_status', opertionType: 'like', opertionValue: '' }
          ],
          sorts: [],
          pages: {
            currentPage: 1,
            size: 20
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
      that.getrealSchoolList();
    },
    methods: {
      down(row){
        $.ajax({
          url: sessionStorage.getItem("API") + "trans/updateMu",
          type: "POST",
          data: { ids:row.sunwouId,isShow:true },
          dataType: "json",
          success(res) {
            if (res.code) {
              console.info()
              row.isShow=true;
              that.$Message.success('下架成功');
            } else {
              that.$Message.error('下架失败');
            }
          }
        });
      },
      up(row) {
        $.ajax({
          url: sessionStorage.getItem("API") + "trans/updateMu",
          type: "POST",
          data: { ids: row.sunwouId, isShow: false },
          dataType: "json",
          success(res) {
            if (res.code) {
              console.info()
              row.isShow = false;
              that.$Message.success('上架成功');
            } else {
              that.$Message.error('上架失败');
            }
          }
        });
      },
      changeFilterQuery(conditions,num){
        if (conditions[1] != undefined) {
          that.query.wheres[num].opertionType='regex';
          let opertionValue='';
          for(let i=0;i<conditions.length;i++){
            opertionValue = opertionValue + conditions[i] + '|';
          }
          opertionValue=opertionValue.substr(0, opertionValue.length - 1);
          that.query.wheres[num].opertionValue= opertionValue;
        } else if (conditions[0] != undefined) {
          that.query.wheres[num].opertionType = 'equal';
          that.query.wheres[num].opertionValue = conditions[0];
        } else {
          that.query.wheres[num].opertionType = 'like';
          that.query.wheres[num].opertionValue = '';
        }
      },
      filterChange(filters) {
        if (filters.payItemId != undefined) {
          that.changeFilterQuery(filters.payItemId,3);
        } else if (filters.payItemCompany != undefined) {
          that.changeFilterQuery(filters.payItemCompany, 2);
        } else if (filters.classes != undefined) {
          that.changeFilterQuery(filters.classes, 4);
        } else if (filters.goSchoolTime != undefined) {
          that.changeFilterQuery(filters.goSchoolTime, 5);
        } else if (filters.schoolName != undefined) {
          that.changeFilterQuery(filters.schoolName, 6);
        } else if (filters.trade_status != undefined) {
          that.changeFilterQuery(filters.trade_status, 7);
        }
        that.getPaymentList();
      },
      putOut() {
        console.info(JSON.stringify(that.query))
        let sb = JSON.stringify(that.query).replace(/\"/g, "%22").replace(/\{/g, "%7b").replace(/\}/g, "%7d");
        console.info(sb)
        window.open(sessionStorage.getItem("API") + "trans/outExcel?query=" + sb)
      },
      returnFee(payment) {
        that.returnPay.sunwouId = payment.sunwouId;
        that.returnPay.max = payment.total_amount*1;
        that.returnModal = true;
      },
      submitReturn() {
        $.ajax({
          url: sessionStorage.getItem("API") + "minipay/refund",
          type: "POST",
          data: that.returnPay,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Notice.success({
                title: '成功退款',
                desc: '成功退款' + that.returnPay.refund_fee1 + '元',
                duration: 0
              });
              that.getPaymentList();
              that.returnPay={
                appid: 'wx52824aa6f56489e9',
                  appSecret: '73bf828a7cb0257fab919a9f580b6a3e',
                    merchantNumber: '1503604781',
                      merchantSecret: 'LHJYMRYQCCNMBTHZSWWLKJYXGS717SUN',
                        sunwouId: '',
                          refund_fee1: 0,
                            max: 0
              };
            } else {
              that.$Notice.error({
                title: '退款失败',
                desc: '退款失败'+res.msg,
                duration: 0
              });
            }
          }
        });
      },
      cancel() {
        this.$Message.info('Clicked cancel');
      },

      search() {
        if (this.query.wheres.length == 8) {
          this.query.wheres.push({
            value: "payAccountName",
            opertionType: "like",
            opertionValue: this.searchText
          });
        } else {
          this.query.wheres[8].opertionValue = this.searchText;
        }
        this.getPaymentList();
      },
      filterTagPay(value, row) {
        if (value == 'EDU_SUCCESS') {
          return row.trade_status === value;
        } else {
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
      filterTagPayItemCompany(value, row) {
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
          data: { eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId },
          dataType: "json",
          success(res) {
            if (res.code) {
              let schoolList = [];
              res.params.list.forEach(function (item, index) {
                let school = { text: item.schoolName, value: item.schoolName };
                schoolList.push(school);
              })
              that.schoolList = schoolList;

            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      getrealSchoolList() {
        let query = {
          fields: [],
          wheres: [
            { value: 'eduId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('school')).result.eduId },
            { value: 'isDelete', opertionType: 'equal', opertionValue: false }
          ],
          sorts: [],
          pages: {
          }
        }
        $.ajax({
          url: sessionStorage.getItem("API") + "schoolaccount/find",
          type: "POST",
          data: { query: JSON.stringify(query) },
          dataType: "json",
          success(res) {
            if (res.code) {
              res.params.result.forEach(function (item, index) {
                let payItemCompany = { text: item.scName, value: item.scName };
                that.payItemCompanyList.push(payItemCompany)
              });
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      }
    }
  };
</script>