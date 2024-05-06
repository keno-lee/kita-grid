import type { MergeCell } from '../type';

export type ViewPositionMap = {
  colBegin: number;
  colEnd: number;
  rowBegin: number;
  rowEnd: number;
  colRenderBegin: number;
  colRenderEnd: number;
  rowRenderBegin: number;
  rowRenderEnd: number;
  listLength: number;
  leftLength: number;
  rightLength: number;
};

export type ViewRenderInfo = {
  colRenderBegin: number;
  colRenderEnd: number;
  rowRenderBegin: number;
  rowRenderEnd: number;
  colBegin: number;
  colEnd: number;
  blockMergeInfos: MergeCell[];
};

type MergeInfoMap = {
  colBeginMergeInfos: MergeCell[];
  colEndMergeInfos: MergeCell[];
  rowBeginMergeInfos: MergeCell[];
  rowEndMergeInfos: MergeCell[];
};

/**
 * 合并 block 信息排序
 * @param mergeInfos
 * @param rowFirst 行优先排序
 * @returns
 */
const sortMergeInfos = (mergeInfos: MergeCell[], rowFirst: boolean = true) => {
  return mergeInfos.sort((a, b) =>
    rowFirst
      ? a.rowIndex - b.rowIndex || a.colIndex - b.colIndex
      : a.colIndex - b.colIndex || a.rowIndex - b.rowIndex,
  );
};

/**
 * 处理列左侧合并信息
 * @param viewPosMap
 * @param mergeInfos
 * @returns
 */
const handleColBeginMerge = (viewPosMap: ViewPositionMap, mergeInfos: MergeCell[]) => {
  const { colBegin, rowBegin, rowEnd, leftLength } = viewPosMap;
  const colBeginMergeInfos: MergeCell[] = [];
  if (mergeInfos.length === 0) return { minCol: colBegin, colBeginMergeInfos };
  const beginMergeInfos = sortMergeInfos(mergeInfos);
  const mergeRowIndexList = [];
  let minCol = colBegin;
  for (let i = 0; i < beginMergeInfos.length; i++) {
    const { colIndex, rowIndex, rowspan } = beginMergeInfos[i];
    const rangeMap = {
      end: [Math.min(rowIndex + rowspan - 1, rowEnd), Math.max(colBegin - 1, leftLength)],
      start: [Math.max(rowIndex, rowBegin), Math.max(leftLength, colIndex)],
    };
    minCol = Math.max(Math.min(minCol, colIndex - leftLength), 0);
    mergeRowIndexList.push({ rowIndex: Math.max(rowIndex, rowBegin), rangeMap });
  }

  let startRow = rowBegin;
  for (let i = 0; i < mergeRowIndexList.length; i++) {
    const { rowIndex, rangeMap } = mergeRowIndexList[i];
    if (!(i === 0 && rowIndex === rowBegin)) {
      const preVirtualBlock = {
        colIndex: minCol + leftLength,
        colspan: colBegin - minCol,
        rowIndex: startRow,
        rowspan: rangeMap.start[0] - startRow,
      };
      colBeginMergeInfos.push(preVirtualBlock);
    }

    const virtualBlock = {
      colIndex: minCol + leftLength,
      colspan: rangeMap.start[1] - (minCol + leftLength),
      rowIndex: rangeMap.start[0],
      rowspan: rangeMap.end[0] - rangeMap.start[0],
    };
    colBeginMergeInfos.push(virtualBlock);
    startRow = rangeMap.end[0] + 1;
    if (!(i === mergeRowIndexList.length - 1 && startRow > rowEnd)) {
      const lastVirtualBlock = {
        colIndex: minCol + leftLength,
        colspan: colBegin - minCol,
        rowIndex: startRow,
        rowspan: rowEnd - startRow,
      };
      colBeginMergeInfos.push(lastVirtualBlock);
    }
  }
  return { minCol, colBeginMergeInfos };
};

/**
 * 处理列右侧合并信息
 * @param viewPosMap
 * @param mergeInfos
 * @returns
 */
const handleColEndMerge = (viewPosMap: ViewPositionMap, mergeInfos: MergeCell[]) => {
  const { colEnd, rowBegin, rowEnd, listLength } = viewPosMap;
  if (mergeInfos.length === 0) return { maxCol: colEnd, colEndMergeInfos: [] };
  const endMergeInfos = sortMergeInfos(mergeInfos);

  let maxCol = colEnd;
  const colEndMergeInfos = [];
  const mergeRowIndexList = [];
  for (let i = 0; i < endMergeInfos.length; i++) {
    const { colIndex, rowIndex, rowspan, colspan } = endMergeInfos[i];
    const rangeMap = {
      start: [Math.max(rowIndex, rowBegin), colIndex + colspan],
      end: [Math.min(rowIndex + rowspan - 1, rowEnd), colEnd + 1],
    };
    maxCol = Math.min(Math.max(maxCol, colIndex + colspan - 1), listLength - 1);
    mergeRowIndexList.push({ rowIndex, rangeMap });
  }

  let startRow = rowBegin;
  for (let i = 0; i < mergeRowIndexList.length; i++) {
    const { rowIndex, rangeMap } = mergeRowIndexList[i];
    if (!(i === 0 && rowIndex === rowBegin)) {
      const preVirtualBlock = {
        colIndex: colEnd + 1,
        colspan: maxCol - colEnd + 1,
        rowIndex: startRow,
        rowspan: rangeMap.start[0] - startRow,
      };
      colEndMergeInfos.push(preVirtualBlock);
    }

    const virtualBlock = {
      colIndex: rangeMap.start[1] + 1,
      colspan: maxCol - rangeMap.start[1] + 1,
      rowIndex: rangeMap.start[0],
      rowspan: rangeMap.end[0] - rangeMap.start[0],
    };
    colEndMergeInfos.push(virtualBlock);

    startRow = rangeMap.end[0] + 1;
    if (i === mergeRowIndexList.length - 1 && rowIndex !== rowEnd) {
      const lastVirtualBlock = {
        colIndex: colEnd + 1,
        colspan: maxCol - colEnd + 1,
        rowIndex: startRow,
        rowspan: rowEnd - startRow,
      };
      colEndMergeInfos.push(lastVirtualBlock);
    }
  }
  return { maxCol, colEndMergeInfos };
};

/**
 * 处理行顶部合并信息
 * @param viewPosMap
 * @param mergeInfos
 * @returns
 */
const handleRowBeginMerge = (viewPosMap: ViewPositionMap, mergeInfos: MergeCell[]) => {
  const rowBeginMergeInfos: MergeCell[] = [];
  const { rowBegin, rowRenderBegin, listLength, leftLength } = viewPosMap;
  const maxColIndex = listLength + leftLength - 1;
  if (mergeInfos.length === 0 && rowBegin !== 0) {
    rowBeginMergeInfos.push({
      rowIndex: rowRenderBegin,
      rowspan: rowBegin - rowRenderBegin - 1,
      colIndex: leftLength,
      colspan: listLength,
    });
    return { minRow: rowBegin, rowBeginMergeInfos };
  }

  const beginMergeInfos = sortMergeInfos(mergeInfos, false);
  const mergeColIndexList = [];
  // 可以改成 rowBegin - 1，而不是虚拟列表的 renderBegin
  let minRow = rowBegin;
  for (let index = 0; index < beginMergeInfos.length; index++) {
    const { colIndex, colspan, rowIndex } = beginMergeInfos[index];
    // [列, 行]
    const rangeMap = {
      start: [Math.max(colIndex, listLength), rowBegin - 1],
      end: [Math.min(colIndex + colspan - 1, maxColIndex), rowIndex],
    };
    minRow = Math.min(minRow, rowIndex);
    mergeColIndexList.push({ colIndex, rangeMap });
  }

  let startCol = leftLength;
  for (let index = 0; index < mergeColIndexList.length; index++) {
    const { colIndex, rangeMap } = mergeColIndexList[index];
    if (!(index === 0 && colIndex === leftLength)) {
      const preVirtualBlock = {
        colIndex: startCol,
        colspan: colIndex - startCol,
        rowIndex: minRow,
        rowspan: rowBegin - minRow,
      };
      rowBeginMergeInfos.push(preVirtualBlock);
    }

    const virtualBlock = {
      colIndex: colIndex,
      colspan: rangeMap.end[0] - colIndex + 1,
      rowIndex: minRow,
      rowspan: rangeMap.end[1] - minRow,
    };
    rowBeginMergeInfos.push(virtualBlock);
    startCol = rangeMap.end[0] + 1;
    if (index === mergeColIndexList.length - 1 && rangeMap.end[0] !== maxColIndex) {
      const lastBlock = {
        colIndex: startCol,
        colspan: maxColIndex - startCol + 1,
        rowIndex: minRow,
        rowspan: rowBegin - minRow,
      };
      rowBeginMergeInfos.push(lastBlock);
    }
  }
  return { minRow, rowBeginMergeInfos };
};

/**
 * 处理行结束信息
 * @param viewPosMap
 * @param mergeInfos
 * @returns
 */
const handleRowEndMerge = (viewPosMap: ViewPositionMap, mergeInfos: MergeCell[]) => {
  const { rowEnd, rowRenderEnd, listLength, leftLength } = viewPosMap;
  const rowEndMergeInfos: MergeCell[] = [];
  const mergeColIndexList = [];
  const maxColIndex = leftLength + listLength - 1;
  let maxRow = rowRenderEnd;
  const endMergeInfos = sortMergeInfos(mergeInfos, false);
  for (let index = 0; index < endMergeInfos.length; index++) {
    const { colspan, colIndex, rowIndex, rowspan } = endMergeInfos[index];
    const rangeMap = {
      start: [Math.max(colIndex, leftLength), rowEnd + 1],
      end: [Math.min(colIndex + colspan - 1, maxColIndex), rowIndex + rowspan - 1],
    };
    maxRow = Math.max(maxRow, rowIndex + rowspan - 1);
    mergeColIndexList.push({ colIndex, rangeMap });
  }

  let startCol = leftLength;
  for (let index = 0; index < mergeColIndexList.length; index++) {
    const { colIndex, rangeMap } = mergeColIndexList[index];
    if (!(index === 0 && colIndex === leftLength)) {
      const preVirtualBlock = {
        colIndex: startCol,
        colspan: colIndex - startCol,
        rowIndex: rowEnd + 1,
        rowspan: maxRow - rowEnd,
      };
      rowEndMergeInfos.push(preVirtualBlock);
    }
    const virtualBlock = {
      colIndex,
      colspan: rangeMap.end[0] - rangeMap.start[0] + 1,
      rowIndex: rangeMap.end[1] + 1,
      rowspan: maxRow - rangeMap.end[1],
    };
    rowEndMergeInfos.push(virtualBlock);
    startCol = rangeMap.end[0] + 1;
    if (index === mergeColIndexList.length - 1 && rangeMap.end[0] !== maxColIndex) {
      const lastBlock = {
        colIndex: startCol,
        colspan: maxColIndex - startCol + 1,
        rowIndex: rowEnd + 1,
        rowspan: maxRow - rowEnd,
      };
      rowEndMergeInfos.push(lastBlock);
    }
  }
  return { maxRow, rowEndMergeInfos };
};

const getVerticalMergeInfo = (
  viewPosMap: ViewPositionMap,
  beginMergeInfos: MergeCell[],
  endMergeInfos: MergeCell[],
) => {
  const { rowBegin, rowEnd, rowRenderBegin, rowRenderEnd } = viewPosMap;

  if (
    (!rowRenderBegin && rowRenderBegin !== 0) ||
    rowRenderBegin < 0 ||
    rowBegin === 0 ||
    !rowRenderEnd
  )
    return { minRow: 0, maxRow: rowEnd, rowEndMergeInfos: [], rowBeginMergeInfos: [] };

  const { minRow, rowBeginMergeInfos } = handleRowBeginMerge(viewPosMap, beginMergeInfos);
  const { maxRow, rowEndMergeInfos } = handleRowEndMerge(viewPosMap, endMergeInfos);

  return {
    minRow,
    maxRow,
    rowEndMergeInfos,
    rowBeginMergeInfos,
  };
};

const getHorizontalMergeInfo = (
  viewPosMap: ViewPositionMap,
  beginMergeInfos: MergeCell[],
  endMergeInfos: MergeCell[],
) => {
  const { colBegin, colEnd } = viewPosMap;

  const { minCol, colBeginMergeInfos } = handleColBeginMerge(viewPosMap, beginMergeInfos);
  const { maxCol, colEndMergeInfos } = handleColEndMerge(viewPosMap, endMergeInfos);

  return {
    colBegin,
    colEnd,
    minCol,
    maxCol,
    colBeginMergeInfos,
    colEndMergeInfos,
  };
};

/**
 * 计算不可见区域的单元格合并，减少在不可见区域的 dom 渲染数量
 * @param viewPosMap 渲染的坐标信息
 * @param originMergeInfos 初始的合并信息
 * @returns
 */
export const mergeBlock = (
  viewPosMap: ViewPositionMap,
  originMergeInfos: MergeCell[],
): ViewRenderInfo => {
  const { colBeginMergeInfos, colEndMergeInfos, rowBeginMergeInfos, rowEndMergeInfos } =
    originMergeInfos.reduce<MergeInfoMap>(
      (mergeInfos, mergeInfo) => {
        const { colIndex, colspan, rowIndex, rowspan } = mergeInfo;
        const { rowBegin, rowEnd, colBegin, colEnd, leftLength } = viewPosMap;
        const actualColBegin = colBegin + leftLength;
        const actualColEnd = colEnd + leftLength;
        if (mergeInfo.rowIndex < rowBegin && mergeInfo.rowIndex + mergeInfo.rowspan > rowBegin) {
          mergeInfos.rowBeginMergeInfos.push(mergeInfo);
        }
        if (mergeInfo.rowIndex < rowEnd && mergeInfo.rowIndex + mergeInfo.rowspan > rowEnd) {
          mergeInfos.rowEndMergeInfos.push(mergeInfo);
        }

        if (
          colIndex < actualColBegin &&
          colIndex + colspan > actualColBegin &&
          rowIndex + rowspan - 1 >= rowBegin
        ) {
          const currBeginMergeInfo = {
            ...mergeInfo,
            colIndex: Math.max(colIndex, actualColBegin),
            colspan: colspan - (actualColBegin - colIndex),
          };
          mergeInfos.colBeginMergeInfos.push(currBeginMergeInfo);
        }
        if (colIndex < actualColEnd && colIndex + colspan > actualColEnd && rowIndex <= rowEnd) {
          mergeInfos.colEndMergeInfos.push(mergeInfo);
        }

        return mergeInfos;
      },
      {
        colBeginMergeInfos: [],
        colEndMergeInfos: [],
        rowBeginMergeInfos: [],
        rowEndMergeInfos: [],
      },
    );

  const {
    maxRow,
    minRow,
    rowBeginMergeInfos: rbInfos,
    rowEndMergeInfos: reInfos,
  } = getVerticalMergeInfo(viewPosMap, rowBeginMergeInfos, rowEndMergeInfos);
  const {
    minCol,
    maxCol,
    colBegin,
    colEnd,
    colBeginMergeInfos: cbInfos,
    colEndMergeInfos: ceInfos,
  } = getHorizontalMergeInfo(viewPosMap, colBeginMergeInfos, colEndMergeInfos);
  const blockMergeInfos = [...rbInfos, ...cbInfos, ...reInfos, ...ceInfos].filter(
    (b) => b.colspan !== 0 && b.rowspan !== 0,
  );
  // console.warn('rb', rbInfos, 'cb', cbInfos, 're', reInfos, 'ce', ceInfos);
  return {
    colBegin,
    colEnd,
    colRenderBegin: minCol,
    colRenderEnd: maxCol,
    rowRenderBegin: minRow,
    rowRenderEnd: maxRow,
    blockMergeInfos, // 需要合并的单元格信息
  };
};

export const formatMergeInfos = (
  merges: MergeCell[],
  leftCount: number,
  rightCount: number,
  centerCount: number,
) => {
  if (leftCount === 0 && rightCount === 0) return merges;
  return merges.reduce<MergeCell[]>((newMerges, mergeInfo) => {
    const { colIndex, colspan, rowIndex, rowspan } = mergeInfo;
    // 合并单元格跨越做固定列和中间列时进行切割
    if (colIndex < leftCount && colIndex + colspan > leftCount) {
      const leftMerges = {
        colIndex: colIndex,
        colspan: leftCount - colIndex,
        rowIndex: rowIndex,
        rowspan: rowspan,
      };
      const rightMerges = {
        colIndex: leftCount,
        colspan: colIndex + colspan - leftCount,
        rowIndex: rowIndex,
        rowspan: rowspan,
      };
      newMerges.push(...[leftMerges, rightMerges]);
    } else if (
      rightCount > 0 &&
      colIndex < leftCount + centerCount &&
      colIndex + colspan - 1 >= leftCount + centerCount
    ) {
      // 合并单元格跨越做中间列和右固定列时进行切割
      const leftMerges = {
        colIndex: colIndex,
        colspan: leftCount + rightCount - colIndex,
        rowIndex: rowIndex,
        rowspan: rowspan,
      };
      const rightMerges = {
        colIndex: leftCount + centerCount,
        colspan: colIndex + colspan - leftCount - centerCount,
        rowIndex: rowIndex,
        rowspan: rowspan,
      };
      newMerges.push(...[leftMerges, rightMerges]);
    } else {
      newMerges.push(mergeInfo);
    }
    return newMerges;
  }, []);
};
