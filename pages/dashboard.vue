<template>
<div v-if="widgets.length>0">

  <div class="row" v-if="$store.state.balsas.length > 0">
      <div
        v-for="(device, index) in devicesByBalsa"
        :key="index"
        :class="[device.widgets[0].column]"
      >
        <Rtnumberchart
          v-if="device.widgets[0].widget == 'numberchart'"
          :config="fixWidget(device)"
        ></Rtnumberchart>
      </div>
  </div>
  <div v-else>
    Select a Balsa...
  </div>
</div>
  <card v-else>
      you need to create a device in this balsa
  </card>
</template>
<script>
export default {
  middleware: "authenticated",
  name: "Dashboard",

  data() {
    return {
      balsaIndex: null,
      balsa: {},
      devicesByBalsa: [],
      widgets: []
    };
  },

  mounted() {
    this.$nuxt.$on("selectedBalsaIndex", this.setBalsaIndex);
    this.initDashboard();
  },
  beforeDestroy() {
    this.$nuxt.$off("selectedBalsaIndex");
  },

  methods: {
    fixWidget(device) {
      const deviceCopy = JSON.parse(JSON.stringify(device));
      var widgetCopy = deviceCopy.widgets[0];
      widgetCopy.selectedDevice.dId =deviceCopy.dId;
      widgetCopy.selectedDevice.name = deviceCopy.name;
      widgetCopy.userId = deviceCopy.userId;

      if (device.widgets[0].widget == "numberchart") {
        widgetCopy.demo = false;
      }
      
      return widgetCopy;
    },
    setBalsaIndex(index) {
      this.balsaIndex = index;
      const { ...balsaCopy } = this.$store.state.balsas[index];
      const devicesCopy = JSON.parse(JSON.stringify(this.$store.state.devices));
      const id = balsaCopy._id;

      const widgets = devicesCopy.filter(device => device.balsaId == id);
      this.widgets = widgets;

      this.balsa = balsaCopy;
      this.devicesByBalsa = widgets;
    },
    initDashboard() {
      setTimeout(() => {
        if (this.$store.state.selectedBalsaIndex != null) {
          this.setBalsaIndex(this.$store.state.selectedBalsaIndex);
          // console.log("setBalsaIndex()",this.$store.state.balsas.length,"sel: ",this.$store.state.selectedBalsa)
        }
      }, 100);
    }
  }
};
</script>
