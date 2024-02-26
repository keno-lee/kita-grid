import { type GridStore } from '../store';
/**
 *
 * @param index 当前行在 mergeInfoMap 中的索引
 * @param columns 当前行的所有列
 * @param mergeInfoMap 包含合并单元格的信息
 * @param watchData 包含 colRenderBegin 和 colRenderEnd 的对象，必须是响应式的
 * @returns
 */
declare const useRenderColumns: (rowIndex: number, gridStore: GridStore) => any;
export { useRenderColumns };
