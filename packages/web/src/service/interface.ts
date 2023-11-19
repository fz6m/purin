export interface IListItem {
  id: string
  name: string
  cover: string
}

export interface ITweetsReq {
  /**
   * YYYY-MM-DD
   */
  date: string
  list: string
}
