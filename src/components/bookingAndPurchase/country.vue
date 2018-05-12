<template>
  <transition name="fade" mode="out-in">
    <div>
              <div class="panel-between">
                <div class="panel-start">
                  <button class="ui-btn ui-btn-default" @click="multiDel(null,'删除')"><Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
                  <button class="ui-btn ui-btn-default" @click="addcates()"><Icon type="plus-round" color="#00CC66"></Icon>&nbsp;&nbsp;添加地区</button>
                </div>
                <div class="panel-end">
                  <input type="text" v-model="pubSearchText" class="search-input" placeholder="搜索" @input="pubSearch()">
                  <button class="ui-btn ui-btn-default">&nbsp;&nbsp;<Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
                </div>
              </div>
              <el-table style="margin-top:15px;width: 100%" :data="pubList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="类目名称" > </el-table-column>
                <el-table-column prop="sort" label="序号" > </el-table-column>
                <el-table-column prop="createTime" label="添加时间" > </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-dropdown size="mini" split-button type="default" trigger="click">
                      <div @click="catemodelup = true,formUp = scope.row">修改</div> 
                      <el-dropdown-menu slot="dropdown">
                        
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
              <Modal v-model="catemodel" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>地区添加</span>
                </p>
                <div style="text-align:center">
                   <Form :model="formData" label-position="left" :label-width="80">
                        <FormItem label="国家名称">
                            <Input v-model="formData.name"></Input>
                        </FormItem>
                        <FormItem label="序号">
                            <Input v-model="formData.sort"></Input>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="primary" :loading="loading" size="large" long  @click="submitData()">确认提交</Button>
                </div>
            </Modal>
            <Modal v-model="catemodelup" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>地区修改</span>
                </p>
                <div style="text-align:center">
                   <Form :model="formData" label-position="left" :label-width="80">
                        <FormItem label="类目名称">
                            <Input v-model="formUp.name"></Input>
                        </FormItem>
                        <FormItem label="序号">
                            <Input v-model="formUp.sort"></Input>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="primary" :loading="loading" size="large" long  @click="formUpdate()">确认提交</Button>
                </div>
            </Modal>
    </div>
  </transition>
</template>


<script>
export default {
  data() {
    return {
      formData: {
        type:'country',
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
            value: "type",
            opertionType: "equal",
            opertionValue: 'country'
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }
        ],
        sorts: [
          { value: "sort", asc: true },
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
    this.getPubList();
  },
  methods: {
    addcates() {
      this.catemodel = true;
    },
    submitData() {
      var that = this;
      if (this.formData.name == "") {
        this.$Notice.error({
          title: "警告",
          desc: "类目名称不能为空"
        });
      } else {
        this.loading = true;
        $.ajax({
          url: sessionStorage.getItem("API") + "productcategory/add",
          type: "POST",
          data: this.formData,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Message.success(res.msg);
              that.getPubList();
            } else {
              that.$Message.error(res.msg);
            }
          },
          complete() {
            that.loading = false;
            that.catemodel = false;
          }
        });
      }
    },
    formUpdate() {
      var that = this;
      if (this.formUp.name == "") {
        this.$Notice.error({
          title: "警告",
          desc: "类目名称不能为空"
        });
      } else {
        this.loading = true;
        $.ajax({
          url: sessionStorage.getItem("API") + "productcategory/update",
          type: "POST",
          data: this.formUp,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Message.success(res.msg);
              that.getPubList();
            } else {
              that.$Message.error(res.msg);
            }
          },
          complete() {
            that.loading = false;
            that.catemodelup = false;
          }
        });
      }
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
            data.remark2 = name;
          }
          $.ajax({
            url: sessionStorage.getItem("API") + "productcategory/updateMu",
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
    pubSearch() {
      var temp = -1;
      for (var i in this.pubQuery.wheres) {
        if (this.pubQuery.wheres[i].value == "name") {
          temp = i;
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
        url: sessionStorage.getItem("API") + "productcategory/find",
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
