<template>
    <div id="village_village">
        <main-head>
           
        </main-head>

        <main-content>
            <screen-form :formList="formList" @search="search" />

            <el-table :data="list" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="固件ID" align="center" width="80px" />
                <el-table-column prop="name" label="固件名称" align="center" />
                <el-table-column prop="softVersion" label="软件版本" align="center" />
                <el-table-column prop="hardVersion" label="硬件版本" align="center" />
                <!-- <el-table-column prop="version" label="版本号" align="center" /> -->
                <el-table-column label="文件大小" align="center"> 
                    <template slot-scope="scope">
                        {{scope.row.wareSize}}M
                    </template>
                </el-table-column>
               
                <!-- <el-table-column prop="wareUrl" label="文件地址" align="center" /> -->
                <!-- <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm:ss" />
                    </template>
                </el-table-column> -->
                <el-table-column label="升级范围" align="center">
                    <template slot-scope="scope">
                        <div>软件版本号：{{scope.row.reSoftVersion}}</div>
                        <div>硬件版本号：{{scope.row.reHardVersion}}</div>
                        <div>序列号：{{scope.row.deviceCode}}</div>
                    </template>
                </el-table-column>
               <el-table-column label="最后修改时间" align="center">
                    <template slot-scope="scope">
                        <timer :date="scope.row.updateTime" format="Y-MM-DD HH:mm:ss" />
                    </template>
                </el-table-column>
                 <el-table-column label="发布状态" align="center"> 
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0" class="warning">未发布</span>
                        <span v-if="scope.row.status==1" class="success">发布中</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    class="page"
                    background
                    @size-change="search"
                    @current-change="getList"
                    :current-page.sync="params.pageNo"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    v-if="total!=0"
                    >
            </el-pagination>
        </main-content>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                params: {
                    pageNo: 1,
                    pageSize: 10,
                    isCount: true
                },
                formList: [
                 
                ],
                formData: {
                   
                },
                list: [],
                total: 0,
                visible: false,
                loading: false,
                formLoading: false,
                selectData: [],
                formList: [
                {
                    type: 'daterange',
                    value: [],
                    key1: 'startTime',
                    key2: 'endTime'
                },
                {
                    type: 'input',
                    placeholder: '固件名称',
                    key: 'name',
                    value: ''
                },
                {
                    type: 'input',
                    placeholder: '软件版本',
                    key: 'softVersion',
                    value: ''
                },
                {
                    type: 'input',
                    placeholder: '硬件版本',
                    key: 'hardVersion',
                    value: ''
                },
            ],
            };
        },

        watch: {
        
        },

        created() {
          
            
        },
            
        mounted() {
            this.search();
        },

        methods: {
            search(obj){
                if (obj) { this.params = Object.assign(this.params, obj) }
                this.getList();
            },

            getList() {
                this.loading = true;
                this.$request.post({
                    url: 'admin/firmwareRecord/list',
                    params: this.params,
                    success: result =>{
                        this.list = result.list;
                        if(this.params.isCount){
                            this.params.isCount = false;
                            this.total = result.total
                        }
                    },
                    finally: ()=>{
                        this.loading = false
                    }
                })
            },


        },


        beforeDestroy() {}
    }
</script>

<style>

</style>

<style lang="scss" scoped>
    .page{
        text-align: right;
        margin-top: 20px;
    }

</style>
