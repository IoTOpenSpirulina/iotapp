<template>
  <div>
    <!-- FORM ADD DEVICE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Add new Device</h4>
        </div>

        <div class="row">
          <div class="col-3">
            <base-input
              label="Device Name"
              type="text"
              placeholder="Ex: Home, Office..."
              v-model="newDevice.name"
            >
            </base-input>
          </div>

          <div class="col-3">
            <base-input
              label="Device Id"
              type="text"
              placeholder="Ex: 7777-8888"
              v-model="newDevice.dId"
            >
            </base-input>
          </div>
          
           <!-- WIDGET SELECTOR AND FORMS -->
          <div class="col-3">
            <label>Widgets Selector</label>
            <el-select
              v-model="widgetType"
              class="select-success"
              placeholder="Select Widget"
              style="width: 100%;"
              
            >
              <el-option
                class="text-dark"
                value="numberchart"
                label="Number Chart"
              >
              </el-option>
              </el-select>
          </div>

          <div class="col-3">
            <slot name="label">
              <label> Balsa </label>
            </slot>

            <el-select
              v-model="selectedIndexBalsa"
              placeholder="Select Balsa"
              class="select-success"
              style="width:100%"
            >
              <el-option
                v-for="(balsa, index) in balsas"
                :key="balsa._id"
                class="text-dark"
                :value="index"
                :label="balsa.name"
              ></el-option>
            </el-select>
          </div>
        </div>
      </card>
    </div>

    <!-- WIDGET CONFIGURATOR -->
    <div v-if="widgetType != null" class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Widget Config</h4>
        </div>

        <div class="row">
          <!-- WIDGET SELECTOR AND FORMS -->
          <div class="col-6">
           <!-- FORMS NUMBER CHART TYPE -->
            <div v-if="widgetType == 'numberchart'">
              <base-input
                v-model="ncConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input v-model="ncConfig.unit" label="Unit" type="text">
              </base-input>

              <base-input
                v-model.number="ncConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <br />

              <base-input
                v-model.number="ncConfig.variableSendFreq"
                label="Send Freq"
                type="number"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.chartTimeAgo"
                label="Chart Back Time (mins)"
                type="number"
              ></base-input>

              <br />

              <el-select
                v-model="ncConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />
            </div>
          </div>

          <!-- WIDGET PREVIEW -->
          <div class="col-6">
            <Rtnumberchart
              v-if="widgetType == 'numberchart'"
              :config="ncConfig"
            ></Rtnumberchart>
          </div>
        </div>

        <!-- ADD WIDGET BUTTON -->
        <div class="row pull-right">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="success"
              class="mb-3"
              size="lg"
              @click="createNewDevice()"
            >
              Add Device
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- DEVICES TABLE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Devices</h4>
        </div>
        <el-table :data="$store.state.devices">
          <el-table-column label="#" min-width="50" align="center">
            <div slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>

          </el-table-column>

          <el-table-column prop="name" label="Name"></el-table-column>

          <el-table-column prop="dId" label="Device Id"></el-table-column>

          <el-table-column prop="password" label="Password"></el-table-column>

          <el-table-column
            prop="balsaName"
            label="Balsa"
          ></el-table-column>

          <el-table-column label="Actions">
            <div slot-scope="{ row,$index }">
              <el-tooltip
                content="Saver Status Indicator"
                style="margin-right:10px"
              >
              </el-tooltip>
              
              <el-tooltip content="Database Saver">
                <base-switch
                  @click="updateSaverRuleStatus(row.saverRule)"
                  :value="row.saverRule.status"
                  type="primary"
                  on-text="On"
                  off-text="Off"
                ></base-switch>
              </el-tooltip>

              <el-tooltip
                content="Delete"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  type="danger"
                  icon
                  size="sm"
                  class="btn-link"
                  @click="deleteDevice(row)"
                >
                  <i class="tim-icons icon-simple-remove "></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      widgetType: null,
      balsas: [],
      selectedIndexBalsa: null,
      newDevice: {
        name: "",
        dId: "",
        balsaId: "",
        balsaName: "",
        widgets:[],
      },
       ncConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "30",
        unit: "Watts",
        class: "success",
        column: "col-4",
        decimalPlaces: 2,
        widget: "numberchart",
        // icon: "fa-sun",
        chartTimeAgo: 60,
        demo: true
      },
    };
  },
  mounted() {
    this.getBalsas();
  },
  methods: {
    updateSaverRuleStatus(rule) {
      
      var ruleCopy = JSON.parse(JSON.stringify(rule));

      ruleCopy.status = !ruleCopy.status;

      const toSend = { 
        rule: ruleCopy 
      };

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      this.$axios
        .put("/saver-rule", toSend, axiosHeaders)
        .then(res => {


          if (res.data.status == "success") {

            this.$store.dispatch("getDevices");

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: " Device Saver Status Updated"
            });

          }

          return;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error updating saver rule status"
          });
          return;
        });
    },
    deleteDevice(device) {
      const axiosHeader = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          dId: device.dId
        }
      };

      this.$axios
        .delete("/device", axiosHeader)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: device.name + " deleted!"
            });
            this.$store.dispatch("getDevices");
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error deleting " + device.name
          });
        });
    },

    // deleteDevice(device) {
    //   const axiosHeaders = {
    //     headers: {
    //       token: this.$store.state.auth.token
    //     },
    //     params: {
    //       dId: device.dId
    //     }
    //   };

    //   this.$axios
    //     .delete("/device", axiosHeaders)
    //     .then(res => {
    //       if (res.data.status == "success") {
    //         this.$notify({
    //           type: "success",
    //           icon: "tim-icons icon-check-2",
    //           message: device.name + " deleted!"
    //         });
    //       }

    //       $nuxt.$emit("time-to-get-devices");

    //       return;
    //     })
    //     .catch(e => {
    //       console.log(e);
    //       this.$notify({
    //         type: "danger",
    //         icon: "tim-icons icon-alert-circle-exc",
    //         message: " Error deleting " + device.name
    //       });
    //       return;
    //     });
    // },
    //new device
    createNewDevice() {
      if (this.newDevice.name == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device Name is Empty :("
        });
        return;
      }

      if (this.newDevice.dId == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device ID is Empty :("
        });
        return;
      }
      if (this.widgetType == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Widget must be selected"
        });
        return;
      }

      if (this.selectedIndexBalsa == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Balsa must be selected"
        });
        return;
      }

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      //ESCRIBIMOS EL NOMBRE Y EL ID DEL BALSA SELECCIONADO EN EL OBJETO newDevice
      this.newDevice.balsaId = this.balsas[
        this.selectedIndexBalsa
      ]._id;
      this.newDevice.balsaName = this.balsas[
        this.selectedIndexBalsa
      ].name;
      this.ncConfig.selectedDevice.name = this.newDevice.name;
      this.ncConfig.selectedDevice.dId = this.newDevice.dId;
      this.ncConfig.variable = this.makeid(10);
      this.newDevice.widgets[0] = this.ncConfig; 

      const toSend = {
        newDevice: this.newDevice
      };

      this.$axios
        .post("/device", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getDevices");

            this.newDevice.name = "";
            this.newDevice.dId = "";
            this.selectedIndexBalsa = null;

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Device was added"
            });

            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.dId.kind == "unique"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "The device is already registered in the system. Try another device"
            });
            return;
          } else {
            this.showNotify("danger", "Error");
            return;
          }
        });
    },

    //Get balsas
    async getBalsas() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/balsa", axiosHeaders);
        // console.log(res.data);

        if (res.data.status == "success") {
          this.balsas = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting balsas..."
        });
        // console.log(error);
        return;
      }
    },
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
  }
};
</script>
