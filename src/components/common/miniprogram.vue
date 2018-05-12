<template>
  <transition name="fade" mode="out-in">
    <div style="width:100%">
    <div style="background:#1c2438;height:60px" class="panel-between item-center">
        <div class="layout-logo">
            <img src="../../assets/img/logo.png" width="30px" height="30px" alt="">
            <div style="color:#fff;margin-left:10px">{{appName}}</div>
        </div>   
    </div>
    <div style="width:1200px;margin:auto;margin-top:100px">
      
      <div class="panel-between">
        <!-- <div class="panel-start">
          <button class="ui-btn ui-btn-default" > <Icon type="ios-pause" color="#FF3333"></Icon>&nbsp;&nbsp;批量停止服务</button>
          <button class="ui-btn ui-btn-default"><Icon type="ios-play" color="#00CC66"></Icon>&nbsp;&nbsp;批量开启服务</button>
        </div> -->
        <div class="panel-end">
          <input type="text" class="search-input" v-model="searchText" @input="searchInput" placeholder="搜索">
          <button class="ui-btn ui-btn-default">&nbsp;&nbsp;<Icon type="ios-search" color="#0099ff"></Icon>&nbsp;&nbsp;</button>
        </div>
      </div>
      <el-table style="margin-top:15px;width: 100%" :data="list">
        <el-table-column prop="appName" label="名称" > </el-table-column>
        <el-table-column prop="appid" label="appId" width="180"> </el-table-column>
        <el-table-column prop="miniMod.modelName" label="模板名称" width="180"> </el-table-column>
        <el-table-column prop="status" label="状态" :filters="[{ text: '运行中', value: 1 }, { text: '已停止', value: 0 }]"
          :filter-method="filterTagStatus" filter-placement="bottom-end">
          <template slot-scope="scope">
            <span>{{scope.row.status == '未购买服务' ? "未购买服务":""}}</span>
            <Icon v-show="scope.row.status != '未购买服务'" type="ionic" :color="scope.row.status == '服务中' || scope.row.status == '即将停止服务' ?'#00CC66':'#FF3333'"></Icon>
            <span v-show="scope.row.status != '未购买服务'">{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="到期时间"> 
          <template slot-scope="scope">
            {{scope.row.deadLine ? scope.row.deadLine:"未购买服务"}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <Button type="default" size="small" @click="maner(scope.row.miniMod.relation,scope.row.appName,scope.row.sunwouId,scope.row.modelid)">进入管理</Button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top:30px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="query.pages.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="query.pages.size"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
      <div class="clearfix"></div>
      </div>
    </div>
  </transition>
</template>
<style>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  margin-left: 20px
}
.layout-logo > img {
  border-radius: 40px;
  border: 2px solid #fff;
}
</style>

<script>
export default {
  data() {
    return {
      appName:localStorage.getItem('appName'),
      searchText:'',
      currentPage: 1,
      list: [],
      total: 0,
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
    if(!localStorage.getItem('userId')){
         this.$route.push({path:'/login'})
    }
    this.getList()
  },
  methods: {
    maner(relation,name,miniId,modelId){
      if(relation){
        localStorage.setItem('miniId',miniId)
        localStorage.setItem('modelId',modelId)
        localStorage.setItem('appName',name)
        localStorage.setItem('relation',relation)
        this.$router.push({path:'/'})
      }else{
        this.$Message.error('该模板还未绑定后台，请联系客服人员')
      }       
    },
    navTo(path,query,params,target){
      sessionStorage.setItem('createMiniSunwouId',JSON.stringify(params))
      this.$router.push({path:path,query:query,params:params,target:target});
    },
    searchInput(){
      var temp = -1
      for(var i in this.query.wheres){
        if(this.query.wheres[i].value == 'appName'){
          temp = i;
        }
      }
      if(temp == -1){
        this.query.wheres.push({value:'appName',opertionType:'like',opertionValue:this.searchText})
      }else{
        this.query.wheres[temp].opertionValue = this.searchText
      }
      this.getList()
    },
    getList() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "miniPro/find",
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
