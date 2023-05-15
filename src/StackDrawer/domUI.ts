/* eslint-disable vue/require-render-return */
import Vue from 'vue';
import { sleep } from './utils';
import { StackDrawerModel, DOM_CLASS_LIST } from './types';

export const CUSTOM_WARP_ATTR = '__custom__warp__';

async function _invokTransition(
	$dom: HTMLElement,
	fromClass: string,
	toClass: string
) {
	$dom.classList.add(fromClass);
	await sleep();
	$dom.classList.add(toClass);

	await new Promise((resolve) => {
		const transitionEndFn = () => {
			$dom.removeEventListener('transitionend', transitionEndFn);
			$dom.classList.remove(fromClass);
			$dom.classList.remove(toClass);
			resolve(true);
		};
		$dom.addEventListener('transitionend', transitionEndFn);
	});
	return true;
}

export async function _enterTransition(model?: StackDrawerModel) {
	if (model) {
		const { vmWarp } = model;
		if (!vmWarp) return;
		return _invokTransition(
			vmWarp,
			DOM_CLASS_LIST.enterTransitionFromClass,
			DOM_CLASS_LIST.enterTransitionToClass
		);
	}
	return false;
}

export async function _leaveTransition(model?: StackDrawerModel) {
	if (model) {
		const { vmWarp } = model;
		if (!vmWarp) return;
		return _invokTransition(
			vmWarp,
			DOM_CLASS_LIST.leaveTransitionFromClass,
			DOM_CLASS_LIST.leaveTransitionToClass
		);
	}
	return false;
}

export function _apper(model: StackDrawerModel) {
	const { vmWarp } = model;
	if (!vmWarp) return;
	vmWarp.style.display = '';
}

// 消失
export function _disapper(model?: StackDrawerModel) {
	if (!model) return;
	const { vmWarp } = model;
	if (!vmWarp) return;
	vmWarp.style.display = 'none';
}

export function renderVm(model: StackDrawerModel, $warp: HTMLElement) {
	const { component, propsData, events, options } = model;

	const methods: { [key: string]: Function } = {};
	Object.keys(events).forEach((key) => {
		// eslint-disable-next-line func-names
		methods[key] = function (...arg: any) {
			if (!options.keepEmit && !model.activate) return; // 非活跃状态下不触发事件
			const fns = events[key];
			fns.forEach((fn) => {
				fn(...arg);
			});
		};
	});

	const Component = Vue.extend({
		components: { com: component },
		store: options.store,
		data: () => ({
			...propsData,
		}),
		render(h: Vue.CreateElement) {
			return h('com', {
				attrs: { ...this.$data },
				on: methods,
			});
		},
	} as any);

	const $vmWarp = document.createElement('div');
	$vmWarp.classList.add(DOM_CLASS_LIST.drawerMainClass);
	$vmWarp.style.display = 'none';

	if (options.width !== undefined) {
		$vmWarp.style.width = `${options.width}px`;
	}

	if (options.top !== undefined && !$vmWarp.hasAttribute(CUSTOM_WARP_ATTR)) {
		$vmWarp.style.top = `${options.top}px`;
	}

	if (options.customClass) {
		$vmWarp.classList.add(options.customClass);
	}

	const vm = new Component();

	console.log(vm);

	vm.$mount(); // 挂载
	$vmWarp.appendChild(vm.$el);
	model.vm = vm;
	model.vmWarp = $vmWarp;
	$warp.appendChild($vmWarp);
}
