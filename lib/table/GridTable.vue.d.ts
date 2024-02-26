import { type VNode } from 'vue';
import { type Column, type ListItem, type MergeCell } from '../type';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_TypePropsToRuntimeProps<{
    list: ListItem[];
    rowKey?: string | number | undefined;
    rowMinHeight?: number | undefined;
    defaultExpandAll?: boolean | undefined;
    merges?: MergeCell[] | undefined;
    selection?: boolean | undefined;
    groupConfig?: {
        columnId: string;
        sort: "desc" | "asc";
    }[] | undefined;
    border: boolean;
    stripe: boolean;
    showTreeLine: boolean;
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
        areas: import("../type").SelectedCells[][];
        cells: import("../type").SelectedCells[];
    }) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    list: ListItem[];
    rowKey?: string | number | undefined;
    rowMinHeight?: number | undefined;
    defaultExpandAll?: boolean | undefined;
    merges?: MergeCell[] | undefined;
    selection?: boolean | undefined;
    groupConfig?: {
        columnId: string;
        sort: "desc" | "asc";
    }[] | undefined;
    border: boolean;
    stripe: boolean;
    showTreeLine: boolean;
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
        areas: import("../type").SelectedCells[][];
        cells: import("../type").SelectedCells[];
    }) => any) | undefined;
}, {}, {}>, Readonly<{
    empty?: (() => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>) | undefined;
    default?: (() => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[]) | undefined;
}> & {
    empty?: (() => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>) | undefined;
    default?: (() => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[]) | undefined;
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
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
