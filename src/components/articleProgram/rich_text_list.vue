<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="console-title">
        <div class="draw-line"></div>
        <div class="title">文章列表</div>
      </div>
      <div class="panel-between">
        <div class="panel-start">
          <button class="ui-btn ui-btn-default" @click="multiDel()"> <Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
        </div>
        <div class="panel-end">
          <input type="text" class="search-input" v-model="searchText" @input="searchInput" placeholder="搜索">
          <button class="ui-btn ui-btn-default">&nbsp;&nbsp;<Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
        </div>
      </div>
      <el-table style="margin-top:15px;width: 100%" :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="封面" > 
            <template slot-scope="scope">
                <div :style="'background-size:cover;background-position:center;background-image:url('+scope.row.cover+');width:50px;height:50px'"></div>
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" > </el-table-column>
        <el-table-column prop="author" label="作者" > </el-table-column>
        <el-table-column prop="sonTitle" label="简述" > </el-table-column>
        <el-table-column prop="createTime" label="时间" > </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-dropdown size="mini" split-button type="default" trigger="click" @click="previewArticle('articleUpdate',scope.row.sunwouId)">
              修改
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div style="width:70px;text-align:Center" @click="previewArticle('articleUpdate',scope.row.sunwouId)">修改</div></el-dropdown-item>
                <el-dropdown-item><div style="width:70px;text-align:Center" @click="multiDel(scope.row.sunwouId)">删除</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="query.pages.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="query.pages.size"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
      <div class="clearfix"></div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      searchText:'',
      currentPage: 1,
      list: [],
      total: 0,multipleSelection:[],
      query: {
        fields: [],
        wheres: [ 
          {
            value: "userid",
            opertionType: "equal",
            opertionValue: localStorage.getItem('userId')
          },       
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          },
          {
            value: "type",
            opertionType: "equal",
            opertionValue: localStorage.getItem('miniId')
          }
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 10
        }
      },
    };
  },
  mounted(){
    this.getList()
  },
  methods: {
    getIds(){
      var ids = [];
      for(var i in this.multipleSelection){
        ids.push(this.multipleSelection[i].sunwouId)
      }
      return ids
    },
    //批量删除
    multiDel(id) {
      var ids = null;
      if(this.getIds().length == 0){
        ids = id;
      }else{
        ids = this.getIds().toString();
      }
      var that = this;
      this.$Modal.confirm({
        title: "警告",
        content: "<p>删除后数据将无法恢复，确定要继续吗？</p>",
        loading: true,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          var ui = this;
          $.ajax({
            url: sessionStorage.getItem("API") + "art/remove",
            type: "POST",
            data: {
              ids: ids,
            },
            dataType: "json",
            success(res) {
              if (res.code) {
                ui.$Modal.remove();
                that.$Message.success(res.msg);
                that.getList();
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
    previewArticle(path,id){
        this.$router.push({path:path,query:{id:id}})
    },
    navTo(path,query,params,target){
      sessionStorage.setItem('createMiniSunwouId',JSON.stringify(params))
      this.$router.push({path:path,query:query,params:params,target:target});
    },
    searchInput(){
      var temp = -1
      for(var i in this.query.wheres){
        if(this.query.wheres[i].value == 'title'){
          temp = i;
        }
      }
      if(temp == -1){
        this.query.wheres.push({value:'title',opertionType:'like',opertionValue:this.searchText})
      }else{
        this.query.wheres[temp].opertionValue = this.searchText
      }
      this.getList()
    },
    getList() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "art/find",
        type: "POST",
        data: {
          query: JSON.stringify(this.query)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            for (var i in res.params.result) {
              res.params.result[i].active = false;
            }
            that.list = res.params.result;
            that.total = res.params.total;
          } else {
            that.$Message.error(res.msg);
          }
        },
        complete() {
          that.load = false;
        }
      });
    },
    filterTagStatus(value, row) {
      return row.status === value;
    },
    handleSizeChange(val) {
      this.query.pages.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.pages.currentPage = val;
      this.getList();
    },
  }
};
</script>
