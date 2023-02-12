<template>
  <card type="chart">
    <template slot="header">
      <h5 class="card-category pull-right">
        {{ getTimeAgo((nowTime - time) / 1000) }} ago
      </h5>

      <h5 class="card-category">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h5>

      <h3 class="card-title">
        <i
          class="fa "
          :class="[config.icon, getIconColorClass()]"
          aria-hidden="true"
          style="font-size: 30px;"
        ></i>
        <span>{{ value.toFixed(config.decimalPlaces) }} {{ config.unit }}</span>
      </h3>
    </template>

    <div class="chart-area" style="height: 300px">
      <highstock
        style="height: 100%"
        v-if="isMounted"
        :options="chartOptions"
      />
    </div>
    <!-- <button id="getcsv">Alert CSV</button> -->
  </card>
</template>

<script>
export default {
  name: "rtnumberchart",
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value: 0,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,
      topic: "",
      chartOptions: {
        exporting: {
          enable: true,
          showTable: true,
          csv: {
            annotations:{
              itemDelimiter: "; ",
              join: false
            },
            dateFormat: "%Y-%m-%d"
          },
          buttons: {
            contextButton: {
                enabled: true
            },
          }
        },
        credits: {
          enabled: false
        },
        rangeSelector: {
          allButtonsEnabled: false,
          buttons: [
            {
              type: "minute",
              count: 5,
              text: "5M"
            },
            {
              type: "minute",
              count: 30,
              text: "30M"
            },
            {
              type: "all",
              text: "All"
            }
          ],
          inputEnabled: false,
          selected: 0
        },
        chart: {
          renderTo: "container",
          defaultSeriesType: "line",
          backgroundColor: "rgba(0,0,0,0)"
        },

        title: {
          text: ""
        },
        xAxis: {
          type: "datetime",
          labels: {
            style: {
              color: "#d4d2d2"
            }
          }
        },
        yAxis: {
          title: {
            text: ""
          },
          labels: {
            style: {
              color: "#d4d2d2",
              font: "11px Trebuchet MS, Verdana, sans-serif"
            }
          }
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
          }
        },
        series: [
          {
            name: "",
            data: [],
            color: "#e14eca"
          }
        ],
        legend: {
          itemStyle: {
            color: "#d4d2d2"
          }
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      }
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.value = 0;

          this.$nuxt.$off(this.topic + "/sdata");

          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData);

          this.chartOptions.series[0].data = [];

          this.getChartData();

          this.chartOptions.series[0].name =
            this.config.variableFullName + " " + this.config.unit;
          this.updateColorClass();
          window.dispatchEvent(new Event("resize"));
        }, 300);
      }
    }
  },
  mounted() {
    this.getNow();
    this.updateColorClass();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  methods: {
    updateColorClass() {
      console.log("update" + this.config.class);

      var c = this.config.class;

      if (c == "success") {
        this.chartOptions.series[0].color = "#00f2c3";
      }
      if (c == "primary") {
        this.chartOptions.series[0].color = "#e14eca";
      }
      if (c == "warning") {
        this.chartOptions.series[0].color = "#ff8d72";
      }
      if (c == "danger") {
        this.chartOptions.series[0].color = "#fd5d93";
      }

      this.chartOptions.series[0].name =
        this.config.variableFullName + " " + this.config.unit;
    },

    getChartData() {
      if (this.config.demo) {
        this.chartOptions.series[0].data = [
          [1673476920000, 36],
          [1673479980000, 41],
          [1673483040000, 38],
          [1673486100000, 40],
          [1673489160000, 41],
          [1673492220000, 38],
          [1673495280000, 35],
          [1673498340000, 41],
          [1673501400000, 38],
          [1673504460000, 39],
          [1673507520000, 40],
          [1673510580000, 37],
          [1673513640000, 35],
          [1673516700000, 39],
          [1673519760000, 39],
          [1673522820000, 39],
          [1673525880000, 41],
          [1673528940000, 35],
          [1673532000000, 39],
          [1673535060000, 35],
          [1673538120000, 41],
          [1673541180000, 35],
          [1673544240000, 39],
          [1673547300000, 35],
          [1673550360000, 41],
          [1673553420000, 39],
          [1673556480000, 35],
          [1673559540000, 38],
          [1673562600000, 37],
          [1673565660000, 36],
          [1673568720000, 41],
          [1673571780000, 41],
          [1673574840000, 41],
          [1673577900000, 36],
          [1673580960000, 39],
          [1673584020000, 39],
          [1673587080000, 40],
          [1673590140000, 40],
          [1673593200000, 41],
          [1673596260000, 37],
          [1673599320000, 39],
          [1673602380000, 35],
          [1673605440000, 40],
          [1673608500000, 40],
          [1673611560000, 36],
          [1673614620000, 36],
          [1673617680000, 41],
          [1673620740000, 35],
          [1673623800000, 40],
          [1673626860000, 38],
          [1673629920000, 41],
          [1673632980000, 38],
          [1673636040000, 37],
          [1673639100000, 40],
          [1673642160000, 40],
          [1673645220000, 37],
          [1673648280000, 36],
          [1673651340000, 35],
          [1673654400000, 41],
          [1673657460000, 39],
          [1673660520000, 39],
          [1673663580000, 36],
          [1673666640000, 39],
          [1673669700000, 35],
          [1673672760000, 36],
          [1673675820000, 39],
          [1673678880000, 36],
          [1673681940000, 37],
          [1673685000000, 41],
          [1673688060000, 37],
          [1673691120000, 35],
          [1673694180000, 36],
          [1673697240000, 39],
          [1673700300000, 37],
          [1673703360000, 35],
          [1673706420000, 38],
          [1673709480000, 37],
          [1673712540000, 40],
          [1673715600000, 37],
          [1673718660000, 35],
          [1673721720000, 37],
          [1673724780000, 38],
          [1673727840000, 37],
          [1673730900000, 35],
          [1673733960000, 41],
          [1673737020000, 40],
          [1673740080000, 36],
          [1673743140000, 41],
          [1673746200000, 40],
          [1673749260000, 35],
          [1673752320000, 35],
          [1673755380000, 38],
          [1673758440000, 39],
          [1673761500000, 37],
          [1673764560000, 41],
          [1673767620000, 39],
          [1673770680000, 36],
          [1673773740000, 38],
          [1673776800000, 36],
          [1673779860000, 36],
          [1673782920000, 40],
          [1673785980000, 40],
          [1673789040000, 40],
          [1673792100000, 36],
          [1673795160000, 36],
          [1673798220000, 38],
          [1673801280000, 38],
          [1673804340000, 38],
          [1673807400000, 36],
          [1673810460000, 35],
          [1673813520000, 35],
          [1673816580000, 40],
          [1673819640000, 41],
          [1673822700000, 40],
          [1673825760000, 39],
          [1673828820000, 38],
          [1673831880000, 39],
          [1673834940000, 37],
          [1673838000000, 37],
          [1673841060000, 38],
          [1673844120000, 40],
          [1673847180000, 41],
          [1673850240000, 36],
          [1673853300000, 36],
          [1673856360000, 38],
          [1673859420000, 41],
          [1673862480000, 39],
          [1673865540000, 37],
          [1673868600000, 38],
          [1673871660000, 35],
          [1673874720000, 37],
          [1673877780000, 37],
          [1673880840000, 38],
          [1673883900000, 39],
          [1673886960000, 35],
          [1673890020000, 38],
          [1673893080000, 40],
          [1673896140000, 41],
          [1673899200000, 39],
          [1673902260000, 37],
          [1673905320000, 38],
          [1673908380000, 38],
          [1673911440000, 36],
          [1673914500000, 38],
          [1673917560000, 37],
          [1673920620000, 35],
          [1673923680000, 37],
          [1673926740000, 39],
          [1673929800000, 37],
          [1673932860000, 41],
          [1673935920000, 38],
          [1673938980000, 35],
          [1673942040000, 37],
          [1673945100000, 40],
          [1673948160000, 41],
          [1673951220000, 36],
          [1673954280000, 41],
          [1673957340000, 36],
          [1673960400000, 38],
          [1673963460000, 41],
          [1673966520000, 38],
          [1673969580000, 41],
          [1673972640000, 39],
          [1673975700000, 37],
          [1673978760000, 35],
          [1673981820000, 35],
          [1673984880000, 35],
          [1673987940000, 40],
          [1673991000000, 35],
          [1673994060000, 37],
          [1673997120000, 41],
          [1674000180000, 40],
          [1674003240000, 37],
          [1674006300000, 37],
          [1674009360000, 38],
          [1674012420000, 39],
          [1674015480000, 39],
          [1674018540000, 39],
          [1674021600000, 38],
          [1674024660000, 37],
          [1674027720000, 39],
          [1674030780000, 41],
          [1674033840000, 36],
          [1674036900000, 40],
          [1674039960000, 39],
          [1674043020000, 40],
          [1674046080000, 37],
          [1674049140000, 37],
          [1674052200000, 39],
          [1674055260000, 37],
          [1674058320000, 39],
          [1674061380000, 38],
          [1674064440000, 36],
          [1674067500000, 41],
          [1674070560000, 41],
          [1674073620000, 40],
          [1674076680000, 39],
          [1674079740000, 35],
          [1674082800000, 38],
          [1674085860000, 36],
          [1674085908000, 41],
          [1674085956000, 37],
          [1674086004000, 35],
          [1674086052000, 39],
          [1674086100000, 36],
          [1674086148000, 38],
          [1674086196000, 39],
          [1674086244000, 40],
          [1674086292000, 38],
          [1674086340000, 37],
          [1674086388000, 40],
          [1674086436000, 39],
          [1674086484000, 35],
          [1674086532000, 35],
          [1674086580000, 38],
          [1674086628000, 36],
          [1674086676000, 35],
          [1674086724000, 38]
        ];
        this.isMounted = true;
        return;
      }

      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
          chartTimeAgo: this.config.chartTimeAgo
        }
      };

      this.$axios
        .get("/get-small-charts-data", axiosHeaders)
        .then(res => {
          this.chartOptions.series[0].data = [];
          const data = res.data.data;
          console.log("/get-small-charts-data: \n", res.data);

          data.forEach(element => {
            var aux = [];

            aux.push(
              element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
            );
            aux.push(element.value);

            this.chartOptions.series[0].data.push(aux);
          });

          this.isMounted = true;

          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },

    getIconColorClass() {
      if (this.config.class == "success") {
        return "text-success";
      }
      if (this.config.class == "primary") {
        return "text-primary";
      }
      if (this.config.class == "warning") {
        return "text-warning";
      }
      if (this.config.class == "danger") {
        return "text-danger";
      }
    },

    procesReceivedData(data) {
      try {
        this.time = Date.now();
        this.value = data.value;

        setTimeout(() => {
          if (data.save == 1) {
            this.getChartData();
          }
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },

    getNow() {
      this.nowTime = Date.now();
      setTimeout(() => {
        this.getNow();
      }, 1000);
    },

    getTimeAgo(seconds) {
      if (seconds < 0) {
        seconds = 0;
      }

      if (seconds < 59) {
        return seconds.toFixed() + " secs";
      }

      if (seconds > 59 && seconds <= 3600) {
        seconds = seconds / 60;
        return seconds.toFixed() + " min";
      }

      if (seconds > 3600 && seconds <= 86400) {
        seconds = seconds / 3600;
        return seconds.toFixed() + " hour";
      }

      if (seconds > 86400) {
        seconds = seconds / 86400;
        return seconds.toFixed() + " day";
      }
    }
  }
};
</script>
<style></style>
