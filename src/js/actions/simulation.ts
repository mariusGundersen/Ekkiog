
export type SetTickIntervalAction = {
  readonly type : 'setTickInterval',
  readonly tickInterval : number
}
export const setTickInterval = (tickInterval: number) : SetTickIntervalAction => ({
  type: 'setTickInterval',
  tickInterval
});

export type StepForwardAction = {
  readonly type : 'stepForward'
}
export const stepForward = () : StepForwardAction => ({
  type: 'stepForward'
});

export type SimulationActions =
  SetTickIntervalAction |
  StepForwardAction;
