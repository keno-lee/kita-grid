var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { reactive, shallowReactive as shallowReactive$1, ref as ref$1, openBlock, createElementBlock, createElementVNode, defineComponent, toDisplayString, onUpdated, watch as watch$1, inject, computed, normalizeClass, normalizeStyle, Fragment, renderList, unref, createBlock, resolveDynamicComponent, createCommentVNode, withModifiers, createTextVNode, provide, onMounted as onMounted$1, onBeforeUnmount as onBeforeUnmount$1, createVNode, renderSlot, useSlots, getCurrentInstance, mergeProps, withCtx, render } from "vue";
import { ref, shallowReactive, onBeforeMount, onMounted, onBeforeUnmount, shallowRef, watch, isVue2 } from "vue-demi";
const index$1 = "";
const useObserverItem = (props) => {
  const itemRefEl = ref(null);
  onMounted(() => {
    if (props.resizeObserver && itemRefEl.value) {
      props.resizeObserver.observe(itemRefEl.value);
    }
  });
  onBeforeUnmount(() => {
    if (props.resizeObserver && itemRefEl.value) {
      props.resizeObserver.unobserve(itemRefEl.value);
    }
  });
  return {
    itemRefEl
  };
};
const defaultProps$1 = {
  fixed: false,
  buffer: 0,
  bufferTop: 0,
  bufferBottom: 0,
  scrollDistance: 0,
  horizontal: false,
  start: 0,
  offset: 0,
  listStyle: "",
  listClass: "",
  itemStyle: "",
  itemClass: "",
  headerClass: "",
  headerStyle: "",
  footerClass: "",
  footerStyle: "",
  stickyHeaderClass: "",
  stickyHeaderStyle: "",
  stickyFooterClass: "",
  stickyFooterStyle: ""
};
function useVirtList(userProps, emitFunction) {
  const props = new Proxy(userProps, {
    get(target, key) {
      var _a;
      return (_a = Reflect.get(target, key)) != null ? _a : Reflect.get(defaultProps$1, key);
    }
  });
  const clientRefEl = ref(null);
  const listRefEl = ref(null);
  const headerRefEl = ref(null);
  const footerRefEl = ref(null);
  const stickyHeaderRefEl = ref(null);
  const stickyFooterRefEl = ref(null);
  const sizesMap = /* @__PURE__ */ new Map();
  const renderKey = ref(0);
  let direction = "backward";
  let fixOffset = false;
  let forceFixOffset = false;
  const slotSize = shallowReactive({
    clientSize: 0,
    headerSize: 0,
    footerSize: 0,
    stickyHeaderSize: 0,
    stickyFooterSize: 0
  });
  const reactiveData = shallowReactive({
    // 可视区域的个数，不算buffer，只和clientSize和minSize有关
    views: 0,
    // 滚动距离
    offset: 0,
    // 不包含插槽的高度
    listTotalSize: 0,
    // 虚拟占位尺寸，是从0到renderBegin的尺寸
    virtualSize: 0,
    // 可视区的起始下标
    inViewBegin: 0,
    // 可视区的结束下标
    inViewEnd: 0,
    // buffer的起始下标
    renderBegin: 0,
    // buffer的结束下标
    renderEnd: 0,
    bufferTop: 0,
    bufferBottom: 0
  });
  function getOffset() {
    const directionKey = props.horizontal ? "scrollLeft" : "scrollTop";
    return clientRefEl.value ? clientRefEl.value[directionKey] : 0;
  }
  function getSlotSize() {
    return slotSize.headerSize + slotSize.footerSize + slotSize.stickyHeaderSize + slotSize.stickyFooterSize;
  }
  function getTotalSize() {
    return reactiveData.listTotalSize + slotSize.headerSize + slotSize.footerSize + slotSize.stickyHeaderSize + slotSize.stickyFooterSize;
  }
  function getItemSize(itemKey) {
    var _a;
    if (props.fixed)
      return props.minSize;
    return (_a = sizesMap.get(String(itemKey))) != null ? _a : props.minSize;
  }
  function setItemSize(itemKey, size) {
    sizesMap.set(String(itemKey), size);
  }
  function deleteItemSize(itemKey) {
    sizesMap.delete(String(itemKey));
  }
  function getItemPosByIndex(index2) {
    var _a, _b;
    if (props.fixed) {
      return {
        top: props.minSize * index2,
        current: props.minSize,
        bottom: props.minSize * (index2 + 1)
      };
    }
    const {
      itemKey
    } = props;
    let topReduce = slotSize.headerSize;
    for (let i = 0; i <= index2 - 1; i += 1) {
      const currentSize = getItemSize((_a = props.list[i]) == null ? void 0 : _a[itemKey]);
      topReduce += currentSize;
    }
    const current = getItemSize((_b = props.list[index2]) == null ? void 0 : _b[itemKey]);
    return {
      top: topReduce,
      current,
      bottom: topReduce + current
    };
  }
  function scrollToOffset(offset, needForceFixOffset = false) {
    if (needForceFixOffset) {
      forceFixOffset = true;
    }
    const directionKey = props.horizontal ? "scrollLeft" : "scrollTop";
    if (clientRefEl.value)
      clientRefEl.value[directionKey] = offset;
  }
  async function scrollToIndex(index2) {
    console.log("scrollToIndex", index2);
    if (index2 < 0) {
      return;
    }
    if (index2 >= props.list.length - 1) {
      scrollToBottom();
      return;
    }
    let {
      top: lastOffset
    } = getItemPosByIndex(index2);
    const recursion = async () => {
      scrollToOffset(lastOffset);
      setTimeout(() => {
        const {
          top: offset
        } = getItemPosByIndex(index2);
        if (lastOffset !== offset) {
          lastOffset = offset;
          recursion();
        }
      }, 3);
    };
    recursion();
  }
  async function scrollIntoView(index2) {
    var _a;
    const {
      top: targetMin,
      bottom: targetMax
    } = getItemPosByIndex(index2);
    const offsetMin = getOffset();
    const offsetMax = getOffset() + slotSize.clientSize;
    const currentSize = getItemSize((_a = props.list[index2]) == null ? void 0 : _a[props.itemKey]);
    if (targetMin < offsetMin && offsetMin < targetMax && currentSize < slotSize.clientSize) {
      scrollToOffset(targetMin);
      return;
    }
    if (targetMin + slotSize.stickyHeaderSize < offsetMax && offsetMax < targetMax + slotSize.stickyHeaderSize && currentSize < slotSize.clientSize) {
      scrollToOffset(targetMax - slotSize.clientSize + slotSize.stickyHeaderSize);
      return;
    }
    if (targetMin + slotSize.stickyHeaderSize >= offsetMax) {
      scrollToIndex(index2);
      return;
    }
    if (targetMax <= offsetMin) {
      scrollToIndex(index2);
      return;
    }
  }
  async function scrollToTop() {
    scrollToOffset(0);
    setTimeout(() => {
      var _a;
      const directionKey = props.horizontal ? "scrollLeft" : "scrollTop";
      if (((_a = clientRefEl == null ? void 0 : clientRefEl.value) == null ? void 0 : _a[directionKey]) !== 0) {
        scrollToTop();
      }
    }, 3);
  }
  async function scrollToBottom() {
    scrollToOffset(getTotalSize());
    setTimeout(() => {
      if (Math.abs(Math.round(reactiveData.offset + slotSize.clientSize) - Math.round(getTotalSize())) > 2) {
        scrollToBottom();
      }
    }, 0);
  }
  function fixSelection() {
    const selection = window.getSelection();
    if (selection) {
      const {
        anchorNode,
        anchorOffset,
        focusNode,
        focusOffset
      } = selection;
      if (anchorNode && anchorOffset !== null && focusNode !== null && focusOffset) {
        requestAnimationFrame(() => {
          if (anchorOffset < focusOffset) {
            selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
          } else {
            selection.setBaseAndExtent(focusNode, focusOffset, anchorNode, anchorOffset);
          }
        });
      }
    }
  }
  function updateRange(start) {
    if (isVue2 && direction === "backward") {
      fixSelection();
    }
    reactiveData.inViewBegin = start;
    reactiveData.inViewEnd = Math.min(start + reactiveData.views, props.list.length - 1);
  }
  function calcRange() {
    var _a, _b;
    const {
      views,
      offset,
      inViewBegin
    } = reactiveData;
    const {
      itemKey
    } = props;
    const offsetWithNoHeader = offset - slotSize.headerSize;
    let start = inViewBegin;
    let offsetReduce = getVirtualSize2beginInView();
    if (offsetWithNoHeader < 0) {
      updateRange(0);
      return;
    }
    if (direction === "forward") {
      if (offsetWithNoHeader >= offsetReduce) {
        return;
      }
      for (let i = start - 1; i >= 0; i -= 1) {
        const currentSize = getItemSize((_a = props.list[i]) == null ? void 0 : _a[itemKey]);
        offsetReduce -= currentSize;
        if (offsetReduce <= offsetWithNoHeader && offsetWithNoHeader < offsetReduce + currentSize) {
          start = i;
          break;
        }
      }
      fixOffset = true;
    }
    if (direction === "backward") {
      if (offsetWithNoHeader <= offsetReduce) {
        return;
      }
      for (let i = start; i <= props.list.length - 1; i += 1) {
        const currentSize = getItemSize((_b = props.list[i]) == null ? void 0 : _b[itemKey]);
        if (offsetReduce <= offsetWithNoHeader && offsetWithNoHeader < offsetReduce + currentSize) {
          start = i;
          break;
        }
        offsetReduce += currentSize;
      }
      fixOffset = false;
    }
    if (start !== reactiveData.inViewBegin) {
      updateRange(start);
    }
  }
  function onScroll(evt) {
    var _a, _b, _c;
    (_a = emitFunction == null ? void 0 : emitFunction.scroll) == null ? void 0 : _a.call(emitFunction, evt);
    const offset = getOffset();
    if (offset === reactiveData.offset)
      return;
    direction = offset < reactiveData.offset ? "forward" : "backward";
    reactiveData.offset = offset;
    calcRange();
    if (direction === "forward" && reactiveData.offset - props.scrollDistance <= 0) {
      console.log("[VirtList] 到达顶部");
      (_b = emitFunction == null ? void 0 : emitFunction.toTop) == null ? void 0 : _b.call(emitFunction, props.list[0]);
    }
    if (direction === "backward" && reactiveData.offset + props.scrollDistance >= reactiveData.listTotalSize + getSlotSize() - slotSize.clientSize) {
      console.log("[VirtList] 到达底部");
      (_c = emitFunction == null ? void 0 : emitFunction.toBottom) == null ? void 0 : _c.call(emitFunction, props.list[props.list.length - 1]);
    }
  }
  function calcViews() {
    const newViews = Math.ceil(slotSize.clientSize / props.minSize) + 1;
    reactiveData.views = newViews;
  }
  function onClientResize() {
    calcViews();
    updateRange(reactiveData.inViewBegin);
  }
  function calcListTotalSize() {
    var _a;
    if (props.fixed) {
      reactiveData.listTotalSize = props.minSize * props.list.length;
      return;
    }
    const {
      itemKey
    } = props;
    let re = 0;
    for (let i = 0; i <= props.list.length - 1; i += 1) {
      re += getItemSize((_a = props.list[i]) == null ? void 0 : _a[itemKey]);
    }
    reactiveData.listTotalSize = re;
  }
  function reset() {
    console.log("[VirtList] reset");
    reactiveData.offset = 0;
    reactiveData.listTotalSize = 0;
    reactiveData.virtualSize = 0;
    reactiveData.inViewBegin = 0;
    reactiveData.inViewEnd = 0;
    reactiveData.renderBegin = 0;
    reactiveData.renderEnd = 0;
    sizesMap.clear();
  }
  function deletedList2Top(deletedList) {
    calcListTotalSize();
    let deletedListSize = 0;
    deletedList.forEach((item) => {
      deletedListSize += getItemSize(item[props.itemKey]);
    });
    updateTotalVirtualSize();
    scrollToOffset(reactiveData.offset - deletedListSize, true);
    calcRange();
  }
  function addedList2Top(addedList) {
    calcListTotalSize();
    let addedListSize = 0;
    addedList.forEach((item) => {
      addedListSize += getItemSize(item[props.itemKey]);
    });
    updateTotalVirtualSize();
    scrollToOffset(reactiveData.offset + addedListSize, true);
    calcRange();
  }
  function forceUpdate() {
    renderKey.value += 1;
  }
  let resizeObserver = void 0;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver((entries) => {
      var _a;
      let diff = 0;
      for (const entry of entries) {
        const id = entry.target.dataset.id;
        if (id) {
          const oldSize = getItemSize(id);
          let newSize = 0;
          if (entry.borderBoxSize) {
            const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
            newSize = props.horizontal ? contentBoxSize.inlineSize : contentBoxSize.blockSize;
          } else {
            newSize = props.horizontal ? entry.contentRect.width : entry.contentRect.height;
          }
          if (id === "client") {
            slotSize.clientSize = newSize;
            onClientResize();
          } else if (id === "header") {
            slotSize.headerSize = newSize;
          } else if (id === "footer") {
            slotSize.footerSize = newSize;
          } else if (id === "stickyHeader") {
            slotSize.stickyHeaderSize = newSize;
          } else if (id === "stickyFooter") {
            slotSize.stickyFooterSize = newSize;
          } else if (oldSize !== newSize) {
            setItemSize(id, newSize);
            diff += newSize - oldSize;
            (_a = emitFunction == null ? void 0 : emitFunction.itemResize) == null ? void 0 : _a.call(emitFunction, id, newSize);
          }
        }
      }
      reactiveData.listTotalSize += diff;
      if ((fixOffset || forceFixOffset) && diff !== 0) {
        fixOffset = false;
        forceFixOffset = false;
        scrollToOffset(reactiveData.offset + diff);
      }
    });
  }
  const updateTotalVirtualSize = () => {
    var _a;
    let offset = 0;
    const currentFirst = reactiveData.inViewBegin;
    for (let i = 0; i < currentFirst; i++) {
      offset += getItemSize((_a = props.list[i]) == null ? void 0 : _a[props.itemKey]);
    }
    reactiveData.virtualSize = offset;
  };
  onBeforeMount(() => {
    if (props.bufferTop) {
      reactiveData.bufferTop = props.bufferTop;
    } else {
      reactiveData.bufferTop = props.buffer;
    }
    if (props.bufferBottom) {
      reactiveData.bufferBottom = props.bufferBottom;
    } else {
      reactiveData.bufferBottom = props.buffer;
    }
  });
  onMounted(() => {
    if (clientRefEl.value) {
      clientRefEl.value.addEventListener("scroll", onScroll);
      resizeObserver == null ? void 0 : resizeObserver.observe(clientRefEl.value);
    }
    if (stickyHeaderRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.observe(stickyHeaderRefEl.value);
    }
    if (stickyFooterRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.observe(stickyFooterRefEl.value);
    }
    if (headerRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.observe(headerRefEl.value);
    }
    if (footerRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.observe(footerRefEl.value);
    }
    if (props.start) {
      scrollToIndex(props.start);
    } else if (props.offset) {
      scrollToOffset(props.offset);
    }
  });
  onBeforeUnmount(() => {
    if (clientRefEl.value) {
      clientRefEl.value.removeEventListener("scroll", onScroll);
      resizeObserver == null ? void 0 : resizeObserver.unobserve(clientRefEl.value);
      slotSize.clientSize = 0;
    }
    if (stickyHeaderRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.unobserve(stickyHeaderRefEl.value);
      slotSize.stickyHeaderSize = 0;
    }
    if (stickyFooterRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.unobserve(stickyFooterRefEl.value);
      slotSize.stickyFooterSize = 0;
    }
    if (headerRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.unobserve(headerRefEl.value);
      slotSize.headerSize = 0;
    }
    if (footerRefEl.value) {
      resizeObserver == null ? void 0 : resizeObserver.unobserve(footerRefEl.value);
      slotSize.footerSize = 0;
    }
  });
  function getVirtualSize2beginInView() {
    return reactiveData.virtualSize + getRangeSize(reactiveData.renderBegin, reactiveData.inViewBegin);
  }
  function getRangeSize(range1, range2) {
    var _a;
    const start = Math.min(range1, range2);
    const end = Math.max(range1, range2);
    let re = 0;
    for (let i = start; i < end; i += 1) {
      re += getItemSize((_a = props.list[i]) == null ? void 0 : _a[props.itemKey]);
    }
    return re;
  }
  const renderList2 = shallowRef([]);
  watch(
    // 这里为什么用 renderKey 代替监听 props.list
    // 因为props.list会导致v-for时deepArray导致大量的性能浪费
    () => [reactiveData.inViewBegin, reactiveData.inViewEnd, renderKey.value],
    (newVal, oldVal) => {
      if (newVal && oldVal) {
        const [_newInViewBegin] = newVal;
        const _oldRenderBegin = reactiveData.renderBegin;
        let _newRenderBegin = _newInViewBegin;
        let _newRenderEnd = reactiveData.inViewEnd;
        _newRenderBegin = Math.max(0, _newRenderBegin - reactiveData.bufferTop);
        _newRenderEnd = Math.min(_newRenderEnd + reactiveData.bufferBottom, props.list.length - 1);
        if (props == null ? void 0 : props.renderControl) {
          const {
            begin,
            end
          } = props.renderControl(_newInViewBegin, reactiveData.inViewEnd);
          _newRenderBegin = begin;
          _newRenderEnd = end;
        }
        reactiveData.renderBegin = _newRenderBegin;
        reactiveData.renderEnd = _newRenderEnd;
        if (_newRenderBegin > _oldRenderBegin) {
          reactiveData.virtualSize += getRangeSize(_newRenderBegin, _oldRenderBegin);
        } else {
          reactiveData.virtualSize -= getRangeSize(_newRenderBegin, _oldRenderBegin);
        }
        renderList2.value = props.list.slice(reactiveData.renderBegin, reactiveData.renderEnd + 1);
      }
    },
    {
      immediate: true
    }
  );
  watch(() => props.list.length, () => {
    if (props.list.length <= 0) {
      reset();
      return;
    }
    calcListTotalSize();
    updateRange(reactiveData.inViewBegin);
    forceUpdate();
  }, {
    immediate: true
  });
  return {
    props,
    renderList: renderList2,
    clientRefEl,
    listRefEl,
    headerRefEl,
    footerRefEl,
    stickyHeaderRefEl,
    stickyFooterRefEl,
    reactiveData,
    slotSize,
    sizesMap,
    resizeObserver,
    getOffset,
    reset,
    scrollToIndex,
    scrollIntoView,
    scrollToTop,
    scrollToBottom,
    scrollToOffset,
    getItemSize,
    deleteItemSize,
    // expose only
    deletedList2Top,
    addedList2Top,
    getItemPosByIndex,
    forceUpdate
  };
}
var ColumnType = /* @__PURE__ */ ((ColumnType2) => {
  ColumnType2["Index"] = "index";
  ColumnType2["Title"] = "title";
  ColumnType2["Checkbox"] = "checkbox";
  ColumnType2["Expand"] = "expand";
  ColumnType2["Text"] = "text";
  return ColumnType2;
})(ColumnType || {});
var CellEventEnum = /* @__PURE__ */ ((CellEventEnum2) => {
  CellEventEnum2["CellClick"] = "cellClick";
  CellEventEnum2["CellDblclick"] = "cellDblclick";
  CellEventEnum2["CellContextmenu"] = "cellContextmenu";
  return CellEventEnum2;
})(CellEventEnum || {});
var RowEventEnum = /* @__PURE__ */ ((RowEventEnum2) => {
  RowEventEnum2["RowClick"] = "rowClick";
  RowEventEnum2["RowDblclick"] = "rowDblclick";
  RowEventEnum2["RowContextmenu"] = "rowContextmenu";
  return RowEventEnum2;
})(RowEventEnum || {});
var HeaderEventEnum = /* @__PURE__ */ ((HeaderEventEnum2) => {
  HeaderEventEnum2["HeaderClick"] = "headerClick";
  HeaderEventEnum2["HeaderDblclick"] = "headerDblclick";
  HeaderEventEnum2["HeaderContextmenu"] = "headerContextmenu";
  return HeaderEventEnum2;
})(HeaderEventEnum || {});
var TableEventEnum = /* @__PURE__ */ ((TableEventEnum2) => {
  TableEventEnum2["ExpandChange"] = "expandChange";
  TableEventEnum2["BoxSelection"] = "boxSelection";
  return TableEventEnum2;
})(TableEventEnum || {});
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
const formatColumns = (originColumns) => {
  const leftFixedColumns = [];
  const rightFixedColumns = [];
  const centerNormalColumns = [];
  const flattedColumns = [];
  const headerCellInfo = {};
  let maxLevel = 0;
  function dfs({
    columns,
    level = 0,
    parentId,
    parentColumn,
    fixed
  }) {
    maxLevel = Math.max(maxLevel, level);
    let leftReduce = 0;
    let childCountReduce = 0;
    columns.forEach((_col) => {
      var _a, _b;
      const column = _col;
      column._id = column._id || `${column.field || ""}-${nanoid(4)}`;
      column.width = (_a = column.width) != null ? _a : 200;
      headerCellInfo[column._id] = {
        ...column
      };
      headerCellInfo[column._id].level = level;
      if (column.fixed === void 0 && fixed) {
        column.fixed = fixed;
        headerCellInfo[column._id].fixed = fixed;
      }
      if (parentColumn && (parentColumn == null ? void 0 : parentColumn.fixed) === void 0) {
        column.fixed = "";
      }
      if (column.children && ((_b = column.children) == null ? void 0 : _b.length) > 0) {
        const childCount = dfs({
          columns: column.children,
          level: level + 1,
          parentId: column._id,
          parentColumn: column,
          fixed: column.fixed
        });
        headerCellInfo[column._id].colspan = childCount;
        childCountReduce += childCount;
      } else {
        headerCellInfo[column._id].colspan = 1;
        childCountReduce += 1;
        headerCellInfo[column._id].isLeaf = true;
        flattedColumns.push(column);
        if (column.fixed === "left") {
          headerCellInfo[column._id].left = leftReduce;
          leftReduce += column.width;
          leftFixedColumns.push(column);
        } else if (column.fixed === "right") {
          rightFixedColumns.push(column);
        } else {
          centerNormalColumns.push(column);
        }
      }
      if (parentId !== void 0) {
        headerCellInfo[column._id].parentId = parentId;
      }
      if (parentColumn !== void 0) {
        headerCellInfo[column._id].parentColumn = parentColumn;
      }
    });
    return childCountReduce;
  }
  dfs({ columns: originColumns });
  function bfs(columns) {
    var _a;
    const leftFixedHeaderColumns2 = [];
    const rightFixedHeaderColumns2 = [];
    const centerNormalHeaderColumns2 = [];
    const queue = [...columns];
    while (queue.length > 0) {
      const levelFixedLeft = [];
      const levelFixedRight = [];
      const levelMain = [];
      const length = queue.length;
      for (let i = 0; i < length; i++) {
        const column = queue.shift();
        headerCellInfo[column._id].rowspan = maxLevel - ((_a = headerCellInfo[column._id].level) != null ? _a : 0) + 1;
        if (column.fixed === "left") {
          levelFixedLeft.push(column);
        } else if (column.fixed === "right") {
          levelFixedRight.push(column);
        } else {
          levelMain.push(column);
        }
        if (column.children) {
          headerCellInfo[column._id].rowspan = 1;
          queue.push(...column.children);
        }
      }
      leftFixedHeaderColumns2.push(levelFixedLeft);
      rightFixedHeaderColumns2.push(levelFixedRight);
      centerNormalHeaderColumns2.push(levelMain);
    }
    return {
      // result,
      leftFixedHeaderColumns: leftFixedHeaderColumns2,
      rightFixedHeaderColumns: rightFixedHeaderColumns2,
      centerNormalHeaderColumns: centerNormalHeaderColumns2
    };
  }
  const { leftFixedHeaderColumns, rightFixedHeaderColumns, centerNormalHeaderColumns } = bfs(
    originColumns
  );
  let rightReduce = 0;
  for (let i = rightFixedColumns.length - 1; i >= 0; i--) {
    headerCellInfo[rightFixedColumns[i]._id].right = rightReduce;
    rightReduce += rightFixedColumns[i].width;
  }
  flattedColumns.forEach((col, index2) => {
    col.colIndex = index2;
  });
  console.log("headerCellInfo", headerCellInfo);
  return {
    headerCellInfo,
    flattedColumns,
    leftFixedColumns,
    rightFixedColumns,
    centerNormalColumns,
    originColumns,
    leftFixedHeaderColumns,
    rightFixedHeaderColumns,
    centerNormalHeaderColumns
  };
};
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
const freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
const root$1 = root;
var Symbol$1 = root$1.Symbol;
const Symbol$2 = Symbol$1;
var objectProto$e = Object.prototype;
var hasOwnProperty$b = objectProto$e.hasOwnProperty;
var nativeObjectToString$1 = objectProto$e.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$b.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$d = Object.prototype;
var nativeObjectToString = objectProto$d.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag$3 = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
}
var isArray = Array.isArray;
const isArray$1 = isArray;
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index2 = string.length;
  while (index2-- && reWhitespace.test(string.charAt(index2))) {
  }
  return index2;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root$1["__core-js_shared__"];
const coreJsData$1 = coreJsData;
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$c = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString.call(hasOwnProperty$a).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var WeakMap = getNative(root$1, "WeakMap");
const WeakMap$1 = WeakMap;
var objectCreate = Object.create;
var baseCreate = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
const baseCreate$1 = baseCreate;
function copyArray(source, array) {
  var index2 = -1, length = source.length;
  array || (array = Array(length));
  while (++index2 < length) {
    array[index2] = source[index2];
  }
  return array;
}
var defineProperty = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
const defineProperty$1 = defineProperty;
function arrayEach(array, iteratee) {
  var index2 = -1, length = array == null ? 0 : array.length;
  while (++index2 < length) {
    if (iteratee(array[index2], index2, array) === false) {
      break;
    }
  }
  return array;
}
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty$1) {
    defineProperty$1(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var objectProto$b = Object.prototype;
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$9.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index2 = -1, length = props.length;
  while (++index2 < length) {
    var key = props[index2];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
var objectProto$a = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$a;
  return value === proto;
}
function baseTimes(n, iteratee) {
  var index2 = -1, result = Array(n);
  while (++index2 < n) {
    result[index2] = iteratee(index2);
  }
  return result;
}
var argsTag$3 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$3;
}
var objectProto$9 = Object.prototype;
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
var isArguments = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$8.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
const isArguments$1 = isArguments;
function stubFalse() {
  return false;
}
var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
const isBuffer$1 = isBuffer;
var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$5 = "[object Map]", numberTag$3 = "[object Number]", objectTag$3 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$3 = "[object String]", weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var freeProcess = moduleExports$1 && freeGlobal$1.process;
var nodeUtil = function() {
  try {
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
const nodeUtil$1 = nodeUtil;
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
const isTypedArray$1 = isTypedArray;
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var nativeKeys = overArg(Object.keys, Object);
const nativeKeys$1 = nativeKeys;
var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty$5.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
var nativeCreate = getNative(Object, "create");
const nativeCreate$1 = nativeCreate;
function hashClear() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$4.call(data, key) ? data[key] : void 0;
}
var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$3.call(data, key);
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
function Hash(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index2 = assocIndexOf(data, key);
  if (index2 < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index2 == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index2, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index2 = assocIndexOf(data, key);
  return index2 < 0 ? void 0 : data[index2][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index2 = assocIndexOf(data, key);
  if (index2 < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index2][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map$1 = getNative(root$1, "Map");
const Map$2 = Map$1;
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$2 || ListCache)(),
    "string": new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index2 = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index2 < length) {
    var entry = entries[index2];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
function arrayPush(array, values) {
  var index2 = -1, length = values.length, offset = array.length;
  while (++index2 < length) {
    array[offset + index2] = values[index2];
  }
  return array;
}
var getPrototype = overArg(Object.getPrototypeOf, Object);
const getPrototype$1 = getPrototype;
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== void 0) {
      number = number <= upper ? number : upper;
    }
    if (lower !== void 0) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}
function clamp(number, lower, upper) {
  if (upper === void 0) {
    upper = lower;
    lower = void 0;
  }
  if (upper !== void 0) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== void 0) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
function stackGet(key) {
  return this.__data__.get(key);
}
function stackHas(key) {
  return this.__data__.has(key);
}
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
function arrayFilter(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index2 < length) {
    var value = array[index2];
    if (predicate(value, index2, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
function stubArray() {
  return [];
}
var objectProto$3 = Object.prototype;
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
const getSymbols$1 = getSymbols;
function copySymbols(source, object) {
  return copyObject(source, getSymbols$1(source), object);
}
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols$1(object));
    object = getPrototype$1(object);
  }
  return result;
};
const getSymbolsIn$1 = getSymbolsIn;
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn$1(source), object);
}
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
}
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols$1);
}
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn$1);
}
var DataView = getNative(root$1, "DataView");
const DataView$1 = DataView;
var Promise$1 = getNative(root$1, "Promise");
const Promise$2 = Promise$1;
var Set$1 = getNative(root$1, "Set");
const Set$2 = Set$1;
var mapTag$4 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
var dataViewTag$3 = "[object DataView]";
var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$1);
var getTag = baseGetTag;
if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$3 || Map$2 && getTag(new Map$2()) != mapTag$4 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$4 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) {
  getTag = function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$3;
        case mapCtorString:
          return mapTag$4;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$4;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
const getTag$1 = getTag;
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty$2.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var Uint8Array$1 = root$1.Uint8Array;
const Uint8Array$2 = Uint8Array$1;
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$2(result).set(new Uint8Array$2(arrayBuffer));
  return result;
}
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", mapTag$3 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$2 = "[object String]", symbolTag$2 = "[object Symbol]";
var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object);
    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);
    case dataViewTag$2:
      return cloneDataView(object, isDeep);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(object, isDeep);
    case mapTag$3:
      return new Ctor();
    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);
    case regexpTag$2:
      return cloneRegExp(object);
    case setTag$3:
      return new Ctor();
    case symbolTag$2:
      return cloneSymbol(object);
  }
}
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate$1(getPrototype$1(object)) : {};
}
var mapTag$2 = "[object Map]";
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$2;
}
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
const isMap$1 = isMap;
var setTag$2 = "[object Set]";
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$2;
}
var nodeIsSet = nodeUtil$1 && nodeUtil$1.isSet;
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
const isSet$1 = isSet;
var CLONE_DEEP_FLAG$1 = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG$1 = 4;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$1 = "[object Map]", numberTag$1 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$1 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG$1, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray$1(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value), isFunc = tag == funcTag || tag == genTag;
    if (isBuffer$1(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet$1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap$1(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var CLONE_DEEP_FLAG = 1, CLONE_SYMBOLS_FLAG = 4;
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
function setCacheHas(value) {
  return this.__data__.has(value);
}
function SetCache(values) {
  var index2 = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index2 < length) {
    this.add(values[index2]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function arraySome(array, predicate) {
  var index2 = -1, length = array == null ? 0 : array.length;
  while (++index2 < length) {
    if (predicate(array[index2], index2, array)) {
      return true;
    }
  }
  return false;
}
function cacheHas(cache, key) {
  return cache.has(key);
}
var COMPARE_PARTIAL_FLAG$3 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index2 < arrLength) {
    var arrValue = array[index2], othValue = other[index2];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
function mapToArray(map) {
  var index2 = -1, result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index2] = [key, value];
  });
  return result;
}
function setToArray(set) {
  var index2 = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index2] = value;
  });
  return result;
}
var COMPARE_PARTIAL_FLAG$2 = 1, COMPARE_UNORDERED_FLAG = 2;
var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$2(object), new Uint8Array$2(other))) {
        return false;
      }
      return true;
    case boolTag:
    case dateTag:
    case numberTag:
      return eq(+object, +other);
    case errorTag:
      return object.name == other.name && object.message == other.message;
    case regexpTag:
    case stringTag:
      return object == other + "";
    case mapTag:
      var convert = mapToArray;
    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
var COMPARE_PARTIAL_FLAG$1 = 1;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index2 = objLength;
  while (index2--) {
    var key = objProps[index2];
    if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index2 < objLength) {
    key = objProps[index2];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var COMPARE_PARTIAL_FLAG = 1;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray$1(object), othIsArr = isArray$1(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer$1(object)) {
    if (!isBuffer$1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
function isEqual(value, other) {
  return baseIsEqual(value, other);
}
const getCellFromEvent = (e) => {
  const cellRoot = e.composedPath().find(
    (v) => {
      var _a, _b, _c;
      return !((_a = v.classList) == null ? void 0 : _a.contains("kita-grid-cell--unselectable")) && ((_b = v.dataset) == null ? void 0 : _b.colidx) && ((_c = v.dataset) == null ? void 0 : _c.rowidx);
    }
  );
  if (cellRoot && cellRoot.dataset) {
    const { colidx, rowidx, colspan, rowspan } = cellRoot.dataset;
    return {
      rowIndex: +(rowidx || 0),
      colIndex: +(colidx || 0),
      rowspan: +(rowspan || 1),
      colspan: +(colspan || 1)
    };
  }
  return void 0;
};
class GridSelection {
  constructor(store) {
    __publicField(this, "container");
    __publicField(this, "boxArea", {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    });
    __publicField(this, "id", "");
    __publicField(this, "startPos", {
      rowIndex: -1,
      colIndex: -1
    });
    __publicField(this, "lastClickPos");
    __publicField(this, "lastShiftClickPos");
    __publicField(this, "callbackFunc", () => {
    });
    __publicField(this, "isMetaKey", false);
    __publicField(this, "isShiftKey", false);
    __publicField(this, "preventContextMenu", (e) => {
      e.preventDefault();
      this.onMouseup();
    });
    __publicField(this, "onMousedown", (e) => {
      if (!this.store.getUIProps("selection"))
        return;
      if (e.buttons !== 1 || e.button)
        return;
      const cellInfo = getCellFromEvent(e);
      this.isMetaKey = e.metaKey || e.ctrlKey;
      this.isShiftKey = e.shiftKey;
      if (cellInfo) {
        const { colIndex, rowIndex } = cellInfo;
        this.id = nanoid(4);
        this.startPos = {
          rowIndex,
          colIndex
        };
        if (this.isShiftKey) {
          if (!this.lastShiftClickPos) {
            this.lastShiftClickPos = cloneDeep(this.lastClickPos || this.startPos);
          }
        } else {
          this.lastShiftClickPos = void 0;
        }
        if (this.isShiftKey && this.lastShiftClickPos) {
          const { rowIndex: ri, colIndex: ci } = this.lastShiftClickPos;
          this.boxArea = {
            top: Math.min(rowIndex, ri),
            bottom: Math.max(rowIndex, ri),
            left: Math.min(colIndex, ci),
            right: Math.max(colIndex, ci)
          };
        } else {
          this.boxArea = {
            top: rowIndex,
            bottom: rowIndex,
            left: colIndex,
            right: colIndex
          };
        }
        this.lastClickPos = cloneDeep(this.startPos);
        this.container.style.userSelect = "none";
        document.body.addEventListener("mouseup", this.onMouseup);
        document.body.addEventListener("mouseover", this.onMouseOver);
        document.body.addEventListener("contextmenu", this.preventContextMenu);
        this.store.gridScrollZone.append();
        this.emitChange();
      }
    });
    __publicField(this, "onMouseOver", (e) => {
      if (!this.store.getUIProps("selection"))
        return;
      const cellInfo = getCellFromEvent(e);
      if (cellInfo) {
        const { colIndex, rowIndex } = cellInfo;
        const newArea = {
          top: Math.min(this.startPos.rowIndex, rowIndex),
          bottom: Math.max(this.startPos.rowIndex, rowIndex),
          left: Math.min(this.startPos.colIndex, colIndex),
          right: Math.max(this.startPos.colIndex, colIndex)
        };
        if (!isEqual(newArea, this.boxArea)) {
          this.boxArea = newArea;
          this.emitChange();
        }
      }
    });
    __publicField(this, "onMouseup", () => {
      if (!this.store.getUIProps("selection"))
        return;
      this.id = "";
      this.boxArea = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
      this.container.style.userSelect = "auto";
      document.body.removeEventListener("mouseover", this.onMouseOver);
      document.body.removeEventListener("mouseup", this.onMouseup);
      document.body.removeEventListener("contextmenu", this.preventContextMenu);
      this.store.gridScrollZone.remove();
    });
    this.store = store;
  }
  init(el) {
    this.container = el;
    this.container.addEventListener("mousedown", this.onMousedown);
  }
  on(fn) {
    this.callbackFunc = fn;
  }
  reset() {
  }
  emitChange() {
    this.callbackFunc(this.id, this.boxArea, this.isMetaKey);
  }
  destroy() {
    var _a;
    (_a = this.container) == null ? void 0 : _a.removeEventListener("mousedown", this.onMousedown);
    document.body.removeEventListener("contextmenu", this.preventContextMenu);
    document.body.removeEventListener("mouseup", this.onMouseup);
    document.body.removeEventListener("mouseover", this.onMouseOver);
    this.store.gridScrollZone.remove();
  }
}
const useTableEvent = (gridStore) => {
  return {
    onExpandChange(data) {
      gridStore.eventEmitter.emit(TableEventEnum.ExpandChange, data);
    },
    onCellSelection(data) {
      gridStore.eventEmitter.emit(TableEventEnum.BoxSelection, data);
    }
  };
};
const checkAndGetThInfo = (e, gridStore) => {
  const composedPath = e.composedPath();
  const thEl = composedPath.find((el) => {
    var _a;
    return (_a = el.classList) == null ? void 0 : _a.contains("kita-grid-th");
  });
  if (thEl) {
    const colId = thEl.dataset.id;
    if (colId === void 0)
      return;
    const targetColumnData = gridStore.headerCellInfo[colId];
    return {
      event: e,
      column: targetColumnData
    };
  }
  return null;
};
const checkAndGetTdInfo = (event, gridStore) => {
  const composedPath = event.composedPath();
  const tdEl = composedPath.find(
    (el) => {
      var _a;
      return (_a = el.classList) == null ? void 0 : _a.contains("kita-grid-td");
    }
  );
  if (tdEl) {
    const rowIdx = tdEl.dataset.rowidx;
    const colIdx = tdEl.dataset.colidx;
    if (rowIdx === void 0 || colIdx === void 0)
      return;
    const rowIdxNum = +rowIdx;
    const colIdxNum = +colIdx;
    const targetColumn = gridStore.flattedColumns[colIdxNum];
    const targetRow = gridStore.originList[rowIdxNum];
    if (targetColumn && targetRow) {
      return {
        event,
        column: targetColumn,
        columnIndex: colIdxNum,
        row: gridStore.originList[rowIdxNum],
        rowIndex: rowIdxNum,
        cell: targetColumn.field ? targetRow[targetColumn.field] : null
      };
    }
    return null;
  }
};
const useContentEvent = (gridStore) => {
  const onClick = (e) => {
    const thData = checkAndGetThInfo(e, gridStore);
    if (thData) {
      gridStore.eventEmitter.emit(HeaderEventEnum.HeaderClick, thData);
      return;
    }
    const tdData = checkAndGetTdInfo(e, gridStore);
    if (tdData) {
      gridStore.eventEmitter.emit(CellEventEnum.CellClick, tdData);
      gridStore.eventEmitter.emit(RowEventEnum.RowClick, tdData);
    }
  };
  const onDblclick = (e) => {
    const thData = checkAndGetThInfo(e, gridStore);
    if (thData) {
      gridStore.eventEmitter.emit(HeaderEventEnum.HeaderDblclick, thData);
      return;
    }
    const tdData = checkAndGetTdInfo(e, gridStore);
    if (tdData) {
      gridStore.eventEmitter.emit(CellEventEnum.CellDblclick, tdData);
      gridStore.eventEmitter.emit(RowEventEnum.RowDblclick, tdData);
    }
  };
  const onContextmenu = (e) => {
    const thData = checkAndGetThInfo(e, gridStore);
    if (thData) {
      gridStore.eventEmitter.emit(HeaderEventEnum.HeaderContextmenu, thData);
      return;
    }
    const tdData = checkAndGetTdInfo(e, gridStore);
    if (tdData) {
      gridStore.eventEmitter.emit(CellEventEnum.CellContextmenu, tdData);
      gridStore.eventEmitter.emit(RowEventEnum.RowContextmenu, tdData);
    }
  };
  return {
    onClick,
    onDblclick,
    onContextmenu
  };
};
class EventEmitter {
  constructor() {
    __publicField(this, "events", {});
  }
  // 订阅事件
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  // 取消订阅事件
  off(event, listener) {
    if (!this.events[event])
      return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }
  // 发布事件
  emit(event, ...args) {
    if (!this.events[event])
      return;
    this.events[event].forEach((listener) => listener(...args));
  }
  // 订阅一次性事件
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
  offAll() {
    this.events = {};
  }
}
class GridScrollZone {
  constructor(store) {
    __publicField(this, "container");
    __publicField(this, "scrollUpZone");
    __publicField(this, "scrollDownZone");
    __publicField(this, "scrollIntervalTimer", 0);
    __publicField(this, "speed", 4);
    __publicField(this, "lastDirection", 0);
    __publicField(this, "handler", (e) => {
      const els = document.elementsFromPoint(e.pageX, e.pageY);
      if (els.includes(this.scrollUpZone)) {
        this.onListScrollUp();
        this.lastDirection = -1;
      } else if (els.includes(this.scrollDownZone)) {
        this.onListScrollDown();
        this.lastDirection = 1;
      } else {
        cancelAnimationFrame(this.scrollIntervalTimer);
        this.lastDirection = 0;
      }
    });
    this.store = store;
    this.scrollUpZone = document.createElement("div");
    this.scrollUpZone.style.width = "3000px";
    this.scrollUpZone.style.height = "64px";
    this.scrollUpZone.style.position = "absolute";
    this.scrollUpZone.style.left = "0";
    this.scrollUpZone.style.top = "0";
    this.scrollUpZone.style.background = "transparent";
    this.scrollUpZone.style.zIndex = "-100";
    this.scrollUpZone.id = "kita-grid-scroll-zone__top";
    this.scrollDownZone = document.createElement("div");
    this.scrollDownZone.style.width = "3000px";
    this.scrollDownZone.style.height = "40px";
    this.scrollDownZone.style.position = "absolute";
    this.scrollDownZone.style.left = "0";
    this.scrollDownZone.style.bottom = "0";
    this.scrollDownZone.style.background = "transparent";
    this.scrollDownZone.style.zIndex = "-100";
    this.scrollUpZone.id = "kita-grid-scroll-zone__bottom";
  }
  init(container) {
    this.container = container;
  }
  scrollUp(offset, base = 1) {
    this.scrollIntervalTimer = requestAnimationFrame(() => {
      var _a;
      (_a = this.store.virtualListRef) == null ? void 0 : _a.scrollToOffset(offset - this.speed * base);
      this.scrollUp(offset, base + 1);
    });
  }
  scrollDown(offset, base = 1) {
    this.scrollIntervalTimer = requestAnimationFrame(() => {
      var _a;
      (_a = this.store.virtualListRef) == null ? void 0 : _a.scrollToOffset(offset + this.speed * base);
      this.scrollDown(offset, base + 1);
    });
  }
  onListScrollUp() {
    cancelAnimationFrame(this.scrollIntervalTimer);
    const { offset } = this.store.virtualListRef.reactiveData;
    const base = this.lastDirection === -1 ? 2 : 1;
    this.scrollUp(offset, base);
  }
  onListScrollDown() {
    cancelAnimationFrame(this.scrollIntervalTimer);
    const { offset } = this.store.virtualListRef.reactiveData;
    const base = this.lastDirection === 1 ? 2 : 1;
    this.scrollDown(offset, base);
  }
  append() {
    var _a, _b, _c;
    this.remove();
    (_a = this.container) == null ? void 0 : _a.appendChild(this.scrollUpZone);
    (_b = this.container) == null ? void 0 : _b.appendChild(this.scrollDownZone);
    (_c = this.container) == null ? void 0 : _c.addEventListener("mousemove", this.handler);
    document.body.addEventListener("mouseup", this.handler);
    this.lastDirection = 0;
  }
  remove() {
    var _a, _b, _c;
    cancelAnimationFrame(this.scrollIntervalTimer);
    (_a = this.scrollUpZone) == null ? void 0 : _a.remove();
    (_b = this.scrollDownZone) == null ? void 0 : _b.remove();
    (_c = this.container) == null ? void 0 : _c.removeEventListener("mousemove", this.handler);
    document.body.removeEventListener("mouseup", this.handler);
    this.lastDirection = 0;
  }
}
class GridStore {
  constructor() {
    // 响应式数据
    __publicField(this, "watchData", reactive({
      // 强制渲染
      renderKey: 0,
      // 列渲染起始
      colRenderBegin: 0,
      // 列渲染结束
      colRenderEnd: 0,
      // TODO 可能考虑拿出去做非响应式
      rowHeightMap: /* @__PURE__ */ new Map(),
      // 父子显示的映射
      foldMap: {},
      // 展开行显示的映射
      expandMap: {},
      // FIXME： 分组不需要这个，要重新写分组逻辑
      // 配置
      config: {
        rowHeight: 36,
        colWidth: 100
        // headerHeight: 30,
        // headerWidth: 100,
      },
      fullWidth: 0
    }));
    __publicField(this, "rowKey", "id");
    // 非响应式
    __publicField(this, "virtualListProps", shallowReactive$1({
      list: [],
      minSize: 30,
      itemKey: this.rowKey,
      // buffer: 4,
      renderControl: (begin, end) => {
        var _a, _b, _c, _d, _e, _f;
        return {
          begin: (_c = (_b = (_a = this.bodyMergeMap) == null ? void 0 : _a[begin]) == null ? void 0 : _b.$begin) != null ? _c : begin,
          end: (_f = (_e = (_d = this.bodyMergeMap) == null ? void 0 : _d[end]) == null ? void 0 : _e.$end) != null ? _f : end
        };
      }
    }));
    __publicField(this, "uiProps", shallowReactive$1({
      border: false,
      stripe: false,
      showTreeLine: false,
      selection: false,
      highlightCurrentRow: false,
      highlightCurrentColumn: false,
      defaultExpandAll: false,
      headerRowClassName: () => "",
      headerRowStyle: () => "",
      headerCellClassName: () => "",
      headerCellStyle: () => "",
      rowClassName: () => "",
      rowStyle: () => "",
      cellClassName: () => "",
      cellStyle: () => ""
    }));
    __publicField(this, "interaction", shallowReactive$1({
      selectBoxes: {},
      selectCellBorderMap: {},
      selectCellClassMap: {}
    }));
    // 原始列数据（带 _id），一般不直接用
    __publicField(this, "originColumns", []);
    // 平铺列(子树列)
    __publicField(this, "flattedColumns", []);
    // 左侧固定列(子树列)
    __publicField(this, "leftFixedColumns", []);
    // 右侧固定列(子树列)
    __publicField(this, "rightFixedColumns", []);
    // 中间主要列(子树列)
    __publicField(this, "centerNormalColumns", []);
    // 这3个是给表头用的
    __publicField(this, "leftFixedHeaderColumns", []);
    __publicField(this, "rightFixedHeaderColumns", []);
    __publicField(this, "centerNormalHeaderColumns", []);
    // 记一下原始的list
    __publicField(this, "originList", []);
    // 表身合并信息
    __publicField(this, "bodyMergeMap", {});
    __publicField(this, "headerCellInfo", {});
    __publicField(this, "gridSelection", new GridSelection(this));
    __publicField(this, "gridScrollZone", new GridScrollZone(this));
    __publicField(this, "currentRowId", ref$1(""));
    __publicField(this, "currentColumnId", ref$1(""));
    __publicField(this, "gridScrollingStatus", ref$1("is-scrolling-none"));
    __publicField(this, "tableRootEl");
    __publicField(this, "virtualListRef");
    __publicField(this, "gridRowMap", {});
    // 用于内部事件的触发
    __publicField(this, "eventEmitter", new EventEmitter());
    __publicField(this, "handleSelectionChange", (id, area, isMultiple) => {
      const mergedArea = this.expandMergedSelectArea(area);
      let selectBoxes = {
        [id]: mergedArea
      };
      if (isMultiple) {
        selectBoxes = {
          ...this.interaction.selectBoxes,
          ...selectBoxes
        };
      }
      const posMap = {};
      const cellBorderMap = {};
      Object.keys(selectBoxes).forEach((boxId) => {
        const { left, top, right, bottom } = selectBoxes[boxId];
        for (let i = top; i <= bottom; i++) {
          for (let j = left; j <= right; j++) {
            const posId = `${i}-${j}`;
            if (!posMap[posId]) {
              posMap[posId] = /* @__PURE__ */ new Set();
            }
            if (i === top || i === bottom || j === left || j === right) {
              if (i === top && j === left) {
                posMap[posId].add("left-top");
              }
              if (i === top && j === right) {
                posMap[posId].add("right-top");
              }
              if (i === bottom && j === left) {
                posMap[posId].add("left-bottom");
              }
              if (i === bottom && j === right) {
                posMap[posId].add("right-bottom");
              }
              if (j > left && j < right) {
                if (i === top) {
                  posMap[posId].add("top");
                }
                if (i === bottom) {
                  posMap[posId].add("bottom");
                }
              }
              if (i > top && i < bottom) {
                if (j === left) {
                  posMap[posId].add("left");
                }
                if (j === right) {
                  posMap[posId].add("right");
                }
              }
            } else {
              posMap[posId].add("center");
            }
          }
        }
      });
      Object.keys(posMap).forEach((posId) => {
        const poses = posMap[posId];
        if (poses.has("left-top") && poses.has("right-bottom") || poses.has("left-bottom") && poses.has("right-top")) {
          cellBorderMap[posId] = ["left-top", "right-bottom"];
        } else {
          cellBorderMap[posId] = [...posMap[posId]];
        }
      });
      const cellClass = {};
      const selectedCells = [];
      const selectedArea = [];
      const visitedCellId = /* @__PURE__ */ new Set();
      Object.keys(selectBoxes).forEach((boxId) => {
        var _a;
        const { left: nLeft, top: nTop, right: nRight, bottom: nBottom } = selectBoxes[boxId];
        const cells = [];
        for (let i = nTop; i <= nBottom; i++) {
          for (let j = nLeft; j <= nRight; j++) {
            const posId = `${i}-${j}`;
            const mergeInfo = (_a = this.bodyMergeMap[i]) == null ? void 0 : _a[j];
            const colspan = mergeInfo == null ? void 0 : mergeInfo.colspan;
            const rowspan = mergeInfo == null ? void 0 : mergeInfo.rowspan;
            cellClass[posId] = this.selectCellClassConstructor(cellBorderMap, i, j, rowspan, colspan);
            if (!mergeInfo || colspan || rowspan) {
              const cellData = {
                row: this.virtualListProps.list[i],
                rowIndex: i,
                column: this.flattedColumns[j],
                columnIndex: j
              };
              cells.push(cellData);
              if (!visitedCellId.has(posId)) {
                selectedCells.push(cellData);
              }
              visitedCellId.add(posId);
            }
          }
        }
        selectedArea.push(cells);
      });
      const tableEvents = useTableEvent(this);
      tableEvents.onCellSelection({
        areas: selectedArea,
        cells: selectedCells
      });
      this.interaction.selectBoxes = selectBoxes;
      this.interaction.selectCellBorderMap = cellBorderMap;
      this.interaction.selectCellClassMap = cellClass;
      this.forceUpdate();
    });
    this.gridSelection.on(this.handleSelectionChange);
  }
  forceUpdate() {
    this.watchData.renderKey += 1;
    console.log("forceUpdate");
  }
  setRowKey(key) {
    this.rowKey = key;
    this.virtualListProps.itemKey = key;
  }
  setRowMinHeight(minHeight) {
    this.virtualListProps.minSize = minHeight;
  }
  setColumns(columns) {
    const {
      leftFixedColumns,
      rightFixedColumns,
      centerNormalColumns,
      flattedColumns,
      headerCellInfo,
      originColumns,
      leftFixedHeaderColumns,
      rightFixedHeaderColumns,
      centerNormalHeaderColumns
    } = formatColumns(columns);
    this.leftFixedColumns = leftFixedColumns;
    this.rightFixedColumns = rightFixedColumns;
    this.centerNormalColumns = centerNormalColumns;
    this.flattedColumns = flattedColumns;
    this.headerCellInfo = headerCellInfo;
    this.originColumns = originColumns;
    this.leftFixedHeaderColumns = leftFixedHeaderColumns;
    this.rightFixedHeaderColumns = rightFixedHeaderColumns;
    this.centerNormalHeaderColumns = centerNormalHeaderColumns;
    this.watchData.fullWidth = this.flattedColumns.reduce((a, b) => a + b.width, 0);
    this.forceUpdate();
  }
  setColumnWidth(id, width) {
    const column = this.flattedColumns.find((col) => col._id === id);
    if (column) {
      column.width = width;
      this.setColumns(this.originColumns);
    }
  }
  setList(list) {
    this.virtualListProps.list = list;
  }
  // setConfig(config: GridStore['watchData']['config']) {
  //   this.watchData.config = {
  //     ...this.watchData.config,
  //     ...config,
  //   };
  // }
  setOriginList(list) {
    this.originList = list;
  }
  setTableRootEl(el) {
    this.tableRootEl = el;
  }
  // setMergeMethods(mergeMethods: any) {
  //   this.watchData.mergeMethods = mergeMethods;
  // }
  // setMergeCells(mergeCells: any) {
  //   this.watchData.mergeCells = mergeCells;
  //   console.log('mergeCells', mergeCells);
  // }
  generateFlatList() {
    const flattenList = [];
    const { foldMap, expandMap } = this.watchData;
    const hasExpandCol = !!this.flattedColumns.find((col) => col.type === ColumnType.Expand);
    const defaultExpandAll = this.getUIProps("defaultExpandAll");
    this.gridRowMap = {};
    let level = 0;
    let groupLevel = 0;
    const flat = (list, isGroup = false) => {
      list.forEach((item, index2) => {
        var _a;
        if (isGroup) {
          groupLevel += 1;
        }
        const row = { ...item, level, groupLevel, isLastChild: index2 === list.length - 1 };
        flattenList.push(row);
        this.gridRowMap[row.id] = row;
        if ((item == null ? void 0 : item.children) && ((_a = item == null ? void 0 : item.children) == null ? void 0 : _a.length) > 0) {
          level += 1;
          foldMap[item.id] = !defaultExpandAll;
          if (defaultExpandAll) {
            flat(item.children, item.type === "group");
          }
          level -= 1;
        }
        if (hasExpandCol) {
          expandMap[item.id] = defaultExpandAll;
          if (defaultExpandAll) {
            this.gridRowMap[`${item.id}-expand`] = { id: `${item.id}-expand`, type: "expand" };
          }
        }
        if (expandMap[item.id]) {
          flattenList.push(this.gridRowMap[`${item.id}-expand`]);
        }
        if (isGroup) {
          groupLevel -= 1;
        }
      });
    };
    flat(this.originList);
    this.setList(flattenList);
    return flattenList;
  }
  resetFlatList() {
    const flattenList = [];
    const { foldMap, expandMap } = this.watchData;
    let level = 0;
    let groupLevel = 0;
    const flat = (list, isGroup = false) => {
      list.forEach((item, index2) => {
        var _a;
        if (isGroup) {
          groupLevel += 1;
        }
        const row = { ...item, level, groupLevel, isLastChild: index2 === list.length - 1 };
        flattenList.push(row);
        this.gridRowMap[row.id] = row;
        if (foldMap[item.id] === false && (item == null ? void 0 : item.children) && ((_a = item == null ? void 0 : item.children) == null ? void 0 : _a.length) > 0) {
          level += 1;
          flat(item.children, item.type === "group");
          level -= 1;
        }
        if (expandMap[item.id]) {
          flattenList.push(this.gridRowMap[`${item.id}-expand`]);
        }
        if (isGroup) {
          groupLevel -= 1;
        }
      });
    };
    flat(this.originList);
    this.setList(flattenList);
    return flattenList;
  }
  mergeFunction(rowIndex, colIndex) {
    if (colIndex === 0) {
      if (rowIndex % 2 === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  }
  mergeMapConstructorWithFunction() {
    const colLen = 200;
    const rowLen = 1e4;
    const res = [];
    console.log(colLen, rowLen);
    for (let i = 0; i < colLen; i++) {
      for (let j = 0; j < rowLen; j++) {
        const mergeCfg = this.mergeFunction(j, i);
        if (mergeCfg) {
          res.push({
            rowIndex: j,
            colIndex: i,
            rowspan: mergeCfg.rowspan,
            colspan: mergeCfg.colspan
          });
        }
      }
    }
    return this.mergeMapConstructor(res);
  }
  mergeMapConstructor(cellList) {
    const mergeMap = {};
    cellList.forEach((cell) => {
      const { rowIndex, colIndex, rowspan, colspan } = cell;
      if (mergeMap[rowIndex]) {
        mergeMap[rowIndex].$begin = Math.min(mergeMap[rowIndex].$begin, rowIndex);
        mergeMap[rowIndex].$end = Math.max(mergeMap[rowIndex].$end, rowIndex + rowspan - 1);
      } else {
        mergeMap[rowIndex] = {
          $begin: rowIndex,
          $end: rowIndex + rowspan - 1
        };
      }
      for (let i = rowIndex; i < rowIndex + rowspan; i += 1) {
        for (let j = colIndex; j < colIndex + colspan; j += 1) {
          if (!mergeMap[i]) {
            mergeMap[i] = {
              $begin: rowIndex,
              $end: rowIndex + rowspan - 1
            };
          } else {
            mergeMap[i].$begin = Math.min(mergeMap[i].$begin, rowIndex);
            mergeMap[i].$end = Math.max(mergeMap[i].$end, rowIndex + rowspan - 1);
          }
          mergeMap[i][j] = {
            $begin: colIndex,
            $end: colIndex + colspan - 1,
            mergeBy: [rowIndex, colIndex]
          };
        }
      }
      mergeMap[rowIndex][colIndex] = {
        $begin: colIndex,
        $end: colIndex + colspan - 1,
        rowspan,
        colspan
      };
    });
    return mergeMap;
  }
  groupFoldConstructor(list, conditions) {
    return this.constructGroup(list, 0, conditions);
  }
  constructGroup(list, conditionIndex, conditions) {
    var _a;
    if (conditionIndex >= conditions.length) {
      return list;
    }
    const { columnId, sort } = conditions[conditionIndex];
    const sortedList = list.sort((a, b) => {
      if (sort === "desc") {
        return b[columnId].localeCompare(a[columnId]);
      }
      return a[columnId].localeCompare(b[columnId]);
    });
    const res = [];
    let subGroup = [];
    for (let i = 0; i < sortedList.length; i++) {
      const item = sortedList[i];
      if (item[columnId] === ((_a = subGroup[subGroup.length - 1]) == null ? void 0 : _a[columnId])) {
        subGroup.push(item);
      } else {
        if (subGroup.length) {
          res.push(subGroup);
        }
        subGroup = [item];
      }
    }
    if (subGroup.length) {
      res.push(subGroup);
    }
    const groupList = [];
    res.forEach((item) => {
      const v = item[0][columnId];
      groupList.push({
        id: `group-${columnId}-${nanoid(4)}`,
        type: "group",
        columnId,
        name: v,
        children: this.constructGroup(item, conditionIndex + 1, conditions)
      });
    });
    return groupList;
  }
  toggleFold(id) {
    const { foldMap } = this.watchData;
    foldMap[id] = !foldMap[id];
    this.resetFlatList();
  }
  toggleExpand(id) {
    const tableEvents = useTableEvent(this);
    const { expandMap } = this.watchData;
    expandMap[id] = !expandMap[id];
    if (expandMap[id] && !this.gridRowMap[`${id}-expand`]) {
      this.gridRowMap[`${id}-expand`] = { id: `${id}-expand`, type: "expand" };
    }
    const expandedRowKeys = Object.keys(expandMap).filter((key) => !!expandMap[key]).map((id2) => this.gridRowMap[id2]);
    tableEvents.onExpandChange({ row: this.gridRowMap[id], expandedRows: expandedRowKeys });
    this.resetFlatList();
  }
  setUIProps(key, value) {
    this.uiProps[key] = value;
  }
  getUIProps(key) {
    return this.uiProps[key];
  }
  expandMergedSelectArea(area) {
    var _a;
    const { left, top, right, bottom } = area;
    const mergedArea = { ...area };
    const visited = /* @__PURE__ */ new Set();
    const que = [];
    for (let i = top; i <= bottom; i++) {
      for (let j = left; j <= right; j++) {
        que.push([i, j]);
      }
    }
    while (que.length) {
      const [i, j] = que.shift();
      const mergeInfo = (_a = this.bodyMergeMap[i]) == null ? void 0 : _a[j];
      const k = `${i}-${j}`;
      if (visited.has(k)) {
        continue;
      }
      visited.add(k);
      if (mergeInfo) {
        const mergeBy = mergeInfo.mergeBy;
        if (mergeBy) {
          const mergeOrigin = this.bodyMergeMap[mergeBy[0]][mergeBy[1]];
          if (mergeOrigin) {
            mergedArea.left = Math.min(mergedArea.left, mergeBy[1]);
            mergedArea.right = Math.max(mergedArea.right, mergeBy[1] + mergeOrigin.colspan - 1);
            mergedArea.top = Math.min(mergedArea.top, mergeBy[0]);
            mergedArea.bottom = Math.max(mergedArea.bottom, mergeBy[0] + mergeOrigin.rowspan - 1);
          }
        } else {
          const { rowspan, colspan } = mergeInfo;
          mergedArea.left = Math.min(mergedArea.left, j);
          mergedArea.right = Math.max(mergedArea.right, j + colspan - 1);
          mergedArea.top = Math.min(mergedArea.top, i);
          mergedArea.bottom = Math.max(mergedArea.bottom, i + rowspan - 1);
        }
        const { left: left2, top: top2, right: right2, bottom: bottom2 } = mergedArea;
        for (let i2 = top2; i2 <= bottom2; i2++) {
          for (let j2 = left2; j2 <= right2; j2++) {
            que.push([i2, j2]);
          }
        }
      }
    }
    return mergedArea;
  }
  selectCellClassConstructor(selectRenderMap, rowIndex, colIndex, rowspan = 1, colspan = 1) {
    const id = `${rowIndex}-${colIndex}`;
    let pos = selectRenderMap[id];
    if (pos) {
      if (rowspan > 1 || colspan > 1) {
        const posArr = /* @__PURE__ */ new Set();
        for (let i = rowIndex; i < rowIndex + rowspan; i++) {
          for (let j = colIndex; j < colIndex + colspan; j++) {
            const subPos = selectRenderMap[`${i}-${j}`];
            if (subPos) {
              subPos.forEach((p) => {
                posArr.add(p);
              });
            }
          }
        }
        if (posArr.has("left-top")) {
          posArr.delete("left");
          posArr.delete("top");
          posArr.delete("center");
        }
        if (posArr.has("right-top")) {
          posArr.delete("right");
          posArr.delete("top");
          posArr.delete("center");
        }
        if (posArr.has("left-bottom")) {
          posArr.delete("left");
          posArr.delete("bottom");
          posArr.delete("center");
        }
        if (posArr.has("right-bottom")) {
          posArr.delete("right");
          posArr.delete("bottom");
          posArr.delete("center");
        }
        if (posArr.has("left") || posArr.has("right") || posArr.has("top") || posArr.has("bottom")) {
          posArr.delete("center");
        }
        if (posArr.has("left-top") && posArr.has("right-bottom") || posArr.has("left-bottom") && posArr.has("right-top")) {
          pos = ["left-top", "right-bottom"];
        } else {
          pos = [...posArr];
        }
      }
      return ["box-selection", ...pos.map((p) => `box-selection__${p}`)].join(" ");
    }
    return "";
  }
  getSelectionClass(rowIndex, column) {
    if (!this.getUIProps("selection")) {
      return "";
    }
    const colIndex = column.colIndex;
    const type = column.type;
    if (type === ColumnType.Expand || type === ColumnType.Index || type === ColumnType.Checkbox) {
      return "kita-grid-cell--unselectable";
    }
    const id = `${rowIndex}-${colIndex}`;
    return this.interaction.selectCellClassMap[id] || "";
  }
  initSelectionElement(el) {
    this.gridSelection.init(el);
    this.gridScrollZone.init(el);
  }
  getCurrentRow() {
    return this.currentRowId.value;
  }
  setCurrentRow(v) {
    if (this.getUIProps("highlightCurrentRow")) {
      this.currentRowId.value = v;
    }
  }
  getCurrentColumn() {
    return this.currentColumnId.value;
  }
  setCurrentColumn(v) {
    if (this.getUIProps("highlightCurrentColumn")) {
      this.currentColumnId.value = v;
    }
  }
  setRowSelection(areaId = nanoid(4), startRowIndex, endRowIndex, isMulti) {
    this.handleSelectionChange(
      areaId,
      {
        left: 0,
        right: this.flattedColumns.length,
        top: startRowIndex,
        bottom: endRowIndex
      },
      isMulti
    );
  }
  setColumnSelection(areaId = nanoid(4), startColumnIndex, endColumnIndex, isMulti) {
    this.handleSelectionChange(
      areaId,
      {
        left: startColumnIndex,
        right: endColumnIndex,
        top: 0,
        bottom: this.virtualListProps.list.length
      },
      isMulti
    );
  }
  initVirtualListRef(elRef) {
    this.virtualListRef = elRef;
  }
  calcGridScrollingStatus(scrollLeft, scrollWidth, clientWidth) {
    if (scrollWidth <= clientWidth) {
      this.gridScrollingStatus.value = "is-scrolling-none";
    } else {
      if (scrollLeft === 0) {
        this.gridScrollingStatus.value = "is-scrolling-left";
      } else if (scrollLeft + clientWidth === scrollWidth) {
        this.gridScrollingStatus.value = "is-scrolling-right";
      } else {
        this.gridScrollingStatus.value = "is-scrolling-middle";
      }
    }
  }
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$g = {};
const _hoisted_1$c = { class: "kita-grid-th-cell" };
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$c);
}
const IndexHeaderCell = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$1]]);
const _sfc_main$f = {};
const _hoisted_1$b = { class: "kita-grid-th-cell" };
const _hoisted_2$8 = /* @__PURE__ */ createElementVNode("input", { type: "checkbox" }, null, -1);
const _hoisted_3$6 = [
  _hoisted_2$8
];
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$b, _hoisted_3$6);
}
const CheckboxHeaderCell = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render]]);
const _hoisted_1$a = { class: "kita-grid-th-cell" };
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "TextHeaderCell",
  props: {
    column: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$a, toDisplayString(_ctx.column.title), 1);
    };
  }
});
const index = "";
const ColumnResizeLineClass = "gird-column-resize-line";
const ColumnResizeTriggerClass = "gird-column-resize-trigger";
function setRelative(el) {
  const style = getComputedStyle(el);
  const position = style.getPropertyValue("position");
  if (!position || position === "static") {
    el.style.position = "relative";
  }
}
function isInitialized(el) {
  return !!el.__resizeTrigger;
}
function useResizeColumn(columnEl, headerInfo, tableRootEl, cb) {
  if (isInitialized(columnEl))
    return;
  const resizeTriggerDom = document.createElement("div");
  resizeTriggerDom.className = ColumnResizeTriggerClass;
  const data = {
    resizing: false,
    startX: 0,
    endX: 0,
    columnLeft: 0,
    columnCurrentWidth: 0
  };
  function getWillWidth() {
    var _a, _b;
    return clamp(
      data.endX - data.startX + data.columnCurrentWidth,
      (_a = headerInfo.minWidth) != null ? _a : 0,
      (_b = headerInfo.maxWidth) != null ? _b : Infinity
    );
  }
  function setupTrigger() {
    var _a;
    if (!(headerInfo == null ? void 0 : headerInfo.resizable)) {
      (_a = resizeTriggerDom.parentElement) == null ? void 0 : _a.removeChild(resizeTriggerDom);
      return;
    }
    if (columnEl && !columnEl.contains(resizeTriggerDom)) {
      columnEl.appendChild(resizeTriggerDom);
      setRelative(columnEl);
      const style = getComputedStyle(columnEl);
      if (style.getPropertyValue("border-right-width") === "0px") {
        resizeTriggerDom.classList.add("is-opacity");
      }
    }
    columnEl.__resizeTrigger = true;
  }
  onUpdated(() => setupTrigger);
  watch$1(() => [columnEl, headerInfo], setupTrigger, { immediate: true });
  let resizeLine;
  function setupResizeLine(e) {
    if (!tableRootEl)
      return;
    data.startX = e.clientX;
    data.columnLeft = tableRootEl.scrollLeft + columnEl.getBoundingClientRect().left - tableRootEl.getBoundingClientRect().x - 2;
    data.endX = e.clientX;
    data.columnCurrentWidth = columnEl.getBoundingClientRect().width;
    resizeLine = document.createElement("div");
    resizeLine.className = ColumnResizeLineClass;
    tableRootEl.appendChild(resizeLine);
    setRelative(tableRootEl);
    resizeLine.style.transform = `translateX(${getWillWidth() + data.columnLeft}px)`;
    resizeLine.style.top = `${tableRootEl.scrollTop}px`;
  }
  function resize(e) {
    if (!data.resizing)
      return;
    e.preventDefault();
    data.endX = e.clientX;
    if (resizeLine)
      resizeLine.style.transform = `translateX(${getWillWidth() + data.columnLeft}px)`;
  }
  resizeTriggerDom.addEventListener("mouseenter", (e) => {
    if (!resizeLine)
      setupResizeLine(e);
  });
  resizeTriggerDom.addEventListener("mouseleave", (e) => {
    if (!data.resizing && resizeLine) {
      resizeLine.remove();
      resizeLine = void 0;
    }
  });
  resizeTriggerDom.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (data.resizing)
      return;
    data.resizing = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener(
      "mouseup",
      () => {
        data.resizing = false;
        document.removeEventListener("mousemove", resize);
        resizeLine == null ? void 0 : resizeLine.remove();
        resizeLine = void 0;
        console.log(getWillWidth());
        cb(getWillWidth());
      },
      {
        once: true
      }
    );
  });
}
const _hoisted_1$9 = ["data-id", "rowspan", "colspan"];
const _hoisted_2$7 = ["colspan"];
const _hoisted_3$5 = ["data-id", "rowspan", "colspan"];
const _hoisted_4$2 = ["colspan"];
const _hoisted_5$2 = ["data-id", "rowspan", "colspan"];
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "GridHeaderRow",
  props: {
    headerRowIndex: {},
    currentColumn: {},
    centerColumnsInfo: {}
  },
  setup(__props) {
    const gridStore = inject("gridStore");
    const {
      headerCellInfo,
      leftFixedHeaderColumns,
      rightFixedHeaderColumns,
      centerNormalHeaderColumns
    } = gridStore;
    const cls = {
      leftFixed: (column, index2) => [
        "kita-grid-th",
        "is-fixed",
        "is-fixed--left",
        index2 === leftFixedHeaderColumns[props.headerRowIndex].length - 1 && "is-last-column",
        getCellClass(column),
        column.className
      ],
      leftPadding: () => ["kita-grid-th"],
      main: (column) => ["kita-grid-th", getCellClass(column), column.className],
      rightPadding: () => ["kita-grid-th"],
      rightFixed: (column, index2) => [
        "kita-grid-th",
        "is-fixed",
        "is-fixed--right",
        index2 === 0 && "is-first-column",
        getCellClass(column),
        column.className
      ],
      row: () => ["kita-grid-tr", getRowClass()]
    };
    const props = __props;
    const leftCount = computed(() => {
      var _a, _b;
      const currentHeaderColumns = props.centerColumnsInfo[props.headerRowIndex];
      const currentHeaderFirstColumn = currentHeaderColumns == null ? void 0 : currentHeaderColumns[0];
      return (_b = (_a = headerCellInfo[currentHeaderFirstColumn == null ? void 0 : currentHeaderFirstColumn._id]) == null ? void 0 : _a.leftColspan) != null ? _b : 0;
    });
    const rightCount = computed(() => {
      var _a, _b, _c, _d;
      const currentHeaderColumns = props.centerColumnsInfo[props.headerRowIndex];
      const currentHeaderLastColumn = currentHeaderColumns == null ? void 0 : currentHeaderColumns[(currentHeaderColumns == null ? void 0 : currentHeaderColumns.length) - 1];
      const currentHeaderLastColumnLeftColspan = (_b = (_a = headerCellInfo[currentHeaderLastColumn == null ? void 0 : currentHeaderLastColumn._id]) == null ? void 0 : _a.leftColspan) != null ? _b : 0;
      const currentCenterNormalHeaderColumns = centerNormalHeaderColumns[props.headerRowIndex];
      const currentHeaderNormalHeaderLastColumn = currentCenterNormalHeaderColumns == null ? void 0 : currentCenterNormalHeaderColumns[(currentCenterNormalHeaderColumns == null ? void 0 : currentCenterNormalHeaderColumns.length) - 1];
      const currentHeaderNormalHeaderLastColumnLeftColspan = (_d = (_c = headerCellInfo[currentHeaderNormalHeaderLastColumn == null ? void 0 : currentHeaderNormalHeaderLastColumn._id]) == null ? void 0 : _c.leftColspan) != null ? _d : 0;
      return currentHeaderNormalHeaderLastColumnLeftColspan - currentHeaderLastColumnLeftColspan;
    });
    const fullRow = leftFixedHeaderColumns[props.headerRowIndex].concat(
      centerNormalHeaderColumns[props.headerRowIndex],
      rightFixedHeaderColumns[props.headerRowIndex]
    );
    const getRowClass = () => {
      const fn = gridStore.getUIProps("headerRowClassName");
      if (fn) {
        return fn({
          row: fullRow,
          rowIndex: props.headerRowIndex
        });
      }
    };
    const getRowStyle = () => {
      const fn = gridStore.getUIProps("headerRowStyle");
      if (fn) {
        return fn({
          row: fullRow,
          rowIndex: props.headerRowIndex
        });
      }
    };
    const getCellClass = (column) => {
      const fn = gridStore.getUIProps("headerCellClassName");
      if (fn) {
        return fn({
          row: props.currentColumn,
          rowIndex: props.headerRowIndex,
          column,
          columnIndex: column.colIndex
        });
      }
    };
    const getCellStyle = (column) => {
      const fn = gridStore.getUIProps("headerCellStyle");
      if (fn) {
        return fn({
          row: props.currentColumn,
          rowIndex: props.headerRowIndex,
          column,
          columnIndex: column.colIndex
        });
      }
    };
    const itemRefEl = ref$1();
    onUpdated(() => {
      var _a;
      (_a = itemRefEl.value) == null ? void 0 : _a.querySelectorAll(":scope>th[data-id]").forEach((item) => {
        var _a2, _b;
        const colId = item.getAttribute("data-id");
        if (!colId || !((_a2 = headerCellInfo[colId]) == null ? void 0 : _a2.resizable) || !((_b = headerCellInfo[colId]) == null ? void 0 : _b.isLeaf))
          return;
        useResizeColumn(
          item,
          headerCellInfo[colId],
          gridStore.tableRootEl,
          (width) => {
            if (colId)
              gridStore.setColumnWidth(colId, width);
          }
        );
      });
    });
    function getRenderCell(column) {
      var _a;
      switch (column.type) {
        case ColumnType.Index:
          return IndexHeaderCell;
        case ColumnType.Checkbox:
          return CheckboxHeaderCell;
        default:
          if (column == null ? void 0 : column.headerRender)
            return (_a = column == null ? void 0 : column.headerRender) == null ? void 0 : _a.call(column, column);
          return _sfc_main$e;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("tr", {
        ref_key: "itemRefEl",
        ref: itemRefEl,
        class: normalizeClass(cls.row()),
        style: normalizeStyle(getRowStyle())
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(leftFixedHeaderColumns)[_ctx.headerRowIndex], (column, index2) => {
          var _a, _b;
          return openBlock(), createElementBlock("th", {
            key: column.field,
            "data-id": column._id,
            class: normalizeClass(cls.leftFixed(column, index2)),
            style: normalizeStyle(`text-align: ${column.headerAlign || column.align}; left: ${unref(headerCellInfo)[column._id].left}px; ${getCellStyle(column)}`),
            rowspan: (_a = unref(headerCellInfo)[column._id]) == null ? void 0 : _a.rowspan,
            colspan: (_b = unref(headerCellInfo)[column._id]) == null ? void 0 : _b.colspan
          }, [
            (openBlock(), createBlock(resolveDynamicComponent(getRenderCell(column)), { column }, null, 8, ["column"]))
          ], 14, _hoisted_1$9);
        }), 128)),
        leftCount.value > 0 ? (openBlock(), createElementBlock("th", {
          key: 0,
          class: normalizeClass(cls.leftPadding()),
          colspan: leftCount.value
        }, null, 10, _hoisted_2$7)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.centerColumnsInfo[_ctx.headerRowIndex], (column) => {
          var _a, _b;
          return openBlock(), createElementBlock("th", {
            key: column.field,
            class: normalizeClass(cls.main(column)),
            style: normalizeStyle(`text-align: ${column.headerAlign || column.align}; ${getCellStyle(column)}`),
            "data-id": column._id,
            rowspan: (_a = unref(headerCellInfo)[column._id]) == null ? void 0 : _a.rowspan,
            colspan: (_b = unref(headerCellInfo)[column._id]) == null ? void 0 : _b.colspan
          }, [
            (openBlock(), createBlock(resolveDynamicComponent(getRenderCell(column)), { column }, null, 8, ["column"]))
          ], 14, _hoisted_3$5);
        }), 128)),
        rightCount.value > 0 ? (openBlock(), createElementBlock("th", {
          key: 1,
          class: normalizeClass(cls.rightPadding),
          colspan: rightCount.value
        }, null, 10, _hoisted_4$2)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(rightFixedHeaderColumns)[_ctx.headerRowIndex], (column, index2) => {
          var _a, _b;
          return openBlock(), createElementBlock("th", {
            key: column.field,
            "data-id": column._id,
            class: normalizeClass(cls.rightFixed(column, index2)),
            style: normalizeStyle(`text-align: ${column.headerAlign || column.align}; right: ${unref(headerCellInfo)[column._id].right}px; ${getCellStyle(column)}`),
            rowspan: (_a = unref(headerCellInfo)[column._id]) == null ? void 0 : _a.rowspan,
            colspan: (_b = unref(headerCellInfo)[column._id]) == null ? void 0 : _b.colspan
          }, [
            (openBlock(), createBlock(resolveDynamicComponent(getRenderCell(column)), { column }, null, 8, ["column"]))
          ], 14, _hoisted_5$2);
        }), 128))
      ], 6);
    };
  }
});
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "GridHeader",
  setup(__props) {
    const gridStore = inject("gridStore");
    const { leftFixedHeaderColumns } = gridStore;
    const centerColumnsInfo = computed(() => {
      const { centerNormalColumns, centerNormalHeaderColumns, headerCellInfo } = gridStore;
      const centerColumnsInfo2 = [];
      centerNormalColumns.forEach((col) => {
        headerCellInfo[col._id].rendered = false;
        const { parentColumn } = headerCellInfo[col._id];
        if (parentColumn) {
          headerCellInfo[parentColumn._id].rendered = false;
        }
      });
      for (let i = gridStore.watchData.colRenderBegin; i <= gridStore.watchData.colRenderEnd; i++) {
        const column = centerNormalColumns[i];
        const { level = 0, parentColumn } = headerCellInfo[column._id];
        if (centerColumnsInfo2[level] === void 0) {
          centerColumnsInfo2[level] = [];
        }
        centerColumnsInfo2[level].push(column);
        headerCellInfo[column._id].rendered = true;
        if (parentColumn) {
          const { level: parentLevel = 0 } = headerCellInfo[parentColumn._id];
          if (centerColumnsInfo2[parentLevel] === void 0) {
            centerColumnsInfo2[parentLevel] = [];
          }
          if (centerColumnsInfo2[parentLevel].indexOf(parentColumn) < 0) {
            centerColumnsInfo2[parentLevel].push(parentColumn);
            headerCellInfo[parentColumn._id].rendered = true;
          }
        }
      }
      const baseLeftPadding = [];
      const maxLevel = centerNormalHeaderColumns.length;
      for (let i = 0; i < maxLevel; i++) {
        baseLeftPadding.push(0);
      }
      for (let i = 0; i < maxLevel; i++) {
        const row = centerNormalHeaderColumns[i];
        for (let j = 0; j < row.length; j++) {
          const info = headerCellInfo[row[j]._id];
          const parentInfo = info.parentId ? headerCellInfo[info.parentId] : void 0;
          if (!info.rendered && (!parentInfo || parentInfo.rendered)) {
            for (let k = i; k < maxLevel; k++) {
              baseLeftPadding[k] += info.colspan || 1;
            }
          } else {
            break;
          }
        }
      }
      for (let i = 0; i < maxLevel; i++) {
        const row = centerNormalHeaderColumns[i];
        let isLeftPadding = true;
        for (let j = 0; j < row.length; j++) {
          const info = headerCellInfo[row[j]._id];
          if (info.rendered || !isLeftPadding) {
            info.leftColspan = baseLeftPadding[i];
            baseLeftPadding[i] += info.colspan || 1;
            isLeftPadding = false;
          }
        }
      }
      return centerColumnsInfo2;
    });
    return (_ctx, _cache) => {
      return openBlock(true), createElementBlock(Fragment, null, renderList(unref(leftFixedHeaderColumns), (currentColumn, index2) => {
        return openBlock(), createBlock(_sfc_main$d, {
          key: index2,
          currentColumn,
          headerRowIndex: index2,
          centerColumnsInfo: centerColumnsInfo.value
        }, null, 8, ["currentColumn", "headerRowIndex", "centerColumnsInfo"]);
      }), 128);
    };
  }
});
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "Placement",
  props: {
    showLine: { type: Boolean, default: false },
    isLastPlacement: { type: Boolean, default: false },
    isLastChild: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const cls = computed(() => [
      "placement",
      props.showLine && "placement--tree-line",
      props.showLine && props.isLastPlacement && "placement--last-padding",
      props.showLine && props.isLastPlacement && props.isLastChild && "placement--last-tree-node"
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(cls.value)
      }, null, 2);
    };
  }
});
const _hoisted_1$8 = /* @__PURE__ */ createElementVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none"
}, [
  /* @__PURE__ */ createElementVNode("path", {
    d: "M8.58816 5.15502L16.888 11.1913C17.4371 11.5906 17.4371 12.4094 16.888 12.8087L8.58816 18.845C7.92719 19.3257 6.99999 18.8535 6.99999 18.0362L6.99999 5.96376C6.99999 5.14647 7.92719 4.67432 8.58816 5.15502Z",
    fill: "#6B7075"
  })
], -1);
const _hoisted_2$6 = [
  _hoisted_1$8
];
const _hoisted_3$4 = { class: "content" };
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "TitleCell",
  props: {
    row: {},
    column: {}
  },
  setup(__props) {
    const gridStore = inject("gridStore");
    const { watchData } = gridStore;
    const props = __props;
    const showTreeLine = computed(() => gridStore.getUIProps("showTreeLine"));
    const customBody = computed(() => {
      var _a, _b;
      return (_b = (_a = props.column) == null ? void 0 : _a.bodyRender) == null ? void 0 : _b.call(_a, props.column, props.row);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "kita-grid-cell kita-grid-cell__title",
        style: normalizeStyle(`width: ${_ctx.column.width}px;`)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.row.level, (item) => {
          return openBlock(), createBlock(_sfc_main$b, {
            key: item,
            "show-line": showTreeLine.value && item > _ctx.row.groupLevel,
            "is-last-child": _ctx.row.isLastChild,
            "is-last-placement": item === _ctx.row.level
          }, null, 8, ["show-line", "is-last-child", "is-last-placement"]);
        }), 128)),
        createElementVNode("div", {
          class: normalizeClass([
            "tree-leading",
            showTreeLine.value ? "tree-leading--tree-line" : "tree-leading--tree-line-hide",
            (!_ctx.row.level || _ctx.row.level === _ctx.row.groupLevel) && "tree-leading--first-node"
          ])
        }, [
          unref(watchData).foldMap[_ctx.row.id] !== void 0 ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass([
              "tree-leading-icon",
              !unref(watchData).foldMap[props.row.id] && "tree-leading-icon--expand"
            ]),
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => unref(gridStore).toggleFold(_ctx.row.id), ["stop"]))
          }, _hoisted_2$6, 2)) : createCommentVNode("", true)
        ], 2),
        createElementVNode("div", _hoisted_3$4, [
          customBody.value ? (openBlock(), createBlock(resolveDynamicComponent(customBody.value), { key: 0 })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode(toDisplayString(_ctx.column.field ? _ctx.row[_ctx.column.field] : ""), 1)
          ], 64))
        ])
      ], 4);
    };
  }
});
const TitleCell_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$7 = { class: "kita-grid-cell kita-grid-cell__text" };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "TextCell",
  props: {
    rowIndex: {},
    row: {},
    column: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, toDisplayString(_ctx.column.field ? _ctx.row[_ctx.column.field] : ""), 1);
    };
  }
});
function handleColumns({
  currentRowMergeInfo,
  columns,
  startIndex,
  endIndex,
  offsetIndex = 0
}) {
  var _a, _b, _c, _d, _e;
  const result = [];
  for (let colIndex = startIndex; colIndex <= endIndex; colIndex++) {
    const column = columns[colIndex];
    if ((currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + offsetIndex]) === void 0) {
      result.push(column);
    } else if (((_a = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + offsetIndex]) == null ? void 0 : _a.colspan) !== void 0) {
      result.push({
        ...column,
        colspan: (_b = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + offsetIndex]) == null ? void 0 : _b.colspan,
        rowspan: (_c = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + offsetIndex]) == null ? void 0 : _c.rowspan
      });
      colIndex += ((_e = (_d = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + offsetIndex]) == null ? void 0 : _d.colspan) != null ? _e : 0) - 1;
    }
  }
  return result;
}
const useRenderColumns = (rowIndex, gridStore) => {
  const data = computed(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const { watchData, bodyMergeMap, leftFixedColumns, rightFixedColumns, centerNormalColumns } = gridStore;
    const currentRowMergeInfo = bodyMergeMap[rowIndex];
    const mainStartIndex = leftFixedColumns.length;
    const rightStartIndex = mainStartIndex + centerNormalColumns.length;
    const leftColumns = handleColumns({
      currentRowMergeInfo,
      columns: leftFixedColumns,
      startIndex: 0,
      endIndex: leftFixedColumns.length - 1,
      offsetIndex: 0
    });
    const rightColumns = handleColumns({
      currentRowMergeInfo,
      columns: rightFixedColumns,
      startIndex: 0,
      endIndex: rightFixedColumns.length - 1,
      offsetIndex: rightStartIndex
    });
    const actualBeginIndex = watchData.colRenderBegin + mainStartIndex;
    const $begin = ((_a = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[actualBeginIndex]) == null ? void 0 : _a.$begin) !== void 0 ? (_b = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[actualBeginIndex]) == null ? void 0 : _b.$begin : actualBeginIndex;
    const leftCount = $begin - mainStartIndex;
    const actualEndIndex = watchData.colRenderEnd + mainStartIndex;
    const $end = ((_c = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[actualEndIndex]) == null ? void 0 : _c.$end) !== void 0 ? (_d = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[actualEndIndex]) == null ? void 0 : _d.$end : actualEndIndex;
    const rightCount = Math.max(0, centerNormalColumns.length - 1 - $end + mainStartIndex);
    const centerColumns = [];
    for (let colIndex = leftCount; colIndex <= watchData.colRenderEnd; colIndex++) {
      if ((currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + mainStartIndex]) === void 0) {
        centerColumns.push(centerNormalColumns[colIndex]);
      } else if (((_e = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + mainStartIndex]) == null ? void 0 : _e.colspan) !== void 0) {
        centerColumns.push({
          ...centerNormalColumns[colIndex],
          colspan: (_f = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + mainStartIndex]) == null ? void 0 : _f.colspan,
          rowspan: (_g = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + mainStartIndex]) == null ? void 0 : _g.rowspan
        });
        colIndex += ((_i = (_h = currentRowMergeInfo == null ? void 0 : currentRowMergeInfo[colIndex + mainStartIndex]) == null ? void 0 : _h.colspan) != null ? _i : 1) - 1;
      }
    }
    return {
      leftColumns,
      rightColumns,
      centerColumns,
      leftCount,
      rightCount
    };
  });
  return data;
};
const _hoisted_1$6 = { class: "kita-grid-cell kita-grid-cell__index" };
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "IndexCell",
  props: {
    rowIndex: {},
    row: {},
    column: {}
  },
  setup(__props) {
    var _a, _b, _c;
    const props = __props;
    const indexValue = (_c = (_b = (_a = props.column) == null ? void 0 : _a.index) == null ? void 0 : _b.call(_a, props.rowIndex)) != null ? _c : props.rowIndex + 1;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, toDisplayString(unref(indexValue)), 1);
    };
  }
});
const _hoisted_1$5 = { class: "kita-grid-cell kita-grid-cell__checkbox" };
const _hoisted_2$5 = /* @__PURE__ */ createElementVNode("input", { type: "checkbox" }, null, -1);
const _hoisted_3$3 = [
  _hoisted_2$5
];
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "CheckboxCell",
  props: {
    rowIndex: {},
    row: {},
    column: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, _hoisted_3$3);
    };
  }
});
const _hoisted_1$4 = /* @__PURE__ */ createElementVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none"
}, [
  /* @__PURE__ */ createElementVNode("path", {
    d: "M6.79289 22.2071C6.40237 21.8166 6.40237 21.1834 6.79289 20.7929L15.0858 12.5L6.79289 4.20711C6.40237 3.81658 6.40237 3.18342 6.79289 2.79289C7.18342 2.40237 7.81658 2.40237 8.20711 2.79289L17.2071 11.7929C17.5976 12.1834 17.5976 12.8166 17.2071 13.2071L8.20711 22.2071C7.81658 22.5976 7.18342 22.5976 6.79289 22.2071Z",
    fill: "#6B7075"
  })
], -1);
const _hoisted_2$4 = [
  _hoisted_1$4
];
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ExpandCell",
  props: {
    rowIndex: {},
    row: {},
    column: {}
  },
  setup(__props) {
    const gridStore = inject("gridStore");
    const { watchData } = gridStore;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "kita-grid-cell kita-grid-cell__expand",
        onClick: _cache[0] || (_cache[0] = ($event) => unref(gridStore).toggleExpand(_ctx.row.id))
      }, [
        createElementVNode("div", {
          class: normalizeClass(["row-expand-icon", unref(watchData).expandMap[_ctx.row.id] && "row-expand-icon--expand"])
        }, _hoisted_2$4, 2)
      ]);
    };
  }
});
const _hoisted_1$3 = ["rowspan", "colspan", "data-rowidx", "data-colidx"];
const _hoisted_2$3 = ["colspan"];
const _hoisted_3$2 = ["rowspan", "colspan", "data-rowidx", "data-colidx"];
const _hoisted_4$1 = ["colspan"];
const _hoisted_5$1 = ["rowspan", "colspan", "data-rowidx", "data-colidx"];
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "BaseRow",
  props: {
    resizeObserver: { default: null },
    rowIndex: { default: 0 },
    row: {}
  },
  setup(__props) {
    const gridStore = inject("gridStore");
    const { headerCellInfo } = gridStore;
    const props = __props;
    const currentRowId = computed(() => gridStore.getCurrentRow());
    const currentColumnId = computed(() => gridStore.getCurrentColumn());
    const cls = {
      leftFixed: (column, index2) => [
        "kita-grid-td",
        "is-fixed",
        "is-fixed--left",
        index2 === mainRenderInfo.value.leftColumns.length - 1 && "is-last-column",
        column._id === currentColumnId.value && "current-column",
        gridStore.getSelectionClass(props.rowIndex, column),
        getCellClass(column),
        column.className
      ],
      leftPadding: () => ["kita-grid-td"],
      main: (column) => [
        "kita-grid-td",
        column._id === currentColumnId.value && "current-column",
        gridStore.getSelectionClass(props.rowIndex, column),
        getCellClass(column),
        column.className
      ],
      rightPadding: () => ["kita-grid-td"],
      rightFixed: (column, index2) => [
        "kita-grid-td",
        "is-fixed",
        "is-fixed--right",
        index2 === 0 && "is-first-column",
        column._id === currentColumnId.value && "current-column",
        gridStore.getSelectionClass(props.rowIndex, column),
        getCellClass(column),
        column.className
      ],
      row: () => [
        "kita-grid-tr",
        gridStore.getUIProps("stripe") && props.rowIndex % 2 && "kita-grid-tr--striped",
        props.row.id === currentRowId.value && "current-row",
        getRowClass()
      ]
    };
    const { itemRefEl } = useObserverItem({ resizeObserver: props.resizeObserver });
    const mainRenderInfo = useRenderColumns(props.rowIndex, gridStore);
    const maxHeight = computed(() => gridStore.watchData.rowHeightMap.get(String(props.row.id)));
    const getRowClass = () => {
      const fn = gridStore.getUIProps("rowClassName");
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex
        });
      }
    };
    const getCellClass = (column) => {
      const fn = gridStore.getUIProps("cellClassName");
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex,
          column,
          columnIndex: column.colIndex
        });
      }
    };
    const getRowStyle = () => {
      const fn = gridStore.getUIProps("rowStyle");
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex
        });
      }
    };
    const getCellStyle = (column) => {
      const fn = gridStore.getUIProps("cellStyle");
      if (fn) {
        return fn({
          row: props.row,
          rowIndex: props.rowIndex,
          column,
          columnIndex: column.colIndex
        });
      }
    };
    function getRenderCell(column) {
      var _a;
      switch (column.type) {
        case ColumnType.Index:
          return _sfc_main$8;
        case ColumnType.Title:
          return _sfc_main$a;
        case ColumnType.Checkbox:
          return _sfc_main$7;
        case ColumnType.Expand:
          return _sfc_main$6;
        default:
          if (column.bodyRender)
            return (_a = column == null ? void 0 : column.bodyRender) == null ? void 0 : _a.call(column, column, props.row);
          return _sfc_main$9;
      }
    }
    function handleCurrentRowClick() {
      gridStore.setCurrentRow(props.row.id);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("tr", {
        ref_key: "itemRefEl",
        ref: itemRefEl,
        class: normalizeClass(cls.row()),
        style: normalizeStyle(getRowStyle()),
        onMousedown: handleCurrentRowClick
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(mainRenderInfo).leftColumns, (column, index2) => {
          return openBlock(), createElementBlock("td", {
            key: column.field,
            class: normalizeClass(cls.leftFixed(column, index2)),
            style: normalizeStyle(`text-align: ${column.align}; left: ${unref(headerCellInfo)[column._id].left}px; ${getCellStyle(column)}`),
            rowspan: column == null ? void 0 : column.rowspan,
            colspan: column == null ? void 0 : column.colspan,
            "data-rowidx": _ctx.rowIndex,
            "data-colidx": column.colIndex
          }, [
            (openBlock(), createBlock(resolveDynamicComponent(getRenderCell(column)), {
              rowIndex: _ctx.rowIndex,
              row: _ctx.row,
              column
            }, null, 8, ["rowIndex", "row", "column"]))
          ], 14, _hoisted_1$3);
        }), 128)),
        unref(mainRenderInfo).leftCount > 0 ? (openBlock(), createElementBlock("td", {
          key: 0,
          class: normalizeClass(cls.leftPadding()),
          colspan: unref(mainRenderInfo).leftCount,
          style: normalizeStyle(`height: ${maxHeight.value}px`)
        }, null, 14, _hoisted_2$3)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(mainRenderInfo).centerColumns, (column) => {
          return openBlock(), createElementBlock("td", {
            key: column.field,
            class: normalizeClass(cls.main(column)),
            style: normalizeStyle(`text-align: ${column.align}; ${getCellStyle(column)}`),
            rowspan: column == null ? void 0 : column.rowspan,
            colspan: column == null ? void 0 : column.colspan,
            "data-rowidx": _ctx.rowIndex,
            "data-colidx": column.colIndex
          }, [
            (openBlock(), createBlock(resolveDynamicComponent(getRenderCell(column)), {
              rowIndex: _ctx.rowIndex,
              row: _ctx.row,
              column
            }, null, 8, ["rowIndex", "row", "column"]))
          ], 14, _hoisted_3$2);
        }), 128)),
        unref(mainRenderInfo).rightCount > 0 ? (openBlock(), createElementBlock("td", {
          key: 1,
          class: normalizeClass(cls.rightPadding),
          colspan: unref(mainRenderInfo).rightCount,
          style: normalizeStyle(`height: ${maxHeight.value}px`)
        }, null, 14, _hoisted_4$1)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(mainRenderInfo).rightColumns, (column, index2) => {
          return openBlock(), createElementBlock("td", {
            key: column.field,
            class: normalizeClass(cls.rightFixed(column, index2)),
            style: normalizeStyle(`text-align: ${column.align}; right: ${unref(headerCellInfo)[column._id].right}px; ${getCellStyle(column)}`),
            rowspan: column == null ? void 0 : column.rowspan,
            colspan: column == null ? void 0 : column.colspan,
            "data-rowidx": _ctx.rowIndex,
            "data-colidx": column.colIndex
          }, [
            (openBlock(), createBlock(resolveDynamicComponent(getRenderCell(column)), {
              rowIndex: _ctx.rowIndex,
              row: _ctx.row,
              column
            }, null, 8, ["rowIndex", "row", "column"]))
          ], 14, _hoisted_5$1);
        }), 128))
      ], 38);
    };
  }
});
const _hoisted_1$2 = ["colspan"];
const _hoisted_2$2 = /* @__PURE__ */ createElementVNode("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none"
}, [
  /* @__PURE__ */ createElementVNode("path", {
    d: "M8.58816 5.15502L16.888 11.1913C17.4371 11.5906 17.4371 12.4094 16.888 12.8087L8.58816 18.845C7.92719 19.3257 6.99999 18.8535 6.99999 18.0362L6.99999 5.96376C6.99999 5.14647 7.92719 4.67432 8.58816 5.15502Z",
    fill: "#6B7075"
  })
], -1);
const _hoisted_3$1 = [
  _hoisted_2$2
];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "GroupRow",
  props: {
    row: {},
    resizeObserver: { default: null },
    rowIndex: { default: 0 }
  },
  setup(__props) {
    const gridStore = inject("gridStore");
    const { foldMap, config } = gridStore.watchData;
    const { flattedColumns } = gridStore;
    const props = __props;
    console.log(111, foldMap[props.row.id]);
    const { itemRefEl } = useObserverItem({ resizeObserver: props.resizeObserver });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("tr", {
        ref_key: "itemRefEl",
        ref: itemRefEl,
        class: "kita-grid-tr kita-grid-tr--group"
      }, [
        createElementVNode("td", {
          class: "kita-grid-td kita-grid-td--group",
          colspan: unref(flattedColumns).length
        }, [
          createElementVNode("div", {
            class: "kita-grid-cell",
            style: normalizeStyle(`height: ${unref(config).rowHeight}px;`)
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(props.row.level, (item) => {
              return openBlock(), createBlock(_sfc_main$b, {
                key: item,
                class: normalizeClass(item === props.row.level ? "last" : "")
              }, null, 8, ["class"]);
            }), 128)),
            createElementVNode("div", {
              class: normalizeClass(["group-icon", !unref(foldMap)[props.row.id] && "group-icon--expand"]),
              onClick: _cache[0] || (_cache[0] = withModifiers(($event) => unref(gridStore).toggleFold(_ctx.row.id), ["stop"]))
            }, _hoisted_3$1, 2),
            createElementVNode("div", null, "分组-" + toDisplayString(props.row.name), 1)
          ], 4)
        ], 8, _hoisted_1$2)
      ], 512);
    };
  }
});
const _hoisted_1$1 = ["colspan"];
const _hoisted_2$1 = { class: "kita-grid-cell" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ExpandRow",
  props: {
    resizeObserver: { default: null },
    rowIndex: {},
    row: {}
  },
  setup(__props) {
    const gridStore = inject("gridStore");
    const { flattedColumns } = gridStore;
    const expandCol = computed(() => flattedColumns.find((c) => c.type === "expand"));
    const props = __props;
    const { itemRefEl } = useObserverItem({ resizeObserver: props.resizeObserver });
    const getRenderRow = (row) => {
      var _a, _b;
      return (_b = (_a = expandCol.value) == null ? void 0 : _a.bodyRender) == null ? void 0 : _b.call(_a, expandCol.value, row);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("tr", {
        ref_key: "itemRefEl",
        ref: itemRefEl,
        class: "kita-grid-tr"
      }, [
        createElementVNode("td", {
          class: "kita-grid-td kita-grid-td--expand",
          colspan: unref(flattedColumns).length
        }, [
          createElementVNode("div", _hoisted_2$1, [
            (openBlock(), createBlock(resolveDynamicComponent(getRenderRow(_ctx.row))))
          ])
        ], 8, _hoisted_1$1)
      ], 512);
    };
  }
});
const _hoisted_1 = ["width"];
const _hoisted_2 = ["width"];
const _hoisted_3 = ["width"];
const _hoisted_4 = {
  class: "kita-grid-body"
};
const _hoisted_5 = {
  key: 0,
  class: "kita-grid-mask"
};
const _hoisted_6 = /* @__PURE__ */ createElementVNode("p", null, "No Data", -1);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Grid",
  props: {
    columns: {
      default: () => []
    },
    list: {
      default: () => []
    },
    rowKey: {
      default: "id"
    },
    rowMinHeight: {
      default: 30
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: false
    },
    showTreeLine: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    highlightCurrentColumn: {
      type: Boolean,
      default: false
    },
    merges: {
      default: () => []
    },
    groupConfig: {
      default: () => []
    },
    headerRowClassName: {
      type: Function,
      default: () => ""
    },
    headerRowStyle: {
      type: Function,
      default: () => ""
    },
    headerCellClassName: {
      type: Function,
      default: () => ""
    },
    headerCellStyle: {
      type: Function,
      default: () => ""
    },
    rowClassName: {
      type: Function,
      default: () => ""
    },
    rowStyle: {
      type: Function,
      default: () => ""
    },
    cellClassName: {
      type: Function,
      default: () => ""
    },
    cellStyle: {
      type: Function,
      default: () => ""
    }
  },
  setup(__props, {
    emit: __emit
  }) {
    const emits = __emit;
    const props = __props;
    const gridStore = new GridStore();
    provide("gridStore", gridStore);
    gridStore.setUIProps("border", props.border);
    gridStore.setUIProps("stripe", props.stripe);
    gridStore.setUIProps("showTreeLine", props.showTreeLine);
    gridStore.setUIProps("selection", props.selection);
    gridStore.setUIProps("highlightCurrentRow", props.highlightCurrentRow);
    gridStore.setUIProps("highlightCurrentColumn", props.highlightCurrentColumn);
    gridStore.setUIProps("defaultExpandAll", props.defaultExpandAll);
    gridStore.setUIProps("headerRowClassName", props.headerRowClassName);
    gridStore.setUIProps("headerRowStyle", props.headerRowStyle);
    gridStore.setUIProps("headerCellClassName", props.headerCellClassName);
    gridStore.setUIProps("headerCellStyle", props.headerCellStyle);
    gridStore.setUIProps("rowClassName", props.rowClassName);
    gridStore.setUIProps("rowStyle", props.rowStyle);
    gridStore.setUIProps("cellClassName", props.cellClassName);
    gridStore.setUIProps("cellStyle", props.cellStyle);
    gridStore.setColumns(props.columns);
    if (props.merges) {
      gridStore.bodyMergeMap = gridStore.mergeMapConstructor(props.merges);
    }
    if (props.rowKey) {
      gridStore.setRowKey(props.rowKey);
    }
    if (props.rowMinHeight) {
      gridStore.setRowMinHeight(props.rowMinHeight);
    }
    let list = props.list;
    if (props.groupConfig && props.groupConfig.length) {
      list = gridStore.groupFoldConstructor(list, props.groupConfig);
    }
    function initDataList(list2) {
      gridStore.setList([]);
      setTimeout(() => {
        gridStore.setOriginList(list2);
        gridStore.generateFlatList();
      });
    }
    watch$1(() => props.groupConfig, (nv) => {
      if (nv == null ? void 0 : nv.length) {
        const list2 = gridStore.groupFoldConstructor(props.list, nv);
        initDataList(list2);
      }
    });
    watch$1(() => props.list, (nv) => {
      initDataList(nv);
    }, {
      immediate: true
    });
    const {
      centerNormalColumns,
      leftFixedColumns,
      rightFixedColumns
    } = gridStore;
    function calcVisibleColumns(scrollLeft, clientWidth) {
      let colRenderBegin = 0;
      let colRenderEnd = 0;
      let currentLeft = 0;
      let beginFlag = false;
      for (let i = 0; i < centerNormalColumns.length; i++) {
        const currentWidth = centerNormalColumns[i].width;
        if (currentLeft >= scrollLeft && !beginFlag) {
          colRenderBegin = i;
          beginFlag = true;
        } else if (currentLeft >= scrollLeft + clientWidth) {
          colRenderEnd = i;
          break;
        }
        colRenderEnd = i;
        currentLeft += currentWidth;
      }
      colRenderBegin = Math.max(0, colRenderBegin - 1);
      colRenderEnd = Math.min(centerNormalColumns.length - 1, colRenderEnd + 1);
      gridStore.watchData.colRenderBegin = colRenderBegin;
      gridStore.watchData.colRenderEnd = colRenderEnd;
    }
    function calcFixedShadow(scrollLeft, scrollWidth, clientWidth) {
      gridStore.calcGridScrollingStatus(scrollLeft, scrollWidth, clientWidth);
    }
    const emitFunction = {
      scroll: (evt) => {
        const {
          scrollLeft,
          scrollWidth,
          clientWidth
        } = evt.target;
        calcVisibleColumns(scrollLeft, clientWidth);
        calcFixedShadow(scrollLeft, scrollWidth, clientWidth);
      },
      toTop: () => {
      },
      toBottom: () => {
      },
      itemResize: (id, height) => {
        var _a;
        const lastHeight = (_a = gridStore.watchData.rowHeightMap.get(String(id))) != null ? _a : props.rowMinHeight;
        gridStore.watchData.rowHeightMap.set(String(id), Math.max(lastHeight, height));
      }
    };
    const virtualListRef = useVirtList(gridStore.virtualListProps, emitFunction);
    gridStore.initVirtualListRef(virtualListRef);
    const {
      resizeObserver,
      reactiveData: vlReactiveData,
      slotSize,
      renderList: renderList$1,
      clientRefEl,
      stickyHeaderRefEl
    } = virtualListRef;
    const tableRefEl = ref$1();
    const rootRefEl = ref$1();
    const {
      onClick,
      onDblclick,
      onContextmenu
    } = useContentEvent(gridStore);
    function getComponent(row) {
      switch (row.type) {
        case "group":
          return _sfc_main$4;
        case "expand":
          return _sfc_main$3;
        default:
          return _sfc_main$5;
      }
    }
    const cls = computed(() => ({
      body: [gridStore.getUIProps("border") && "kita-grid-main--border"],
      table: ["kita-grid-table", gridStore.gridScrollingStatus.value]
    }));
    const fullWidth = computed(() => {
      return gridStore.watchData.fullWidth;
    });
    const headerHeight = computed(() => slotSize.stickyHeaderSize);
    onMounted$1(() => {
      if (clientRefEl.value) {
        const {
          scrollLeft,
          scrollWidth,
          clientWidth
        } = clientRefEl.value;
        calcVisibleColumns(scrollLeft, clientWidth);
        calcFixedShadow(scrollLeft, scrollWidth, clientWidth);
      }
      if (tableRefEl.value)
        gridStore.setTableRootEl(tableRefEl.value);
      if (rootRefEl.value)
        gridStore.initSelectionElement(rootRefEl.value);
      for (const key of Object.values({
        ...CellEventEnum,
        ...RowEventEnum,
        ...HeaderEventEnum,
        ...TableEventEnum
      })) {
        gridStore.eventEmitter.on(key, (data) => {
          emits(key, data);
        });
      }
    });
    onBeforeUnmount$1(() => {
      gridStore.eventEmitter.offAll();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "kita-grid-root",
        ref_key: "rootRefEl",
        ref: rootRefEl
      }, [createElementVNode("div", {
        class: normalizeClass(["kita-grid-main", cls.value.body]),
        ref_key: "clientRefEl",
        ref: clientRefEl,
        "data-id": "client"
      }, [createElementVNode("div", {
        style: normalizeStyle(`float:left; height: ${unref(vlReactiveData).listTotalSize}px`)
      }, null, 4), createElementVNode("table", {
        class: normalizeClass(cls.value.table),
        cellspacing: "0",
        cellpadding: "0",
        style: normalizeStyle(`width: ${fullWidth.value}px;`),
        ref_key: "tableRefEl",
        ref: tableRefEl,
        onClick: _cache[0] || (_cache[0] = //@ts-ignore
        (...args) => unref(onClick) && unref(onClick)(...args)),
        onDblclick: _cache[1] || (_cache[1] = //@ts-ignore
        (...args) => unref(onDblclick) && unref(onDblclick)(...args)),
        onContextmenu: _cache[2] || (_cache[2] = //@ts-ignore
        (...args) => unref(onContextmenu) && unref(onContextmenu)(...args))
      }, [(openBlock(), createElementBlock("colgroup", {
        key: unref(gridStore).watchData.renderKey
      }, [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(leftFixedColumns), (column) => {
        return openBlock(), createElementBlock("col", {
          key: column._id,
          width: column.width
        }, null, 8, _hoisted_1);
      }), 128)), (openBlock(true), createElementBlock(Fragment, null, renderList(unref(centerNormalColumns), (column) => {
        return openBlock(), createElementBlock("col", {
          key: column._id,
          width: column.width
        }, null, 8, _hoisted_2);
      }), 128)), (openBlock(true), createElementBlock(Fragment, null, renderList(unref(rightFixedColumns), (column) => {
        return openBlock(), createElementBlock("col", {
          key: column._id,
          width: column.width
        }, null, 8, _hoisted_3);
      }), 128))])), props.showHeader ? (openBlock(), createElementBlock("thead", {
        key: 0,
        ref_key: "stickyHeaderRefEl",
        ref: stickyHeaderRefEl,
        "data-id": "stickyHeader",
        class: "kita-grid-header",
        style: normalizeStyle(`height: ${headerHeight.value}px;`)
      }, [createVNode(_sfc_main$c)], 4)) : createCommentVNode("", true), createElementVNode("tbody", _hoisted_4, [createElementVNode("tr", {
        style: normalizeStyle(`height: ${unref(vlReactiveData).virtualSize}px;`)
      }, null, 4), (openBlock(true), createElementBlock(Fragment, null, renderList(unref(renderList$1), (row, index2) => {
        return openBlock(), createBlock(resolveDynamicComponent(getComponent(row)), {
          key: row.id,
          resizeObserver: unref(resizeObserver),
          row,
          rowIndex: index2 + unref(vlReactiveData).renderBegin,
          "data-id": row.id,
          "data-level": row.level
        }, null, 8, ["resizeObserver", "row", "rowIndex", "data-id", "data-level"]);
      }), 128))])], 38)], 2), !unref(list).length ? (openBlock(), createElementBlock("div", _hoisted_5, [renderSlot(_ctx.$slots, "empty", {}, () => [_hoisted_6])])) : createCommentVNode("", true)], 512);
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GridTable",
  props: {
    list: {},
    rowKey: {},
    rowMinHeight: {},
    defaultExpandAll: { type: Boolean },
    merges: {},
    selection: { type: Boolean },
    groupConfig: {},
    border: { type: Boolean },
    stripe: { type: Boolean },
    showTreeLine: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const instance = getCurrentInstance();
    const attrs = computed(() => {
      return {
        ...props,
        ...instance == null ? void 0 : instance.attrs
      };
    });
    function setupNode(node) {
      let dom = document.createElement("div");
      render(node, dom);
    }
    function isGridTableColumnNode(node) {
      return node.type.name === "GridTableColumn";
    }
    function initColumn(columnNode) {
      var _a, _b, _c, _d;
      const field = columnNode.props.field;
      const baseProps = columnNode.props;
      Object.keys(baseProps).forEach((key) => {
        if (baseProps[key] === "")
          baseProps[key] = true;
      });
      setupNode(columnNode);
      if (!isGridTableColumnNode(columnNode)) {
        throw new Error("please use GridTableColumn");
      }
      const slots2 = (_b = (_a = columnNode.component) == null ? void 0 : _a.slots) != null ? _b : {};
      const columnConfig = {
        ...baseProps,
        field,
        headerRender: slots2.header ? (column) => {
          var _a2, _b2;
          return (_b2 = (_a2 = slots2.header) == null ? void 0 : _a2.call(slots2, { column })) == null ? void 0 : _b2[0];
        } : void 0
      };
      const children = (_d = (_c = slots2.default) == null ? void 0 : _c.call(slots2, {
        row: {},
        column: {}
      })) != null ? _d : [];
      children.forEach((node) => {
        if (isGridTableColumnNode(node)) {
          if (!columnConfig.children)
            columnConfig.children = [];
          columnConfig.children.push(initColumn(node));
        }
      });
      const hasBodyRender = !columnConfig.children && !!slots2.default;
      console.log(hasBodyRender);
      if (hasBodyRender) {
        columnConfig.bodyRender = (column, row) => {
          var _a2, _b2;
          return (_b2 = (_a2 = slots2.default) == null ? void 0 : _a2.call(slots2, { column, row })) == null ? void 0 : _b2[0];
        };
      }
      return columnConfig;
    }
    const getColumns = () => {
      var _a, _b;
      let defaultNodes = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) != null ? _b : [];
      const columnNodes = [];
      defaultNodes.forEach((node) => {
        if (isGridTableColumnNode(node))
          columnNodes.push(node);
        if (node.type === Fragment)
          columnNodes.push(...node.children.filter(isGridTableColumnNode));
      });
      return columnNodes.filter((node) => isGridTableColumnNode(node)).map((node) => {
        return initColumn(node);
      });
    };
    const columns = computed(getColumns);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$2, mergeProps({ columns: columns.value }, attrs.value), {
        empty: withCtx(() => [
          renderSlot(_ctx.$slots, "empty")
        ]),
        _: 3
      }, 16, ["columns"]);
    };
  }
});
const __default__ = {
  name: "GridTableColumn"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: {
    field: {},
    title: {},
    type: {},
    width: {},
    minWidth: {},
    maxWidth: {},
    resizable: { type: Boolean },
    fixed: {},
    align: {},
    headerAlign: {},
    children: {},
    className: {},
    headerRender: { type: Function },
    bodyRender: { type: Function },
    index: { type: Function },
    colIndex: {},
    ellipsis: { type: Boolean },
    sort: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return toDisplayString(_ctx.field);
    };
  }
});
export {
  CellEventEnum,
  ColumnType,
  _sfc_main$2 as Grid,
  _sfc_main$1 as GridTable,
  _sfc_main as GridTableColumn,
  HeaderEventEnum,
  RowEventEnum,
  TableEventEnum
};
//# sourceMappingURL=index.js.map
