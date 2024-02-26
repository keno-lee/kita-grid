import './popper.scss';
import type { App } from 'vue';
export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-start' | 'bottom-start' | 'left-start' | 'right-start' | 'top-end' | 'bottom-end' | 'left-end' | 'right-end';
export type Options = {
    placement?: Placement;
    offset?: [number, number];
    mountEl?: HTMLElement | null;
    scrollTrigger?: HTMLElement;
    overflowTrigger?: HTMLElement;
    beforeClose?: () => void;
    mounted?: (el: HTMLElement) => void;
    popperClass?: string;
    onEnter?: () => void;
    onOver?: () => void;
    onLeave?: () => void;
    onOverflow?: () => void;
    onInView?: () => void;
    showArrow?: boolean;
    autoWidth?: boolean;
    width?: string | number;
    manual?: boolean;
    padding?: [number, number];
    allowOverflow?: boolean;
    followScroll?: boolean;
    zIndex?: number;
    autoAdjustAlign?: boolean;
};
export interface ElementRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ILmsPopper {
    close: () => void;
    updatePopper: () => void;
    destroy: () => void;
    popperElement?: HTMLDivElement;
}
export interface IVirtualElement {
    getBoundingClientRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    } | DOMRect | void;
}
export declare const createPopper: (reference?: HTMLElement | IVirtualElement, popper?: HTMLElement | App, customOptions?: Options) => ILmsPopper;
