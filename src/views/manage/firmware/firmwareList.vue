<template>
  <div>
    <main-head>
      <el-button
        type="primary"
        slot="after"
        class="top_btn"
        @click="visible = true"
        >新建固件
      </el-button>
    </main-head>
    <main-content>
      <screen-form :formList="formList" @search="search" />
      <el-table :data="list" stripe style="width: 100%" v-loading="load">
        <el-table-column prop="id" label="固件ID" align="center" width="80px" />
        <el-table-column prop="name" label="固件名称" align="center" />
        <el-table-column prop="softVersion" label="软件版本" align="center" />
        <el-table-column prop="hardVersion" label="硬件版本" align="center" />
        <!-- <el-table-column prop="version" label="版本号" align="center" /> -->
        <el-table-column label="文件大小" align="center">
          <template slot-scope="scope"> {{ scope.row.wareSize }}M</template>
        </el-table-column>

        <!-- <el-table-column prop="wareUrl" label="文件地址" align="center" /> -->
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm:ss" />
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" align="center">
          <template slot-scope="scope">
            <timer
              v-if="scope.row.updateTime"
              :date="scope.row.updateTime"
              format="Y-MM-DD HH:mm:ss"
            />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!--                <el-table-column label="发布状态" align="center"> -->
        <!--                    <template slot-scope="scope">-->
        <!--                        <span v-if="scope.row.status==0" class="warning">未发布</span>-->
        <!--                        <span v-if="scope.row.status==1" class="success">发布中</span>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          min-width="120px"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="setData(scope.row)">
              编辑固件
            </el-button>
            <!-- <el-button v-if="scope.row.status==0" type="warning" size="small" @click="sub(scope.row.id)">发布</el-button> -->
            <!-- <el-button v-else type="info" size="small" @click="sub(scope.row.id)">取消</el-button> -->
            <el-button
              v-if="scope.row.status == 0"
              type="success"
              size="small"
              @click="(issueShow = true), (issFormData.id = scope.row.id)"
            >
              发布固件
            </el-button>
            <el-button
              v-if="scope.row.status == 1"
              type="warning"
              size="small"
              @click="issueEetData(scope.row)"
              >编辑发布
            </el-button>
            <el-button type="danger" size="small" @click="del(scope.row.id)">
              删除
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
        :title="formData.id ? '编辑' : '新增'"
        :visible.sync="visible"
        center
        width="600px"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form
          ref="formData"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="120px"
        >
          <el-form-item label="固件名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入固件名称" />
          </el-form-item>
          <el-form-item label="上传固件" prop="file">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :limit="1"
              :on-change="handleFileUp"
              :on-remove="handleRemove"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件
              </el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload"
                >上传到服务器
              </el-button>
              <div slot="tip" class="el-upload__tip">只能上传一个文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="固件大小" prop="wareSize">
            <el-input
              v-model="formData.wareSize"
              disabled
              placeholder="请先选择文件再上传至服务器"
            />
          </el-form-item>
          <el-form-item label="固件地址" prop="wareUrl">
            <el-input
              v-model="formData.wareUrl"
              disabled
              placeholder="请先选择文件再上传至服务器"
            />
          </el-form-item>
          <el-form-item label="硬件版本" prop="hardVersion">
            <el-input
              v-model="formData.hardVersion"
              placeholder="请输入硬件版本"
            />
          </el-form-item>
          <el-form-item label="软件版本" prop="softVersion">
            <el-input
              v-model="formData.softVersion"
              placeholder="请输入软件版本"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="clearFormData(), (visible = false)"
            >关闭
          </el-button>
          <el-button type="primary" @click="addOrUpdate" :loading="formLoading">
            确定
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        :title="issFormData.id ? '编辑' : '新增'"
        :visible.sync="issueShow"
        center
        width="600px"
        :before-close="handleIssueClose"
        :close-on-click-modal="false"
      >
        <el-form
          ref="issFormData"
          :model="issFormData"
          :rules="issueRules"
          size="medium"
          label-width="120px"
        >
          <el-form-item label="设备序列号" prop="deviceCode">
            <el-input
              v-model="issFormData.deviceCode"
              placeholder="请输入设备序列号，支持模糊和精确匹配"
            />
          </el-form-item>
          <div class="hint_text">注:匹配序列号内包含以上连续字段</div>

          <el-form-item label="软硬件版本号" prop="firmwareVersionList">
            <el-button size="small" type="primary" @click="addItem">
              添加目标软硬件版本号
            </el-button>
          </el-form-item>
          <div v-for="(item, index) in versionList" :key="index">
            <el-button
              icon="el-icon-minus"
              @click="deleteItem(item, index)"
              circle
              style="font-size:10px;position: absolute; left:40px"
            />
            <el-form
              :model="item"
              ref="form"
              :rules="issueRules"
              label-width="80px"
              :inline="false"
              size="normal"
            >
              <el-form-item
                label="目标软件版本号"
                label-width="165px"
                prop="reSoftVersion"
              >
                <el-input
                  v-model="item.reSoftVersion"
                  placeholder="请输入要升级的8位软件版本号"
                />
              </el-form-item>
              <el-form-item
                label="目标硬件版本号"
                label-width="165px"
                prop="reHardVersion"
              >
                <el-input
                  v-model="item.reHardVersion"
                  placeholder="请输入要升级的8位硬件版本号"
                />
              </el-form-item>
            </el-form>
          </div>
          <!-- <el-form-item label="状态" prop="status">
              <el-radio v-model="issFormData.status" label="0">未发布</el-radio>
              <el-radio v-model="issFormData.status" label="1">发布中</el-radio>
          </el-form-item> -->
        </el-form>
        <div slot="footer">
          <el-button @click="clearFormData(), (issueShow = false)"
            >关闭
          </el-button>
          <el-button
            type="primary"
            @click="issueAddOrUpdate"
            :loading="formLoading"
            >确定
          </el-button>
        </div>
      </el-dialog>
    </main-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      versionList: [],

      issueShow: false,
      issFormData: {
        firmwareVersionList: "",
        id: "",
        deviceCode: "",
        status: 1
      },
      issueRules: {
        deviceCode: [
          {
            required: true,
            trigger: "blur",
            message: "请输入设备序列号"
          }
        ],
        status: [
          {
            required: true,
            trigger: "blur",
            message: "请选择发布状态"
          }
        ],
        firmwareVersionList: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.versionList.length == 0) {
                callback("请选择输入设备版本");
              } else {
                callback();
              }
            }
          }
        ],
        reSoftVersion: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (String(value).length != 8) {
                console.log(String(value).length);
                callback("软件版本号必须为8个字符");
              } else {
                callback();
              }
            }
          }
        ],
        reHardVersion: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (String(value).length != 8) {
                callback("硬件版本号必须为8个字符");
              } else {
                callback();
              }
            }
          }
        ]
      },
      formList: [
        {
          type: "daterange",
          value: [],
          key1: "startTime",
          key2: "endTime"
        },
        {
          type: "input",
          placeholder: "固件名称",
          key: "name",
          value: ""
        },
        {
          type: "input",
          placeholder: "软件版本",
          key: "softVersion",
          value: ""
        },
        {
          type: "input",
          placeholder: "硬件版本",
          key: "hardVersion",
          value: ""
        }
      ],
      formData: {
        hardVersion: "",
        id: "",
        name: "",
        softVersion: "",
        wareSize: "",
        wareUrl: ""
      },
      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "请输入固件"
          }
        ],
        wareSize: [
          {
            required: true,
            trigger: "blur",
            message: "请先选择文件再上传至服务器"
          }
        ],
        wareUrl: [
          {
            required: true,
            trigger: "blur",
            message: "请先选择文件再上传至服务器"
          }
        ],
        hardVersion: [
          {
            required: true,
            trigger: "blur",
            message: "请输入硬件版本"
          }
        ],
        softVersion: [
          {
            required: true,
            trigger: "blur",
            message: "请输入软件版本"
          }
        ]
      },
      params: {
        pageNo: 1,
        pageSize: 10,
        startTime: "",
        endTime: ""
      },
      total: 0,
      load: false,
      formLoading: false,
      visible: false,
      date: [],
      list: [],
      file: ""
    };
  },

  mounted() {
    this.search();
  },

  methods: {
    deleteItem(item, index) {
      this.versionList.splice(index, 1);
    },
    issueEetData(data) {
      console.log("data", data);

      this.issFormData.deviceCode = data.deviceCode;
      this.issFormData.status = data.status.toString() || 1;
      console.log("this.issFormData.status", this.issFormData.status);
      this.issFormData.id = data.id;
      let newArr = [];
      data.firmwareVersionList.forEach(item => {
        newArr.push({
          id: item.id,
          reHardVersion: item.reHardVersion,
          reSoftVersion: item.reSoftVersion
        });
      });
      this.versionList.push(...newArr);
      this.issueShow = true;
    },
    addItem() {
      this.versionList.push({
        reHardVersion: "",
        reSoftVersion: ""
      });
    },
    issueAddOrUpdate() {
      console.log("issFormData", this.issFormData);
      console.log("versionList", this.versionList);

      if (this.versionList == "") {
        return this.$message.warning("请添加需要发布的软硬件版本号");
      }

      for (let i = 0; i < this.versionList.length; i++) {
        if (
          this.versionList[i].reHardVersion == "" ||
          this.versionList[i].reSoftVersion == ""
        ) {
          return this.$message.warning("请补充完整软硬件版本号");
        }
      }

      this.issFormData.firmwareVersionList = JSON.stringify([
        ...this.versionList
      ]);

      // 确保数据更新后再进行提交
      this.$nextTick(() => {
        this.$refs.issFormData.validate(valid => {
          console.log("valid", valid);
          if (valid) {
            this.formLoading = true;
            this.$request.post({
              url: "admin/firmwareVersion/addAndUpdate",
              params: this.issFormData,
              success: result => {
                this.$message.success("操作成功");
                this.clearFormData();
                this.issueShow = false;
                this.search();
              },
              finally: _ => {
                this.formLoading = false;
              }
            });
          }
        });
      });
    },

    handleIssueClose(done) {
      this.clearFormData();
      done();
    },
    handleClose(done) {
      this.clearFormData();
      done();
    },
    clearFormData() {
      for (let key in this.formData) {
        this.formData[key] = "";
      }
      for (let key in this.issFormData) {
        this.issFormData[key] = "";
      }
      this.versionList = [];
    },
    search(obj) {
      if (obj) {
        this.params = Object.assign(this.params, obj);
      }
      this.getList();
    },
    getList() {
      this.load = true;
      this.$request.post({
        url: "admin/firmwareVersion/list",
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
    setData(data) {
      console.log("编辑固件data", data);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.hardVersion = data.hardVersion;
      this.formData.softVersion = data.softVersion;
      this.formData.wareSize = data.wareSize;
      this.formData.wareUrl = data.wareUrl;
      this.formData.status = data.status;
      this.visible = true;
    },
    handleFileUp(file, fileList) {
      this.file = file;
      this.formData.wareUrl = "";
      this.formData.wareSize = "";
    },
    handleRemove(file, fileList) {
      this.file = "";
      this.formData.wareUrl = "";
      this.formData.wareSize = "";
    },
    submitUpload() {
      if (!this.file)
        return this.$message.warning("请先上传文件至服务器再点击");
      var formData = new FormData();
      formData.append("file", this.file.raw);
      this.$request.post({
        url: "admin/firmware/upload",
        params: formData,
        success: res => {
          this.formData.wareSize = res.wareSize;
          this.formData.wareUrl = res.wareUrl;
        }
      });
    },
    addOrUpdate() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.formLoading = true;
          this.$request.post({
            url: "admin/firmware/addOrUpdate",
            params: this.formData,
            success: result => {
              this.$message.success("操作成功");
              this.clearFormData();
              this.visible = false;
              this.search();
            },
            finally: _ => {
              this.formLoading = false;
            }
          });
        }
      });
    },
    sub(id) {
      this.$confirm("确认更改发布状态?", { type: "warning" }).then(_ => {
        this.$request.post({
          url: "admin/firmwareVersion/release",
          params: {
            id
          },
          success: result => {
            this.$message.success("操作成功");
            if (this.list.length < 2 && this.params.pageNo > 1) {
              this.params.pageNo--;
            }
            this.getList();
          }
        });
      });
    },
    del(id) {
      this.$confirm("确认删除?", { type: "warning" }).then(_ => {
        this.$request.post({
          url: "admin/firmwareVersion/delete",
          params: {
            id
          },
          success: result => {
            this.$message.success("删除成功");
            if (this.list.length < 2 && this.params.pageNo > 1) {
              this.params.pageNo--;
            }
            this.getList();
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.hint_text {
  color: #409eff;
  position: relative;
  height: 0px;
  top: -20px;
  left: 125px;
  font-size: 13px;
}
</style>
