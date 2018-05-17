<template>
  <transition name="fade" mode="out-in">
    <div>

      <div class="panel-between">
        <div class="panel-start">
          <button class="ui-btn ui-btn-default" @click="addBankCard()">
            <Icon type="plus-round" color="green"></Icon>
            </Icon>&nbsp;&nbsp;添加</button>
          <!-- <button class="ui-btn ui-btn-default" @click="multiDel(null,'批量删除')">
            <Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button> -->
        </div>
        <div class="panel-end">
          <input type="text" v-model="searchText" class="search-input" placeholder="搜索" @input="pubSearch()">
          <button class="ui-btn ui-btn-default">&nbsp;&nbsp;
            <Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
        </div>
      </div>
      <el-table style="margin-top:15px;width: 100%" :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="bankName" label="银行"> </el-table-column>
        <el-table-column prop="number" label="账户"> </el-table-column>
        <el-table-column prop="registName" label="户主"> </el-table-column>
        <el-table-column prop="remake" label="备注"> </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-dropdown size="mini" split-button type="default" trigger="click">
              <div @click="updateBankCard(scope.row)">修改</div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="query.pages.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="query.pages.size" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <div class="clearfix"></div>
      <div>
        <Modal v-model="modal" title="银行卡信息" @on-ok="ok" @on-cancel="cancel">
          <Form :label-width="80" :rules="ruleValidate" :model="bankData">
            <FormItem label="银行名称">
              <Input v-model="bankData.bankName" placeholder="银行名称" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="银行卡号">
              <Input v-model="bankData.number" placeholder="银行卡账号" clearable></Input>
            </FormItem>
            <FormItem label="户主姓名">
              <Input v-model="bankData.registName" placeholder="户主姓名" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="备注">
              <Input v-model="bankData.remake" type="textarea" placeholder="银行卡备注"></Input>
            </FormItem>
          </Form>
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
        okType: 'add',
        query: {
          fields: [],
          wheres: [{ value: 'schoolId', opertionType: 'equal', opertionValue: JSON.parse(localStorage.getItem('user')).result.sunwouId },
          { value: 'isDelete', opertionType: 'equal', opertionValue: false }
          ],
          sorts: [],
          pages: {
            currentPage: 1,
            size: 10
          }
        },
        bankData: {
          bankName: '',
          number: "",
          registName: '',
          schoolId: JSON.parse(localStorage.getItem('user')).result.sunwouId,
          remake: "",
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
      that.getBankCardList();
    },
    methods: {
      updateBankCard(bankCard) {
        console.info(bankCard)
        that.okType = 'update';
        $.extend(that.bankData, bankCard)
        that.modal = true;
      },
      addBankCard() {
        that.okType = 'add';
        that.bankData = {
          bankName: '',
          number: "",
          registName: '',
          schoolId: JSON.parse(localStorage.getItem('user')).result.sunwouId,
          remake: "",
        };
        that.modal = true;
      },
      ok() {
        if (that.okType == 'add') {
          $.ajax({
            type: "POST",
            url: sessionStorage.getItem('API') + "bankcrad/add",
            data: that.bankData,
            dataType: "json",
            success(res) {
              if (res.code) {
                that.$Message.success(res.msg);
                that.getBankCardList();
              } else {
                that.$Message.error(res.msg);
              }
            }
          });
        } else {
          $.ajax({
            type: "POST",
            url: sessionStorage.getItem('API') + "bankcrad/update",
            data: that.bankData,
            dataType: "json",
            success(res) {
              if (res.code) {
                that.$Message.success(res.msg);
                that.getBankCardList();
              } else {
                that.$Message.error(res.msg);
              }
            }
          });
        }
      },
      cancel() {
        this.$Message.info('Clicked cancel');
      },
      getIds() {
        var ids = [];
        for (var i in this.multipleSelection) {
          ids.push(this.multipleSelection[i].sunwouId);
        }
        return ids;
      },
      //批量删除
      multiDel(id, name) {
        var ids = null;
        if(this.getIds().length == 0&&id==null){
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
        }else{
          if (id != null) {
            ids = id;
          } else if (this.getIds().length == 0) {

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
                sunwouId: ids
              }
                data.isDelete = true
              $.ajax({
                url: sessionStorage.getItem("API") + "bankcrad/update",
                type: "POST",
                data: data,
                dataType: "json",
                success(res) {
                  if (res.code) {
                    that.$Modal.remove();
                    that.$Message.success(res.msg);
                    that.getBankCardList();
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

      pubSearch() {
        if (this.query.wheres.length == 2) {
          this.query.wheres.push({
            value: "title",
            opertionType: "like",
            opertionValue: this.pubSearchText
          });
        } else {
          this.query.wheres[2].opertionValue = this.pubSearchText;
        }
        this.getBankCardList();
      },
      filterTagStatus(value, row) {
        return row.status === value;
      },
      handleSizeChange(val) {
        this.query.pages.size = val;
        this.getBankCardList();
      },
      handleCurrentChange(val) {
        this.query.pages.currentPage = val;
        this.getBankCardList();
      },
      getBankCardList() {
        $.ajax({
          url: sessionStorage.getItem("API") + "bankcrad/find",
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
      }
    }
  };
</script>