<template>
  <transition name="fade" mode="out-in">
    <div>

              <div class="panel-between">
                <div class="panel-start">
                  <!-- <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')"><Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'上架')"><Icon type="arrow-up-a" color="#00CC66"></Icon>&nbsp;&nbsp;批量上架</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'下架')"><Icon type="arrow-down-a" color="#FF9900"></Icon>&nbsp;&nbsp;批量下架</button> -->
                </div>
                <div class="panel-end">
                  <input type="text" v-model="pubSearchText" class="search-input" placeholder="搜索" @input="pubSearch()">
                  <button class="ui-btn ui-btn-default">&nbsp;&nbsp;<Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
                </div>
              </div>
              <el-table style="margin-top:15px;width: 100%" :data="pubList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="头像" width="55" >
                  <template slot-scope="scope">
                    <img :src="scope.row.avatarUrl" width="50px" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="openid" label="ID" > </el-table-column>
                <el-table-column prop="nickName" label="昵称" > 
                  <template slot-scope="scope">{{scope.row.nickName}}{{scope.row.remark ? '('+scope.row.remark+')':''}}</template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" > </el-table-column>
                <el-table-column  label="性别" >
                    <template slot-scope="scope">
                        {{scope.row.gender == 1 ? '男':''}}{{scope.row.gender == 2 ? '女':''}}{{scope.row.gender == 0 ? '男':''}}
                    </template>
                </el-table-column>
                <el-table-column prop="province" label="省份" > </el-table-column>
                <el-table-column prop="city" label="城市" > </el-table-column>
                
                <el-table-column prop="createTime" label="注册时间" width="180"> </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <Button size="mini" @click="swmodel = true,tempid = scope.row.sunwouId">{{scope.row.remark ? '修改备注':'添加备注'}}</Button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pubQuery.pages.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pubQuery.pages.size"
                layout="total, sizes, prev, pager, next, jumper" :total="pubTotal">
              </el-pagination>
              <div class="clearfix"></div>
              <Modal v-model="swmodel" title="备注信息" width="300" ok-text="确认" cancel-text="取消" @on-ok="doOksub">
                  <p>备注信息</p>
                  <p><Input v-model="searchUser" placeholder="备注">
                    </Input>
                  </p>
                  
              </Modal>
    </div>
  </transition>
</template>


<script>
export default {
  data() {
    return {
      tempid:'',
      swmodel: false,
      searchUser: "",
      pubList: [],
      pubTotal: 0,
      pubSearchText: "",
      multipleSelection: [],
      pubQuery: {
        fields: [],
        wheres: [
          {
            value: "minProgramId",
            opertionType: "equal",
            opertionValue: localStorage.getItem("miniId")
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }
        ],
        sorts: [{ value: "createTime", asc: false }],
        pages: {
          currentPage: 1,
          size: 10
        }
      }
    };
  },
  mounted() {
    this.getPubList();
  },
  methods: {
    doOksub() {
      var that = this;
      
        if (this.searchUser != '') {
          $.ajax({
            url: sessionStorage.getItem("API") + "wxuser/updatew",
            type: "POST",
            data: {
              sunwouId: this.tempid,
              remark: this.searchUser
            },
            dataType: "json",
            success(res) {
              if (res.code) {
                that.getPubList();
                that.$Message.success(res.msg);
              } else {
                that.$Message.error(res.msg);
              }
            }
          });
        } else {
          that.$Message.error("不能为空");
        }
      
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    navTo(path, query, params, target) {
      this.$router.push({
        path: path,
        query: query,
        params: params,
        target: target
      });
    },
    pubSearch() {
      if (this.pubQuery.wheres.length == 2) {
        this.pubQuery.wheres.push({
          value: "nickName",
          opertionType: "like",
          opertionValue: this.pubSearchText
        });
      } else {
        this.pubQuery.wheres[2].opertionValue = this.pubSearchText;
      }
      this.getPubList();
    },
    filterTagStatus(value, row) {
      return row.status === value;
    },
    handleSizeChange(val) {
      this.pubQuery.pages.size = val;
      this.getPubList();
    },
    handleCurrentChange(val) {
      this.pubQuery.pages.currentPage = val;
      this.getPubList();
    },
    getPubList() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "wxuser/find",
        type: "POST",
        data: {
          query: JSON.stringify(this.pubQuery)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.pubList = res.params.users;
            that.pubTotal = res.params.total;
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    }
  }
};
</script>
