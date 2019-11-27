import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';
import { Dispatch } from 'redux';

import {
  fitBox,
  Action
} from '../actions';
import { SelectionState } from '../reduce/selection';
import { ContextState } from '../reduce/context';

import { ContextMenuState } from '../reduce/contextMenu';
import { viewportToTile } from '../reduce/perspective';
import { ViewState } from '../reduce/view';
import Canvas from './Canvas';
import TouchEngine from '../interaction/TouchEngine';
import { SimulationState } from '../reduce/simulation';

export interface Props {
  readonly simulation: SimulationState,
  readonly view: ViewState,
  readonly selection: SelectionState,
  readonly contextMenu: ContextMenuState,
  readonly context: ContextState,
  readonly dispatch: Dispatch<Action>
}

export default function WebGLCanvas(props: Props) {
  const perspective = useCurrent(props.view.perspective);
  const context = useCurrent(props.context);
  const selection = useCurrent(props.selection);
  const simulation = useCurrent(props.simulation);

  const [touchEngine, canvas] = useRefCallback((canvas: HTMLCanvasElement) => {
    const touchEngine = new TouchEngine(canvas, (x, y) => viewportToTile(perspective.current, x, y), props.dispatch);

    onAnimationFrame(delta => {
      const zoomEase = context.current.ease.next(delta);

      if (!zoomEase.done) {
        props.dispatch(fitBox(zoomEase.value));
      }

      const simulationMenuEase = simulation.current.ease.next(delta);
      const top = simulationMenuEase.done ? (simulation.current.show ? 1 : 0) : simulationMenuEase.value[0];
      touchEngine.onAnimationFrame(perspective.current, selection.current, (top * (64 + 48) - 64) * window.devicePixelRatio);
    });

    return touchEngine;
  });

  const previousForest = usePrevious(props.context.forest);
  const previousSelection = usePrevious(props.selection);
  const previousButtonTree = usePrevious(props.context.buttonTree);

  useEffect(() => {
    if (!touchEngine.current) return;

    touchEngine.current.diff(previousForest, previousButtonTree, props.context.forest, props.context.buttonTree);
    touchEngine.current.diffMove(previousSelection, props.selection);
    touchEngine.current.updateTouches(props.contextMenu.type === 'show', props.selection);
  });

  useInterval(() => {
    if (!touchEngine.current) return;

    touchEngine.current.onTick(props.simulation.step);
  }, props.simulation.tickInterval);

  useEffect(() => {
    if (!touchEngine.current) return;

    touchEngine.current.onTick(props.simulation.step);
  }, [props.simulation.step])

  useEffect(() => {
    if (!touchEngine.current) return;

    touchEngine.current.setViewport(props.view.pixelWidth, props.view.pixelHeight);
  }, [props.view.pixelWidth, props.view.pixelHeight, touchEngine.current]);

  return (
    <Canvas
      ref={canvas}
      width={props.view.pixelWidth}
      height={props.view.pixelHeight} />
  );
};

function onAnimationFrame(render: (delta: number) => void) {
  let earlier = window.performance.now();
  const onFrameRequest = (now: number) => {
    window.requestAnimationFrame(onFrameRequest);
    render(now - earlier);
    earlier = now;
  }
  window.requestAnimationFrame(onFrameRequest);
}

function useRefCallback<In, Out>(map: (input: In) => Out): [React.MutableRefObject<Out | undefined>, (input: In) => void] {
  const ref = useRef<Out>();
  const callback = useCallback(input => {
    ref.current = map(input);
  }, []);

  return [ref, callback];
}

function useCurrent<T>(value: T) {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useInterval(effect: () => void, interval: number) {
  return useEffect(() => {
    if (interval === Infinity) return;

    const delta = Math.max(16, interval);

    const intval = setInterval(() => {
      for (let d = 0; d < delta; d += interval) {
        effect();
      }
    }, delta);

    return () => clearInterval(intval);
  }, [interval]);
}