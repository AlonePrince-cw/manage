<template lang="html">
    <div>
        <div @click="inputFocus" class="my-reply" v-if="permButton('510405')">
            <el-avatar class="header-img" :size="40" :src="headImg(myHeader)" :key="headImg(myHeader)"></el-avatar>
            <div class="reply-info">
                <el-input
                    type="textarea"
                    id="replyInput"
                    v-model="comment"
                    placeholder="输入评论..."
                    class="reply-input"
                    @focus="showReplyBtn">
                </el-input>
            </div>
            <div class="reply-btn-box" v-show="btnShow">
                <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
            </div>
        </div>
        <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
            <el-avatar class="header-img" :size="40" :src="headImg(item.headImg)" :key="item.headImg + i"></el-avatar>
            <div class="author-info">
                <span class="author-name"
                      @click="showReplyInput(i,item.sendEmployee.name,item.id,item.sendEmployee.id)">{{item.sendEmployee.name}}</span>
                <span class="author-time">{{dateStr(item.modifyTime)}}</span>
            </div>
            <!--<div class="icon-btn">-->
            <!--<span @click="showReplyInput(i,item.name,item.id)">-->
            <!--<i class="iconfont el-icon-s-comment"></i>-->
            <!--回复</span>-->
            <!--<i class="iconfont el-icon-caret-top"></i>{{item.like}}-->
            <!--</div>-->
            <div class="talk-box">
                <p>
                    <span class="reply">{{item.content}}</span>
                </p>
            </div>
            <div class="reply-box">
                <div v-for="(reply,j) in item.replyComments" :key="j" class="author-title">
                    <el-avatar class="header-img" :size="40" :src="headImg(reply.fromHeadImg)"
                               :key="reply.fromHeadImg + j"></el-avatar>
                    <div class="author-info">
                        <span class="author-name"
                              @click="showReplyInput(i,reply.sendEmployee.name,item.id,reply.sendEmployee.id)">{{reply.sendEmployee.name}}</span>
                        <span class="author-time">{{dateStr(reply.modifyTime)}}</span>
                    </div>
                    <!--<div class="icon-btn">-->
                    <!--<span @click="showReplyInput(i,reply.receiveEmployee.name,reply.id)"><i class="iconfont el-icon-s-comment"></i> 回复 </span>-->
                    <!--<i class="iconfont el-icon-caret-top"></i>{{reply.like}}-->
                    <!--</div>-->
                    <div class="talk-box">
                        <p>
                            <span>回复 <span class="author-name"
                                           @click="showReplyInput(i,reply.receiveEmployee.name,item.id,reply.receiveEmployee.id)">{{reply.receiveEmployee.name}}</span>:</span>
                            <span class="reply">{{reply.content}}</span>
                        </p>
                    </div>
                    <div class="reply-box"></div>
                </div>
            </div>
            <div v-if="item.inputShow" class="my-reply my-comment-reply">
                <el-avatar class="header-img" :size="40" :src="headImg(myHeader)" :key="headImg(myHeader)"></el-avatar>
                <div class="reply-info">
                    <el-input type="textarea" v-model="replyComment" :placeholder="to?'回复' + to:'请输入回复内容'"
                              class="reply-input reply-comment-input"/>
                </div>
                <div class=" reply-btn-box">
                    <el-button class="reply-btn" size="medium" @click="sendCommentReply(i)" type="primary">发表评论
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getUser, getNode, getDict, getPerm } from "@/utils/auth";
  import { reportComment } from '@/api/report'
  import { dateFormatYmdHms } from "@/utils/util";

  const clickoutside = {
    // 初始化指令
    bind (el, binding, vnode) {
      function documentHandler (e) {
        // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
          return false;
        }
        // 判断指令中是否绑定了函数
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          binding.value(e);
        }
      }

      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.vueClickOutside = documentHandler;
      document.addEventListener('click', documentHandler);
    },
    update () {
    },
    unbind (el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.vueClickOutside);
      delete el.vueClickOutside;
    },
  };
  export default {
    props: {
      mainId: {
        type: String,
        default: ''
      },
      comments: {
        required: true,
        type: Array
      },
    },
    directives: {clickoutside},
    data () {
      return {
        comment: '',
        btnShow: false,
        index: '0',
        replyComment: '',
        myHeader: '',
        to: '',
        receiveEmployeeId: 0,
        replyCommentId: 0,
        fromParams: {
          reportId: '',
          receiveEmployeeId: 0,
          content: '',
          replyCommentId: 0
        }
      }
    },
    methods: {
        permButton(v){
            let f = ''
            if(getPerm().indexOf(v) === -1){
                f = false
            }else {
                f = true
            }
            return f
        },
      inputFocus () {
      },
      showReplyBtn () {
        this.btnShow = true
      },
      hideReplyBtn () {
        this.btnShow = false
        this.comment = ''
      },
      headImg (src) {
        src = src || require('@/assets/avatar.png');
        return src
      },
      showReplyInput (i, name, id, receiverId) {
        if (getUser().accountId === receiverId) {
          this.$message.error('不能自己回复自己哦')
          return false
        }
        this.replyComment = '';
        this.comments[this.index].inputShow = false;
        this.index = i;
        this.comments[i].inputShow = true;
        this.$forceUpdate();
        this.to = name;
        this.receiveEmployeeId = receiverId;
        this.replyCommentId = id;
      },
      _inputShow (i) {
        return this.comments[i].inputShow
      },
      async sendComment () {
        let vm = this
        if (!this.comment) {
          this.$message({
            showClose: true,
            type: 'warning',
            message: '评论不能为空'
          })
        } else {
          vm.fromParams = {
            reportId: vm.mainId,
            receiveEmployeeId: 0,
            content: vm.comment,
            replyCommentId: 0,
            token: getUser().token
          }
          vm.loading = true
          const loading = vm.$loading({
            lock: true,
            text: '正在发表评论...'
          });
          try {
            await reportComment(vm.fromParams)
            vm.comment = '';
            vm.$emit('success')
            vm.$message.success('发表成功')
            vm.loading = false
          } catch (err) {
            console.log('页面加载失败，请刷新页面重试')
          } finally {
            loading.close()
          }
        }
      },
      async sendCommentReply (i) {
        let vm = this
        if (!vm.replyComment) {
          vm.$message({
            showClose: true,
            type: 'warning',
            message: '评论不能为空'
          })
        } else {
          vm.fromParams = {
            reportId: vm.mainId,
            receiveEmployeeId: vm.receiveEmployeeId,
            content: vm.replyComment,
            replyCommentId: vm.replyCommentId,
            token: getUser().token
          }
          vm.loading = true
          const loading = vm.$loading({
            lock: true,
            text: '正在发表评论...'
          });
          try {
            await reportComment(vm.fromParams)
            vm.$emit('success')
            vm.replyComment = '';
            vm.$message.success('发表成功')
            vm.loading = false
          } catch (err) {
            console.log('页面加载失败，请刷新页面重试')
          } finally {
            loading.close()
          }
        }
      },
      dateStr (v) {
        //获取js 时间戳
        let dates = new Date(dateFormatYmdHms(v)).getTime()
        var time = new Date().getTime();
        //去掉 js 时间戳后三位，与php 时间戳保持一致
        time = parseInt((time - dates) / 1000);
        //存储转换值
        var s;
        if (time < 60 * 10) {//十分钟内
          return '刚刚';
        } else if ((time < 60 * 60) && (time >= 60 * 10)) {
          //超过十分钟少于1小时
          s = Math.floor(time / 60);
          return s + "分钟前";
        }
          // else if((time<60*60*24)&&(time>=60*60)){
          //     //超过1小时少于24小时
          //     s = Math.floor(time/60/60);
          //     return  s+"小时前";
          // }
          // else if((time<60*60*24*30)&&(time>=60*60*24)){
          //     //超过1天少于30天内
          //     s = Math.floor(time/60/60/24);
          //     return s+"天前";
        // }
        else {
          return dateFormatYmdHms(v)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
    .myDialog {
        .el-dialog__body {
            padding-left: 0px;
        }

        .el-input-number {
            width: 100%;

            .el-input__inner {
                text-align: left;
            }
        }

        .el-date-editor {
            width: 100%;
        }

        .el-select {
            width: 100%;
        }
    }

    .my-reply {
        padding: 10px;
        background-color: #fafbfc;

        .header-img {
            float: left;
            display: inline-block;
            vertical-align: top;
        }

        .reply-info {
            margin-left: 50px;
            position: relative;
            @media screen and (max-width: 700px) {
                width: 80%;
            }

            .reply-input {
                min-height: 20px;
                line-height: 22px;
                padding: 10px 10px;
                color: #ccc;
                background-color: #fff;
                border-radius: 5px;

                &:empty:before {
                    content: attr(placeholder)
                }

                &:focus:before {
                    content: none
                }

                &:focus {
                    padding: 8px 8px;
                    border: 2px solid #409eff;
                    box-shadow: none;
                    outline: none;
                }
            }
        }
    }

    .reply-btn-box {
        text-align: right;
        margin-top: 10px;

        .reply-btn {
            position: relative;
        }
    }

    .my-comment-reply {
        margin-left: 50px;

        .reply-input {
            display: flex;
        }
    }

    .author-title {
        padding: 10px;

        .icon-btn {
            padding: 0 !important;
            float: right;
            @media screen and (max-width: 1200px) {
                width: 20%;
                padding: 7px;
            }

            > span {
                cursor: pointer;
            }

            .iconfont {
                margin: 0 5px;
            }
        }

        .header-img {
            display: inline-block;
            vertical-align: top;
        }

        .talk-box {
            margin: 0 45px;

            > p {
                margin: 0;
            }

            .author-name {
                color: rgb(64, 158, 255);
                font-size: 16px;
                cursor: pointer;
            }

            .reply {
                font-size: 14px;
                color: #333;
            }
        }

        .reply-box {
            margin: 10px 0 0 50px;
            background-color: #efefef;
        }

        .author-info {
            display: inline-block;
            margin-left: 5px;
            width: auto;
            height: 40px;
            line-height: 20px;

            > span {
                display: block;
                cursor: pointer;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .author-name {
                color: rgb(64, 158, 255);
                font-size: 18px;
            }

            .author-time {
                font-size: 14px;
            }
        }
    }
</style>
