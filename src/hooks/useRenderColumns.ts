import { computed } from 'vue';
import { type GridStore } from '../store';
import type { MergeCell } from '../type';

function getCellSpan(rowIndex: number, colIndex: number, mergeInfoMap: Record<number, MergeCell>) {
  const mergeInfo = mergeInfoMap?.[colIndex];
  if (!mergeInfo) {
    return {
      rowspan: 1,
      colspan: 1,
    };
  }
  if (mergeInfo.rowIndex !== rowIndex || mergeInfo.colIndex !== colIndex) {
    return {
      rowspan: 0,
      colspan: 0,
    };
  }
  return {
    rowspan: mergeInfo.rowspan,
    colspan: mergeInfo.colspan,
  };
}

function handleColumns({
  currentRowMergeInfo,
  columns,
  startIndex,
  endIndex,
  offsetIndex = 0,
  rowIndex,
}: any) {
  const result: any[] = [];
  for (let colIndex = startIndex; colIndex <= endIndex; colIndex++) {
    const column = columns[colIndex];
    if (currentRowMergeInfo?.[colIndex + offsetIndex] === undefined) {
      result.push(column);
    } else if (currentRowMergeInfo?.[colIndex + offsetIndex]?.colspan !== undefined) {
      const cellSpan = getCellSpan(rowIndex, colIndex + offsetIndex, currentRowMergeInfo);
      if (cellSpan.rowspan > 0 && cellSpan.colspan > 0) {
        result.push({
          ...column,
          colspan: cellSpan.colspan,
          rowspan: cellSpan.rowspan,
        });
      }
      colIndex += (currentRowMergeInfo?.[colIndex + offsetIndex]?.colspan ?? 0) - 1;
    }
  }
  return result;
}
/**
 *
 * @param index 当前行在 mergeInfoMap 中的索引
 * @param columns 当前行的所有列
 * @param mergeInfoMap 包含合并单元格的信息
 * @param watchData 包含 colRenderBegin 和 colRenderEnd 的对象，必须是响应式的
 * @returns
 */
const useRenderColumns = (rowIndex: number, gridStore: GridStore): any => {
  // 做成一个 computed
  const data = computed(() => {
    const { watchData, leftFixedColumns, rightFixedColumns, centerNormalColumns, virtualListRef } =
      gridStore;

    // TODO: 处理好这两个值的依赖问题
    if (!virtualListRef?.reactiveData.inViewBegin && watchData.colBegin) {
      // console.warn('a');
    }

    const currentRowMergeInfo: Record<number, MergeCell> = {};
    const stack: number[] = [];

    for (let colIndex = 0; colIndex < leftFixedColumns.length; colIndex++) {
      const column = leftFixedColumns[colIndex];
      const mergeInfo = gridStore.getCellMergeInfo(rowIndex, column, stack);
      if (mergeInfo) {
        currentRowMergeInfo[column.colIndex!] = mergeInfo;
      }
    }

    for (let colIndex = 0; colIndex < rightFixedColumns.length; colIndex++) {
      const column = rightFixedColumns[colIndex];
      const mergeInfo = gridStore.getCellMergeInfo(rowIndex, column, stack);
      if (mergeInfo) {
        currentRowMergeInfo[column.colIndex!] = mergeInfo;
      }
    }
    for (let colIndex = 0; colIndex < centerNormalColumns.length; colIndex++) {
      const column = centerNormalColumns[colIndex];
      const mergeInfo = gridStore.getCellMergeInfo(rowIndex, column, stack);
      if (mergeInfo) {
        currentRowMergeInfo[column.colIndex!] = mergeInfo;
      }
    }

    const mainStartIndex = leftFixedColumns.length;
    const rightStartIndex = mainStartIndex + centerNormalColumns.length;

    const leftColumns: any[] = handleColumns({
      currentRowMergeInfo,
      columns: leftFixedColumns,
      startIndex: 0,
      endIndex: leftFixedColumns.length - 1,
      offsetIndex: 0,
      rowIndex,
    });
    const rightColumns: any[] = handleColumns({
      currentRowMergeInfo,
      columns: rightFixedColumns,
      startIndex: 0,
      endIndex: rightFixedColumns.length - 1,
      offsetIndex: rightStartIndex,
      rowIndex,
    });

    const actualBeginIndex = watchData.colRenderBegin + mainStartIndex;
    const $begin =
      currentRowMergeInfo?.[actualBeginIndex]?.colIndex !== undefined
        ? currentRowMergeInfo?.[actualBeginIndex]?.colIndex
        : actualBeginIndex;
    const leftCount = $begin - mainStartIndex;

    const actualEndIndex = watchData.colRenderEnd + mainStartIndex;
    const $end =
      currentRowMergeInfo?.[actualEndIndex]?.colIndex !== undefined
        ? currentRowMergeInfo?.[actualEndIndex]?.colIndex +
          currentRowMergeInfo?.[actualEndIndex]?.colspan
        : actualEndIndex;
    const rightCount = Math.max(0, centerNormalColumns.length - 1 - $end + mainStartIndex);

    const centerColumns: any[] = [];
    for (let colIndex = leftCount; colIndex <= watchData.colRenderEnd; colIndex++) {
      if (currentRowMergeInfo?.[colIndex + mainStartIndex] === undefined) {
        // console.log('不存在合并信息', rowIndex, colIndex, currentRowMergeInfo?.[colIndex]);
        centerColumns.push(centerNormalColumns[colIndex]);
      } else if (currentRowMergeInfo?.[colIndex + mainStartIndex]?.colspan !== undefined) {
        const cellSpan = getCellSpan(rowIndex, colIndex + mainStartIndex, currentRowMergeInfo);
        if (cellSpan.rowspan > 0 && cellSpan.colspan > 0) {
          // console.warn('存在合并信息', rowIndex, colIndex, cellSpan);
          centerColumns.push({
            ...centerNormalColumns[colIndex],
            colspan: cellSpan.colspan,
            rowspan: cellSpan.rowspan,
          });
        }

        colIndex += (currentRowMergeInfo?.[colIndex + mainStartIndex]?.colspan ?? 1) - 1;
      }
    }
    return {
      leftColumns,
      rightColumns,
      centerColumns,
      leftCount,
      rightCount,
    };
  });
  return data;
};

export { useRenderColumns };
