<template>
  <transition name="fade" mode="out-in">
    <div>
      <Select v-model="shop" style="width:300px;margin-bottom:20px" placeholder="请选择一家店铺" @on-change="changeShop()">
            <Option v-for="item in shopList" :value="item.sunwouId" :key="item.sunwouId">{{ item.shopName }}</Option>
        </Select>
              <div class="panel-between">
                <div class="panel-start">
                  <button class="ui-btn ui-btn-default" @click="swmodel = true"><Icon type="arrow-up-a" color="#00CC66"></Icon>&nbsp;&nbsp;添加收营员</button>
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
                <el-table-column prop="nickName" label="昵称" > </el-table-column>
                <el-table-column prop="phone" label="手机号" > </el-table-column>
                <el-table-column  label="性别" >
                    <template slot-scope="scope">
                        {{scope.row.gender == 1 ? '男':''}}{{scope.row.gender == 2 ? '女':''}}{{scope.row.gender == 0 ? '男':''}}
                    </template>
                </el-table-column>
                <el-table-column prop="shopActive" label="收银状态"> 
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.shopActive ? 'success':'error'">{{scope.row.shopActive ? '收银中':'挂起'}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-dropdown size="mini" split-button type="default" trigger="click">
                      <div @click="scope.row.shopActive ? changeStatus(scope.row.sunwouId,false):changeStatus(scope.row.sunwouId,true)">{{scope.row.shopActive ? '挂起':'收银'}}</div> 
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId)">删除</div></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pubQuery.pages.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pubQuery.pages.size"
                layout="total, sizes, prev, pager, next, jumper" :total="pubTotal">
              </el-pagination>
              <div class="clearfix"></div>
              <Modal v-model="swmodel" title="新增收银员" width="300" ok-text="确认添加" cancel-text="取消添加" @on-ok="doOksub">
                  <p>输入手机号搜索用户</p>
                  <p><Input v-model="searchUser" placeholder="手机号">
                       <Button slot="append" icon="ios-search" @click="searchUserInfo()"></Button>
                    </Input>
                  </p>
                  <p>
                    <div v-if="userInfo.length>0" style="margin-top:20px;width:100%;text-align:center"><img :src="userInfo[0].avatarUrl" width="100px" alt=""></div>
                  </p>
              </Modal>
    </div>
  </transition>
</template>


<script>
export default {
  data() {
    return {
      searchUser: "",
      swmodel: false,
      userInfo: [],
      shopList: [],
      shop: "",
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
            value: "shopId",
            opertionType: "equal",
            opertionValue: ""
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 10
        }
      }
    };
  },
  mounted() {
    this.getShopList();
  },
  methods: {
    doOksub() {
      var that = this;
      if (this.shop != '') {
        if (this.userInfo.length > 0) {
          $.ajax({
            url: sessionStorage.getItem("API") + "wxuser/updatew",
            type: "POST",
            data: {
              sunwouId: this.userInfo[0].sunwouId,
              shopId: this.shop,
              shopActive:false
            },
            dataType: "json",
            success(res){
              
              if(res.code){
                that.getPubList()
                that.$Message.success(res.msg);
              }else{
                that.$Message.error(res.msg);
              }
            }
          });
        } else {
          that.$Message.error("你还没搜索用户");
        }
      }else{
        that.$Message.error("请选择一家店铺");
      }
    },
    searchUserInfo() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "wxuser/find",
        type: "POST",
        data: {
          query: JSON.stringify({
            fields: [],
            wheres: [
              {
                value: "minProgramId",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "phone",
                opertionType: "equal",
                opertionValue: this.searchUser
              },
              {
                value: "isDelete",
                opertionType: "equal",
                opertionValue: false
              }
            ],
            sorts: [],
            pages: {
              currentPage: 1,
              size: 10
            }
          })
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.userInfo = res.params.users;
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    changeShop() {
      if (this.shop != "") {
        this.pubQuery.wheres[1].opertionValue = this.shop;
        this.getPubList();
      }
    },
    getShopList() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "shop/find",
        type: "POST",
        data: {
          query: JSON.stringify({
            fields: ["shopName"],
            wheres: [
              {
                value: "appid",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "isDelete",
                opertionType: "equal",
                opertionValue: false
              }
            ],
            sorts: [],
            pages: {
              currentPage: 1,
              size: 100
            }
          })
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.shopList = res.params.list;
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    addToTui(id) {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "collection/add",
        type: "POST",
        data: {
          userId: localStorage.getItem("userId"),
          tableName: "Exhibition",
          tableId: id,
          miniId: localStorage.getItem("miniId"),
          type: JSON.stringify({ type: "首页推荐" })
        },
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
    getIds() {
      var ids = [];
      for (var i in this.multipleSelection) {
        ids.push(this.multipleSelection[i].sunwouId);
      }
      return ids;
    },
    //批量操作
    multiDel(id) {
      
      var that = this;
      this.$Modal.confirm({
        title: "警告",
        content:
          name == "删除"
            ? "<p>删除后数据将无法恢复，确定要继续吗？</p>"
            : "<p>这是批量修改操作，确定要继续吗？</p>",
        loading: true,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          var ui = this;
         
          
          $.ajax({
            url: sessionStorage.getItem("API") + "wxuser/updatew",
            type: "POST",
            data: {
              sunwouId:id,
              shopId:''
            },
            dataType: "json",
            success(res) {
              if (res.code) {
                ui.$Modal.remove();
                that.$Message.success(res.msg);
                that.getPubList();
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

    //上架下架状态改变
    changeStatus(id, st) {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "wxuser/updatew",
        type: "POST",
        data: {
          sunwouId: id,
          shopActive: st
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.$Message.success(res.msg);
            that.getPubList();
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
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
          value: "title",
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
