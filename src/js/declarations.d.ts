declare const __DEV__ : boolean;

declare module "*.glsl" {
  const content : string;
  export default content;
}

declare module "*.png" {
  const content : string;
  export default content;
}

declare module "*.css" {
  const style : {
    [key : string] : string
  }
  export default style;
}

declare module "*.scss" {
  const style : {
    [key : string] : string
  }
  export default style;
}

declare module "gl-shader" {
  export interface GlShader {
    bind() : void,
    uniforms : {
      [key : string] : number | Float32Array | number[]
    }
  }
  export default function(gl : WebGLRenderingContext, vertexShaderSource : string, fragmentShaderSource : string) : GlShader;
}

declare module "ndarray" {
  function ndarray(data: Data, shape?: number[], stride?: number[], offset?: number): NdArray;

  type Data =
    Array<number> | Int8Array | Int16Array | Int32Array |
    Uint8Array | Uint16Array | Uint32Array |
    Float32Array | Float64Array | Uint8ClampedArray;

  export interface NdArray {
    data: Data;
    shape: number[];
    stride: number[];
    offset: number;
    dtype: 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' |'uint32' |
           'float32' | 'float64' | 'array'| 'uint8_clamped' | 'buffer' | 'generic';
    size: number;
    order: number[];
    dimension: number;
    get(...args: number[]): number;
    set(...args: number[]): number;
    index(...args: number[]): number;
    lo(...args: number[]): NdArray;
    hi(...args: number[]): NdArray;
    step(...args: number[]): NdArray;
    transpose(...args: number[]): NdArray;
    pick(...args: number[]): NdArray;
  }

  export default ndarray;
}


declare module "event-saga" {
  import { EventEmitter } from 'events';

  export interface Identifiable<T> {
    id : T
  }

  export interface Saga<Data, T> extends Identifiable<T> {
    data : Data;
    emit<EventData>(event : string, data : EventData) : void;
    setTimeout(event : string, time : number) : void;
    setTimeout<TimeoutData>(event : string, data : TimeoutData, time : number) : void;
    clearTimeout(event : string) : void;
    done() : void;
  }

  export interface SagaFactory<Data, T> {
    createOn<EventData>(event : string, handle : (this : Saga<Data, T>, data : EventData, actor : Saga<Data, T>) => void) : void;

    on<EventData>(event : string, handle : (this : Saga<Data, T>, data : EventData, actor : Saga<Data, T>) => void) : void;
  }

  export default class EventSaga<Data, T>{
    constructor(eventEmitter : EventEmitter, factory : (saga : SagaFactory<Data, T>) => void);
  }
}

declare module "offline-plugin/runtime" {
  export interface InstallParams {
    onInstalled? : () => void;
    onUpdating? : () => void;
    onUpdateReady? : () => void;
  }

  class Offline {
    install(params : InstallParams) : void;
    applyUpdate() : void;
  }

  export default new Offline;
}

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__<R>(a: R) : R
}