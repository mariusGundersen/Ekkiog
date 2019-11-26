
export type SetTickIntervalAction = {
  readonly type: 'setTickInterval',
  readonly tickInterval: number
}
export const setTickInterval = (tickInterval: number): SetTickIntervalAction => ({
  type: 'setTickInterval',
  tickInterval
});

export type StepForwardAction = {
  readonly type: 'stepForward'
}
export const stepForward = (): StepForwardAction => ({
  type: 'stepForward'
});

export type ToggleShowAction = {
  readonly type: 'toggleShow'
  readonly show: boolean
}
export const toggleShow = (show: boolean): ToggleShowAction => ({
  type: 'toggleShow',
  show
});

export type SimulationActions =
  SetTickIntervalAction |
  StepForwardAction |
  ToggleShowAction;
