<template>
  <transition name="fade" mode="out-in">
    <div>
        <!-- <Select v-model="shop" style="width:300px;margin-bottom:20px" placeholder="请选择一家店铺" @on-change="changeShop()">
            <Option v-for="item in shopList" :value="item.sunwouId" :key="item.sunwouId">{{ item.shopName }}</Option>
        </Select> -->
        <Select v-show="cateList.length > 0" v-model="cate" style="width:300px;margin-bottom:20px" placeholder="筛选类目" @on-change="changeCate()">
            <Option v-for="item in cateList" :value="item.sunwouId" :key="item.sunwouId">{{ item.name }}</Option>
        </Select>
              <div class="panel-between">
                <div class="panel-start">
                  <!-- <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')"><Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'上架')"><Icon type="arrow-up-a" color="#00CC66"></Icon>&nbsp;&nbsp;批量上架</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'下架')"><Icon type="arrow-down-a" color="#FF9900"></Icon>&nbsp;&nbsp;批量下架</button>
                  <button class="ui-btn ui-btn-default" @click="navTo('/wiseMealGoodsAdd',{id:shop})"><Icon type="plus-round" color="#0099ff"></Icon>&nbsp;&nbsp;添加商品</button> -->
                </div>
                <div class="panel-end">
                  <input type="text" v-model="pubSearchText" class="search-input" placeholder="搜索" @input="pubSearch()">
                  <button class="ui-btn ui-btn-default">&nbsp;&nbsp;<Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
                </div>
              </div>
              <el-table style="margin-top:15px;width: 100%" :data="pubList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                
                <el-table-column prop="sunwouId" label="订单号" > </el-table-column>
                <el-table-column prop="type" label="取餐类型" > </el-table-column>
                <el-table-column prop="waterNumber" label="货号" width="55"> </el-table-column>
                <el-table-column prop="shop.shopName" label="店名" > </el-table-column>
                <el-table-column prop="total" label="支付金额" > </el-table-column>
                <el-table-column prop="payment" label="支付方式" > </el-table-column>
                <el-table-column prop="status" label="状态" :filters="[{ text: '待付款', value: '待付款' }, { text: '待取货', value: '待取货' }, { text: '已完成', value: '已完成' }]"
                  :filter-method="filterTagStatus" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == '待付款'" type="primary">待付款</el-tag>
                    <el-tag v-if="scope.row.status == '待取货'" type="warning">待取货</el-tag>
                    <el-tag v-if="scope.row.status == '已完成'" type="success">已完成</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="payTime" label="支付时间" > </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                      <Button v-if="scope.row.status != '已完成'" @click="multiDel(scope.row.sunwouId,scope.row.status)" type="ghost">{{scope.row.status == '待付款' ? '标记为已付款':''}}{{scope.row.status == '待取货' ? '标记为已完成':''}}</Button>

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
      shop: "",
      cate: "",
      cateList: [],
      formData: {
        shopid: "",
        appid: localStorage.getItem("miniId"),
        name: "",
        sort: ""
      },
      formUp: {},
      loading: false,
      catemodelup: false,
      catemodel: false,
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
            value: "appid",
            opertionType: "equal",
            opertionValue: localStorage.getItem("miniId")
          },

          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          },
          {
            value: "type",
            opertionType: "ne",
            opertionValue: "充值"
          }
        ],
        sorts: [
          { value: "status", asc: false },
          { value: "createTime", asc: false }
        ],
        pages: {
          currentPage: 1,
          size: 10
        }
      }
    };
  },
  mounted() {
    this.getShopList();
    this.getPubList()
    if (this.$route.query.id) {
      this.shop = this.$route.query.id;
    }
  },
  methods: {
    filterTagStatus(value, row) {
      return row.status === value;
    },
    changeCate() {
      var temp = -1;
      for (var i in this.pubQuery.wheres) {
        if (this.pubQuery.wheres[i].value == "categoryid") {
          temp = i;
        }
      }
      if (temp == -1) {
        this.pubQuery.wheres.push({
          value: "categoryid",
          opertionType: "like",
          opertionValue: this.cate
        });
      } else {
        this.pubQuery.wheres[i].opertionValue = this.cate;
      }
      this.getPubList();
    },
    changeShop() {
      if (this.shop != "") {
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
            sunwouId: ids
          };
          if (name == "待付款") {
            data.status = "待取货";
          } else if(name == '待取货') {
            data.status = "已完成";
          }
          $.ajax({
            url: sessionStorage.getItem("API") + "takeoutorder/update",
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
    navTo(path, query, params, target) {
      this.$router.push({
        path: path,
        query: query,
        params: params,
        target: target
      });
    },
    changeStatus(id, st) {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "product/update",
        type: "POST",
        data: {
          sunwouId: id,
          show: st
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
    pubSearch() {
      var temp = -1;
      for (var i in this.pubQuery.wheres) {
        if (this.pubQuery.wheres[i].value == "sunwouId") {
          temp = i;
        }
      }
      if (temp == -1) {
        this.pubQuery.wheres.push({
          value: "sunwouId",
          opertionType: "like",
          opertionValue: this.pubSearchText
        });
      } else {
        this.pubQuery.wheres[i].opertionValue = this.pubSearchText;
      }
      this.getPubList();
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
      var tee = -1;

      for (var i in this.pubQuery.wheres) {
        if (this.pubQuery.wheres[i].value == "shopid") {
          tee = i;
        }
      }
      if (tee == -1) {
        if (this.shop != "") {
          this.pubQuery.wheres.push({
            value: "shopid",
            opertionType: "equal",
            opertionValue: this.shop
          });
        }
      } else {
        if (this.shop != "") {
          this.pubQuery.wheres[tee].opertionValue = this.shop;
        } else {
          this.pubQuery.wheres.splice(tee, 1);
        }
      }
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "takeoutorder/find",
        type: "POST",
        data: {
          query: JSON.stringify(this.pubQuery)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            
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
