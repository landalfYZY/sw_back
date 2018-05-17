<template>
  <transition name="fade" mode="out-in">
      <div>
          <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column label="学校" prop="scName"> </el-table-column>
            <el-table-column label="地址" prop="scAddress"> </el-table-column>
            <el-table-column label="管理员" prop="scAdminName"> </el-table-column>
            <el-table-column label="手机" prop="scAdminPhone"> </el-table-column>
            <el-table-column label="登录账号" prop="scAccount"> </el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-dropdown size="mini" split-button type="default" trigger="click">
                        <div @click="update(scope.row)">修改</div>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <el-dropdown-item>
                                <div style="width:100px;text-align:Center" @click="scope.row.remark2 == '上架' ? changeStatus(scope.row.sunwouId,'下架'):changeStatus(scope.row.sunwouId,'上架')">{{scope.row.remark2 == '上架' ? '下架':'上架'}}</div>
                            </el-dropdown-item> -->
                            <el-dropdown-item>
                                <div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除</div>
                            </el-dropdown-item>
                            <!-- <el-dropdown-item>
                                <div style="width:100px;text-align:Center" @click="addToTui(scope.row.sunwouId)">加入首页推荐</div>
                            </el-dropdown-item> -->
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
            <Modal v-model="studentUpdateModal" title="缴费用户信息" @on-ok="ok" @on-cancel="cancel" ok-text="确定" cancel-text="取消">
                <el-form ref="studentData" :model="studentData" label-width="100px">
                    <el-form-item label="校园名称">
                        <el-input v-model="studentData.scName" style="max-width:500px" placeholder="校园名称"></el-input>
                    </el-form-item>
                    <el-form-item label="校园地址">
                        <el-input v-model="studentData.scAddress" style="max-width:500px" placeholder="校园地址"></el-input>
                    </el-form-item>
                    <el-form-item label="登录账号">
                        <el-input v-model="studentData.scAccount" style="max-width:500px" placeholder="登录账号"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码">
                        <el-input v-model="studentData.scKey" style="max-width:500px" placeholder="登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="校园联系人">
                        <el-input v-model="studentData.scAdminName" style="max-width:500px" placeholder="校园联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="studentData.scAdminPhone" style="max-width:500px" placeholder="联系电话"></el-input>
                    </el-form-item>
                </el-form>
            </Modal>
        </div>
      </div>
  </transition>
</template>
<script>
    let that;
export default {
  data(){
      return {
          studentUpdateModal: false,
          studentData: {
              scName: '',
              scAccount: '',
              scKey: '',
              scAddress: '',
              scAdminName: '',
              scAdminPhone: '',
              scConfig: '',
              sunwouId:'',
              eduId: JSON.parse(localStorage.getItem('user')).result.sunwouId
          },
          list:[],
          total:0,
          query: {
              fields: [],
              wheres: [{ value: 'isDelete', opertionType: 'equal', opertionValue: false }
                 
              ],
              sorts: [],
              pages: {
                  currentPage: 1,
                  size: 10
              }
          },
      }
  },
  mounted(){
      that=this;
      that.getSchoolList();
  },
  methods:{
      ok() {
          $.ajax({
              url: sessionStorage.getItem("API") + "schoolaccount/update",
              type: "POST",
              data: that.studentData,
              dataType: "json",
              success(res) {
                  if (res.code) {
                      that.getSchoolList();
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
      update(student){
          $.extend(that.studentData , student)
          
          that.studentUpdateModal=true;
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
      handleSizeChange(val) {
          this.query.pages.size = val;
          this.getSchoolList();
      },
      handleCurrentChange(val) {
          this.query.pages.currentPage = val;
          this.getSchoolList();
      },
       getSchoolList() {
          $.ajax({
              url: sessionStorage.getItem("API") + "schoolaccount/find ",
              type: "POST",
              data: { query: JSON.stringify(that.query)} ,
              dataType: "json",
              success(res) {
                  if (res.code) {
                      that.list=res.params.result;
                      that.total=res.params.total;
                  } else {
                      that.$Message.error(res.msg);
                  }
              }
          });
      }
  }
}
</script>
