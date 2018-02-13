export interface StartSync {
  readonly type : 'start-sync'
}
export const startSync = () : StartSync => ({
  type: 'start-sync'
});

export interface SyncProgress {
  readonly type : 'sync-progress'
  readonly message : string
}
export const syncProgress = (message : string) : SyncProgress => ({
  type: 'sync-progress',
  message
});

export interface SyncDone {
  readonly type : 'sync-done'
  readonly ok : string[]
  readonly behind : string[]
  readonly infront : string[]
  readonly diverged : string[]
}
export const syncDone = (ok : string[], behind : string[], infront : string[], diverged : string[]) : SyncDone => ({
  type: 'sync-done',
  ok,
  behind,
  infront,
  diverged
});

export interface ToggleUpload {
  readonly type : 'toggle-upload'
  readonly names : string[]
}
export const toggleUpload = (names : string[]) : ToggleUpload => ({
  type: 'toggle-upload',
  names
});

export interface ToggleDownload {
  readonly type : 'toggle-download'
  readonly names : string[]
}
export const toggleDownload = (names : string[]) : ToggleDownload => ({
  type: 'toggle-download',
  names
});

export interface SyncGo {
  readonly type : 'sync-go'
}
export const syncGo = () : SyncGo => ({
  type: 'sync-go'
});

export interface SyncComplete {
  readonly type : 'sync-complete'
}
export const syncComplete = () : SyncComplete => ({
  type: 'sync-complete'
});


export type SyncActions = StartSync |
  SyncProgress |
  SyncDone |
  ToggleUpload |
  ToggleDownload |
  SyncGo |
  SyncComplete;