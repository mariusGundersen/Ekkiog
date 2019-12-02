
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

export type RewindAction = {
  readonly type: 'rewind'
}
export const rewind = (): RewindAction => ({
  type: 'rewind'
});

export type TickAction = {
  readonly type: 'tick',
  readonly ticks: number
}
export const tick = (ticks: number): TickAction => ({
  type: 'tick',
  ticks
});

export type ToggleLoopAction = {
  readonly type: 'toggle-loop'
}
export const toggleLoop = (): ToggleLoopAction => ({
  type: 'toggle-loop'
});

export type SimulationActions =
  SetTickIntervalAction |
  StepForwardAction |
  ToggleShowAction |
  RewindAction |
  TickAction |
  ToggleLoopAction;
