<template>
  <div>
    <main-head>

    </main-head>
    <main-content>
      <screen-form :formList="formList" @search="search"/>
      <el-table :data="list" stripe style="width: 100%" v-loading="load">
        <el-table-column prop="id" label="固件ID" align="center" width="80px"/>
        <el-table-column prop="name" label="固件名称" align="center"/>
        <el-table-column prop="deviceCode" label="设备序列号" align="center"/>
        <el-table-column prop="softVersion" label="软件版本" align="center"/>
        <el-table-column prop="hardVersion" label="硬件版本" align="center"/>
        <el-table-column prop="version" label="版本号" align="center"/>
        <el-table-column label="文件大小" align="center">
          <template slot-scope="scope">
            {{ scope.row.wareSize }}M
          </template>
        </el-table-column>
        <el-table-column label="发布状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" class="warning">未发布</span>
            <span v-if="scope.row.status==1" class="success">已发布</span>
          </template>
        </el-table-column>
        <el-table-column prop="wareUrl" label="文件地址" align="center"/>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm:ss"/>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <timer v-if="scope.row.updateTime" :date="scope.row.updateTime" format="Y-MM-DD HH:mm:ss"/>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="100px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="setData(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="showCancel(scope.row)" v-if="scope.row.status===1">取消</el-button>
            <el-button type="success" size="small" @click="showCancel(scope.row)" v-else>恢复发布</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="page" background :small="$store.state.isPhone"
                     :layout="$store.state.isPhone?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                     :current-page.sync="params.pageNo" :page-size.sync="params.pageSize" :total="total" @size-change="search"
                     @current-change="getList">
      </el-pagination>

      <el-dialog :title="formData.id ? '编辑' : '新增'" :visible.sync="visible" center width="600px" :before-close="handleClose"
                 :close-on-click-modal="false">
        <el-form ref="formData" :model="formData" :rules="rules" size="medium" label-width="120px">
          <el-form-item label="设备序列号" prop="deviceCode">
            <el-input v-model="formData.deviceCode" placeholder="请输入设备序列号"/>
          </el-form-item>
          <el-form-item label="软硬件版本号" prop="firmwareVersionList">
            <el-button size="small" type="primary" @click="addItem">添加发布软硬件版本号</el-button>
          </el-form-item>
          <div v-for="(item,index) in versionList" :key="index">
            <el-button icon="el-icon-minus" @click="deleteItem(item,index)"
                       circle style="font-size:10px;position: absolute; left:40px"/>
            <el-form-item label="软件版本号" label-width="155px">
              <el-input v-model="item.reSoftVersion" placeholder="请输入软件版本号"/>
            </el-form-item>
            <el-form-item label="硬件版本号" label-width="155px">
              <el-input v-model="item.reHardVersion" placeholder="请输入硬件版本号"/>
            </el-form-item>
          </div>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="formData.status" label="0">未发布</el-radio>
            <el-radio v-model="formData.status" label="1">已发布</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="clearFormData(), visible = false">关闭</el-button>
          <el-button type="primary" @click="addOrUpdate" :loading="formLoading">确定</el-button>
        </div>
      </el-dialog>
    </main-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formList: [
        {
          type: 'daterange',
          value: [],
          key1: 'startTime',
          key2: 'endTime'
        },
      ],
      formData: {
        firmwareVersionList: '',
        id: '',
        deviceCode: '',
        status: '',
      },
      rules: {
        deviceCode: [{
          required: true,
          trigger: 'blur',
          message: '请输入设备序列号'
        }],
        status: [{
          required: true,
          trigger: 'blur',
          message: '请选择发布状态'
        }],
        firmwareVersionList: [{
          required: true,
          trigger: 'blur',
          message: '请输入软硬件版本号'
        }],

      },
      params: {
        pageNo: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
      },
      total: 0,
      load: false,
      formLoading: false,
      visible: false,
      date: [],
      list: [],
      versionList: [],
      file: ''
    }
  },

  mounted() {
    this.search()
  },

  methods: {
    showCancel(row) {
      let that=this
      console.log("id:",row)
      this.$confirm(`是否${row.status===1?"取消":'恢复'}发布?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.post({
          url: 'admin/firmwareVersion/release',
          params: {
            id:row.id
          },
          success: () => {
            this.$message.success('操作成功');
            this.getList()
          },
          finally: () => {

          }
        })

      }).catch(() => {
      });
    },
    handleClose(done) {
      this.clearFormData();
      done();
    },
    clearFormData() {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.versionList = []
    },
    search(obj) {
      if (obj) {
        this.params = Object.assign(this.params, obj)
      }
      this.getList()
    },
    getList() {
      this.load = true
      this.$request.post({
        url: 'admin/firmwareVersion/list',
        params: this.params,
        success: result => {
          this.list = result.list
          this.total = result.total
        },
        finally: () => {
          this.load = false
        }
      })
    },
    setData(data) {
      this.formData.deviceCode = data.deviceCode
      this.formData.status = data.status.toString()
      this.formData.id = data.id
      let newArr = []
      data.firmwareVersionList.forEach(item => {
        newArr.push({
          id: item.id,
          reHardVersion: item.reHardVersion,
          reSoftVersion: item.reSoftVersion
        })
      })
      this.versionList.push(...newArr)
      this.visible = true;
    },
    addOrUpdate() {
      if (this.versionList == '') return this.$message.warning('请添加需要发布的软硬件版本号')
      this.versionList.some(item => {
        if (item.reHardVersion == '' || item.reSoftVersion == '') {
          return this.$message.warning('请补充完整软硬件版本号')
        }
      })
      this.formData.firmwareVersionList = JSON.stringify([...this.versionList])
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.formLoading = true;
          this.$request.post({
            url: 'admin/firmwareVersion/addAndUpdate',
            params: this.formData,
            success: result => {
              this.$message.success('操作成功');
              this.clearFormData();
              this.visible = false;
              this.search()
            },
            finally: _ => {
              this.formLoading = false;
            }
          })
        }
      });
    },
    addItem() {
      this.versionList.push({
        reHardVersion: '',
        reSoftVersion: ''
      })
    },
    deleteItem(item, index) {
      this.versionList.splice(index, 1)
    }


  }
}
</script>

<style lang="scss" scoped>

</style>