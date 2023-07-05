/* eslint-disable max-classes-per-file */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
import Vue from 'vue';
import './stackDrawerStyle.scss';
import { startWidthOpPerfix, transformKey } from './utils';
import {
	DOM_CLASS_LIST,
	StackDrawerOptions,
	EventCallBack,
	StackDrawerModel,
} from './types';
import {
	renderVm,
	_enterTransition,
	_leaveTransition,
	_disapper,
	_apper,
	CUSTOM_WARP_ATTR,
} from './domUI';

import {
	_destoryOne,
	_destoryDrawer,
	_activate,
	_deactivate,
} from './lifeCycle';

import {
	setElementRemoveMutationObserver,
	addWindowClickOutCloseEvent,
	removeWindowClickOutCloseEvent,
	addSelectorClickOutCloseEvent,
	removeSelectorClickOutCloseEvent,
} from './events';

/** *************** 原则: 视图层异步 数据层绝不可异步 **************** */

const getStackDrawerClass = () =>
	class StackDrawer {
		static instance?: StackDrawer;

		static customWarp?: HTMLElement; // 自定义 视图 容器

		static defaultOptions: StackDrawerOptions = {
			pushStack: true, // 是否入栈
			keepEmit: false, // 默认非活跃状态下 不保持事件触发
		};

		static clickOutClose = false; // 是否点击空白处关闭

		static closeSelector = ''; // 需要挂载关闭事件的元素选择器

		static ignoreSelector = ''; // 忽略 点击空白处关闭的选择器

		_afterCloseFn?: Function;

		_beforeCloseFn?: Function;

		$warp!: HTMLElement;

		// options: StackDrawerOptions;

		vector: StackDrawerModel[]; // Model容器

		currentModel?: StackDrawerModel; // 当前数据层

		constructor() {
			this.vector = [];
			if (StackDrawer.customWarp) {
				this._initDiyWarp(StackDrawer.customWarp);
			} else {
				this._createWarp();
			}
		}

		static setIgnoreSelector(selector: string) {
			StackDrawer.ignoreSelector = selector;
		}

		static setCloseSelector(selector: string) {
			StackDrawer.closeSelector = selector;
		}

		static setGlobalOption(options: StackDrawerOptions) {
			StackDrawer.defaultOptions = {
				...StackDrawer.defaultOptions,
				...options,
			};
		}

		static setCustomWarp(customWarp: HTMLElement) {
			// if (StackDrawer?.instance?.vector?.length) {
			//     console.error('StackDrawer 栈不为空, 你可以调用 StackDrawer.closeNow()) 清空StackDrawer后再尝试设置customWarp');
			//     return;
			// }
			// if (StackDrawer.customWarp) {
			//     console.error('customWarp 已定义，请先移除自定义容器 在设置自定义容器');
			//     return;
			// }
			if (!customWarp) {
				console.error('customWarp 不能为空');
			}
			if (customWarp === StackDrawer.customWarp) return;
			if (StackDrawer.instance) {
				StackDrawer.closeNow();
				if (!StackDrawer.customWarp) {
					removeSelectorClickOutCloseEvent(StackDrawer);
					removeWindowClickOutCloseEvent(StackDrawer);
					StackDrawer.instance.$warp.remove();
				}
				StackDrawer.customWarp = customWarp;
				StackDrawer.instance._initDiyWarp(StackDrawer.customWarp);
			} else {
				StackDrawer.customWarp = customWarp;
				StackDrawer._getStackDrawer();
			}
		}

		static removeCustomWarp() {
			if (!StackDrawer.customWarp) return;
			delete StackDrawer.customWarp;
			if (!StackDrawer.instance) return;
			StackDrawer.closeNow();
			StackDrawer.instance._createWarp();
		}

		// 可级联调用
		static push(
			component: Vue.ComponentOptions<Vue>,
			propsData: any,
			options: StackDrawerOptions = {}
		) {
			const ins = StackDrawer._getStackDrawer();
			ins._push(component, propsData, options);
			return StackDrawer;
		}

		// 可级联调用
		static replace(
			component: Vue.ComponentOptions<Vue>,
			propsData: any,
			options: StackDrawerOptions = {}
		) {
			const ins = StackDrawer._getStackDrawer();
			ins._replace(component, propsData, options);
			return StackDrawer;
		}

		// 可级联调用
		static $on(eventName: string, fn: Function, keepEmit?: boolean) {
			const ins = StackDrawer._getStackDrawer();
			ins._$on(eventName, fn, keepEmit);
			return StackDrawer;
		}

		// 可级联调用
		static $off(eventName: string, fn: Function) {
			const ins = StackDrawer._getStackDrawer();
			ins._$off(eventName, fn);
			return StackDrawer;
		}

		static async goBack(num = 1, animate = true) {
			const ins = StackDrawer._getStackDrawer();
			return ins._goBack(num, animate);
		}

		// 立即关闭 没有任何动画 不会返回promise
		static closeNow() {
			const ins = StackDrawer.instance;
			return ins?._closeNow();
		}

		static async close(animate = true) {
			const ins = StackDrawer._getStackDrawer();
			return ins._close(animate);
		}

		static async show(animate = true) {
			const ins = StackDrawer._getStackDrawer();
			return ins._show(animate);
		}

		static async hide(animate = true) {
			const ins = StackDrawer._getStackDrawer();
			return ins._hide(animate);
		}

		static getLength() {
			const ins = StackDrawer._getStackDrawer();
			return ins._getLength();
		}

		/** *********************** ----上面是外部可调用的方法----- ********************* */
		/** ************************* -------我是分割线------ ********************* */

		static _getStackDrawer() {
			if (!StackDrawer.instance) {
				StackDrawer.instance = new StackDrawer();
			}
			return StackDrawer.instance;
		}

		static registerAfterCloseEvent(fn: Function) {
			const instance = StackDrawer._getStackDrawer();
			instance._afterCloseFn = fn;
		}

		static removeAfterCloseEvent() {
			if (StackDrawer.instance) {
				delete StackDrawer.instance._afterCloseFn;
			}
		}

		static registerBeforeCloseEvent(fn: Function) {
			const instance = StackDrawer._getStackDrawer();
			instance._beforeCloseFn = fn;
		}

		static removeBeforeCloseEvent() {
			if (StackDrawer.instance) {
				delete StackDrawer.instance._beforeCloseFn;
			}
		}

		/** 创建容器 */
		_createWarp() {
			this.$warp = document.createElement('div');
			this.$warp.classList.add(DOM_CLASS_LIST.warpClass);
			this.$warp.classList.add(DOM_CLASS_LIST.warpClassOrigon);
			this.$warp.style.display = 'none';
			document.body.appendChild(this.$warp);
			addWindowClickOutCloseEvent(StackDrawer);
			addSelectorClickOutCloseEvent(StackDrawer);
		}

		/** 初始化自定义容器 */
		_initDiyWarp(customWarp: HTMLElement) {
			setElementRemoveMutationObserver(customWarp, () => {
				if (StackDrawer.customWarp === customWarp) {
					StackDrawer.removeCustomWarp();
				}
			});
			this.$warp = customWarp;
			this.$warp.setAttribute(CUSTOM_WARP_ATTR, '1');
			this.$warp.classList.add(DOM_CLASS_LIST.warpClass);
		}

		async _show(animate: boolean) {
			if (this._getLength() < 1) {
				console.warn('StackDrawer 中没有内容');
				return false;
			}

			let needActivate = false; // 是否需要激活, 第一次挂载不需要激活

			const { currentModel } = this;

			if (!currentModel) return false;

			if (currentModel.vmWarp && this._isShow()) return false;

			if (!currentModel.vmWarp) {
				// 第一次挂载
				renderVm(currentModel, this.$warp);
			} else {
				// 重新激活
				needActivate = true;
			}

			if (!this._isShow()) {
				this.$warp.style.display = '';
			}

			// 1, 上一个Drawer 设置为非激活
			if (currentModel.lastModel) {
				_deactivate(currentModel.lastModel);
			}

			// 2, 显示出当前Drawer
			_apper(currentModel);

			// 3, 当前Drawer 执行动画
			if (animate) await _enterTransition(currentModel);

			// 4, 动画执行完 上一个Drawer 消失
			if (currentModel.lastModel) {
				_disapper(currentModel.lastModel);
				if (!currentModel.lastModel.options.pushStack) {
					_destoryOne(currentModel.lastModel);
				}
				delete currentModel.lastModel;
			}

			// 5, 当前Drawer 设置为激活
			if (needActivate) {
				// 激活当前Drawer
				_activate(currentModel);
			}

			return true;
		}

		_hideNow() {
			if (!this._isShow()) {
				return false;
			}

			const { currentModel, $warp } = this;

			_deactivate(currentModel);

			if (!$warp.hasAttribute(CUSTOM_WARP_ATTR)) {
				$warp.style.display = 'none';
			}
		}

		async _hide(animate: boolean) {
			if (!this._isShow()) {
				return false;
			}

			const { currentModel, $warp } = this;

			if (animate) await _leaveTransition(currentModel);

			_deactivate(currentModel);

			if (!$warp.hasAttribute(CUSTOM_WARP_ATTR)) {
				$warp.style.display = 'none';
			}
		}

		_isShow() {
			return this.$warp && this.$warp.style.display !== 'none';
		}

		_push(
			component: Vue.ComponentOptions<Vue>,
			propsData: any = {},
			options: StackDrawerOptions = {}
		) {
			const mOptions = { ...StackDrawer.defaultOptions, ...options };

			// 数据存储
			this.currentModel = {
				component,
				propsData,
				activate: true,
				events: {},
				lastModel: this.currentModel,
				options: mOptions,
			};

			if (mOptions.pushStack) {
				this.vector.push(this.currentModel);
			}

			return StackDrawer;
		}

		_replace(
			component: Vue.ComponentOptions<Vue>,
			propsData: any = {},
			options: StackDrawerOptions = {}
		) {
			this._closeNow(false);
			this._push(component, propsData, options);
		}

		_$on(eventName: string, fn: Function, keepEmit?: boolean) {
			if (this.currentModel) {
				const { events, options } = this.currentModel;
				let isKeepEmit = options.keepEmit || false;
				if (keepEmit !== undefined) {
					isKeepEmit = keepEmit;
				}
				(fn as EventCallBack)._keep_emit = isKeepEmit;

				if (!events[eventName]) {
					events[eventName] = [];
				}
				if (events[eventName].indexOf(fn) < 0) {
					events[eventName].push(fn);
				}
			}
			return StackDrawer;
		}

		_$off(eventName: string, fn: Function) {
			if (this.currentModel) {
				const { events } = this.currentModel;
				if (events[eventName]) {
					events[eventName].splice(events[eventName].indexOf(fn), 1);
				}
			}
			return StackDrawer;
		}

		_closeNow(triggerEvent = true) {
			if (typeof this._beforeCloseFn === 'function' && triggerEvent) {
				this._beforeCloseFn();
			}
			const readyDestoryDrawerModel = this._remove(this._getLength());
			this._hideNow();
			delete this.currentModel;
			_destoryDrawer(readyDestoryDrawerModel);
			if (typeof this._afterCloseFn === 'function' && triggerEvent) {
				this._afterCloseFn();
			}
			return true;
		}

		async _close(animate: boolean) {
			if (typeof this._beforeCloseFn === 'function') {
				this._beforeCloseFn();
			}
			const readyDestoryDrawerModel = this._remove(this._getLength());
			await this._hide(animate);
			delete this.currentModel;
			_destoryDrawer(readyDestoryDrawerModel);
			if (typeof this._afterCloseFn === 'function') {
				this._afterCloseFn();
			}
			return true;
		}

		async _goBack(num = 1, animate: boolean) {
			if (!this.currentModel) return;
			const { options } = this.currentModel;
			let spliceNum = num - 1;
			if (!options.pushStack) {
				spliceNum = num;
			}

			if (spliceNum >= this._getLength() - 1) {
				// 返回过多
				console.warn('返回级数超过了StackDrawer的长度');
				return false;
			}

			if (options.pushStack) {
				this.vector.pop();
			}

			const removeModel = this.currentModel;

			if (spliceNum > 0) {
				_destoryDrawer(this._remove(spliceNum));
			}
			this.currentModel = this.vector[this.vector.length - 1];

			_apper(this.currentModel);

			_deactivate(removeModel);

			_activate(this.currentModel);

			if (animate) await _leaveTransition(removeModel);
			_destoryOne(removeModel);
			return true;
		}

		_remove(spliceNum = 1) {
			return this.vector.splice(-spliceNum);
		}

		_getLength() {
			return this.vector.length;
		}

		static _setProps(key: string, value: any) {
			const ins = StackDrawer._getStackDrawer();
			return ins._insSetProps(key, value);
		}

		static _getVmData(key: string) {
			const ins = StackDrawer._getStackDrawer();
			return ins._insGetVmData(key);
		}

		_insSetProps(key: string, value: any) {
			if (this.currentModel) {
				const { vm, propsData } = this.currentModel;
				(vm as Record<string, any>)[key] = value;
				propsData[key] = value;
			}
		}

		_insGetVmData(key: string) {
			if (this.currentModel) {
				const { vm, propsData } = this.currentModel;
				const target = vm?.$children[0];
				if (target) {
					let value = (target as Record<string, any>)[key];
					if (value === undefined) {
						value = propsData[key];
					}
					return value;
				}
				return null;
			}
			return null;
		}

		static clear() {
			StackDrawer.closeNow();
			const { instance } = StackDrawer;
			StackDrawer.removeBeforeCloseEvent();
			StackDrawer.removeAfterCloseEvent();
			if (!instance) return;
			if (instance?.$warp) {
				instance.$warp.remove();
			}
			delete StackDrawer.instance;
		}
	};

export type StackDrawerClass = ReturnType<typeof getStackDrawerClass> &
	Record<any, any>;

// getStackDrawer 构建多个实例
export const getStackDrawer = () =>
	new Proxy<StackDrawerClass>(getStackDrawerClass(), {
		get(target, key: string) {
			if (startWidthOpPerfix(key as string)) {
				return target._getVmData(transformKey(key));
			}
			return target[key as keyof StackDrawerClass];
		},
		set(target, key: string, value) {
			if (startWidthOpPerfix(key as string)) {
				target._setProps(transformKey(key), value);
			} else {
				target[key as keyof StackDrawerClass] = value;
			}
			return true;
		},
	});

// 导出一个 构建好的实例
export default getStackDrawer();
