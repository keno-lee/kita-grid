import type { VNode } from 'vue';
import type { JSX } from 'vue/jsx-runtime';
export declare enum ColumnType {
    Index = "index",
    Title = "title",
    Checkbox = "checkbox",
    Expand = "expand",
    Text = "text"
}
/**
 * 用户配置时的列配置
 */
export type Column = {
    field?: string;
    title?: string;
    type?: ColumnType;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    resizable?: boolean;
    fixed?: 'left' | 'right' | '';
    align?: 'left' | 'right' | 'center';
    headerAlign?: 'left' | 'right' | 'center';
    children?: Column[];
    className?: string;
    headerRender?: (column: Column) => VNode | JSX.Element;
    bodyRender?: (column: Column, row: ListItem) => VNode | JSX.Element;
    index?: (index: number) => number;
    colIndex?: number;
    /**
     * 是否超宽显示...+tooltip 还没用上
     */
    ellipsis?: boolean;
    /**
     * 列排序
     */
    sort?: {
        sortDirections: ('ascend' | 'descend')[];
        sortOrder: 'ascend' | 'descend' | boolean;
        sorter: ((a: ListItem, b: ListItem, extra: {
            id: string;
            direction: 'ascend' | 'descend';
        }) => number) | boolean;
    };
};
/**
 * 经过格式化后，内部使用的列配置
 */
export type ColumnItem = Column & {
    _id: string;
    children: ColumnItem[];
};
export interface MergeCell {
    rowIndex: number;
    colIndex: number;
    rowspan: number;
    colspan: number;
}
export type ListItem<T extends Record<string, unknown> = Record<string, unknown>> = {
    id: string;
    type?: 'group' | 'expand' | 'item';
    children?: ListItem<T>[];
    level?: number;
    groupLevel?: number;
    isLastChild?: boolean;
} & T;
export declare enum CellEventEnum {
    CellClick = "cellClick",
    CellDblclick = "cellDblclick",
    CellContextmenu = "cellContextmenu"
}
export declare enum RowEventEnum {
    RowClick = "rowClick",
    RowDblclick = "rowDblclick",
    RowContextmenu = "rowContextmenu"
}
export declare enum HeaderEventEnum {
    HeaderClick = "headerClick",
    HeaderDblclick = "headerDblclick",
    HeaderContextmenu = "headerContextmenu"
}
export declare enum TableEventEnum {
    ExpandChange = "expandChange",
    BoxSelection = "boxSelection"
}
export type HeaderEmits = {
    (eventName: HeaderEventEnum.HeaderClick, data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }): void;
    (eventName: HeaderEventEnum.HeaderDblclick, data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }): void;
    (eventName: HeaderEventEnum.HeaderContextmenu, data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }): void;
};
export type RowEmits = {
    (eventName: RowEventEnum.RowClick, data: {
        event: Event;
        column: Column;
        row: ListItem;
        rowIndex: number;
    }): void;
    (eventName: RowEventEnum.RowDblclick, data: {
        event: Event;
        column: Column;
        row: ListItem;
        rowIndex: number;
    }): void;
    (eventName: RowEventEnum.RowContextmenu, data: {
        event: Event;
        column: Column;
        row: ListItem;
        rowIndex: number;
    }): void;
};
export type CellEmits = {
    (eventName: CellEventEnum.CellClick, data: {
        event: Event;
        column: Column;
        columnIndex: number;
        row: ListItem;
        rowIndex: number;
        cell: string;
    }): void;
    (eventName: CellEventEnum.CellDblclick, data: {
        column: Column;
        columnIndex: number;
        row: ListItem;
        rowIndex: number;
        cell: string;
    }): void;
    (eventName: CellEventEnum.CellContextmenu, data: {
        column: Column;
        columnIndex: number;
        row: ListItem;
        rowIndex: number;
        cell: string;
    }): void;
};
export type TableEmits = {
    (eventName: TableEventEnum.ExpandChange, data: {
        rowKey: string;
        rowKeys: string[];
    }): void;
    (eventName: TableEventEnum.BoxSelection, data: {
        areas: SelectedCells[][];
        cells: SelectedCells[];
    }): void;
};
export interface SelectedCells {
    row: ListItem;
    rowIndex: number;
    column: Column;
    columnIndex: number;
}
