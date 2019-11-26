import { merge, fromEvent, of } from "rxjs";
import Engine from "../engines/Engine";
import TouchControls from "./TouchControls";
import { Dispatch, AnyAction } from "redux";
import { mat3 } from "gl-matrix";
import Ticker from "./Ticker";
import { SelectionState } from "../reduce/selection";
import { Perspective, recalculate } from "../reduce/perspective";
import { panZoom } from "../actions";
import { Forest } from "../editing";
import forestHandler from "../editing/forestHandler";
import moveHandler from "../editing/moveHandler";
import { ButtonNode } from "../reduce/buttonTree";
import buttonHandler from "../editing/buttonHandler";
import { switchMap, tap } from "rxjs/operators";

export default class TouchEngine {
  private readonly engine: Engine;
  private readonly touchControls: TouchControls;
  private readonly dispatch: Dispatch<AnyAction>;
  private readonly matrix: mat3;
  private readonly ticker: Ticker;
  constructor(canvas: HTMLCanvasElement, viewportToTile: (x: number, y: number) => [number, number], dispatch: Dispatch<AnyAction>) {
    const gl = getContext(canvas);
    this.engine = new Engine(gl, 100, 100);

    const touches = getTouchEvents(canvas, viewportToTile);

    this.touchControls = new TouchControls(touches, dispatch);
    this.dispatch = dispatch;
    this.matrix = mat3.create();

    this.ticker = new Ticker(tickCount => {
      this.engine.simulate(tickCount);
      this.engine.test(tickCount);
    });
  }

  setViewport(width: number, height: number) {
    this.engine.setViewport(width, height);
  }

  updateTouches(showMenu: boolean, selection: SelectionState) {
    this.touchControls.setSelection(selection);

    if (showMenu || selection) {
      this.touchControls.disable();
    } else {
      this.touchControls.enable();
    }
  }

  onAnimationFrame(perspective: Perspective, selection: SelectionState, top: number) {
    const changed = this.touchControls.getChangedTouches();
    if (changed.length) {
      this.dispatch(panZoom(changed));
    } else {
      this.render(perspective, selection, top);
    }
  }

  setTick(tickInterval: number, delta: number) {
    this.ticker.setTickInterval(tickInterval);
    this.ticker.tick(delta);
  }

  diffForest(before: Forest, after: Forest) {
    forestHandler(before, after, this.engine);
  }

  diffMove(before: SelectionState, after: SelectionState) {
    moveHandler(before, after, this.engine);
  }

  diffButton(before: ButtonNode, after: ButtonNode) {
    buttonHandler(before, after, this.engine);
  }

  render(perspective: Perspective, selection: SelectionState, top: number) {
    const mapToViewportMatrix = recalculate(perspective, this.matrix);
    this.engine.render(mapToViewportMatrix, top);

    if (selection) {
      this.engine.renderMove(
        mapToViewportMatrix,
        selection,
        selection.dx,
        selection.dy);
    }
  }
}

function getTouchEvents(canvas: HTMLCanvasElement, viewportToTile: (x: number, y: number) => [number, number]) {
  return merge(
    fromEvent<TouchEvent>(canvas, 'touchstart'),
    fromEvent<TouchEvent>(canvas, 'touchmove'),
    fromEvent<TouchEvent>(canvas, 'touchend')
  ).pipe(
    tap(e => e.preventDefault()),
    switchMap(handle(viewportToTile))
  );
}

function handle(viewportToTile: (x: number, y: number) => [number, number]) {
  return (event: TouchEvent) => of(...Array.from(event.changedTouches)
    .map(touch => {
      const x = touch.pageX * window.devicePixelRatio;
      const y = touch.pageY * window.devicePixelRatio;
      const [tx, ty] = viewportToTile(x, y);
      return {
        type: event.type,
        id: touch.identifier,
        x,
        y,
        tx,
        ty
      };
    }))
}

function getContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
  return canvas.getContext("webgl", {})
    || (() => { throw new Error("no webgle here") })();
}
