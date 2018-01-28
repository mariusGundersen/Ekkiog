
export type SetTickIntervalAction = {
  readonly type : 'setTickInterval',
  readonly tickInterval : number
}
export const setTickInterval = (tickInterval: number) : SetTickIntervalAction => ({
  type: 'setTickInterval',
  tickInterval
});

export type SimulationActions =
  SetTickIntervalAction;
