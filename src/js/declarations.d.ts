declare module "*.glsl" {
  var content : string;
  export default content;
}

declare module "*.png" {
  var content : string;
  export default content;
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

declare module "gl-buffer" {

  export interface GlBuffer{
    bind() : void
  }

  export default function createBuffer(gl : WebGLRenderingContext, source : Float32Array | Uint16Array, type? : number) : GlBuffer;
}

declare module "gl-vao" {

  import { GlBuffer } from "gl-buffer";

  export interface GlVAO {
    bind() : void;
    draw(type : number, count : number) : void;
  }

  export default function createVAO(gl : WebGLRenderingContext, definiton : any[], indexBuffer : GlBuffer, type : number) : GlVAO;
}

declare module "a-big-triangle"{
  export default function(gl : WebGLRenderingContext) : void;
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