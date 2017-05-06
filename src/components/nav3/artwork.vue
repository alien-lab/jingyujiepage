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
      <el-table-column prop="price" label="价格" width="100" sortable>
      </el-table-column>
      <el-table-column prop="number" label="数量" width="100" sortable>
      </el-table-column>
      <el-table-column prop="artist" label="艺术家" width="100" sortable>
      </el-table-column>
      <el-table-column prop="date" label="上传日期" min-width="120" sortable>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template scope="scope">
          <el-button size="small" @click="showArtworkPic(scope.$index, scope.row)">查看图片</el-button>
          <el-button type="primary" size="small" @click="showEditArtwork(scope.$index, scope.row)">编辑</el-button>
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
        <el-form-item label="价格" prop="price">
          <el-input v-model="addArtworkForm.price" auto-complete="off"></el-input>
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
        <el-form-item label="图片" style="display:none;">
          <input type="file" id="addImageLoader" :model="addArtworkForm.picture" @change="onFileChange"/>
        </el-form-item>
        <el-form-item label="图片" v-if="image == '../../assets/addimage.jpg'">
          <img class="img-rounded thumb64 center-block" src="../../assets/addimage.jpg"
               onclick="addImageLoader.click()"/>
        </el-form-item>
        <el-form-item label="图片" v-if="image != '../../assets/addimage.jpg'">
          <img class="img-rounded center-block" :src="image" onclick="addImageLoader.click()"
               style="width: 256px;height: 160px;"/>
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
        <el-form-item label="价格" prop="price">
          <el-input v-model="editArtworkForm.price" auto-complete="off"></el-input>
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
        <el-form-item label="图片" style="display:none;">
          <input type="file" id="editImageLoader" :model="editArtworkForm.picture" @change="onFileChange"/>
        </el-form-item>
        <el-form-item label="图片" v-if="image == '../../assets/addimage.jpg'">
          <img class="img-rounded thumb64 center-block" src="../../assets/addimage.jpg"
               onclick="editImageLoader.click()"/>
        </el-form-item>
        <el-form-item label="图片" v-if="image != '../../assets/addimage.jpg'">
          <img class="img-rounded center-block" :src="image" onclick="editImageLoader.click()"
               style="width: 256px;height: 160px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editArtworkFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editArtworkSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--艺术品图片-->
    <el-dialog title="艺术品图片" v-model="ArtworkPicVisible">
      <el-form :model="ArtworkPicForm" label-width="80px">
        <el-form-item v-if="image == '../../assets/addimage.jpg'">
          <label>（待录入）</label>
        </el-form-item>
        <el-form-item v-if="image != '../../assets/addimage.jpg'">
          <img class="img-rounded center-block" :src="image" style="width: 256px;height: 160px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="ArtworkPicVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!--艺术品详情界面-->
    <el-dialog title="艺术品详情" v-model="ArtworkDetailVisible" :close-on-click-modal="false">
      <!--添加详情部分-->
      <div class="panel panel-info" style="position:relative;">
        <div class="panel-body">
          <el-form class="modal-form" :model="ArtworkDetailForm" ref="ArtworkDetailForm">
            <input type="file" id="imageloader" style="display:none;" :model="ArtworkDetailForm.content"
                   @change="onFileChange"/>
            <!--选择添加类型-->
            <div class="col-md-12" v-if="ArtworkDetailForm.type==null">
              <div class="col-md-5 col-sm-12">
                <img class="img-rounded thumb64 center-block" src="../../assets/addimage.jpg"
                     onclick="imageloader.click()"/>
              </div>
              <div class="col-md-2 center-block align-middle" style="font-size: 20px;">
                OR
              </div>
              <div class="col-md-5 col-sm-12" @click="chooseText()">
                <img class="img-rounded thumb64 center-block" src="../../assets/addtext.jpg"/>
              </div>
            </div>
            <!--如果选择图片，预览图片-->
            <div class="col-md-12" v-if="ArtworkDetailForm.type=='图片'">
              <img :src="image" class="img-rounded" style="max-width:256px;" onclick="imageloader.click()"/>
            </div>
            <!--选择文字-->
            <div class="col-md-12" v-if="ArtworkDetailForm.type=='文字'">
              <div class="form-group-sm">
                <label>文字内容：</label>
                <textarea class="form-control note-editor note-editor-margin"
                          rows="5" name="content" v-model="ArtworkDetailForm.content"></textarea>
              </div>
            </div>
            <!--选择完成后显示-->
            <div class="col-md-12" v-if="ArtworkDetailForm.type=='图片'||ArtworkDetailForm.type=='文字'">
              <div class="form-group-sm">
                <label>标题：</label>
                <input type="text" class="form-control" placeholder="输入标题" v-model="ArtworkDetailForm.label"/>
              </div>
              <div class="form-group-sm">
                <label>链接：</label>
                <input class="form-control" type="text" placeholder="输入需链接到的外部URL" v-model="ArtworkDetailForm.link"/>
              </div>
            </div>
          </el-form>
        </div>
        <!--选择完成后显示-->
        <div class="panel-footer" v-if="ArtworkDetailForm.type=='图片'||ArtworkDetailForm.type=='文字'">
          <el-button class="btn btn-success btn-sm btn-group-sm" :loading="addLoading" @click.native="addDetailSubmit">保存</el-button>
          <el-button class="btn btn-danger btn-sm btn-group-sm" @click.native="ArtworkDetailForm.type = null">取消</el-button>
        </div>
      </div>
      <!--详情列表部分-->
      <div v-for="detail in details" class="panel standard"
           :class="{'panel-primary':detail.status=='已发布','panel-warning':detail.status=='未发布'}">
        <div class="panel-heading" v-if="detail.status=='未发布'" style="position:relative">
          未发布
          <div v-if="detail.status=='未发布'" class="btn btn-sm btn-success"
               style="position:absolute;right:5px;bottom:5px;" @click="publish(detail)">发布
          </div>
        </div>
        <div class="panel-heading" v-if="detail.status=='已发布'" style="position:relative">
          已发布
          <div v-if="detail.status=='已发布'" class="btn btn-sm btn-warning"
               style="position:absolute;right:5px;bottom:5px;" @click="disPublish(detail)">取消发布
          </div>
        </div>
        <div class="panel-body">
          <div v-if="detail.type=='文字'">
            <p v-if="!detail.link">
              {{detail.content}}
            </p>
            <p v-if="detail.link">
              <a :href="detail.link">{{detail.content}}</a>
            </p>
            <p class="text-right">
              {{detail.date}}
            </p>
          </div>
          <div v-if="detail.type=='图片'">
            <a v-if="detail.link" href="detail.link">
              <img :src="detail.content" style="width:100%;"/>
            </a>
            <img v-if="!detail.link" :src="detail.content" style="width:100%;"/>
            <p class="text-right">
              {{detail.date}}
            </p>
          </div>
        </div>
        <div class="panel-footer" v-if="detail.status=='未发布'">
          <div class="btn btn-sm btn-danger" @click="delDetail(detail)">删除</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="ArtworkDetailVisible = false">确定</el-button>
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
    getDetailByArtwork,
    addDetail,
    delDetailSubmit,
    updateDetail
  } from '../../api/api';
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        artworks: [],
        details: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        addArtworkFormVisible: false,//新增艺术品界面是否显示
        addLoading: false,
        addArtworkFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          price: [
            {pattern: /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/, message: '价格填写出错', trigger: 'blur'}
          ]
        },
        editArtworkFormVisible: false,//编辑艺术品界面是否显示
        editLoading: false,
        editArtworkFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          price: [
            {pattern: /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/, message: '价格填写出错', trigger: 'blur'}
          ]
        },
        ArtworkPicVisible: false,//查看图片界面是否显示
        ArtworkDetailVisible: false,//详情界面是否显示
        //新增艺术品界面数据
        addArtworkForm: {
          name: '',
          price: 0,
          number: 0,
          artist: '',
          date: '',
          picture: ''
        },
        //编辑艺术品界面数据
        editArtworkForm: {
          id: 0,
          name: '',
          price: 0,
          number: 0,
          artist: '',
          picture: ''
        },
        //艺术品图片界面数据
        ArtworkPicForm: {
          picture: ''
        },
        ArtworkDetailForm: {
          content: '',
          label: '',
          link: '',
          type: null,
          status: '',
          artworkId: 0
        },
        image: '../../assets/addimage.jpg'
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
        this.image = "../../assets/addimage.jpg";
        this.addArtworkForm = {
          name: '',
          price: 0,
          number: 0,
          artist: '',
          date: '',
          picture: ''
        };
      },
      //显示编辑界面
      showEditArtwork: function (index, row) {
        this.editArtworkFormVisible = true;
        this.editArtworkForm = Object.assign({}, row);
        if (this.editArtworkForm.picture == "（待录入）" || this.editArtworkForm.picture == null) {
          this.image = "../../assets/addimage.jpg";
        } else {
          this.image = this.editArtworkForm.picture;
        }
        console.log(this.image);
      },
      //显示艺术品图片界面
      showArtworkPic: function (index, row) {
        this.ArtworkPicVisible = true;
        this.ArtworkPicForm = Object.assign({}, row);
        if (this.ArtworkPicForm.picture == "（待录入）" || this.ArtworkPicForm.picture == null) {
          this.image = "../../assets/addimage.jpg";
        } else {
          this.image = this.ArtworkPicForm.picture;
        }
        console.log(this.image);
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
              if (para.picture == "" || para.picture == null) {
                para.picture = "（待录入）";
              }
              console.log(para);
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
              if (para.picture == "" || para.picture == null) {
                para.picture = "（待录入）";
              }
              console.log(para);
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
      //显示详情界面
      showDetails(index, row){
        this.ArtworkDetailVisible = true;
        this.ArtworkDetailForm.type = null;
        this.ArtworkDetailForm.artworkId = row.id;
        this.getDetails(this.ArtworkDetailForm.artworkId);
      },
      //根据artwork查detail
      getDetails(artworkId){
        let para = {artworkId: artworkId};
        getDetailByArtwork(para).then((res) => {
          this.details = res.data;
          for (let i = 0; i < this.details.length; i++) {
            this.details[i].date = (!this.details[i].date || this.details[i].date == '') ? '' : util.formatDate.format(new Date(this.details[i].date), 'yyyy-MM-dd hh:mm:ss');
          }
          console.log(this.details);
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
      },
      //上传图片
      onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        this.createImage(files[0]);
      },
      createImage(file) {
        var reader = new FileReader();
        var vm = this;
        reader.onload = (e) => {
          vm.image = e.target.result;
          vm.addArtworkForm.picture = e.target.result;
          vm.editArtworkForm.picture = e.target.result;
          this.chooseImage();
          vm.ArtworkDetailForm.content = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      chooseImage(){
        this.ArtworkDetailForm.type = "图片";
        this.ArtworkDetailForm.label = "";
        this.ArtworkDetailForm.link = "";
      },
      chooseText(){
        this.ArtworkDetailForm.type = "文字";
        this.ArtworkDetailForm.label = "";
        this.ArtworkDetailForm.link = "";
      },
      //确定添加一条详情
      addDetailSubmit: function(){
        this.$refs.ArtworkDetailForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              let para = Object.assign({}, this.ArtworkDetailForm);
              para.status = "未发布";
              para.date = new Date();
              para.date = (!para.date || para.date == '') ? '' : util.formatDate.format(para.date, 'yyyy-MM-dd hh:mm:ss');
              console.log(para);
              addDetail(para).then((res) => {
                this.addLoading = false;
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['ArtworkDetailForm'].resetFields();
                this.ArtworkDetailForm.type = null;
                this.getDetails(para.artworkId);
              });
            });
          }
        });
      },
      //发布
      publish: function(detail) {
        let para = detail;
        para.status = "已发布";
        updateDetail(para).then((res) => {
          this.$message({
            message: '发布成功',
            type: 'success'
          });
        });
      },
      //取消发布
      disPublish: function (detail) {
        let para = detail;
        para.status = "未发布";
        updateDetail(para).then((res) => {
          this.$message({
            message: '取消发布成功',
            type: 'success'
          });
        });
      },
      //删除一条detail记录
      delDetail: function (detail) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          let para = detail;
          delDetailSubmit(para).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getDetails(this.ArtworkDetailForm.artworkId);
          });
        })
      }
    },
    //Vue生命周期mounted阶段调用
    mounted() {
      this.getArtworkByPage();
    }
  }
</script>

<style scoped>
  .img-rounded {
    border-radius: 6px;
  }

  .thumb64 {
    width: 64px !important;
    height: 64px !important;
  }

  .center-block {
    display: block;
    margin-right: auto;
    margin-left: auto;
  }
</style>
