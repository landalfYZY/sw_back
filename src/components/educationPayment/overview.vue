<template>
  <transition name="fade" mode="out-in">
      <div>
          <Row :gutter="16">
              <Col :span="6" style="padding:10px;background:#f3f3f3">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="university" size="30" color="#66CC99"></Icon></div>
                          <div>学校</div>
                      </div>
                      <div style="font-size:35px;margin-left:20px;line-height:60px">20</div>
                  </div>
              </Col>
              <Col  :span="6" style="padding:10px;background:#f3f3f3">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="ios-bookmarks" color="#0099ff" size="30"></Icon></div>
                          <div>缴费项</div>
                      </div>
                      <div style="font-size:35px;margin-left:20px;line-height:60px">145/196</div>
                  </div>
              </Col>
              <Col  :span="6" style="padding:10px;background:#f3f3f3">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="filing" color="#0099ff" size="30"></Icon></div>
                          <div>缴费人数</div>
                      </div>
                      <div style="height:60px">
                          <div style="font-size:20px;margin-left:20px;">15300/20300</div>
                          <div style="text-align:Center;color:#888">剩余5000人</div>
                      </div>
                  </div>
              </Col>
              <Col  :span="6" style="padding:10px;background:#f3f3f3">
                  <div class="panel-center item-center">
                      <div style="text-align:Center">
                          <div><Icon type="social-yen" color="#FF6633" size="30"></Icon></div>
                          <div>缴费金额</div>
                      </div>
                      <div style="height:60px">
                          <div style="font-size:20px;margin-left:20px;">15.6万/37.6万</div>
                          <div style="text-align:Center;color:#888">剩余15200元</div>
                      </div>
                  </div>
              </Col>
          </Row>
          <div style="font-size:20px;margin-top:30px"> 教育局缴费项目分析柱状图</div>
          <div id="mountNode" style="height:500px"></div>

          <div style="font-size:20px;margin-top:30px"> 学生逾期按时缴费分析柱状图</div>
          <div id="mountNode1" style="height:500px"></div>
      </div>
  </transition>
</template>
<script>
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
export default {
  data() {
    return {};
  },
  mounted() {
    this.getCharts();
    this.getCharts1();
  },
  methods: {
    getCharts() {
      const data = [
        { year: "1月", sales: 15200 },
        { year: "2月", sales: 32000 },
        { year: "3月", sales: 58000 },
        { year: "4月", sales: 16500 },
        { year: "5月", sales: 85050 },
        { year: "6月", sales: 48500 },
        { year: "7月", sales: 38000 },
        { year: "8月", sales: 38000 },
        { year: "9月", sales: 48000 },
        { year: "10月", sales: 38000 },
        { year: "11月", sales: 38000 },
        { year: "12月", sales: 38000 }
      ];
      const chart = new G2.Chart({
        container: "mountNode",
        forceFit: true,
        height: 500
      });
      chart.source(data);
      chart.scale("sales", {
        tickInterval: 10000
      });
      chart.interval().position("year*sales");
      chart.render();
    },
    getCharts1() {
      const data = [
        {
          name: "逾期",
          "9月学杂费": 120,
          "Feb.": 28,
          "Mar.": 39,
          "Apr.": 81,
          May: 47,
          "Jun.": 20.3,
          "Jul.": 24,
          "Aug.": 35.6
        },
        {
          name: "按时",
          "9月学杂费": 12.4,
          "Feb.": 23.2,
          "Mar.": 34.5,
          "Apr.": 99.7,
          May: 52.6,
          "Jun.": 35.5,
          "Jul.": 37.4,
          "Aug.": 42.4
        }
      ];
      const ds = new View();
      const dv = ds.source(data);
      dv.transform({
        type: "fold",
        fields: ["9月学杂费", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."], // 展开字段集
        key: "月份", // key字段
        value: "月均降雨量" // value字段
      });

      const chart = new G2.Chart({
        container: "mountNode1",
        forceFit: true,
        height: 500
      });
      chart.source(dv);
      chart
        .interval()
        .position("月份*月均降雨量")
        .color("name")
        .adjust([
          {
            type: "dodge",
            marginRatio: 1 / 32
          }
        ]);
      chart.render();
    }
  }
};
</script>
