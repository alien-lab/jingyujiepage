<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="艺术品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="ifLike">查询</el-button>
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
          <el-button size="small" @click="showEditArtwork(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delArtwork(scope.$index, scope.row)">删除</el-button>
          <el-button type="primary" size="small" @click="showDetails(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addArtworkFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addArtworkSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑艺术品界面-->
    <el-dialog title="编辑艺术品信息" v-model="editArtworkFormVisible" :close-on-click-modal="false">
      <el-form :model="editArtworkForm" label-width="80px" :rules="editArtworkFormRules" ref="editArtworkForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editArtworkForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="editArtworkForm.number" :min="0" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="艺术家">
          <el-select v-model="editArtworkForm.artist" placeholder="请选择艺术家">
            <el-option label="艺术家一" value="大洼"></el-option>
            <el-option label="艺术家二" value="二娃"></el-option>
            <el-option label="艺术家三" value="三娃"></el-option>
            <el-option label="艺术家四" value="是娃"></el-option>
            <el-option label="艺术家无" value="无娃"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editArtworkFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editArtworkSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import {
    addArtwork,
    updateArtwork,
    delArtworkSubmit,
    batchDelArtworkSubmit,
    getArtworkPage,
    getArtworkNameLikePage,
    getDetailByArtwork
  } from '../../api/api';
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
        editArtworkFormVisible: false,//编辑艺术品界面是否显示
        editLoading: false,
        editArtworkFormRules: {
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
        },
        //编辑艺术品界面数据
        editArtworkForm: {
          id: 0,
          name: '',
          number: 0,
          artist: ''
        }
      }
    },
    methods: {
      //换页
      handleCurrentChange(val) {
        this.page = val;
        this.getArtworkByPage();
      },
      //判断是否模糊查询
      ifLike(){
        if (this.filters.name != "" & this.filters.name != null) {
          this.getArtworkByNameLikePage();
        } else {
          this.getArtworkByPage();
        }
      },
      //获取分页艺术品列表
      getArtworkByPage() {
        let para = {
          index: this.page - 1,
          size: 10
        };
        this.listLoading = true;
        getArtworkPage(para).then((res) => {
          this.total = res.data.totalElements;
          this.artworks = res.data.content;
          for (let i = 0; i < this.artworks.length; i++) {
            this.artworks[i].date = (!this.artworks[i].date || this.artworks[i].date == '') ? '' : util.formatDate.format(new Date(this.artworks[i].date), 'yyyy-MM-dd hh:mm:ss');
          }
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
      //显示编辑界面
      showEditArtwork: function (index, row) {
        this.editArtworkFormVisible = true;
        this.editArtworkForm = Object.assign({}, row);
      },
      //确定新增艺术品
      addArtworkSubmit: function () {
        this.$refs.addArtworkForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              let para = Object.assign({}, this.addArtworkForm);
              para.date = new Date();
              para.date = (!para.date || para.date == '') ? '' : util.formatDate.format(para.date, 'yyyy-MM-dd hh:mm:ss');
              addArtwork(para).then((res) => {
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
      //确定保存艺术品信息
      editArtworkSubmit: function () {
        this.$refs.editArtworkForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = Object.assign({}, this.editArtworkForm);
              updateArtwork(para).then((res) => {
                this.editLoading = false;
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editArtworkForm'].resetFields();
                this.editArtworkFormVisible = false;
                this.getArtworkByPage();
              });
            });
          }
        });
      },
      //根据name模糊分页查询
      getArtworkByNameLikePage() {
        let para = {
          likeName: this.filters.name,
          index: this.page - 1,
          size: 10
        };
        this.listLoading = true;
        getArtworkNameLikePage(para).then((res) => {
          this.total = res.data.totalElements;
          this.artworks = res.data.content;
          for (let i = 0; i < this.artworks.length; i++) {
            this.artworks[i].date = (!this.artworks[i].date || this.artworks[i].date == '') ? '' : util.formatDate.format(new Date(this.artworks[i].date), 'yyyy-MM-dd hh:mm:ss');
          }
          this.listLoading = false;
        });
      },
      //显示产看详情界面
      showDetails(index,row){
        let para = {artworkId: row.id};
        this.getDetails(param.artworkId);
      },
      //根据artwork查detail
      getDetails(artworkId){
        this.listLoading = true;
        getArtworkPage(para).then((res) => {
          this.total = res.data.totalElements;
          this.artworks = res.data.content;
          for (let i = 0; i < this.artworks.length; i++) {
            this.artworks[i].date = (!this.artworks[i].date || this.artworks[i].date == '') ? '' : util.formatDate.format(new Date(this.artworks[i].date), 'yyyy-MM-dd hh:mm:ss');
          }
          this.listLoading = false;
        });
      },
      //删除一条艺术品记录
      delArtwork: function (index, row) {
        this.$confirm('确认删除该记录吗,将会连同详情一起删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = {id: row.id};
          delArtworkSubmit(para).then((res) => {
            this.listLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getArtworkByPage();
          });
        }).catch(() => {

        });
      },
      //选中事件
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = {ids: ids};
          batchDelArtworkSubmit(para).then((res) => {
            this.listLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getArtworkByPage();
          });

        }).catch(() => {

        });
      }
    },
    //Vue生命周期mounted阶段调用
    mounted() {
      this.getArtworkByPage();
    }
  }
</script>
