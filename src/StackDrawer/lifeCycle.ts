/* eslint-disable no-unused-expressions */
import Vue from 'vue';
import { StackDrawerModel } from './types';

function callHook(vm: Vue, name: keyof Vue.ComponentOptions<Vue>) {
	if (typeof vm.$options[name] === 'function') {
		(vm.$options[name] as Function)();
	} else if (Array.isArray(vm.$options[name])) {
		(vm.$options[name] as Array<unknown>).forEach((fn) => {
			if (typeof fn === 'function') {
				try {
					fn.call(vm);
				} catch (error) {
					if ((error as any).stack) {
						console.error((error as any).stack);
					}
				}
			}
		});
	}
	vm.$children.forEach((m) => callHook(m, name));
}

export function _destoryOne(model: StackDrawerModel) {
	const { vmWarp, vm } = model;
	vmWarp?.remove();
	vm?.$destroy();
}

export function _destoryDrawer(models: StackDrawerModel[]) {
	models.forEach(_destoryOne);
}

export function _activate(model?: StackDrawerModel) {
	if (!model) return;
	if (model.activate) return;
	const { vm } = model;
	if (!vm) return;
	model.activate = true;
	callHook(vm, 'activated');
}

// 上一个deactivated
export function _deactivate(model?: StackDrawerModel) {
	if (!model) return;
	if (!model.activate) return;
	const { vm } = model;
	if (!vm) return;
	callHook(vm, 'deactivated');
	model.activate = false;
}

export function clearElementRemoveMutationObserver(observer: MutationObserver) {
	observer.disconnect();
}

export function setElementRemoveMutationObserver(
	element: HTMLElement,
	removeCallBack: Function
) {
	const targetNode = document.body;
	// 观察器的配置（需要观察什么变动）
	const config = { childList: true, subtree: true };
	const paths = [element];
	let pElement = element;
	while (pElement.parentElement && pElement.parentElement !== document.body) {
		paths.push(pElement.parentElement);
		pElement = pElement.parentElement;
	}

	// 当观察到变动时执行的回调函数
	const callback = (mutationsList: any, observer: any) => {
		// eslint-disable-next-line no-restricted-syntax
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList' && mutation.removedNodes.length) {
				for (let i = 0; i < mutation.removedNodes.length; i++) {
					if (paths.indexOf(mutation.removedNodes[i]) >= 0) {
						removeCallBack();
						clearElementRemoveMutationObserver(observer);
						break;
					}
				}
			}
		}
	};

	// 创建一个观察器实例并传入回调函数
	const observer = new MutationObserver(callback);

	// 以上述配置开始观察目标节点
	observer.observe(targetNode, config);
}
