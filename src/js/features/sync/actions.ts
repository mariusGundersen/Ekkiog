export interface StartSync {
  readonly type : 'start-sync'
}
export const startSync = () : StartSync => ({
  type : 'start-sync'
});

export interface SyncProgress {
  readonly type : 'sync-progress'
  readonly message : string
}
export const syncProgress = (message : string) : SyncProgress => ({
  type : 'sync-progress',
  message
});

export interface SyncList {
  readonly type : 'sync-list'
  readonly names : string[]
}
export const syncList = (names : string[]) : SyncList => ({
  type : 'sync-list',
  names
});

export interface SyncStatus {
  readonly type : 'sync-status'
  readonly name : string
  readonly status : 'ok' | 'pull' | 'push' | 'pull-push'
}
export const syncStatus = (name: string, status : 'ok' | 'pull' | 'push' | 'pull-push') : SyncStatus => ({
  type : 'sync-status',
  name,
  status
});

export type SyncActions = StartSync |
  SyncProgress |
  SyncList |
  SyncStatus;