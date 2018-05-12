<template>
  <transition name="fade" mode="out-in">
    <div>

              <div class="panel-between">
                <div class="panel-start">
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')"><Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'营业')"><Icon type="arrow-up-a" color="#00CC66"></Icon>&nbsp;&nbsp;批量营业</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'打样')"><Icon type="arrow-down-a" color="#FF9900"></Icon>&nbsp;&nbsp;批量打样</button>
                </div>
                <div class="panel-end">
                  <input type="text" v-model="pubSearchText" class="search-input" placeholder="搜索" @input="pubSearch()">
                  <button class="ui-btn ui-btn-default">&nbsp;&nbsp;<Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
                </div>
              </div>
              <el-table style="margin-top:15px;width: 100%" :data="pubList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="封面" width="55">
                  <template slot-scope="scope">
                    <img :src="scope.row.shopImage" width="50px" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="shopName" label="店名" > </el-table-column>
                <el-table-column prop="shopPhone" label="电话" > </el-table-column>
                <el-table-column prop="boxPrice" label="打包费" > </el-table-column>
                <el-table-column prop="shopAddress" label="地址" > </el-table-column>
                <el-table-column prop="startTime" label="营业时间" > </el-table-column>
                <el-table-column prop="endTime" label="打样时间" > </el-table-column>
                <!-- <el-table-column prop="minPrice" label="商品类目数量"> </el-table-column>
                <el-table-column prop="minPrice" label="商品数量"> </el-table-column>
                <el-table-column prop="minPrice" label="营业总额"> </el-table-column> -->
                <el-table-column prop="open" label="营业状态" :filters="[{ text: '营业中', value: true }, { text: '打样', value: false }]"
                  :filter-method="filterTagStatus" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.open ? 'success':'danger'">{{scope.row.open ? '营业中':'打样'}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-dropdown size="mini" split-button type="default" trigger="click">
                      <div @click="changeStatus(scope.row.sunwouId,!scope.row.open)">{{scope.row.open ? '打样':'营业'}}</div> 
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="navTo('/wiseMealShopUpdate',{id:scope.row.sunwouId})">修改店铺</div></el-dropdown-item>
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="navTo('/wiseMealCategory',{id:scope.row.sunwouId})">类目管理</div></el-dropdown-item>
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="navTo('/wiseMealGoodsList',{id:scope.row.sunwouId})">商品管理</div></el-dropdown-item>
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除店铺</div></el-dropdown-item>
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

              
    </div>
  </transition>
</template>


<script>
export default {
  data() {
    return {
      
      pubList: [],
      pubTotal: 0,
      pubSearchText: "",
      multipleSelection: [],
      pubQuery: {
        fields: [],
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
        sorts: [{value:'createTime',asc:false}],
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
    
    getIds() {
      var ids = [];
      for (var i in this.multipleSelection) {
        ids.push(this.multipleSelection[i].sunwouId);
      }
      return ids;
    },
    //批量操作
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
        content:
          name == "删除"
            ? "<p>删除后数据将无法恢复，确定要继续吗？</p>"
            : "<p>这是批量修改操作，确定要继续吗？</p>",
        loading: true,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          var ui = this;
          var data = {
            ids: ids
          };
          if (name == "删除") {
            data.isDelete = true;
          } else {
            data.open = name == "打样" ? false:true;
          }
          $.ajax({
            url: sessionStorage.getItem("API") + "shop/updateMu",
            type: "POST",
            data: data,
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
        url: sessionStorage.getItem("API") + "shop/update",
        type: "POST",
        data: {
          sunwouId: id,
          open: st
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
          value: "shopName",
          opertionType: "like",
          opertionValue: this.pubSearchText
        });
      } else {
        this.pubQuery.wheres[2].opertionValue = this.pubSearchText;
      }
      this.getPubList();
    },
    filterTagStatus(value, row) {
      return row.open === value;
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
        url: sessionStorage.getItem("API") + "shop/find",
        type: "POST",
        data: {
          query: JSON.stringify(this.pubQuery)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            for(var i in res.params.list){
                res.params.list[i].shopImage = res.params.list[i].shopImage.replace('-','-thumbnail')
            }
            that.pubList = res.params.list;
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
