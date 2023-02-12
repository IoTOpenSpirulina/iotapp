export const state = () => ({
  auth: null,
  devices: [],
  selectedDevice: {},
  notifications: [],
  balsas: [],
  selectedBalsa: {},
  selectedBalsaIndex: null,
  widgets:[],
});

export const mutations = {
  setAuth(state, auth) {
    state.auth = auth;
  },

  setNotifications(state, notifications) {
    state.notifications = notifications;
  },

  setDevices(state, devices) {
    state.devices = devices;
  },

  setSelectedDevice(state, device) {
    state.selectedDevice = device;
  },

  setBalsas(state, balsas) {
    state.balsas = balsas;
  },

  setSelectedBalsa(state, balsa) {
    state.selectedBalsa = balsa;
  },

  setSelectedBalsaIndex(state,index){
    state.selectedBalsaIndex = index;
  },

  setWidgetsToShow(state, widgets) {
    state.widgets = widgets;
  },
};

export const actions = {
  readToken() {
    let auth = null;
    try {
      auth = JSON.parse(localStorage.getItem("auth"));
    } catch (error) {
      console.log(err);
    }
    //saving auth in state
    this.commit("setAuth", auth);
  },

  async getDevices() {
    const axiosHeader = {
      headers: {
        token: this.state.auth.token
      }
    };

    try {
      const res = await this.$axios.get("/device", axiosHeader);
      console.log(res.data.data);

        res.data.data.forEach((device, index) => {
          if (device.selected) {
            this.commit("setSelectedDevice", device);
            $nuxt.$emit("selectedDeviceIndex", index);
          }
        });

        //if all devices were removed
        if (res.data.data.length == 0) {
          this.commit("setSelectedDevice", {});
          $nuxt.$emit("selectedDeviceIndex", null);
        }

        this.commit("setDevices", res.data.data);
        // console.log("setDevices:  ", res.data.data);
    } catch (error) {
      console.log(error);
    }
  },

  getNotifications() {
    const axiosHeader = {
      headers: {
        token: this.state.auth.token
      }
    };

    this.$axios
      .get("/notifications", axiosHeader)
      .then(res => {
        console.log(res.data.data);
        this.commit("setNotifications", res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  },

  async getBalsas() {
    const axiosHeader = {
      headers: {
        token: this.state.auth.token
      }
    };

    try {
      const res = await this.$axios.get("/balsa", axiosHeader);
      res.data.data.forEach((balsa, index) => {
        if (balsa.selected) {
          // console.log("setSelectedBalsa", balsa);
          this.commit("setSelectedBalsa", balsa);
          this.commit("setSelectedBalsaIndex", index);
          $nuxt.$emit("selectedBalsaIndex", index);
        }
      });

      //if all balsas were removed
      if (res.data.data.length == 0) {
        this.commit("setSelectedBalsa", {});
        this.commit("setSelectedBalsaIndex", null);
        $nuxt.$emit("selectedBalsaIndex", null);
      }
      // console.log("---------------------",res.data.data )
      this.commit("setBalsas", res.data.data);
    } catch (error) {
      console.log(error);
    }
  },

};
