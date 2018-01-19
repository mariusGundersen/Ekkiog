
export type GitProgressMessage = {
  readonly type : 'GitProgressMessage'
  readonly message : string
}
export const gitProgressMessage = (message : string) : GitProgressMessage => ({
  type: 'GitProgressMessage',
  message
});

export type GitProgressStatus = {
  readonly type : 'GitProgressStatus'
  readonly status : 'busy' | 'success' | 'failure'
}
export const gitProgressStatus = (status : 'busy' | 'success' | 'failure') : GitProgressStatus => ({
  type: 'GitProgressStatus',
  status
});

export type GitPopupActions =
  GitProgressMessage |
  GitProgressStatus;