/* eslint-disable max-classes-per-file */
import Vue from 'vue';

// eslint-disable-next-line no-shadow
export enum DOM_CLASS_LIST {
	warpClass = '_stack_drawer_warp',
	warpClassOrigon = '_stack_drawer_warp_origin',
	maskClass = '_stack_drawer_mask',
	drawerMainClass = '_stack_drawer_main',
	enterTransitionFromClass = '_stack_drawer_enter_from', // 进入from
	enterTransitionToClass = '_stack_drawer_enter_to', // 进入 to
	leaveTransitionFromClass = '_stack_drawer_leave_from', // 离开 from
	leaveTransitionToClass = '_stack_drawer_leave_to', // 离开 to
}

export interface StackDrawerOptions {
	width?: number; // 宽
	top?: number; // 顶部top
	customClass?: string; // 自定义类名
	pushStack?: boolean; // 是否入栈
	keepEmit?: boolean; // 子组件非活跃状态下保持事件触发
	store?: any;
	router?: any;
}

export interface EventCallBack extends Function {
	// eslint-disable-next-line camelcase
	_keep_emit: boolean;
}

// 数据层 结构定义
export interface StackDrawerModel {
	vmWarp?: HTMLElement;
	component: Vue.ComponentOptions<Vue>;
	vm?: Vue;
	propsData: any;
	events: {
		[key: string]: Function[];
	};
	activate: boolean;
	options: StackDrawerOptions;
	lastModel?: StackDrawerModel;
	onActivateCbs?: Function[];
	onDeactivateCbs?: Function[];
}
