import type { VNode } from 'vue';
import type { Column, ListItem } from '../type';
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_TypePropsToRuntimeProps<Column>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<Column>>>, {}, {}>, Readonly<{
    header?: ((data: {
        column: Column;
    }) => VNode[]) | undefined;
    default?: ((data: {
        row: ListItem;
        column: Column;
    }) => VNode[]) | undefined;
}> & {
    header?: ((data: {
        column: Column;
    }) => VNode[]) | undefined;
    default?: ((data: {
        row: ListItem;
        column: Column;
    }) => VNode[]) | undefined;
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
