<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :append-to-body="true"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-row>
      <el-upload
        ref="uploader"
        :multiple="true"
        :action="action"
        :accept="acceptTypes"
        :limit="limit"
        :file-list="uploadList"
        :auto-upload="autoUpload"
        name="multifiles"
        :data="{ fileType, token, menuId}"
        :with-credentials="true"
        :list-type="listType"
        :before-remove="handleBeforeRemove"
        :before-upload="handleBeforeUpload"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        v-bind="$attrs"
      >
        <el-button v-if="listType === 'text'" type="primary">选择添加</el-button>
        <i class="el-icon-plus" v-else></i>
      </el-upload>
      <!--multiple-->
    </el-row>
    <el-row slot="footer" class="dz-dialog-footer">
      <el-button class="button" @click="visible = false">取消</el-button>
      <el-button class="button" type="success" @click="handleConfirm">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
// import _ from 'lodash'
import { createFileUrl } from "@/utils/util";
import storeData from '@/store/state'

export default {
  props: {
    accept: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "图片上传"
    },
    fileType: {
      type: String,
      default: "01"
    },
    limit: {
      type: Number,
      default: 100
    },
    needDesc: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: "party"
    },
    token: {
      type: String,
      default: ""
    },
    menuId: {
      type: String,
      default: ""
    },
    userPhone: {
      default: null
    },
    uploadType: {
      type: String,
      default: null
    },
    isSize: {
      type: Boolean,
      default: false
    },
    changeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    handleBeforeRemove: {
      type: Function,
      default: function () {
        return true
      }
    }
  },
  name: "Uploader",
  data() {
    return {
      visible: false,
      previewDialogVisible: false,
      previewImageUrl: "",
      uploadList: [],
      videoDuration: 0,
      autoUpload: true
    };
  },
  computed: {
    listType() {
      if (this.target === "party") {
        if (this.fileType === "02" || this.fileType === "05") {
          return "text";
        }

        return "picture-card";
      } else {
        if (this.fileType === "01") {
          return "picture-card";
        }
        return "text";
      }
    },
    action() {
      return this.target === "meta"
        ? storeData.uploadAction
        : storeData.uploadAction;
    },
    acceptTypes() {
      if (this.accept) {
        return this.accept;
      }

      if (this.target === "party") {
        if (this.fileType === "02") {
          return "video/*";
        } else if (this.fileType === "0402") {
          return ".ts";
        } else if (this.fileType === "05") {
          return "";
        }

        return "image/png,image/jpg,image/jpeg,image/gif";
      } else {
        if (this.fileType === "01") {
          return "image/png,image/jpg,image/jpeg,image/gif";
        } else if (this.fileType === '06') {
          return ''
        } else if (this.fileType === "02") {
          return "video/*";
        } else if (this.fileType === "0402") {
          return ".ts";
        }
        return "";
      }
    }
  },
  watch: {
    changeList (v) {
      this.uploadList = v
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.uploadList = fileList.map(fileItem => {
        if (fileItem.response) {
          return fileItem.response.data[0];
        }
        return fileItem;
      });
    },
    handleBeforeUpload(file) {
      const isLt100kb = file.size / 1024 <= 100;
      if (file.type === "video/mp4") {
        return new Promise((resolve, reject) => {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.addEventListener("loadedmetadata", () => {
            this.videoDuration = parseInt(video.duration * 1000);
            resolve();
          });
          video.src = URL.createObjectURL(file);
        });
      } else {
        this.videoDuration = 0;
        if (!isLt100kb && this.isSize) {
          this.$message({
            message: "上传文件大小不能超过 100KB!",
            type: "warning"
          });
          return isLt100kb;
        }
      }
    },
    handleSuccess(response, file, fileList) {
      if (response && response.code === 0) {
        const f = response.data[0];
        f.url = createFileUrl(f)
        f.name = file.name
        if (this.needDesc) {
          this.$prompt("请输入图片文字内容", "图片文字", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(({ value }) => {
              f.remark = value;
              this.uploadList = this.uploadList.reverse()
              this.uploadList = fileList.map(fileItem => {
                if (fileItem.response && fileItem.response.data) {
                  fileItem.response.data[0].url = createFileUrl(fileItem.response.data[0]);
                  fileItem.response.data[0].name = fileItem.response.data[0].fileName;
                  return fileItem.response.data[0];
                }
                return fileItem;
              });
            })
            .catch(() => {
              this.uploadList.push(f);
            });
        } else {
          this.uploadList = this.uploadList.reverse()
          this.uploadList = fileList.map(fileItem => {
            if (fileItem.response) {
              fileItem.response.data[0].url = createFileUrl(fileItem.response.data[0]);
              fileItem.response.data[0].name = fileItem.response.data[0].fileName;
              return fileItem.response.data[0];
            }
            return fileItem;
          });
        }
      }
      // else {
      //   if (response.code === 401) {
      //     this.$message.error('登录过期，请重新登录')
      //     this.$router.unshift({ path: '/login', query: { redirect: this.$route.path } })
      //   } else {
      //     const index = fileList.find(f => f.uid === file.uid)
      //     fileList.splice(index, 1)
      //     this.$message.error(response.msg)
      //   }
      // }
    },
    handleError() {
      this.$message.error("上传失败");
    },
    handleExceed() {
      this.$message.error(`最多只能上传${this.limit}个文件`);
    },
    handleConfirm() {
      this.$emit("confirm", this.uploadList);
      this.hide();
    },
    show(fileList) {
      if (fileList) {
        this.uploadList = Array.from(fileList).map(file => {
          if (file.url) {
            return file;
          }
          file.url = createFileUrl(file);
          return file;
        });
      }
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
