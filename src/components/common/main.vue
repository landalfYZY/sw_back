<template>
  <transition name="fade" mode="out-in">
    <div class="layout">
        <Layout>
            <div style="background:#1c2438;height:60px" class="panel-between item-center">
                <div class="layout-logo">
                    <img src="../../assets/img/logo.png" width="30px" height="30px" alt="">
                    <div style="color:#fff;margin-left:10px">{{appName}}</div>
                </div>
                <div style="margin-right:30px">
                    <Dropdown>
                        <a href="javascript:void(0)">
                            <span style="color:#fff">{{phone}}</span>
                            <Icon type="arrow-down-b" color="#ffffff"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem><div style="width:80px;text-align:Center" @click="changeApp()">切换小程序</div></DropdownItem>
                            <DropdownItem divided><div style="width:80px;text-align:Center" @click="outLogin()">退出登录</div></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    
                </div>
            </div>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu :active-name="navActiveName" theme="light" width="auto" :open-names="navOpenName" :accordion="true" @on-select="navSelect">
                        <Submenu  v-for="(item,index) in nav" :key="index" :name="item.label">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                {{item.label}}
                            </template>
                            <MenuItem v-for="(ul,uin) in item.children" :key="uin" :name="ul.path" >{{ul.label}}</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Breadcrumb :style="{margin: '24px 0'}">
                        <BreadcrumbItem>Home</BreadcrumbItem>
                        <BreadcrumbItem>{{pathName}}</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
  </transition>
</template>
<style scoped>
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
var nav = require('../../appurl/appurl.js')
export default {
  data(){
      return {
          appName:localStorage.getItem('appName'),
          phone:JSON.parse(localStorage.getItem('user')).result.phone,
          pathName:'',
          navActiveName:'/houseAgentOverview',
          navOpenName:[],
          nav:[]
      }
  },
  watch:{
      /**监听路径改变 */
      $route(){
          this.pathName = this.$route.name;
      }
  },
  mounted(){
      if(!localStorage.getItem('userId')){
            this.$router.push({path:'/login'})
      }else{
        if(!localStorage.getItem('miniId')){
            this.$router.push({path:'/miniprogram'})
        }else{
            if(localStorage.getItem('relation')){
                this.getUrl()
            }else{
                this.$router.push({path:'/miniprogram'})
            }   
        }
      }
  },
  methods:{
      getUrl(){
          this.nav = nav[localStorage.getItem('relation')]
          this.pathName = this.nav[0].children[0].label
          this.navOpenName = [this.nav[0].label]
          this.$router.push({path:this.nav[0].children[0].path})
      },
      changeApp(){
           this.$router.push({path:'/miniprogram'})
      },
      outLogin(){
          localStorage.removeItem('user');
          localStorage.removeItem('phone');
          localStorage.removeItem('userId');
          localStorage.removeItem('miniId');
          localStorage.removeItem('modelId');
          localStorage.removeItem('appName');
          localStorage.removeItem('relation');
          this.$router.push({path:'/login'})
      },
      //更换导航
      navSelect(e){
          this.$router.push({path:e})
      }
  }
}
</script>
