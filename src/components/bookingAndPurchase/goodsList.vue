<template>
  <transition name="fade" mode="out-in">
    <div>
        <Select v-model="cate" style="width:300px;margin-bottom:20px" placeholder="筛选类目" @on-change="changeCate()">
            <Option v-for="item in cateList" :value="item.sunwouId" :key="item.sunwouId">{{ item.name }}</Option>
        </Select>
              <div class="panel-between">
                <div class="panel-start">
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')"><Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'上架')"><Icon type="arrow-up-a" color="#00CC66"></Icon>&nbsp;&nbsp;批量上架</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'下架')"><Icon type="arrow-down-a" color="#FF9900"></Icon>&nbsp;&nbsp;批量下架</button>
                  <button class="ui-btn ui-btn-default" @click="navTo('/wiseMealGoodsAdd',{id:shop})"><Icon type="plus-round" color="#0099ff"></Icon>&nbsp;&nbsp;添加商品</button>
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
                    <img :src="scope.row.image[0].url" width="50px" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" > </el-table-column>
                <el-table-column prop="categoryName" label="类目" > </el-table-column>
                <el-table-column prop="price" label="价格" > </el-table-column>
                <el-table-column prop="createTime" label="发布时间" > </el-table-column>
                <el-table-column prop="show" label="状态" :filters="[{ text: '上架', value: true }, { text: '下架', value: false }]"
                  :filter-method="filterTagStatus" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.show ? 'success':'danger'">{{scope.row.show ? '上架':'下架'}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-dropdown size="mini" split-button type="default" trigger="click">
                      <div @click="changeStatus(scope.row.sunwouId,!scope.row.show)">{{scope.row.show ? '下架':'上架'}}</div> 
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="navTo('/wiseMealGoodsUpdate',{id:scope.row.sunwouId})">修改商品</div></el-dropdown-item>
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除</div></el-dropdown-item>
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
      cate:'',
      cateList:[],
      formData: {
        shopid: "",
        appid: localStorage.getItem("miniId"),
        name: "",
        sort: ""
      },
      formUp:{},
      loading: false,
      catemodelup:false,
      catemodel: false,
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
          }
        ],
        sorts: [
          { value: "createTime", asc: true }
        ],
        pages: {
          currentPage: 1,
          size: 10
        }
      }
    };
  },
  mounted() {
    this.getCate();
    this.getPubList();
  },
  methods: {
    getCate() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "productcategory/find",
        type: "POST",
        data: {
          query: JSON.stringify({
            fields: ["name"],
            wheres: [
              {
                value: "appid",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "type",
                opertionType: "equal",
                opertionValue: 'category'
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
            that.cateList = res.params.list;
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    filterTagStatus(value, row) {
      return row.show === value;
    },
    changeCate(){
        var temp = -1
      for(var i in this.pubQuery.wheres){
          if(this.pubQuery.wheres[i].value == 'categoryid'){
              temp = i
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
            data.show = name == "下架" ? false:true;
          }
          $.ajax({
            url: sessionStorage.getItem("API") + "product/updateMu",
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
        var temp = -1
      for(var i in this.pubQuery.wheres){
          if(this.pubQuery.wheres[i].value == 'name'){
              temp = i
          }
      }
      if (temp == -1) {
        this.pubQuery.wheres.push({
          value: "name",
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
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "product/find",
        type: "POST",
        data: {
          query: JSON.stringify(this.pubQuery)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            for(var i in res.params.list){
                res.params.list[i].image = JSON.parse(res.params.list[i].image)
                res.params.list[i].image[0].url = res.params.list[i].image[0].url.replace('-','-thumbnail')
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
