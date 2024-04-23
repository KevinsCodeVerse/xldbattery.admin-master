<template>
  <div id="sys_params">
    <main-head></main-head>
    <!--  整车通信状态-->
    <main-content>
      <div style="display: flex;margin:0 0 10px 0">
        <div>
          <el-button @click="openAdd" visible="false" type="success"
            >添加
          </el-button>
        </div>
      </div>
      <el-table :data="list" stripe style="width: 100%" v-loading="load">
        <el-table-column
          prop="name"
          label="名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="value"
          label="十六进制编码"
          align="center"
        ></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="small"
              @click="openEdit(scope.row)"
              >修改
            </el-button>
            <el-button
              type="danger"
              plain
              size="small"
              @click="remove(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page"
        background
        :small="$store.state.isPhone"
        :layout="
          $store.state.isPhone
            ? 'total, prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        "
        :current-page.sync="params.pageNo"
        :page-size.sync="params.pageSize"
        :total="total"
        @size-change="search"
        @current-change="getList"
      >
      </el-pagination>

      <el-dialog
        :close-on-click-modal="false"
        title="添加整车通信状态"
        :visible.sync="addVisible"
        @close="addClose"
        width="500px"
      >
        <div
          style="display:flex;justify-content: center;align-items: center;flex-direction: column"
        >
          <el-form ref="form" :model="form">
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
          </el-form>
          <el-button @click="saveSub" type="primary">提 交</el-button>
        </div>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog
        :close-on-click-modal="false"
        title="编辑"
        :visible.sync="editVisible"
        @close="editClose"
        width="500px"
      >
        <div
          style="display:flex;justify-content: center;align-items: center;flex-direction: column"
        >
          <el-form ref="editForm" :model="editForm" label-width="80px">
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
          <el-button @click="editSub" type="primary">提 交</el-button>
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
        isCount: true
      },
      form: {
        name: "",
        value: ""
      },
      editForm: {
        id: "",
        name: "",
        value: ""
      },
      total: 0
    };
  },

  watch: {},

  mounted() {
    this.search();
  },

  methods: {
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
            url: "/system/sysVehicleComm/remove",
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
        name: "",
        value: ""
      };
    },
    editClose() {
      this.editForm = {
        id: "",
        name: "",
        value: ""
      };
    },
    search() {
      this.getList();
    },
    getList() {
      this.load = true;
      this.$request.post({
        url: "/system/sysVehicleComm/list",
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
      this.$request.post({
        url: "/system/sysVehicleComm/edit",
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
      if (this.form.name === "" || this.form.value === "") {
        this.$message.warning("请完整填写整车通信状态信息");
        return;
      }
      this.$request.post({
        url: "/system/sysVehicleComm/add",
        params: this.form,
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
