import Vue from 'vue'

// 公共组件引入
import VueUeditorWrap from 'vue-ueditor-wrap'
import TressSelect from '@riophae/vue-treeselect'
import memberSelect from '@/components/memberSelect'
import organizationSelect from '@/components/organizationSelect'
import dataSelect from '@/components/dataSelect'
import Breadcrumb from '@/components/Breadcrumb'
import Pager from '@/components/Pager'
import workLog from '@/components/workLog'
import VDistpicker from 'v-distpicker'
import positionSelect from '@/components/positionSelect'
import Uploader from '@/components/Uploader'
import projectStatus from '@/components/projectStatus'
import importance from '@/components/importance'
import emplyeeStatus from '@/components/emplyeeStatus'
import projectType from '@/components/projectType'
import placeSelect from '@/components/placeSelect'
import marryStatus from '@/components/marryStatus'
import education from '@/components/education'
import nationality from '@/components/nationality'
import politics from '@/components/politics'
import sex from '@/components/sex'
import wangEditor from '@/components/wangEditor'
import projectSelect from '@/components/projectSelect'
import GetPlatformDict from '@/components/GetPlatformDict'
import GetPlatformDicts from '@/components/GetPlatformDicts'
import membersSelect from '@/components/membersSelect'
import navigation from '@/components/navigation'
import ViewImageList from '@/components/ViewImageList'
import ViewDocList from '@/components/ViewDocList'
import commentReply from '@/components/commentReply'
import commentReplys from '@/components/commentReplys'
import importOrgExcel from '@/components/importOrgExcel'
import Table from '@/components/Table'
import MenusSelect from '@/components/MenusSelect'
import MenusAllSelect from '@/components/MenusAllSelect'

Vue.component('treeselect',TressSelect)
Vue.component('importOrgExcel',importOrgExcel)
Vue.component('memberSelect',memberSelect)
Vue.component('organizationSelect',organizationSelect)
Vue.component('dataSelect',dataSelect)
Vue.component('Breadcrumb',Breadcrumb)
Vue.component('workLog',workLog)
Vue.component('Pager',Pager)
Vue.component('v-distpicker', VDistpicker)
Vue.component('Uploader',Uploader)
Vue.component('positionSelect',positionSelect)
Vue.component('projectStatus',projectStatus)
Vue.component('importance',importance)
Vue.component('emplyeeStatus',emplyeeStatus)
Vue.component('projectType',projectType)
Vue.component('placeSelect',placeSelect)
Vue.component('marryStatus',marryStatus)
Vue.component('education',education)
Vue.component('nationality',nationality)
Vue.component('politics',politics)
Vue.component('sex',sex)
Vue.component('wangEditor',wangEditor)
Vue.component('projectSelect',projectSelect)
Vue.component('membersSelect',membersSelect)
Vue.component('navigation',navigation)
Vue.component('GetPlatformDict',GetPlatformDict)
Vue.component('VueUeditorWrap',VueUeditorWrap)
Vue.component('v-image-list', ViewImageList)
Vue.component('v-doc-list', ViewDocList)
Vue.component('commentReply', commentReply)
Vue.component('commentReplys', commentReplys)
Vue.component('GetPlatformDicts',GetPlatformDicts)
Vue.component('Table',Table)
Vue.component('MenusSelect', MenusSelect)
Vue.component('MenusAllSelect',MenusAllSelect)
