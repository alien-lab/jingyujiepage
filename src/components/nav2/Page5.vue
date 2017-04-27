<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="艺术品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddArtwork">新增艺术品</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="artworks" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="140" sortable>
      </el-table-column>
      <el-table-column prop="number" label="数量" width="120" sortable>
      </el-table-column>
      <el-table-column prop="artist" label="艺术家" width="200" sortable>
      </el-table-column>
      <el-table-column prop="date" label="上传日期" min-width="140" sortable>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template scope="scope">
          <el-button size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
          <el-button type="primary" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--新增艺术品界面-->
    <el-dialog title="新增艺术品" v-model="addArtworkFormVisible" :close-on-click-modal="false">
      <el-form :model="addArtworkForm" label-width="80px" :rules="addArtworkFormRules" ref="addArtworkForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addArtworkForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="addArtworkForm.number" :min="0" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="艺术家">
          <el-select v-model="addArtworkForm.artist" placeholder="请选择艺术家">
            <el-option label="艺术家一" value="大洼"></el-option>
            <el-option label="艺术家二" value="二娃"></el-option>
            <el-option label="艺术家三" value="三娃"></el-option>
            <el-option label="艺术家四" value="是娃"></el-option>
            <el-option label="艺术家无" value="无娃"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传日期">
          <!--<el-date-picker type="date" placeholder="选择日期" v-model="addArtworkForm.date"></el-date-picker>-->

          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="addArtworkForm.dateOne" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="addArtworkForm.dateTwo" style="width: 100%;"></el-time-picker>
          </el-col>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addArtworkFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addArtworkSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import {addArtwork, getArtworkPage, getArtwork} from '../../api/api';
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        artworks: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        addArtworkFormVisible: false,//新增艺术品界面是否显示
        addLoading: false,
        addArtworkFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
        //新增艺术品界面数据
        addArtworkForm: {
          name: '',
          number: 0,
          artist: '',
          date: ''
        }
      }
    },
    methods: {
      //换页
      handleCurrentChange(val) {
        this.page = val;
        this.getArtworkByPage();
      },
      //获取分页艺术品列表
      getArtworkByPage() {
        let para = {
          index: this.page-1,
          size: 20
        };
        this.listLoading = true;
        getArtworkPage(para).then((res) => {
          console.log(res.data);
          this.total = res.data.totalPages;
          this.artworks = res.data.content;
          this.listLoading = false;
        });
      },
      //显示新增艺术品界面
      showAddArtwork: function () {
        this.addArtworkFormVisible = true;
        this.addArtworkForm = {
          name: '',
          number: 0,
          artist: '',
          date: ''
        };
      },
      //确定新增艺术品
      addArtworkSubmit: function () {
        this.$refs.addArtworkForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              let para = Object.assign({}, this.addArtworkForm);
              console.log(para.date)
              para.date = (!para.date || para.date == '') ? '' : util.formatDate.format(new Date(para.date), 'yyyy-MM-dd hh:mm:ss');
              console.log(para.date);
              addArtwork(para).then((res) => {
                console.log(res);
                this.addLoading = false;
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addArtworkForm'].resetFields();
                this.addArtworkFormVisible = false;
                this.getArtworkByPage();
              });
            });
          }
        });
      },
      //选中事件
      selsChange: function (sels) {
        this.sels = sels;
      },
    },
    //Vue生命周期mounted阶段调用
    mounted() {
      this.getArtworkByPage();
    }
  }
</script>
