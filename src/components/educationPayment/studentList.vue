<template>
  <transition name="fade" mode="out-in">
    <div>

      <div class="panel-between">
        <div class="panel-start">
          <button class="ui-btn ui-btn-default" @click="multiAddTrans">
            <Icon type="cash" color="green"></Icon>&nbsp;&nbsp;批量缴费</button>
          <button class="ui-btn ui-btn-default" @click="multiDel(null,'批量删除')">
            <Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
          <el-upload class="upload-demo" :action="ip+'filesystem/upfile'" :http-request="uploadFile" :multiple="false" :show-file-list="false">
            <button size="small" class="uploadbtn" type="primary">
              <i class="el-icon-upload el-icon--right"></i>Excel导入</button>
          </el-upload>
        </div>
        <div class="panel-end">
          <input type="text" v-model="searchText" class="search-input" placeholder="搜索">
          <button class="ui-btn ui-btn-default" @click="search()">&nbsp;&nbsp;
            <Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
        </div>
      </div>
      <el-table style="margin-top:15px;width: 100%" :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="idCard" label="身份证号"> </el-table-column>
        <el-table-column prop="schoolName" label="学校" :filters="schoolList" :filter-method="filterTagSchool" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column prop="goSchoolTime" label="入学年限" :filters="gradeList" :filter-method="filterTagGrade" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column prop="classes" label="班级" :filters="classList" :filter-method="filterTagClass" filter-placement="bottom-end">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- <Button @click="transadd(scope.row.idCard)">缴费</Button> -->
            <el-dropdown size="mini" split-button type="default" trigger="click">
              <div @click="transadd(scope.row.idCard)">缴费</div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div style="width:100px;text-align:Center" @click="update(scope.row)">修改</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="query.pages.currentPage" :page-sizes="[20, 100, 1000, 5000]" :page-size="query.pages.size" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <div class="clearfix"></div>
      <div>
        <Modal v-model="modal" title="缴费信息" @on-ok="ok" @on-cancel="cancel" ok-text="确定" cancel-text="取消">
          <Form :label-width="80" :rules="ruleValidate" :model="transData">
            <FormItem label="缴费金额">
              <Input v-model="transData.WIDtotal_amount" style="width:150px;" placeholder="输入缴费金额"></Input>￥
            </FormItem>
            <FormItem label="缴入账户">
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
            <FormItem label="缴费说明">
              <Input v-model="transData.WIDsubject" type="textarea" placeholder="缴费内容说明"></Input>
            </FormItem>
            <FormItem label="截止日期">
              <DatePicker type="date" placeholder="选择缴费截止日期" @on-change="handleChange" v-model="transData.endTime"></DatePicker>
            </FormItem>
          </Form>
        </Modal>
      </div>
      <div>
        <Modal v-model="updateUserInfo" title="缴费用户信息" @on-ok="submitUpdate" @on-cancel="cancel" ok-text="确定" cancel-text="取消">
          <el-form ref="studentData" :model="studentData" label-width="100px">
            <el-form-item label="姓名">
              <el-input v-model="studentData.name" style="max-width:500px" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="studentData.idCard" style="max-width:500px" placeholder="身份证号"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="studentData.phone" style="max-width:500px" placeholder="手机"></el-input>
            </el-form-item>
            <el-form-item label="学校">
              <el-input v-model="studentData.schoolName" style="max-width:500px" placeholder="学校"></el-input>
            </el-form-item>
            <el-form-item label="入学年限">
              <el-input v-model="studentData.goSchoolTime" style="max-width:500px" placeholder="入学年限"></el-input>
            </el-form-item>
            <el-form-item label="班级">
              <el-input v-model="studentData.classes" style="max-width:500px" placeholder="班级"></el-input>
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
        updateUserInfo: false,
        ip: sessionStorage.getItem('API'),
        list: [],
        total: 0,
        searchText: "",
        multipleSelection: [],
        bankCardList: [],
        gradeList: [],
        classList: [],
        schoolList:[],
        query: {
          fields: [],
          wheres: [
            { value: 'eduId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('user')).result.sunwouId },
            { value: 'isDelete', opertionType: 'equal', opertionValue: false }
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
          schoolId: JSON.parse(localStorage.getItem('user')).result.sunwouId,
          WIDsubject: '',
          bankCardId: "",
          endTime: "",
          eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId
        },
        studentData: {
          sunwouId: '',
          name: '',
          idCard: '',
          phone: '',
          goSchoolTime: '',
          classes: '',
          schoolName: '',
          eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId
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
      that.getSudentsList();
      that.getBankCardList();
      that.getGradeList();
      that.getClassList();
      that.getSchoolList();
    },
    methods: {
      uploadFile(e) {
        var formData = new FormData();
        formData.append("eduId", JSON.parse(localStorage.getItem('user')).result.sunwouId);
        formData.append("file", e.file);
        $.ajax({
          type: "POST",
          url: that.ip + "/payaccount/add",
          data: formData,
          processData: false,
          dataType: 'json',
          contentType: false,
          success(res) {
            if (res.code) {
              that.getSudentsList();
              that.$Message.success("上传成功");
              that.$Notice.info({
                title: '提示',
                desc: '成功插入' + res.params.result.success + '条，插入失败' + res.params.result.fail + '条。' + '</br>未成功的身份证号为：</br>' + res.params.result.id.toString().replace(/,/g, '</br>'),
                duration: 0
              });
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      submitUpdate() {
        $.ajax({
          url: sessionStorage.getItem("API") + "payaccount/update",
          type: "POST",
          data: that.studentData,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.getSudentsList();
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      update(studentData) {
        $.extend(that.studentData, studentData);
        that.updateUserInfo = true;
      },
      multiAddTrans() {
        if (that.multipleSelection.length > 0) {
          that.transData.payIdCard = that.getIdCards();
          that.modal = true;
        } else {
          that.$Modal.warning({
            title: "提示",
            content: "未选择要缴费的条目！",
            loading: true,
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
              that.$Modal.remove();
            }
          });
        }

      },
      handleChange(date) {
        console.info(date)
        that.transData.endTime = date;
      },
      transadd(idCard) {
        that.transData.payIdCard = [idCard];
        that.modal = true;
      },
      ok() {
        let transData = {}
        $.extend(transData, that.transData);
        transData.payIdCard = transData.payIdCard.toString();
        $.ajax({
          url: sessionStorage.getItem("API") + "trans/add",
          type: "POST",
          data: transData,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Message.success(res.msg);
              that.$router.push({
                path: "/educationPaymentPaymentList"
              });
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
        this.$Message.info('Clicked ok');
      },
      cancel() {
        this.$Message.info('Clicked cancel');
      },
      
      //批量删除
      multiDel(id, name) {
        var ids = null;
        if (this.getIds().length == 0 && id == null) {
          this.$Modal.warning({
            title: "提示",
            content: "未选择要删除的条目！",
            loading: true,
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
              that.$Modal.remove();
            }
          });
        } else {
          if (id != null) {
            ids = id;
          } else {
            ids = this.getIds().toString();
          }
          this.$Modal.confirm({
            title: "警告",
            content: name == '删除' ? "<p>删除后数据将无法恢复，确定要继续吗？</p>" : "<p>这是批量修改操作，确定要继续吗？</p>",
            loading: true,
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
              var data = {
                ids: ids
              }
              data.isDelete = true
              $.ajax({
                url: sessionStorage.getItem("API") + "payaccount/updateMu",
                type: "POST",
                data: data,
                dataType: "json",
                success(res) {
                  if (res.code) {
                    that.$Modal.remove();
                    that.$Message.success(res.msg);
                    that.getSudentsList();
                  } else {
                    that.$Message.error(res.msg);
                  }
                }
              });
            }
          });
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getIds() {
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].sunwouId);
        }
        return ids;
      },
      getIdCards() {
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].idCard);
        }
        return ids;
      },


      navTo(path, query, params, target) {
        this.$router.push({
          path: path,
          query: query,
          params: params,
          target: target
        });
      },
      search() {
        if (this.query.wheres.length == 2) {
          this.query.wheres.push({
            value: "name",
            opertionType: "like",
            opertionValue: this.searchText
          });
        } else {
          this.query.wheres[2].opertionValue = this.searchText;
        }
        this.getSudentsList();
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
      handleSizeChange(val) {
        this.query.pages.size = val;
        this.getSudentsList();
      },
      handleCurrentChange(val) {
        this.query.pages.currentPage = val;
        this.getSudentsList();
      },
      getSudentsList() {
        $.ajax({
          url: sessionStorage.getItem("API") + "payaccount/find",
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
      getBankCardList() {
        let bankQuery = {
          fields: [],
          wheres: [{ value: 'schoolId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('user')).result.sunwouId },
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
      }
    }
  };
</script>