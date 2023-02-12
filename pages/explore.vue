<template>
  <div>
    <!-- VARIABLES TABLE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Variables</h4>
        </div>
        <el-table :data="$store.state.devices">
          <el-table-column label="#" min-width="50" align="center">
            <div slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>
          </el-table-column>

          <el-table-column prop="name" label="Nombre"></el-table-column>

          <el-table-column prop="dId" label="Id Dispositivo"></el-table-column>

          <el-table-column prop="balsaName" label="Balsa"></el-table-column>

          <!-- <el-table-column prop="init" label="Inicio">
            
          </el-table-column>

          <el-table-column prop="end" label="Fin">
            
          </el-table-column> -->

          <el-table-column label="Exportar">
            <div slot-scope="{ row, $index }">
              <el-tooltip>
                <base-input>
                  <el-date-picker
                    type="datetime"
                    placeholder="Inicio"
                    @change="updateEndDate(row)"
                  >
                  </el-date-picker>
                </base-input>
              </el-tooltip>
              <el-tooltip>
                <base-input>
                  <el-date-picker
                  v-model="initDatePicker"
                    type="datetime"
                    placeholder="Fin"
                    @change="updateEndDate(row)"
                  >
                  </el-date-picker>
                </base-input>
              </el-tooltip>
              <el-tooltip
                content="Delete"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  type="danger"
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
import { DatePicker, TimeSelect } from "element-ui";
import BaseInput from "../components/Inputs/BaseInput.vue";

export default {
  middleware: "authenticated",
  components: {
    BaseInput,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    [DatePicker.name]: DatePicker,
    [TimeSelect.name]: TimeSelect
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
        widgets: []
      },
      ncConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        initDatePicker: "",
        endDatePicker: "",
        variableFullName: "temperature",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "30",
        unit: "Watts",
        class: "success",
        column: "col-4",
        decimalPlaces: 2,
        widget: "numberchart",
        chartTimeAgo: 60,
        demo: true
      }
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
      this.newDevice.balsaId = this.balsas[this.selectedIndexBalsa]._id;
      this.newDevice.balsaName = this.balsas[this.selectedIndexBalsa].name;
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
    updateEndDate(row) {
      console.log("updateEndDate(row)");
      console.log(this.endDatePicker);
      console.log(row);
    }
  }
};
</script>
