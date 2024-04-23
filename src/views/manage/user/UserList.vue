<template>
    <div id="village_village">
        <main-head>
           
        </main-head>

        <main-content>
            <screen-form :formList="formList" @search="search"/>
            <el-table :data="list" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="用户ID" align="center" />
                <el-table-column prop="phone" label="手机号码" align="center"> 
                    <template slot-scope="scope">
                        <span v-if="scope.row.phone">{{scope.row.phone}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>>
                 <el-table-column prop="matchCode" label="匹配码" align="center"> 
                    <template slot-scope="scope">
                        <span v-if="scope.row.matchCode">{{scope.row.matchCode}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <timer :date="scope.row.createTime" format="Y-MM-DD HH:mm:ss" />
                    </template>
                </el-table-column>
               <el-table-column label="更新时间" align="center">
                    <template slot-scope="scope">
                        <timer :date="scope.row.updateTime" format="Y-MM-DD HH:mm:ss" />
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
                    {
                        type: 'daterange',
                        value: [],
                        key1: 'startTime',
                        key2: 'endTime'
                    },
                    {
                        type: 'input',
                        placeholder: '手机号码',
                        key: 'phone',
                        value: ''
                    },

                ],
                formData: {
                   
                },
                list: [],
                total: 0,
                visible: false,
                loading: false,
                formLoading: false,
                selectData: []
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
                    url: 'admin/userInfo/list',
                    params: this.params,
                    success: result =>{
                        this.list = result.list;
                        this.total = result.total
                        this.total = result.total
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
