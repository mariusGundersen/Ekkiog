
export type SetTickIntervalAction = {
  readonly type : 'setTickInterval',
  readonly tickInterval : number
}
export const setTickInterval = (tickInterval: number) : SetTickIntervalAction => ({
  type: 'setTickInterval',
  tickInterval
});

export type SimulationTickAction = {
  readonly type : 'simulationTick',
  readonly tickCount : number
}
export const simulationTick = (tickCount: number) : SimulationTickAction => ({
  type: 'simulationTick',
  tickCount
});

export type SimulationActions =
  SetTickIntervalAction |
  SimulationTickAction;
