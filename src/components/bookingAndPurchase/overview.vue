<template>
  <transition name="fade" mode="out-in">
    <div>
        <Row :gutter="16">
              <Col :span="6" style="padding:10px;background:#f3f3f3">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="university" size="30" color="#66CC99"></Icon></div>
                          <div>新代购人</div>
                      </div>
                      <div style="font-size:35px;margin-left:20px;line-height:60px">20</div>
                  </div>
              </Col>
              <Col  :span="6" style="padding:10px;background:#f3f3f3">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="ios-bookmarks" color="#0099ff" size="30"></Icon></div>
                          <div>日活量</div>
                      </div>
                      <div style="font-size:35px;margin-left:20px;line-height:60px">196</div>
                  </div>
              </Col>
              <Col  :span="6" style="padding:10px;background:#f3f3f3">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="filing" color="#0099ff" size="30"></Icon></div>
                          <div>昨日订单</div>
                      </div>
                      <div style="font-size:35px;margin-left:20px;line-height:60px">352</div>
                  </div>
              </Col>
              <Col  :span="6" style="padding:10px;background:#f3f3f3;height:80px">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="social-yen" color="#FF6633" size="30"></Icon></div>
                          <div>日成交额</div>
                      </div>
                      <div style="font-size:35px;margin-left:20px;line-height:60px">1960.0<span style="font-size:16px">元</span></div>
                  </div>
              </Col>
          </Row>
          <div style="margin-top:30px" class="panel-between"> 
              <div style="font-size:20px;">营业额数据分析</div>
              <div class="panel-end">
                  <Select v-model="model12" filterable multiple placeholder="选择店铺（默认为全部）">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <DatePicker type="daterange" split-panels placeholder="日期筛选" style="width: 300px;margin-left:15px"></DatePicker>
              </div>
          </div>
          <div id="mountNode" style="height:500px"></div>

          <div style="margin-top:30px" class="panel-between"> 
              <div style="font-size:20px;">订单数据分析</div>
              <div class="panel-end">
                  <Select v-model="model12" filterable multiple placeholder="选择店铺（默认为全部）">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <DatePicker type="daterange" split-panels placeholder="日期筛选" style="width: 300px;margin-left:15px"></DatePicker>
              </div>
          </div>
          <div id="mountNode1" style="height:500px"></div>
          <div style="margin-top:30px" class="panel-between"> 
              <div style="font-size:20px;">订单与营业额总数量</div>
              <div class="panel-end">
                  <Select v-model="model12" filterable multiple placeholder="选择店铺（默认为全部）">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
              </div>
          </div>
          <div class="panel-between">
              <div id="mountNode3" style="height:500px;width:50%"></div>
              <div id="mountNode4" style="height:500px;width:50%"></div>
          </div>
    </div>
  </transition>
</template>
<script>
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
export default {
  data() {
    return {
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model12: []
    };
  },
  mounted() {
    this.getCharts();
    this.getCharts1();
    this.getCharts2();
    this.getCharts3();
  },
  methods: {
    getCharts() {
      const data = [
        { year: "1991", value: 3 },
        { year: "1992", value: 4 },
        { year: "1993", value: 3.5 },
        { year: "1994", value: 5 },
        { year: "1995", value: 4.9 },
        { year: "1996", value: 6 },
        { year: "1997", value: 7 },
        { year: "1998", value: 9 },
        { year: "1999", value: 13 }
      ];
      const chart = new G2.Chart({
        container: "mountNode",
        forceFit: true,
        height: 500
      });
      chart.source(data);
      chart.scale("value", {
        min: 0
      });
      chart.scale("year", {
        range: [0, 1]
      });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      chart.line().position("year*value");
      chart
        .point()
        .position("year*value")
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart.render();
    },
    getCharts1() {
      const data = [
        { month: "Jan", 未完成: 7.0, 已完成: 3.9 },
        { month: "Feb", 未完成: 6.9, 已完成: 4.2 },
        { month: "Mar", 未完成: 9.5, 已完成: 5.7 },
        { month: "Apr", 未完成: 14.5, 已完成: 8.5 },
        { month: "May", 未完成: 18.4, 已完成: 11.9 },
        { month: "Jun", 未完成: 21.5, 已完成: 15.2 },
        { month: "Jul", 未完成: 25.2, 已完成: 17.0 },
        { month: "Aug", 未完成: 26.5, 已完成: 16.6 },
        { month: "Sep", 未完成: 23.3, 已完成: 14.2 },
        { month: "Oct", 未完成: 18.3, 已完成: 10.3 },
        { month: "Nov", 未完成: 13.9, 已完成: 6.6 },
        { month: "Dec", 未完成: 9.6, 已完成: 4.8 }
      ];
      const ds = new View();
      const dv = ds.source(data);
      dv.transform({
        type: "fold",
        fields: ["未完成", "已完成"], // 展开字段集
        key: "city", // key字段
        value: "temperature" // value字段
      });
      const chart = new G2.Chart({
        container: "mountNode1",
        forceFit: true,
        height: 500
      });
      chart.source(dv, {
        month: {
          range: [0, 1]
        }
      });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      chart.axis("temperature", {
        label: {
          formatter: val => {
            return val;
          }
        }
      });
      chart
        .line()
        .position("month*temperature")
        .color("city")
        .shape("smooth");
      chart
        .point()
        .position("month*temperature")
        .color("city")
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart.render();
    },
    getCharts2() {
      const data = [
        { year: "2001", population: 41.8 },
        { year: "2002", population: 38 },
        { year: "2003", population: 33.7 },
        { year: "2004", population: 30.7 },
        { year: "2005", population: 25.8 },
        { year: "2006", population: 31.7 },
        { year: "2007", population: 33 },
        { year: "2008", population: 46 },
        { year: "2009", population: 38.3 },
        { year: "2010", population: 28 },
        { year: "2011", population: 42.5 },
        { year: "2012", population: 30.3 }
      ];

      const chart = new G2.Chart({
        container: "mountNode3",
        forceFit: true,
        height: 500
      });
      chart.source(data);
      chart.coord("polar", {
        innerRadius: 0.2
      });
      chart.legend({
        position: "right",
        offsetY: -500 / 2 + 180,
        offsetX: -140
      });
      chart.axis(false);
      chart
        .interval()
        .position("year*population")
        .color("year", G2.Global.colors_pie_16)
        .style({
          lineWidth: 1,
          stroke: "#fff"
        });
      chart.render();
    },
    getCharts3() {
      const data = [
        { item: "事例一", count: 40 },
        { item: "事例二", count: 21 },
        { item: "事例三", count: 17 },
        { item: "事例四", count: 13 },
        { item: "事例五", count: 9 }
      ];
      const dv = new View();
      dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent"
      });
      const chart = new G2.Chart({
        container: "mountNode4",
        forceFit: true,
        height: 500
      });
      chart.source(dv, {
        percent: {
          formatter: val => {
            val = val * 100 + "%";
            return val;
          }
        }
      });
      chart.coord("theta");
      chart.tooltip({
        showTitle: false,
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      chart
        .intervalStack()
        .position("percent")
        .color("item")
        .label("percent", {
          offset: -40,
          // autoRotate: false,
          textStyle: {
            rotate: 0,
            textAlign: "center",
            shadowBlur: 2,
            shadowColor: "rgba(0, 0, 0, .45)"
          }
        })
        .tooltip("item*percent", (item, percent) => {
          percent = percent * 100 + "%";
          return {
            name: item,
            value: percent
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff"
        });
      chart.render();
    }
  }
};
</script>
