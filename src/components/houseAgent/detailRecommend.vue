<template>
  <transition name="fade" mode="out-in">
      <div>
          <Form :model="data" :label-width="100">
            <FormItem :label="data.remakeConfig[0].recommend[3].label">
                <Row>
                    <Col span="7">
                        <Select v-model="data.remakeConfig[0].recommend[3].value" >
                            <Option v-for="(item,index) in hdfs" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px"> &nbsp;</Col> 
                </Row>
            </FormItem>
            <FormItem :label="data.remakeConfig[0].recommend[0].label">
                <Row>
                    <Col span="7">
                        <Select v-model="data.remakeConfig[0].recommend[0].value" >
                            <Option v-for="(item,index) in hrs" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px"> &nbsp;</Col>
                    <Col span="10" >
                        <CheckboxGroup v-model="data.remakeConfig[0].recommend[0].oth">
                            <Checkbox label="houseType" >户型</Checkbox>
                            <Checkbox label="city">城市</Checkbox>
                            <Checkbox label="areas">区域</Checkbox>
                            <Checkbox label="area">面积</Checkbox>
                            <Checkbox label="floorType">楼型</Checkbox>
                            <Checkbox label="decorate">装修</Checkbox>
                            <Checkbox label="elevator">电梯</Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem :label="data.remakeConfig[0].recommend[1].label">
                <Row>
                    <Col span="7">
                        <Select v-model="data.remakeConfig[0].recommend[1].value" >
                            <Option v-for="(item,index) in hrs" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px"> &nbsp;</Col>
                    <Col span="10" >
                        <CheckboxGroup v-model="data.remakeConfig[0].recommend[1].oth">
                            <Checkbox label="city">城市</Checkbox>
                            <Checkbox label="areas">区域</Checkbox>
                            <Checkbox label="area">面积</Checkbox>
                            <Checkbox label="floorType">特色</Checkbox>
                            <Checkbox label="decorate">房源类型</Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem :label="data.remakeConfig[0].recommend[2].label">
                <Row>
                    <Col span="7">
                        <Select v-model="data.remakeConfig[0].recommend[2].value" >
                            <Option v-for="(item,index) in hrs" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </Col>
                    <Col span="2" style="text-align: right;padding-right:10px"> &nbsp;</Col>
                    <Col span="10" >
                        <CheckboxGroup v-model="data.remakeConfig[0].recommend[2].oth">
                            <Checkbox label="houseType" >户型</Checkbox>
                            <Checkbox label="city">城市</Checkbox>
                            <Checkbox label="areas">区域</Checkbox>
                            <Checkbox label="area">面积</Checkbox>
                            <Checkbox label="floorType">楼型</Checkbox>
                            <Checkbox label="decorate">装修</Checkbox>
                            <Checkbox label="elevator">电梯</Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submitForm()">提交</Button>
            </FormItem>
          </Form>
      </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      hrs: ["最近发布", "相似度"],
      hdfs: ["全部最近发布", "二手房最近发布", "新房最近发布", "租房最近发布"],
      data: {
        remakeConfig: [{
          note: "",
          admin:{name:'',phone:''},
          recommend: [
            
            { label: "二手房推荐", value: "", oth: [] },
            { label: "新房房推荐", value: "", oth: [] },
            { label: "租房推荐", value: "", oth: [] },
            { label: "首页推荐", value: "", oth: [] }
          ]
        }]
      }
    };
  },
  mounted() {
    this.getMiniPro();
  },
  methods: {
    submitForm() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "miniPro/update",
        type: "post",
        data: {
          userid: localStorage.getItem("userId"),
          sunwouId: localStorage.getItem("miniId"),
          remakeConfig: JSON.stringify(this.data.remakeConfig)
        },
        dataType: "json",
        success(res) {
          if (res.code) {
            that.getMiniPro();
            that.$Message.success("修改成功");
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    getMiniPro() {
      var that = this;
      $.ajax({
        url: sessionStorage.getItem("API") + "miniPro/find",
        type: "post",
        data: {
          query: JSON.stringify({
            wheres: [
              {
                value: "sunwouId",
                opertionType: "equal",
                opertionValue: localStorage.getItem("miniId")
              },
              {
                value: "userid",
                opertionType: "equal",
                opertionValue: localStorage.getItem("userId")
              }
            ]
          })
        },
        dataType: "json",
        success(res) {
          if (res.params.result[0].remakeConfig) {
            res.params.result[0].remakeConfig = JSON.parse(
              res.params.result[0].remakeConfig
            );
          } else {
            res.params.result[0].remakeConfig = [
              {
                admin: {
                  name: "",
                  phone: ""
                },
                recommend: [
                  { label: "二手房推荐", value: "", oth: [] },
                  { label: "新房房推荐", value: "", oth: [] },
                  { label: "租房推荐", value: "", oth: [] },
                  { label: "首页推荐", value: "", oth: [] }
                ]
              }
            ];
          }
          that.data = res.params.result[0];
        }
      });
    }
  }
};
</script>
