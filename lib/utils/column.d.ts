import type { Column, ColumnItem } from '../type';
export interface FormatColumns {
    headerCellInfo: HeaderCellInfo;
    flattedColumns: ColumnItem[];
    leftFixedColumns: ColumnItem[];
    rightFixedColumns: ColumnItem[];
    centerNormalColumns: ColumnItem[];
    originColumns: ColumnItem[];
    leftFixedHeaderColumns: ColumnItem[][];
    rightFixedHeaderColumns: ColumnItem[][];
    centerNormalHeaderColumns: ColumnItem[][];
}
export type HeaderCellInfo = Record<string | number, ColumnItem & {
    rowspan?: number;
    colspan?: number;
    level?: number;
    leftColspan?: number;
    fixed?: 'left' | 'right' | '';
    parentId?: string | number;
    parentColumn?: ColumnItem;
    rendered?: boolean;
    isLeaf?: boolean;
    left?: number;
    right?: number;
}>;
export declare const formatColumns: (originColumns: Column[]) => FormatColumns;
