export default [
  // 用户布局
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // 主框架布局
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // 系统设置
      {
        path: '/setting',
        name: 'setting',
        icon: 'setting',
        level:'1',
        routes: [
          //部门管理
          {
            path:'/setting/depts',
            name:'depts',
            authority:['super'],
            component:'./Admin/DeptPage',
          },
          //角色管理
          {
            path:'/setting/roles',
            name:'roles',
            authority:['super'],
            component:'./Admin/RolePage',
          },
          //用于显示首页
          {
            path: '/home/home',
            name: 'home',
            authority: ['super'],
            component: './Home/Home',
            hideInMenu: 'true',
          },         
        ],
      },
      {
        component: '404',
      },
    ],
  },
];