export const PROFILE_PIC_PATH = 'PROFILE_PIC_PATH'
export const LAST_APP_STATE = 'LAST_APP_STATE'
export const TEACHING_PLAN_STATUS = {
  COMPLETED: 'Complete',
  NOT_COMPLETE: 'Incomplete'
}
export const PRESENTATION_STATUS = {
  RUNNING: 'RUNNING',
  EXIT: 'EXIT'
}
export const IS_TEACHER_LOGGED_IN = 'IS_TEACHER_LOGGED_IN'
export const IS_PROFILE_EDITED = 'IS_PROFILE_EDITED'
export const TEACHER_PROFILE_DETAILS = 'TEACHER_PROFILE_DETAILS'
export const ACTIVATION_DETAILS = 'ACTIVATION_DETAILS'
export const ACTIVATION_DEVICE_STATUS = {
  ACTIVATED: 'ACTIVATED',
  SURRENDERED: 'SURRENDERED'
}
export const LOGOUT_PROCESS_STATUS = {
  CONFIRMING: 'CONFIRMING',
  CANCELLED: 'CANCELLED',
  PROCESSING: 'PROCESSING',
  DONE: 'DONE'
}
export const TEMPLATE_LIST = 'TEMPLATE_LIST'
export const APPLICATION_CONFIG = {
  SUPERSCHOOL: 'org.mkcl.os.ssteacher',
  SUPERCOLLEGE: 'org.mkcl.os.scteacher'
}
export const QUESTION_TYPES = {
  MCQ: 'Mcq',
  MCMQ: 'Mcmq',
  FIB: 'Fib',
  TF: 'Tf',
  MTP: 'Mtp',
  COMPHEN: 'Comphen',
  DRAGDROP: 'DragDrop',
  CLASSIFICATION: 'Classification',
  PARASEQ: 'ParaSeq'

}
export const ClassroomModes = {
  offline: 'offline',
  online: 'online'
}
export const MediaSources = {
  youtube: 'youtube',
  streamServer: 'streamServer'
}
export const SERVER_PORT = 40031
// export const RASPBERRY_PI_SERVER_IP = "10.4.0.59"
export const RASPBERRY_PI_SERVER_IP = '10.20.10.1'
export const WELCOME_PAGE_AUTO_REDIRECTED = 'WELCOME_PAGE_AUTO_REDIRECTED'
export const NETWORK_TIMEOUT = 5000
export const GOOGLE_ANALYTICS_TRACKINGID = process.env.VUE_GOOGLE_ANALYTICS_TRACKINGID
export const APP_STORE_ID = process.env.VUE_APP_STORE_ID

// Environment Varibles
// console.log(process.env)
export const VUE_APP_GATEWAY_SERVER_URL = process.env.VUE_APP_GATEWAY_SERVER_URL
