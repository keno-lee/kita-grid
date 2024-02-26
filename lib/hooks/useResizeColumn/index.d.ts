import './index.scss';
import type { ColumnItem } from '@/src/type';
export declare function useResizeColumn(columnEl: HTMLElement, headerInfo: ColumnItem, tableRootEl: HTMLElement, cb: (width: number) => void): void;
