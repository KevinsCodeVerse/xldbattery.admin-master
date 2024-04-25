<template>
  <div id="sys_params">
    <main-head></main-head>

    <main-content>
      <el-table :data="list" stripe style="width: 100%" v-loading="load">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column
          prop="name"
          label="参数名"
          align="center"
        ></el-table-column>
        <el-table-column prop="value" label="参数值" align="center">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.id == 6"
              style="width: 100px; height: 100px"
              :src="scope.row.value"
              :preview-src-list="[scope.row.value]"
            >
            </el-image>
            <span v-else-if="scope.row.id == 4 || scope.row.id == 5">--</span>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
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
              @click="update(scope.row)"
              >修改
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
        title="上传图片"
        :visible.sync="logoVisible"
        @close="logoClear"
        width="500px"
      >
        <el-form ref="form" label-width="90px" :model="logoData">
          <el-form-item label="图片">
            <el-upload
              class="qqImg"
              action="#"
              accept="image/*"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleChange"
            >
              <img v-if="logoData.logo" :src="logoData.logo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="logoVisible = false">取 消</el-button>
          <el-button type="primary" @click="logoConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :close-on-click-modal="false"
        title="编辑"
        :visible.sync="editVisible"
        @close="editClear"
        width="800px"
      >
        <el-form ref="form" label-width="90px" :model="editData">
          <el-form-item label="内容:" prop="content">
            <WangEditor
              :isClear="true"
              :value.sync="editData.value"
              uploadImgServer="common/public/upload/image"
              ref="wangEditor"
            ></WangEditor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </main-content>
  </div>
</template>

<script>
import WangEditor from "@/components/utils/CustomWangEditor";

export default {
  components: {
    WangEditor
  },
  data() {
    return {
      list: [],
      load: false,
      params: {
        pageSize: 10,
        pageNo: 1,
        isCount: true
      },
      total: 0,
      logoData: {
        id: "",
        logo: ""
      },
      editData: {
        id: "",
        value: ""
      },
      logoVisible: false,
      editVisible: false
    };
  },

  mounted() {
    this.search();
  },

  methods: {
    logoClear() {
      this.logoData.id = "";
      this.logoData.logo = "";
    },
    editClear() {
      this.editData.id = "";
      this.editData.value = "";
    },
    search() {
      this.params.pageNo = 1;
      this.params.isCount = true;
      this.getList();
    },

    getList() {
      this.load = true;
      this.$request.post({
        url: "system/sysParams/admin/list",
        params: this.params,
        success: result => {
          if (this.params.isCount) {
            this.total = result.total;
          }
          this.params.isCount = false;
          this.list = result.list;
        },
        finally: () => {
          this.load = false;
        }
      });
    },

    update(data) {
      if (data.id == 6) {
        this.logoData.id = data.id;
        this.logoData.logo = data.value;
        this.logoVisible = true;
      } else if (data.id == 4 || data.id == 5) {
        this.editData.id = data.id;
        this.editData.value = data.blodValue;
        this.editVisible = true;
      } else {
        this.$prompt("请输入参数值", "修改", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputErrorMessage: "请输入参数值"
        }).then(({ value }) => {
          this.load = true;
          this.$request.post({
            url: "system/sysParams/admin/update",
            params: {
              id: data.id,
              value: value
            },
            success: result => {
              this.$message.success("更新成功");
              this.getList();
            },
            finally: () => {
              this.load = false;
            }
          });
        });
      }
    },
    handleChange(file, fileList) {
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = res => {
        this.logoData.logo = res.target.result;
      };
      this.logoData.logo = URL.createObjectURL(file.raw);
    },
    logoConfirm() {
      if (!this.logoData.logo) return this.$message.warning("请上传图片");
      this.$request.post({
        url: "system/sysParams/admin/update",
        params: {
          id: this.logoData.id,
          value: this.logoData.logo
        },
        success: res => {
          this.$message.success("操作成功");
          this.logoVisible = false;
          this.logoClear();
          this.getList();
        }
      });
    },
    editConfirm() {
      if (!this.editData.value) return this.$message.warning("请输入内容");
      this.$request.post({
        url: "system/sysParams/admin/update",
        params: {
          id: this.editData.id,
          value: this.editData.value
        },
        success: res => {
          this.$message.success("操作成功");
          this.editVisible = false;
          this.editClear();
          this.getList();
        }
      });
    }
  }
};
</script>

<style></style>

<style scoped>
.page {
  text-align: right;
  margin-top: 20px;
}
</style>

<style lang="scss" scoped>
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-image__preview {
  object-fit: cover;
}

.qqImg {
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
}
</style>
