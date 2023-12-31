export const TZ = 'Asia/Shanghai'

export const APIS = {
  lists: '/api/v1/lists',
  tweets: '/api/v1/tweets',
} as const

export const DAY_LIMIT = 9

export enum EHotkeys {
  backTop = 't',
  markAllAsRead = 'm',
  hideAllReads = 'r',
  hideAllErrors = 'e',
}

export enum EClassHook {
  markAllAsRead = 'J_mark-all-as-read',
}