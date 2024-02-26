import { type ListItem, type MergeCell, type Column } from './type';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    columns: Column[];
    list: ListItem[];
    rowKey?: string | number | undefined;
    rowMinHeight?: number | undefined;
    showHeader?: boolean | undefined;
    defaultExpandAll?: boolean | undefined;
    border?: boolean | undefined;
    stripe?: boolean | undefined;
    showTreeLine?: boolean | undefined;
    selection?: boolean | undefined;
    highlightCurrentRow?: boolean | undefined;
    highlightCurrentColumn?: boolean | undefined;
    merges?: MergeCell[] | undefined;
    groupConfig?: {
        columnId: string;
        sort: "desc" | "asc";
    }[] | undefined;
    headerRowClassName?: ((data: {
        row: Column[];
        rowIndex: number;
    }) => string) | undefined;
    headerRowStyle?: ((data: {
        row: Column[];
        rowIndex: number;
    }) => string) | undefined;
    headerCellClassName?: ((data: {
        row: Column[];
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
    headerCellStyle?: ((data: {
        row: Column[];
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
    rowClassName?: ((data: {
        row: ListItem;
        rowIndex: number;
    }) => string) | undefined;
    rowStyle?: ((data: {
        row: ListItem;
        rowIndex: number;
    }) => string) | undefined;
    cellClassName?: ((data: {
        row: ListItem;
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
    cellStyle?: ((data: {
        row: ListItem;
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
}>, {
    columns: () => never[];
    list: () => never[];
    rowKey: string;
    rowMinHeight: number;
    showHeader: boolean;
    defaultExpandAll: boolean;
    border: boolean;
    stripe: boolean;
    showTreeLine: boolean;
    selection: boolean;
    highlightCurrentRow: boolean;
    highlightCurrentColumn: boolean;
    headerRowClassName: () => "";
    headerRowStyle: () => "";
    headerCellClassName: () => "";
    headerCellStyle: () => "";
    rowClassName: () => "";
    rowStyle: () => "";
    cellClassName: () => "";
    cellStyle: () => "";
    merges: () => never[];
    groupConfig: () => never[];
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cellClick: (data: {
        event: Event;
        column: Column;
        columnIndex: number;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
        cell: string;
    }) => void;
    cellDblclick: (data: {
        column: Column;
        columnIndex: number;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
        cell: string;
    }) => void;
    cellContextmenu: (data: {
        column: Column;
        columnIndex: number;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
        cell: string;
    }) => void;
    rowClick: (data: {
        event: Event;
        column: Column;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
    }) => void;
    rowDblclick: (data: {
        event: Event;
        column: Column;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
    }) => void;
    rowContextmenu: (data: {
        event: Event;
        column: Column;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
    }) => void;
    headerClick: (data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }) => void;
    headerDblclick: (data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }) => void;
    headerContextmenu: (data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }) => void;
    expandChange: (data: {
        rowKey: string;
        rowKeys: string[];
    }) => void;
    boxSelection: (data: {
        areas: import("./type").SelectedCells[][];
        cells: import("./type").SelectedCells[];
    }) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    columns: Column[];
    list: ListItem[];
    rowKey?: string | number | undefined;
    rowMinHeight?: number | undefined;
    showHeader?: boolean | undefined;
    defaultExpandAll?: boolean | undefined;
    border?: boolean | undefined;
    stripe?: boolean | undefined;
    showTreeLine?: boolean | undefined;
    selection?: boolean | undefined;
    highlightCurrentRow?: boolean | undefined;
    highlightCurrentColumn?: boolean | undefined;
    merges?: MergeCell[] | undefined;
    groupConfig?: {
        columnId: string;
        sort: "desc" | "asc";
    }[] | undefined;
    headerRowClassName?: ((data: {
        row: Column[];
        rowIndex: number;
    }) => string) | undefined;
    headerRowStyle?: ((data: {
        row: Column[];
        rowIndex: number;
    }) => string) | undefined;
    headerCellClassName?: ((data: {
        row: Column[];
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
    headerCellStyle?: ((data: {
        row: Column[];
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
    rowClassName?: ((data: {
        row: ListItem;
        rowIndex: number;
    }) => string) | undefined;
    rowStyle?: ((data: {
        row: ListItem;
        rowIndex: number;
    }) => string) | undefined;
    cellClassName?: ((data: {
        row: ListItem;
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
    cellStyle?: ((data: {
        row: ListItem;
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string) | undefined;
}>, {
    columns: () => never[];
    list: () => never[];
    rowKey: string;
    rowMinHeight: number;
    showHeader: boolean;
    defaultExpandAll: boolean;
    border: boolean;
    stripe: boolean;
    showTreeLine: boolean;
    selection: boolean;
    highlightCurrentRow: boolean;
    highlightCurrentColumn: boolean;
    headerRowClassName: () => "";
    headerRowStyle: () => "";
    headerCellClassName: () => "";
    headerCellStyle: () => "";
    rowClassName: () => "";
    rowStyle: () => "";
    cellClassName: () => "";
    cellStyle: () => "";
    merges: () => never[];
    groupConfig: () => never[];
}>>> & {
    onCellClick?: ((data: {
        event: Event;
        column: Column;
        columnIndex: number;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
        cell: string;
    }) => any) | undefined;
    onCellDblclick?: ((data: {
        column: Column;
        columnIndex: number;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
        cell: string;
    }) => any) | undefined;
    onCellContextmenu?: ((data: {
        column: Column;
        columnIndex: number;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
        cell: string;
    }) => any) | undefined;
    onRowClick?: ((data: {
        event: Event;
        column: Column;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
    }) => any) | undefined;
    onRowDblclick?: ((data: {
        event: Event;
        column: Column;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
    }) => any) | undefined;
    onRowContextmenu?: ((data: {
        event: Event;
        column: Column;
        row: ListItem<Record<string, unknown>>;
        rowIndex: number;
    }) => any) | undefined;
    onHeaderClick?: ((data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }) => any) | undefined;
    onHeaderDblclick?: ((data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }) => any) | undefined;
    onHeaderContextmenu?: ((data: {
        event: Event;
        column: Column;
        columnIndex: number;
    }) => any) | undefined;
    onExpandChange?: ((data: {
        rowKey: string;
        rowKeys: string[];
    }) => any) | undefined;
    onBoxSelection?: ((data: {
        areas: import("./type").SelectedCells[][];
        cells: import("./type").SelectedCells[];
    }) => any) | undefined;
}, {
    list: ListItem[];
    headerRowClassName: (data: {
        row: Column[];
        rowIndex: number;
    }) => string;
    border: boolean;
    stripe: boolean;
    showTreeLine: boolean;
    selection: boolean;
    highlightCurrentRow: boolean;
    highlightCurrentColumn: boolean;
    defaultExpandAll: boolean;
    headerRowStyle: (data: {
        row: Column[];
        rowIndex: number;
    }) => string;
    headerCellClassName: (data: {
        row: Column[];
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string;
    headerCellStyle: (data: {
        row: Column[];
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string;
    rowClassName: (data: {
        row: ListItem;
        rowIndex: number;
    }) => string;
    rowStyle: (data: {
        row: ListItem;
        rowIndex: number;
    }) => string;
    cellClassName: (data: {
        row: ListItem;
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string;
    cellStyle: (data: {
        row: ListItem;
        column: Column;
        rowIndex: number;
        columnIndex: number;
    }) => string;
    columns: Column[];
    rowKey: string | number;
    rowMinHeight: number;
    showHeader: boolean;
    merges: MergeCell[];
    groupConfig: {
        columnId: string;
        sort: "desc" | "asc";
    }[];
}, {}>, {
    empty?(_: {}): any;
}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
