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
