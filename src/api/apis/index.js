import auth from './auth'
import dashboard from './dashboard'
import tasks from './tasks'
import auditing from './auditing'
import hashcat from './hashcat'
import users from './users'
import filemanager from './filemanager'
import system from './system'

var wrapConfig = function (fn, cfg) {
  return function () {
    return fn.apply(this, [cfg, ...arguments])
  }
}

export default {
  wrapAPIWithConfig (config) {
    return {
      // ./system
      getVersionInfo: wrapConfig(system.getVersionInfo, config),
      // ./auth
      login: wrapConfig(auth.loginUser, config),
      // ./dashboard
      getWorkers: wrapConfig(dashboard.getWorkers, config),
      // ./tasks
      getTasks: wrapConfig(tasks.getTasks, config),
      getTaskInfo: wrapConfig(tasks.getTaskInfo, config),
      modifyTask: wrapConfig(tasks.modifyTask, config),
      getPasswords: wrapConfig(tasks.getCrackedPasswords, config),
      createTask: wrapConfig(tasks.createTask, config),
      modifyTaskStatus: wrapConfig(tasks.modifyTaskStatus, config),
      deleteTask: wrapConfig(tasks.deleteTask, config),
      // ./auditing
      getAuditLog: wrapConfig(auditing.getAuditLog, config),
      // ./hashcat
      getHashcatTypes: wrapConfig(hashcat.getHashcatTypes, config),
      // ./users
      getUsers: wrapConfig(users.getUsers, config),
      getUserInfo: wrapConfig(users.getUserInfo, config),
      modifyUserInfo: wrapConfig(users.modifyUserInfo, config),
      createUser: wrapConfig(users.createUser, config),
      // ./filemanager
      getTaskFiles: wrapConfig(filemanager.getTaskFiles, config),
      getEngineFiles: wrapConfig(filemanager.getEngineFiles, config),
      uploadFile: wrapConfig(filemanager.uploadFile, config),
      downloadFile: wrapConfig(filemanager.downloadFile, config),
      deleteFile: wrapConfig(filemanager.deleteFile, config)
    }
  }
}
