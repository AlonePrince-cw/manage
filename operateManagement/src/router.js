import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Layout = resolve => { require(['./view/layout/layout.vue'], resolve) }
// const login = resolve => { require(['./view/login/index.vue'], resolve) }
const Home = resolve => { require(['./view/home/index.vue'], resolve) }
const error = resolve => { require(['./view/errorPage/404.vue'], resolve) }
const organization = resolve => { require(['./view/companyManage/organizationManage/index.vue'], resolve) }
const member = resolve => { require(['./view/companyManage/memberManage/index.vue'], resolve) }
const memberAdd = resolve => { require(['./view/companyManage/memberManage/add/index.vue'], resolve) }
const projectManage = resolve => { require(['./view/projectManage/index.vue'], resolve) }
const projectAdd = resolve => { require(['./view/projectManage/add/index.vue'], resolve) }
const knowledge = resolve => { require(['./view/knowledgeManage/index.vue'], resolve) }
const science = resolve => { require(['./view/knowledgeManage/knowledge/index.vue'], resolve) }
const report = resolve => { require(['./view/workManage/report/index.vue'], resolve) }
const getReport = resolve => { require(['./view/workManage/getReport/index.vue'], resolve) }
const dictionaryManagement = resolve => { require(['./view/dictionaryManagement/index.vue'], resolve) }
const myPlan = () => import('./view/workManage/myPlan/index.vue')
const addPlan = () => import('./view/workManage/myPlan/add/index.vue')
const getPlan = () => import('./view/workManage/getPlan/index.vue')
const workAnalyse = () => import('./view/workAnalyse/index.vue')
const expenseRecord = () => import('./view/financialManagement/financialRecords/expenseRecord/Index.vue')
const invoiceRecording = () => import('./view/financialManagement/financialRecords/invoiceRecording/index.vue')
const collectionRecords = () => import('./view/financialManagement/financialRecords/collectionRecords/index.vue')
const costRecord = () => import('./view/financialManagement/financialRecords/costRecord/index.vue')
const taxExpenditure = () => import('./view/financialManagement/financialRecords/taxExpenditure/index.vue')
const taxRevenue = () => import('./view/financialManagement/financialRecords/taxRevenue/index.vue')
const expectedCost = () => import('./view/financialManagement/financialRecords/expectedCost/index.vue')
const badDebtCost = () => import('./view/financialManagement/financialRecords/badDebtCost/index.vue')
const financialAnalysis = () => import('./view/financialManagement/financialAnalysis/Index.vue')
const customerMailList = () => import('./view/customerMailList/index.vue')
const awardRecord = () => import('./view/rewardManage/awardRecord/index.vue')
const penaltyRecord = () => import('./view/rewardManage/penaltyRecord/index.vue')
const contractManage = () => import('./view/contractManage/index.vue')
const menu = resolve => { require(['./view/systemManage/menu/index.vue'], resolve) };
const roleManage = resolve => { require(['./view/systemManage/roleManage/index.vue'], resolve) };
const permSet = resolve => { require(['./view/systemManage/roleManage/permSet/index.vue'], resolve) };
const authoRity = resolve => { require(['./view/systemManage/roleManage/authoRity/index.vue'], resolve) };
const userManage = resolve => { require(['./view/systemManage/userManage/index.vue'], resolve) };
const salaryManage = resolve => { require(['./view/companyManage/salaryManage/index.vue'], resolve) };
const userAddManage = resolve => { require(['./view/systemManage/userManage/add/index.vue'], resolve) };

const linkManagement = resolve => { require(['./view/applicationManagement/linkManagement/index.vue'], resolve) };
const linkApplication = resolve => { require(['./view/applicationManagement/linkApplication/index.vue'], resolve) };

export const asyncRouterMap = [
  { path: '/business/applicationManagement/linkManagement/:id', component: linkManagement, name: 'linkManagement', meta: { title: '链接管理', icon: 'lock' } },
  { path: '/business/applicationManagement/linkApplication/:id', component: linkApplication, name: 'linkApplication', meta: { title: '链接应用', icon: 'lock' } },

  { path: '/business/organization/:id', component: organization, name: 'roleManage', meta: { title: '组织管理', icon: 'lock' }, },
  { path: '/business/member/:id', component: member, name: 'member', meta: { title: '员工管理', icon: 'lock' }, },
  { path: '/business/memberAdd/:id', component: memberAdd, name: 'memberAdd', meta: { title: '新增员工', icon: 'lock' }, },
  { path: '/business/memberEdit/:id', component: memberAdd, name: 'memberEdit', meta: { title: '编辑员工信息', icon: 'lock' }, },
  { path: '/business/projectManage/:id', component: projectManage, name: 'projectManage', meta: { title: '项目管理', icon: 'lock' }, },
  { path: '/business/projectManage/add/:id', component: projectAdd, name: 'projectAdd', meta: { title: '创建项目', icon: 'lock' }, },
  { path: '/business/projectManage/edit/:id', component: projectAdd, name: 'projectEdit', meta: { title: '修改项目', icon: 'lock' }, },
  { path: '/business/knowledge/:id', component: knowledge, name: 'knowledge', meta: { title: '知识管理', icon: 'lock' }, },
  { path: '/business/knowledge/science/:id', component: science, name: 'science', meta: { title: '知识管理', icon: 'lock' }, },
  { path: '/business/workManage/report/:id', component: report, name: 'report', meta: { title: '我的日报', icon: 'lock' }, },
  { path: '/business/workManage/getReport/:id', component: getReport, name: 'getReport', meta: { title: '收到的日报', icon: 'lock' }, },
  { path: '/business/workManage/myPlan/:id', component: myPlan, name: 'myPlan', meta: { title: '我的计划', icon: 'lock' }, },
  { path: '/business/workManage/addPlan/:id', component: addPlan, name: 'addPlan', meta: { title: '创建计划', icon: 'lock' }, },
  { path: '/business/workManage/editPlan/:id', component: addPlan, name: 'editPlan', meta: { title: '编辑计划', icon: 'lock' }, },
  { path: '/business/workManage/getPlan/:id', component: getPlan, name: 'getPlan', meta: { title: '收到的计划', icon: 'lock' }, },
  { path: '/business/workAnalyse/:id', component: workAnalyse, name: 'workAnalyse', meta: { title: '工作分析', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/expenseRecord/:id', component: expenseRecord, name: 'expenseRecord', meta: { title: '费用记录', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/invoiceRecording/:id', component: invoiceRecording, name: 'invoiceRecording', meta: { title: '开票记录', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/collectionRecords/:id', component: collectionRecords, name: 'collectionRecords', meta: { title: '收款记录', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/costRecord/:id', component: costRecord, name: 'costRecord', meta: { title: '成本记录', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/taxExpenditure/:id', component: taxExpenditure, name: 'taxExpenditure', meta: { title: '税务支出', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/taxRevenue/:id', component: taxRevenue, name: 'taxRevenue', meta: { title: '税务收入', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/expectedCost/:id', component: expectedCost, name: 'expectedCost', meta: { title: '预期成本', icon: 'lock' }, },
  { path: '/business/financialManagement/financialRecords/badDebtCost/:id', component: badDebtCost, name: 'badDebtCost', meta: { title: '坏账成本', icon: 'lock' }, },
  { path: '/business/financialManagement/financialAnalysis/:id', component: financialAnalysis, name: 'financialAnalysis', meta: { title: '财务分析', icon: 'lock' }, },
  { path: '/business/customerMailList/:id', component: customerMailList, name: 'customerMailList', meta: { title: '客户通讯录', icon: 'lock' }, },
  { path: '/business/rewardManage/awardRecord/:id', component: awardRecord, name: 'awardRecord', meta: { title: '奖励记录', icon: 'lock' }, },
  { path: '/business/rewardManage/penaltyRecord/:id', component: penaltyRecord, name: 'penaltyRecord', meta: { title: '惩罚记录', icon: 'lock' }, },
  { path: '/business/contractManage/:id', component: contractManage, name: 'contractManage', meta: { title: '合同管理', icon: 'lock' }, },
  { path: '/business/menu/:id', component: menu, meta: { title: '栏目管理', icon: 'lock' } },
  { path: '/business/role/roleManage/:id', component: roleManage, name: 'roleManage', meta: { title: '角色管理', icon: 'lock' } },
  { path: '/business/role/roleManage/permSet/:id', component: permSet, name: 'permSetAdd', meta: { title: '权限管理', icon: 'lock' } },
  { path: '/business/role/roleManage/authoRity/:id', component: authoRity, name: 'authoRity', meta: { title: '绑定权限', icon: 'lock' } },
  { path: '/business/role/roleManage/permSetEdit/:id', component: permSet, name: 'permSetEdit', meta: { title: '权限管理', icon: 'lock' } },
  { path: '/business/account/userManage/:id', component: userManage, name: 'userManage', meta: { title: '用户管理', icon: 'lock' } },
  { path: '/business/account/userManage/add/:id', component: userAddManage, name: 'userAddManage', meta: { title: '创建账号', icon: 'lock' } },
  { path: '/business/account/userManage/edit/:id', component: userAddManage, name: 'userEditManage', meta: { title: '修改账号', icon: 'lock' } },
  { path: '/business/salaryManage/:id', component: salaryManage, name: 'salaryManage', meta: { title: '薪酬管理', icon: 'lock' } },
  { path: '/business/dictionaryManagement/:id', component: dictionaryManagement, name: 'dictionaryManagement', meta: { title: '字典管理', icon: 'lock' }, },
  { path: '*', redirect: '/404', hidden: true },
]

// export const constantRouterMap = [
//   { path: '/login', component: login, hidden: true },
//     { path: '/404', component: error, hidden: true },
//   {
//     path: '', component: Layout, hidden: true,
//     children: [
//       { path: '', component: Home, name: 'Home', meta: { title: '首页', icon: 'home', noCache: true } },
//       ...asyncRouterMap,
//     ]
//   },
//   { path: '/login', component: login, name: 'login' },
// ]
const routes = new Router({
  scrollBehavior: () => ({ y: 0 }),
  mode:"hash",
  routes: constantRouterMap
})

export default routes
