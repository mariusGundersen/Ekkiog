
declare module 'js-git/lib/modes' {
  type modes = {
    readonly tree: number,
    readonly blob: number,
    readonly file: number,
    readonly exec: number,
    readonly sym: number,
    readonly commit: number,
  }
  export default modes;
}

declare module 'js-git/mixins/mem-db' {
  export type Callback<T> = (cb : (err : any, value : T) => void) => void;

  export type TYPE = 'tree' | 'blob' | 'file' | 'exe' | 'sym' | 'commit';

  export interface MemDb {
    saveAs<T>(type : TYPE, value : T) : Callback<string>;
    loadAs<T>(type : TYPE, hash : string) : Callback<T>;
  }
  export default function mixin(repo : {}) : void;
}
declare module 'js-git/mixins/create-tree' {

}
declare module 'js-git/mixins/pack-ops' {

}
declare module 'js-git/mixins/walkers' {

}
declare module 'js-git/mixins/read-combiner' {

}
declare module 'js-git/mixins/formats' {
  export default function mixin(repo : {}) : void;
}