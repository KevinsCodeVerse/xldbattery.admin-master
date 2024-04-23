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
        <el-table-column align="center" label="设备号长度" prop="devLength">
        </el-table-column>
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
              @click="openAdd(scope.row)"
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
        :title="form.id ? '修改' : '添加厂家或车型'"
        width="500px"
        @close="addClose"
      >
        <div
          style="display:flex;justify-content: center;align-items: center;flex-direction: column"
        >
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="标识:">
              <el-radio v-model="form.manufacturersType" :label="1">A</el-radio>
              <el-radio v-model="form.manufacturersType" :label="2">B</el-radio>
            </el-form-item>
            <el-form-item label="类型:">
              <el-radio v-model="form.type" :label="1">厂家</el-radio>
              <el-radio v-model="form.type" :label="2">车型</el-radio>
            </el-form-item>
            <el-form-item label="设备号长度:" label-width="100px">
              <div>
                <el-input
                  v-model="form.devLength"
                  placeholder="请输入设备号长度"
                ></el-input>
              </div>
            </el-form-item>
            <div>
              <el-form-item label="名称:" label-width="100px">
                <div>
                  <el-input
                    v-model="form.name"
                    placeholder="请输入名称"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item label="hex:" label-width="100px">
                <div>
                  <el-input
                    v-model="form.value"
                    placeholder="请输入编码"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </el-form>
          <el-button type="primary" @click="saveSub">提 交</el-button>
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
        manufacturersType: 1,
        value: "",
        name: "",
        devLength: 0,
        type: 1
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
    openAdd(row) {
      console.log("row", row);
      if (row.id) {
        this.form = {};
        this.form = {
          id: row.id,
          devLength: row.devLength,
          manufacturersType: row.manufacturersType,
          name: row.name,
          value: row.value,
          type: row.type
        };
      } else {
        this.addClose();
      }
      this.addVisible = true;
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
        manufacturersType: 1,
        value: "",
        name: "",
        type: 1,
        devLength: 0,
        id: ""
      };
      console.log("addClose", this.form);
      this.addVisible = false;
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

    saveSub() {
      if (
        this.form.name === "" ||
        this.form.value === "" ||
        this.form.devLength === "" ||
        this.form.type === ""
      ) {
        this.$message.warning("请完整填写车型和厂家信息");
        return;
      }

      if (this.form.id) {
        this.$request.post({
          url: "system/sysManufacturerModels/editMaOrMo",
          params: this.form,
          success: () => {
            this.$message.success("操作成功");
            this.getList();
            this.addVisible = false;
            this.addClose();
          },
          finally: () => {
            this.addVisible = false;
            this.addClose();
          }
        });
      } else {
        let params = JSON.stringify(this.form);
        this.$request.post({
          url: "system/sysManufacturerModels/batchAddMaOrMo",
          params: { params },
          success: () => {
            this.$message.success("操作成功");
            this.getList();
            this.addVisible = false;
            this.addClose();
          },
          finally: () => {
            this.addVisible = false;
            this.addClose();
          }
        });
      }
    }
  }
};
</script>

<style></style>

<style scoped></style>
