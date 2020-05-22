import store from "./index";
// let BASE = 'http://'+window.location.hostname + ':8887';// 外网
let BASE = process.env.VUE_APP_BASE_API;// 内网
export default {
    uploadAction: `${BASE}/hstone/api/home/file/upload/multifile`,
    // downAction:`${BASE}/hstone/api/home/file/domain/download/data`,// 外网
    downAction:`${BASE}/hstone/api/home/file/ip/download/data`,// 内网
    uploadPrefix: '/hstone',
    BASE_API:BASE,
    isFowPerson:false,
    isHousePerson:false,
    siteId:1,
    myConfig: {
      // 编辑器不自动被内容撑高
      autoHeightEnabled: false,
      // 初始容器高度
      initialFrameHeight: 240,
      // 初始容器宽度
      initialFrameWidth: '100%',
      // 上传文件接口
      serverUrl: `${BASE}/hstone/api/home/getConfig`,
      serverImgUrl: `${BASE}/hstone/api/home/file/upload/multifile?fileType=1`,
      // UEDITOR_HOME_URL: '/hstone/ueditor/',  //正式环境富文本路径
      UEDITOR_HOME_URL: '/ueditor/', //本地环境富文本路径
    }
}