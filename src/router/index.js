import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import ListTasks from '@/views/ListTask'
import CreateTask from '@/views/CreateTask'
import TaskStatus from '@/views/TaskStatus'
import ErrorUnauthorized from '@/views/ErrorUnauthorized'
import ErrorServer from '@/views/ErrorServer'
import ListFiles from '@/views/ListFiles'
import UserListing from '@/views/UserListing'
import ModifyUser from '@/views/ModifyUser'
import RegisterUser from '@/views/RegisterUser'
import VersionInfo from '@/views/VersionInfo'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      protectedWithLogin: true,
      title: 'Dashboard'
    }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: ListTasks,
    meta: {
      title: 'List Tasks',
      protectedWithLogin: true
    }
  },
  {
    path: '/tasks/create',
    name: 'Create Task',
    component: CreateTask,
    meta: {
      title: 'Create Task',
      protectedWithLogin: true
    }
  },
  {
    path: '/tasks/details/:id',
    name: 'Task Details',
    component: TaskStatus,
    meta: {
      title: 'Task Details',
      protectedWithLogin: true
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: ErrorUnauthorized,
    meta: {
      title: 'Unauthorized',
      protectedWithLogin: false
    }
  },
  {
    path: '/servererror',
    name: 'System Error',
    component: ErrorServer,
    meta: {
      title: 'Error',
      protectedWithLogin: false
    }
  },
  {
    path: '/files/engine',
    name: 'Engine Files',
    component: ListFiles,
    meta: {
      title: 'Engine Files',
      protectedWithLogin: true,
      key: 0
    },
    props: {
      isTaskFile: false
    }
  },
  {
    path: '/files/task',
    name: 'Task Files',
    component: ListFiles,
    meta: {
      title: 'Task Files',
      protectedWithLogin: true,
      key: 1
    },
    props: {
      isTaskFile: true
    }
  },
  {
    path: '/users',
    name: 'User Listing',
    component: UserListing,
    meta: {
      title: 'Users',
      protectedWithLogin: true,
      requireAdminToken: true
    }
  },
  {
    path: '/users/edit',
    name: 'Edit Current User',
    component: ModifyUser,
    meta: {
      title: 'Modify User',
      protectedWithLogin: true,
      requireAdminToken: false
    }
  },
  {
    path: '/users/:id',
    name: 'Edit User',
    component: ModifyUser,
    meta: {
      title: 'Modify User',
      protectedWithLogin: true,
      requireAdminToken: false
    }
  },
  {
    path: '/register',
    name: 'Registration',
    component: RegisterUser,
    meta: {
      title: 'Register',
      preventIfLoggedIn: true
    }
  },
  {
    path: '/version',
    name: 'Version Information',
    component: VersionInfo,
    meta: {
      title: 'Version Information'
    }
  }
]

const router = new Router({
  linkActiveClass: 'nav-item active',
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  // Ensure the user is logged in if we're on a protected route
  if (to.matched.some(record => record.meta.protectedWithLogin)) {
    let user = store.state.auth
    if (!user.authenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // Prevent the user to certain routes if meta contains preventIfLoggedIn and set to true
  if (to.matched.some(record => record.meta.preventIfLoggedIn)) {
    let user = store.state.auth
    if (user.authenticated) {
      next({path: '/'})
      return
    }
  }

  // If the route requires an admin token...
  if (to.matched.some(record => record.meta.requireAdminToken)) {
    let user = store.state.auth
    if (!user.is_admin) {
      next({path: '/unauthorized'})
      return
    }
  }

  if (to.meta.title) {
    document.title = `GoCrack - ${to.meta.title}`
  } else {
    document.title = `GoCrack`
  }

  next()
})

export default router
