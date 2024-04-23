<template>
  <div id="sys_params">
    <main-head></main-head>

    <main-content>
      <div style="display: flex;margin:0 0 10px 0">
        <div>
          <el-button type="success" visible="false" @click="openAdd"
            >添加厂家或车型
          </el-button>
        </div>
      </div>
      <el-table v-loading="load" :data="list" stripe style="width: 100%">
        <el-table-column align="center" label="标识" prop="manufacturersType">
          <template slot="header" slot-scope="scope">
            <span class="demonstration"></span>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                标识<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><span @click="changeABType()">全部</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span
                    style="width:30px;display: inline-block;text-align: center"
                    @click="changeABType(1)"
                    >A</span
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><span
                    style="width:30px;display: inline-block;text-align: center"
                    @click="changeABType(2)"
                    >B</span
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.manufacturersType === 1 ? "A" : "B" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" prop="type">
          <template slot="header" slot-scope="scope">
            <span class="demonstration"></span>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                类型<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><span
                    style="width:30px;display: inline-block;text-align: center"
                    @click="changeType()"
                    >全部</span
                  >
                </el-dropdown-item>
                <el-dropdown-item
                  ><span
                    style="width:30px;display: inline-block;text-align: center"
                    @click="changeType(1)"
                    >厂家</span
                  >
                </el-dropdown-item>
                <el-dropdown-item
                  ><span
                    style="width:30px;display: inline-block;text-align: center"
                    @click="changeType(2)"
                    >车型</span
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <!--            slot="header"-->
            <span>{{ scope.row.type === 1 ? "厂家" : "车型" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="名称"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="十六进制编码"
          prop="value"
        ></el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-button
              plain
              size="small"
              type="primary"
              @click="openEdit(scope.row)"
              >修改
            </el-button>
            <el-button
              plain
              size="small"
              type="danger"
              @click="remove(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="params.pageNo"
        :layout="
          $store.state.isPhone
            ? 'total, prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        "
        :page-size.sync="params.pageSize"
        :small="$store.state.isPhone"
        :total="total"
        background
        class="page"
        @size-change="search"
        @current-change="getList"
      >
      </el-pagination>

      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="addVisible"
        title="添加厂家或车型"
        width="500px"
        @close="addClose"
      >
        <div
          style="display:flex;justify-content: center;align-items: center;flex-direction: column"
        >
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="标识:">
              <el-radio v-model="form.radio" :label="1">A</el-radio>
              <el-radio v-model="form.radio" :label="2">B</el-radio>
            </el-form-item>
            <el-form-item label="设备号长度:" label-width="100px">
              <div>
                <el-input
                  v-model="form.devLength"
                  placeholder="请输入设备号长度"
                ></el-input>
              </div>
            </el-form-item>
            <span style="color: #00a2e9;font-size: 20px">厂家:</span>
            <el-form-item label="名称:" label-width="100px">
              <div>
                <el-input
                  v-model="form.maName"
                  placeholder="请输入名称"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="hex:" label-width="100px">
              <div>
                <el-input
                  v-model="form.maValue"
                  placeholder="请输入编码"
                ></el-input>
              </div>
            </el-form-item>

            <span style="color: #00a2e9;font-size: 20px">车型:</span>
            <el-form-item label="名称:" label-width="100px">
              <div>
                <el-input
                  v-model="form.moName"
                  placeholder="请输入名称"
                ></el-input>
              </div>
            </el-form-item>

            <el-form-item label="hex:" label-width="100px">
              <div>
                <el-input
                  v-model="form.moValue"
                  placeholder="请输入编码"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="saveSub">提 交</el-button>
        </div>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        title="编辑"
        width="500px"
        @close="editClose"
      >
        <div
          style="display:flex;justify-content: center;align-items: center;flex-direction: column"
        >
          <el-form ref="editForm" :model="editForm" label-width="80px">
            <el-form-item label="标识:">
              <el-radio
                v-model="editForm.manufacturersType"
                :label="1"
                @input="change"
                >A
              </el-radio>
              <el-radio
                v-model="editForm.manufacturersType"
                :label="2"
                @input="change"
                >B
              </el-radio>
            </el-form-item>
            <el-form-item label="类型:">
              <el-radio v-model="editForm.type" :label="1" @input="change"
                >厂家
              </el-radio>
              <el-radio v-model="editForm.type" :label="2" @input="change"
                >车型
              </el-radio>
            </el-form-item>
            <el-form-item label="设备号长度:" label-width="100px">
              <div>
                <el-input
                  v-model="editForm.devLength"
                  placeholder="请输入设备号长度"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="名称:" label-width="100px">
              <div>
                <el-input
                  v-model="editForm.name"
                  placeholder="请输入名称"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="hex:" label-width="100px">
              <div>
                <el-input
                  v-model="editForm.value"
                  placeholder="请输入编码"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="editSub">提 交</el-button>
        </div>
      </el-dialog>
    </main-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addVisible: false,
      editVisible: false,
      load: false,
      list: [],
      params: {
        pageSize: 10,
        pageNo: 1,
        isCount: true,
        type: "", // A厂家 B车型
        manufacturersType: ""
      },
      form: {
        radio: 1,
        maValue: "",
        maName: "",
        moValue: "",
        moName: "",
        devLength: ""
      },
      editForm: {
        id: "",
        name: "",
        value: "",
        type: "",
        manufacturersType: "",
        radio: 1,
        devLength: ""
      },
      total: 0
    };
  },

  watch: {},

  mounted() {
    this.search();
  },

  methods: {
    changeABType(type) {
      this.params.manufacturersType = type;
      this.getList();
    },
    changeType(type) {
      this.params.type = type;
      this.getList();
    },
    change(e) {
      console.log("e", e);
      // this.editForm.manufacturersType=e
      // this.$forceUpdate()
    },
    openAdd() {
      this.addVisible = true;
      this.addClose();
    },
    openEdit(row) {
      this.editForm = row;
      this.editVisible = true;
      console.log("editForm:", this.editForm);
    },
    remove(id) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            // url: 'system/sysManufacturerModels/batchAddMaOrMo',
            url: "system/sysManufacturerModels/remove",
            params: { id },
            success: () => {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    addClose() {
      this.form = {
        radio: 1,
        maValue: "",
        maName: "",
        moValue: "",
        moName: "",
        devLength: ""
      };
    },
    editClose() {
      this.editForm = {
        id: "",
        name: "",
        value: "",
        type: "",
        manufacturersType: "",
        devLength: ""
      };
    },
    search() {
      this.getList();
    },
    getList() {
      this.load = true;
      this.$request.post({
        url: "system/sysManufacturerModels/manufacturerModelsList",
        params: this.params,
        success: result => {
          this.list = result.list;
          this.total = result.total;
        },
        finally: () => {
          this.load = false;
        }
      });
    },
    editClear() {},
    editSub() {
      console.log("editFrom:", this.editForm);
      if (this.editForm.name === "" || this.editForm.value === "") {
        this.$message.warning("请完整填写信息");
        return;
      }
      var params = this.editForm;
      this.$request.post({
        url: "system/sysManufacturerModels/editMaOrMo",
        params: this.editForm,
        success: () => {
          this.$message.success("操作成功");
          this.getList();
          this.editVisible = false;
          this.editClose();
        },
        finally: () => {
          this.editVisible = false;
        }
      });
    },

    saveSub() {
      if (
        this.form.moName === "" ||
        this.form.moValue === "" ||
        this.form.maName === "" ||
        this.form.maValue === "" ||
        this.form.devLength === ""
      ) {
        this.$message.warning("请完整填写车型和厂家信息");
        return;
      }
      let form = [];
      let ma = {
        name: this.form.maName,
        value: this.form.maValue,
        manufacturersType: this.form.radio,
        type: 1,
        devLength: Number(this.form.devLength)
      };
      let mo = {
        name: this.form.moName,
        value: this.form.moValue,
        manufacturersType: this.form.radio,
        type: 2,
        devLength: Number(this.form.devLength)
      };
      form.push(ma, mo);
      let params = JSON.stringify(form);
      this.$request.post({
        url: "system/sysManufacturerModels/batchAddMaOrMo",
        params: { params },
        success: () => {
          this.$message.success("操作成功");
          this.getList();
          this.addVisible = false;
        },
        finally: () => {
          this.addVisible = false;
        }
      });
    }
  }
};
</script>

<style></style>

<style scoped></style>
