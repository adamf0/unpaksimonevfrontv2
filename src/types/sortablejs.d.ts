declare module "sortablejs" {
  export interface Options {
    animation?: number;
    handle?: string;
    draggable?: string;
    ghostClass?: string;
    group?: any;
    fallbackOnBody?: boolean;
    swapThreshold?: number;
    invertSwap?: boolean;
    fallbackTolerance?: number;
    dragoverBubble?: boolean;
    onEnd?: (evt: any) => void;
  }

  export default class Sortable {
    constructor(el: HTMLElement, options?: Options);
    destroy(): void;
    el: HTMLElement;
  }
}