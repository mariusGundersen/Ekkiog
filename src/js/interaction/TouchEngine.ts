import { merge, fromEvent, of } from "rxjs";
import Engine from "../engines/Engine";
import TouchControls from "./TouchControls";
import { Dispatch, AnyAction } from "redux";
import { mat3 } from "gl-matrix";
import { SelectionState } from "../reduce/selection";
import { Perspective, recalculate } from "../reduce/perspective";
import { panZoom } from "../actions";
import { Forest, createEnneaTree, diffAndReconcile } from "../editing";
import { ButtonNode, diffAndReconcile as diffAndReconcileButton } from "../reduce/buttonTree";
import { switchMap, tap } from "rxjs/operators";
import Context from "../engines/Context";

export default class TouchEngine {
  private readonly engine: Engine;
  private readonly touchControls: TouchControls;
  private readonly dispatch: Dispatch<AnyAction>;
  private readonly matrix: mat3;
  constructor(canvas: HTMLCanvasElement, viewportToTile: (x: number, y: number) => [number, number], dispatch: Dispatch<AnyAction>) {
    const gl = getContext(canvas);
    this.engine = new Engine(gl, 100, 100);

    const touches = getTouchEvents(canvas, viewportToTile);

    this.touchControls = new TouchControls(touches, dispatch);
    this.dispatch = dispatch;
    this.matrix = mat3.create();
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
    }
    this.render(perspective, selection, top);
  }

  onTick(tick: number, sample: number, loop: boolean) {
    this.engine.simulate(tick, sample, loop);
  }

  diff(beforeForest: Forest, beforeButton: ButtonNode, afterForest: Forest, afterButton: ButtonNode) {
    if (beforeForest == afterForest && beforeButton === afterButton) return;

    this.engine.mutateContext(context => {
      diffAndReconcile(context, beforeForest.enneaTree, afterForest.enneaTree);
      diffAndReconcileButton(context, beforeButton, afterButton);
      if (beforeForest.testScenario !== afterForest.testScenario) {
        context.setTestScenario(afterForest.testScenario);
      }
    })
  }

  diffMove(before: SelectionState, after: SelectionState) {
    if (before === after) return;
    this.engine.mutateMoveContext(context => diffAndReconcile(context, before ? before.enneaTree : undefined, after ? after.enneaTree : undefined));
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
