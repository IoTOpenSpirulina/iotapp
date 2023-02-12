<template>
  <div>
    <!-- NEW ALARM FORM -->
    <div class="row">
      <div class="col-sm-12">
        <card v-if="$store.state.devices.length > 0">
          <div slot="header">
            <h4 class="card-title">
              Create new Alarm Rule {{ selectedWidgetIndex }}
            </h4>
          </div>

          <div class="row">
            <div class="col-3">
              <label style="margin-top: 2px;">Device</label>
              <el-select
                required
                class="select-success"
                placeholder="Device -> Variable"
                v-model="selectedWidgetIndex"
              >
                <el-option
                  v-for="(device, index) in devices"
                  :key="index"
                  class="text-dark"
                  :value="index"
                  :label="
                    device.name + '->' + device.widgets[0].variableFullName
                  "
                ></el-option>
              </el-select>
            </div>

            <div class="col-3">
              <label style="margin-top: 2px;">Condition</label>
              <el-select
                required
                class="select-warning"
                placeholder="Condition"
                v-model="newRule.condition"
              >
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="!=" label="!="></el-option>
              </el-select>
            </div>

            <div class="col-3">
              <base-input
                label="Value"
                v-model="newRule.value"
                type="number"
              ></base-input>
            </div>

            <div class="col-3">
              <base-input
                label="Trigger Time [min]"
                v-model="newRule.triggerTime"
                type="number"
              ></base-input>
            </div>
            <div class="col-3">
              <label style="margin-top: 10px;">Sender Method</label>
              <el-select
                v-model="newRule.sender.type"
                class="select-success"
                placeholder="Select Sender"
                style="width: 100%;"
              >
                <el-option class="text-dark" value="senderemail" label="Email">
                </el-option>
                <!-- <el-option
                  class="text-dark"
                  value="sendertelegram"
                  label="Telegram"
                ></el-option> -->
              </el-select>
            </div>
            <div v-if="newRule.sender.type == 'senderemail'" class="col-3">
              <base-input
                label="Email"
                type="text"
                placeholder="example.notif@email.com"
                style="margin-top:10px;"
                v-model="newRule.sender.description"
              >
              </base-input>
            </div>
            <div v-if="newRule.sender.type == 'sendertelegram'" class="col-3">
              <base-input
                label="Telegram number"
                type="text"
                placeholder="+5012345678"
                style="margin-top:10px;"
                v-model="newRule.sender.description"
              >
              </base-input>
            </div>
          </div>

          <br /><br />

          <div class="row pull-right">
            <div class="col-12">
              <base-button
                @click="createNewRule()"
                native-type="submit"
                type="primary"
                class="mb-3"
                size="lg"
                :disabled="$store.state.devices.length == 0"
              >
                Add Alarm Rule
              </base-button>
            </div>
          </div>
        </card>
        <card v-else>
          You need to select a device to create an Alarm
        </card>
      </div>
    </div>

    <!-- ALARMS TABLE -->
    <div class="row" v-if="$store.state.devices.length > 0">
      <div class="col-sm-12">
        <card>
          <div slot="header">
            <h4 class="card-title">Alarm Rules</h4>
          </div>

          <el-table v-if="alarmRules.length > 0" :data="alarmRules">
            <el-table-column min-width="25" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>

            <el-table-column
              prop="variableFullName"
              label="Var Name"
              align="center"
            ></el-table-column>

            <!-- <el-table-column
              prop="variable"
              label="Var"
              align="center"
            ></el-table-column> -->

            <el-table-column
              prop="sender.description"
              label="Sender"
              align="center"
            ></el-table-column>

            <el-table-column
              prop="condition"
              label="Condition"
              align="center"
            ></el-table-column>

            <el-table-column
              prop="value"
              label="Value"
              align="center"
              min-width="35"
            ></el-table-column>

            <el-table-column
              prop="triggerTime"
              label="Trigger Time [min]"
              align="center"
            ></el-table-column>

            <el-table-column
              prop="counter"
              label="Matches"
              align="center"
            ></el-table-column>

            <el-table-column min-width="110" label="Actions" align="center">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >
                <el-tooltip content="Delete" effect="light" placement="top">
                  <base-button
                    @click="deleteDevice(row)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove "></i>
                  </base-button>
                </el-tooltip>

                <el-tooltip
                  content="Rule Status"
                  style="margin-left: 20px;"
                ></el-tooltip>

                <!-- no ato row.status al v model porque al cambiar de status cambiaria directo sobre store lo que daría error en 
                      cambio uso el value, al accionar el switch no cambiará el objeto, pero podré cambiar el valor en la función -->
                <el-tooltip
                  content="Change Rule Status"
                  style="margin-left: 5px;"
                >
                  <base-switch
                    @click="updateStatusRule(row)"
                    :value="row.status"
                    type="primary"
                    on-text="ON"
                    off-text="OFF"
                    style="margin-top: 10px;"
                  ></base-switch>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>

          <h4 v-else class="card-title">No Alarm Rules</h4>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { Table, TableColumn } from "element-ui";
import JsonVue from "../components/Json.vue";

export default {
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      alarmRules: [],
      devices: [],
      selectedDevice: null,
      selectedWidgetIndex: null,
      newRule: {
        dId: null,
        deviceName: null,
        status: true,
        variableFullName: null,
        variable: null,
        value: null,
        condition: null,
        triggerTime: null,
        sender: {
          type: null,
          description: null
        }
      }
    };
  },
  mounted() {
    this.initDevices();
    this.getAlarmsRules();
  },
  methods: {
    initDevices() {
      setTimeout(() => {
        const devicesCopy = JSON.parse(
          JSON.stringify(this.$store.state.devices)
        );
        this.devices = devicesCopy;
      }, 100);
    },
    deleteDevice(rule) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          emqxRuleId: rule.emqxRuleId
        }
      };

      this.$axios
        .delete("/alarm-rule", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Alarm Rule was deleted"
            });
            this.$store.dispatch("getDevices");
            this.initDevices();
            this.getAlarmsRules();
            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    },

    updateStatusRule(rule) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      var ruleCopy = JSON.parse(JSON.stringify(rule));

      ruleCopy.status = !ruleCopy.status;

      const toSend = { rule: ruleCopy };

      this.$axios
        .put("/alarm-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Alarm Rule was updated"
            });

            this.$store.dispatch("getDevices");
            this.initDevices();
            this.getAlarmsRules();

            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    },

    createNewRule() {
      if (this.selectedWidgetIndex == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Variable must be selected"
        });
        return;
      }

      if (this.newRule.condition == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Condition must be selected"
        });
        return;
      }

      if (this.newRule.value == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Value is empty"
        });
        return;
      }

      if (this.newRule.triggerTime == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Trigger Time is empty"
        });
        return;
      }

      if (this.newRule.sender.type == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Sender type is empty"
        });
        return;
      }
      if (this.newRule.sender.description == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Sender description is empty"
        });
        return;
      }

      this.newRule.dId = this.devices[this.selectedWidgetIndex].dId;
      this.newRule.deviceName = this.devices[this.selectedWidgetIndex].name;
      this.newRule.variableFullName = this.devices[
        this.selectedWidgetIndex
      ].widgets[0].variableFullName;
      this.newRule.variable = this.devices[
        this.selectedWidgetIndex
      ].widgets[0].variable;

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      var toSend = {
        newRule: this.newRule
      };

      this.$axios
        .post("/alarm-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.newRule.variable = null;
            this.newRule.condition = null;
            this.newRule.value = null;
            this.newRule.triggerTime = null;
            this.newRule.sender.type = null;
            this.newRule.sender.description = null;
            this.selectedWidgetIndex = null;

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Alarm Rule was added"
            });

            this.$store.dispatch("getDevices");
            this.initDevices();
            this.getAlarmsRules();
            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    },
    getAlarmsRules() {
      const axiosHeader = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      this.$axios
        .get("/alarm-rule", axiosHeader)
        .then(res => {
          this.alarmRules = JSON.parse(JSON.stringify(res.data.data));
          console.log("LARMASALARMAS--------------", res.data.data);
        })
        .catch(error => {
          console.log("POR AQUI", error);
        });
    }
  }
};
</script>
