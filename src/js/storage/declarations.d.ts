
declare module 'common' {
  export type Callback<T> = (cb : (err : any, value : T) => void) => void;
  export type TYPE = 'tree' | 'blob' | 'file' | 'exe' | 'sym' | 'commit' | 'text';
}

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
  import { Callback, TYPE } from 'common';

  export { TYPE };

  export interface MemDb {
    saveAs<T>(type : TYPE, value : T) : Callback<string>;
    loadAs<T>(type : TYPE, hash : string) : Callback<T>;
    updateRef(ref : string, hash : string) : Callback<void>;
    readRef(ref : string) : Callback<string>;
  }
  export default function mixin(repo : {}) : void;
}
declare module 'js-git/mixins/create-tree' {

}
declare module 'js-git/mixins/pack-ops' {

}
declare module 'js-git/mixins/walkers' {
  import { Callback, TYPE } from 'common';

  export { TYPE };
  export interface Walker {
    read() : Callback<{mode : TYPE, hash : string, path : string}>;
  }

  export interface Walkers {
    treeWalk(ref : string) : Callback<Walker>
  }
  export default function mixin(repo : {}) : void;
}
declare module 'js-git/mixins/read-combiner' {

}
declare module 'js-git/mixins/formats' {
  export default function mixin(repo : {}) : void;
}