<template>
  <div>


    <!-- SAVE BALSA FORM-->
    <div class="row" >
      <card>
        <div slot="header">
          <h4 class="card-title">Save Balsa</h4>
        </div>

        <div class="row">
          <base-input
            class="col-4"
            v-model="balsaName"
            label="Balsa Name"
            type="text"
          >
          </base-input>

          <base-input
            class="col-8"
            v-model="balsaDescription"
            label="Balsa Description"
            type="text"
          >
          </base-input>
        </div>

        <br /><br />

        <div class="row">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="success"
              class="mb-3 pull-right"
              size="lg"
              @click="saveBalsa()"
            >
              <!-- :disabled="widgets.length == 0" -->
              Save Balsa
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- BALSA TABLE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Balsas</h4>
        </div>

        <div class="row">
          <el-table :data="balsas">
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>

            <el-table-column prop="name" label="Name"></el-table-column>

            <el-table-column
              prop="description"
              label="Description"
            ></el-table-column>

            <el-table-column header-align="right" align="right" label="Actions">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >
                <el-tooltip
                  content="Delete"
                  effect="light"
                  :open-delay="300"
                  placement="top"
                >
                  <base-button
                    @click="deleteBalsa(row)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove "></i>
                  </base-button>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
        </div>
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
      widgets: [],
      balsas: [],
      balsaName: "",
      balsaDescription: "",
    };
  },

  mounted() {
    this.getBalsas();
  },

  methods: {
    //Get balsas
    async getBalsas() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/balsa", axiosHeaders);
        console.log(res.data);

        if (res.data.status == "success") {
          this.balsas = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting balsas..."
        });
        console.log(error);
        return;
      }
    },

    //Save balsa
    async saveBalsa() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      console.log(axiosHeaders);

      const toSend = {
        balsa: {
          name: this.balsaName,
          description: this.balsaDescription,
        }
      };

      try {
        const res = await this.$axios.post("/balsa", toSend, axiosHeaders);

        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Balsa created!"
          });
          this.getBalsas();

          // this.widgets = [];
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error creating balsa..."
        });
        console.log(error);
        return;
      }
    },

    //Delete balsa
    async deleteBalsa(balsa) {

      
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params:{
          balsaId:balsa._id
        }
      };

      console.log(axiosHeaders);

      try {

        const res = await this.$axios.delete("/balsa", axiosHeaders);

        console.log(res.data)

        if (res.data.status == "fail" && res.data.error == "balsa in use") {

          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: balsa.name + " is in use. First remove the devices linked to the balsa!"
          });
          
          return;
        }

        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: balsa.name + " was deleted!"
          });
          
          this.getBalsas();
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting balsas..."
        });
        console.log(error);
        return;
      }
    },

    //Add Widget
    addNewWidget() {
      if (this.widgetType == "numberchart") {
        this.ncConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
      }

      if (this.widgetType == "switch") {
        this.iotSwitchConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotSwitchConfig)));
      }

      if (this.widgetType == "button") {
        this.configButton.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.configButton)));
      }

      if (this.widgetType == "indicator") {
        this.iotIndicatorConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotIndicatorConfig)));
      }

    },

    //Delete Widget
    deleteWidget(index) {
      this.widgets.splice(index, 1);
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
    }
  }
};
</script>
