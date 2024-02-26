import { type Column, type ListItem, type MergeCell, type ColumnItem } from './type';
import { type HeaderCellInfo } from './utils/column';
import { GridSelection } from './interaction/selection';
import { EventEmitter } from './hooks/useEvent';
import type { VirtListReturn } from 'vue-virt-list';
import { GridScrollZone } from './interaction/scrollZone';
export type MergeInfoMap = Record<number, {
    $begin: number;
    $end: number;
    [field: number]: {
        $begin: number;
        $end: number;
        rowspan?: number;
        colspan?: number;
        mergeBy?: [number, number];
    };
}>;
export interface IUIProps {
    border: boolean;
    stripe: boolean;
    showTreeLine: boolean;
    selection: boolean;
    highlightCurrentRow: boolean;
    highlightCurrentColumn: boolean;
    defaultExpandAll: boolean;
    headerRowClassName: (data: {
        row: Column[];
        rowIndex: number;
    }) => string;
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
}
export type ISelectionBorderPos = 'left-top' | 'top' | 'right-top' | 'right' | 'right-bottom' | 'bottom' | 'left-bottom' | 'left' | 'center';
export interface IInteractionProps {
    selectBoxes: Record<string, {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }>;
    selectCellBorderMap: Record<string, ISelectionBorderPos[]>;
    selectCellClassMap: Record<string, string>;
}
export declare class GridStore {
    watchData: {
        renderKey: number;
        colRenderBegin: number;
        colRenderEnd: number;
        rowHeightMap: Map<any, any> & Omit<Map<any, any>, keyof Map<any, any>>;
        foldMap: Record<string, boolean>;
        expandMap: Record<string, boolean>;
        config: {
            rowHeight: number;
            colWidth: number;
        };
        fullWidth: number;
    };
    rowKey: string | number;
    virtualListProps: import("vue").ShallowReactive<{
        list: ListItem[];
        minSize: number;
        itemKey: string | number;
        renderControl: (begin: number, end: number) => {
            begin: number;
            end: number;
        };
    }>;
    uiProps: import("vue").ShallowReactive<IUIProps>;
    interaction: import("vue").ShallowReactive<IInteractionProps>;
    private originColumns;
    flattedColumns: ColumnItem[];
    leftFixedColumns: ColumnItem[];
    rightFixedColumns: ColumnItem[];
    centerNormalColumns: ColumnItem[];
    leftFixedHeaderColumns: ColumnItem[][];
    rightFixedHeaderColumns: ColumnItem[][];
    centerNormalHeaderColumns: ColumnItem[][];
    originList: ListItem[];
    bodyMergeMap: MergeInfoMap;
    headerCellInfo: HeaderCellInfo;
    gridSelection: GridSelection;
    gridScrollZone: GridScrollZone;
    currentRowId: import("vue").Ref<string>;
    currentColumnId: import("vue").Ref<string>;
    gridScrollingStatus: import("vue").Ref<string>;
    tableRootEl: HTMLElement | undefined;
    virtualListRef: VirtListReturn<ListItem<Record<string, string>>> | undefined;
    gridRowMap: Record<string, ListItem>;
    eventEmitter: EventEmitter;
    constructor();
    forceUpdate(): void;
    setRowKey(key: string | number): void;
    setRowMinHeight(minHeight: number): void;
    setColumns(columns: Column[]): void;
    setColumnWidth(id: string, width: number): void;
    setList(list: ListItem[]): void;
    setOriginList(list: ListItem[]): void;
    setTableRootEl(el: HTMLElement): void;
    generateFlatList(): ListItem[];
    resetFlatList(): ListItem[];
    mergeFunction(rowIndex: number, colIndex: number): {
        rowspan: number;
        colspan: number;
    } | undefined;
    mergeMapConstructorWithFunction(): Record<number, {
        $begin: number;
        $end: number;
        rowspan?: number | undefined;
        colspan?: number | undefined;
        mergeBy?: [number, number] | undefined;
    } & Record<number, {
        $begin: number;
        $end: number;
        rowspan?: number | undefined;
        colspan?: number | undefined;
        mergeBy?: [number, number] | undefined;
    }>>;
    mergeMapConstructor(cellList: MergeCell[]): Record<number, {
        $begin: number;
        $end: number;
        rowspan?: number | undefined;
        colspan?: number | undefined;
        mergeBy?: [number, number] | undefined;
    } & Record<number, {
        $begin: number;
        $end: number;
        rowspan?: number | undefined;
        colspan?: number | undefined;
        mergeBy?: [number, number] | undefined;
    }>>;
    groupFoldConstructor(list: ListItem[], conditions: {
        columnId: string;
        sort: 'desc' | 'asc';
    }[]): ListItem[];
    constructGroup(list: ListItem[], conditionIndex: number, conditions: {
        columnId: string;
        sort: 'desc' | 'asc';
    }[]): ListItem[];
    toggleFold(id: string): void;
    toggleExpand(id: string): void;
    setUIProps<T extends keyof IUIProps>(key: T, value: IUIProps[T]): void;
    getUIProps<T extends keyof IUIProps>(key: T): IUIProps[T];
    handleSelectionChange: (id: string, area: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }, isMultiple: boolean) => void;
    expandMergedSelectArea(area: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    selectCellClassConstructor(selectRenderMap: Record<string, ISelectionBorderPos[]>, rowIndex: number, colIndex: number, rowspan?: number, colspan?: number): string;
    getSelectionClass(rowIndex: number, column: Column): string;
    initSelectionElement(el: HTMLElement): void;
    getCurrentRow(): string;
    setCurrentRow(v: string): void;
    getCurrentColumn(): string;
    setCurrentColumn(v: string): void;
    setRowSelection(areaId: string | undefined, startRowIndex: number, endRowIndex: number, isMulti: boolean): void;
    setColumnSelection(areaId: string | undefined, startColumnIndex: number, endColumnIndex: number, isMulti: boolean): void;
    initVirtualListRef(elRef: GridStore['virtualListRef']): void;
    calcGridScrollingStatus(scrollLeft: number, scrollWidth: number, clientWidth: number): void;
}
