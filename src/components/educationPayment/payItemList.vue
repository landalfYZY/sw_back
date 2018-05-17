<template>
  <transition name="fade" mode="out-in">
    <div>

      <div class="panel-between">
        <div class="panel-start">
          <!-- <button class="ui-btn ui-btn-default" @click="multiAddTrans">
            <Icon type="cash" color="green"></Icon>&nbsp;&nbsp;缴费</button> -->
          <!-- <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')">
            <Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button> -->

        </div>
        <div class="panel-end">
          <input type="text" v-model="searchText" class="search-input" placeholder="搜索">
          <button class="ui-btn ui-btn-default" @click="search()">&nbsp;&nbsp;
            <Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
        </div>
      </div>
      <el-table style="margin-top:15px;width: 100%" :data="payItemList" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="payItem" label="名称"> </el-table-column>
        <el-table-column prop="allPayNumber" label="应缴人数"> </el-table-column>
        <el-table-column prop="allAmount" label="应缴总金额">
        </el-table-column>
        <el-table-column label="实缴人数">
          <template slot-scope="scope">
            {{scope.row.factPayNumber==''?0:scope.row.factPayNumber}}
          </template>
        </el-table-column>
        <el-table-column label="实缴总金额">
          <template slot-scope="scope">
            {{scope.row.factAmount==''?0:scope.row.factAmount}}
          </template>
        </el-table-column>
        <el-table-column prop="payItemCompany" label="发起单位"> </el-table-column>
        <el-table-column label="是否提现" prop="isToBank" :filters="[{text:'已提现',value:true},{text:'未提现',value:false}]" :filter-method="filterTagIsToBank"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <Icon type="checkmark-round" v-if="scope.row.isToBank" color="green"></Icon>
            <Icon type="close-round" v-if="!scope.row.isToBank" color="red"></Icon>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-dropdown size="mini" split-button type="default" trigger="click">
              <div @click="transadd(scope.row.idCard)">缴费</div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div style="width:100px;text-align:Center" @click="addToTui(scope.row.sunwouId)">修改</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="toBank" size="small" :disabled="scope.row.isToBank">提现</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="query.pages.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="query.pages.size" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <div class="clearfix"></div>
      
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
        total: 0,
        searchText: "",
        multipleSelection: [],
        payItemList: [],
        query: {
          fields: [],
          wheres: [
             { value: 'eduId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('user')).result.sunwouId },
            { value: 'isDelete', opertionType: 'equal', opertionValue: false }
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
      that.getPayItemList();
    },
    methods: {
      toBank(){
        that.$Modal.warning({
          title: '提示',
          content: '此功能暂时不适用！！'
        });
      },
      multiAddTrans() {
        that.transData.payIdCard = that.multipleSelection;
        that.modal = true;
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
      uploadFile(e) {
        var formData = new FormData();
        formData.append("schoolId", localStorage.getItem("userId"));
        formData.append("file", e.file);
        $.ajax({
          type: "POST",
          url: that.ip + "/payaccount/add",
          data: formData,
          processData: false,
          contentType: false,
          complete(res) {
            if (res.code) {
              that.getList();
              that.$Message.success("上传成功");
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      },
      //批量删除
      multiDel(id, name) {
        var ids = null;
        if (this.getIds().length == 0) {
          ids = id;
        } else {
          ids = this.getIds().toString();
        }
        var that = this;
        this.$Modal.confirm({
          title: "警告",
          content: name == '删除' ? "<p>删除后数据将无法恢复，确定要继续吗？</p>" : "<p>这是批量修改操作，确定要继续吗？</p>",
          loading: true,
          okText: "确定",
          cancelText: "取消",
          onOk: () => {
            var ui = this;
            var data = {
              sunwouId: ids
            }
            if (name == '删除') {
              data.isDelete = true
            } else {
              data.remark2 = name
            }
            $.ajax({
              url: sessionStorage.getItem("API") + "exh/update",
              type: "POST",
              data: data,
              dataType: "json",
              success(res) {
                if (res.code) {
                  ui.$Modal.remove();
                  that.$Message.success(res.msg);
                  that.getPayItemList();
                } else {
                  that.$Message.error(res.msg);
                }
              }
            });
          }
        });
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
            value: "payItem",
            opertionType: "like",
            opertionValue: this.searchText
          });
        } else {
          this.query.wheres[2].opertionValue = this.searchText;
        }
        this.getPayItemList();
      },
      filterTagIsToBank(value, row) {
        return row.isToBank === value;
      },
      filterTagPayItem(value, row) {
        return row.payItemId === value;
      },
      handleSizeChange(val) {
        this.query.pages.size = val;
        this.getPayItemList();
      },
      handleCurrentChange(val) {
        this.query.pages.currentPage = val;
        this.getPayItemList();
      },

      getPayItemList() {
        $.ajax({
          url: sessionStorage.getItem("API") + "payitem/find",
          type: "POST",
          data: {
            query: JSON.stringify(that.query)
          },
          dataType: "json",
          success(res) {
            if (res.code) {
              that.payItemList = res.params.result;
              that.total = res.params.total;
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      }
    }
  };
</script>