<template>
  <transition name="fade" mode="out-in">
    <div>

              <div class="panel-between">
                <div class="panel-start">
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')"><Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'上架')"><Icon type="arrow-up-a" color="#00CC66"></Icon>&nbsp;&nbsp;批量上架</button>
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'下架')"><Icon type="arrow-down-a" color="#FF9900"></Icon>&nbsp;&nbsp;批量下架</button>
                </div>
                <div class="panel-end">
                  <input type="text" v-model="pubSearchText" class="search-input" placeholder="搜索" @input="pubSearch()">
                  <button class="ui-btn ui-btn-default">&nbsp;&nbsp;<Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
                </div>
              </div>
              <el-table style="margin-top:15px;width: 100%" :data="pubList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="封面" >
                  <template slot-scope="scope">
                    <img :src="scope.row.config.cover" width="50px" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" > </el-table-column>
                <el-table-column prop="config.name" label="联系人" > </el-table-column>
                <el-table-column prop="config.phone" label="电话" > </el-table-column>
                <el-table-column prop="config.houseType" label="户型" > </el-table-column>
                <el-table-column prop="config.czfs" label="出租方式" > </el-table-column>
                <el-table-column prop="config.floorType" label="楼型" > </el-table-column>
                <el-table-column prop="minPrice" label="租金（元/月）"> </el-table-column>
                <el-table-column label="标签" > 
                  <template slot-scope="scope">
                    <el-tag size="mini" v-for="li in scope.row.config.tag" :key="li">{{li}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="remark2" label="状态" :filters="[{ text: '上架', value: '上架' }, { text: '下架', value: '下架' }]"
                  :filter-method="filterTagStatus" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <Icon type="ionic" :color="scope.row.remark2 === '上架' ?'#00CC66':'#FF3333'"></Icon>
                    {{scope.row.remark2 === '上架' ? '上架':'下架'}}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发布时间" width="180"> </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-dropdown size="mini" split-button type="default" trigger="click">
                      <div @click="navTo('/houseAgentRentRoomUpdate',{id:scope.row.sunwouId})">修改</div> 
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="scope.row.remark2 == '上架' ? changeStatus(scope.row.sunwouId,'下架'):changeStatus(scope.row.sunwouId,'上架')">{{scope.row.remark2 == '上架' ? '下架':'上架'}}</div></el-dropdown-item>
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="multiDel(scope.row.sunwouId,'删除')">删除</div></el-dropdown-item>
                        <el-dropdown-item><div style="width:100px;text-align:Center" @click="addToTui(scope.row.sunwouId)">加入首页推荐</div></el-dropdown-item>
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
            value: "userId",
            opertionType: "equal",
            opertionValue: localStorage.getItem("userId")
          },
          {
            value: "miniId",
            opertionType: "equal",
            opertionValue: localStorage.getItem("miniId")
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          },
          {
            value: "remark1",
            opertionType: "equal",
            opertionValue: "租房"
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
    this.getPubList();
  },
  methods: {
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
          if (name == "删除") {
            data.isDelete = true;
          } else {
            data.remark2 = name;
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
        url: sessionStorage.getItem("API") + "exh/update",
        type: "POST",
        data: {
          sunwouId: id,
          remark2: st
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
        url: sessionStorage.getItem("API") + "exh/find",
        type: "POST",
        data: {
          query: JSON.stringify(this.pubQuery)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            for (var i in res.params.result) {
              res.params.result[i].config.tag = JSON.parse(
                res.params.result[i].config.tag
              );
              res.params.result[i].config.cover = (res.params.result[i].config.cover).replace('-','-thumbnail')
            }
            that.pubList = res.params.result;
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
