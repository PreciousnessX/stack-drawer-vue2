/* eslint-disable max-classes-per-file */
/* eslint-disable no-shadow */
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
	setElementRemoveMutationObserver,
} from './lifeCycle';

/** *************** 原则: 视图层异步 数据层绝不可异步 **************** */

const getStackDrawerClass = () =>
	class StackDrawer {
		static instance?: StackDrawer;

		static customWarp?: HTMLElement; // 自定义 视图 容器

		static defaultOptions: StackDrawerOptions = {
			mask: false, // 是否有遮罩
			maskCloseAnimate: true, // 遮罩触发的关闭 是否有动画
			pushStack: true, // 是否入栈
			keepEmit: false, // 默认非活跃状态下 不保持事件触发
		};

		$warp!: HTMLElement;

		$mask?: HTMLElement;

		vector: StackDrawerModel[]; // Model容器

		currentModel?: StackDrawerModel; // 当前数据层

		static [key: string]: any;

		constructor() {
			this.vector = [];
			if (StackDrawer.customWarp) {
				this._initDiyWarp(StackDrawer.customWarp);
			} else {
				this._createWarp();
			}
		}

		static setGlobalOption(options: StackDrawerOptions) {
			StackDrawer.defaultOptions = {
				...StackDrawer.defaultOptions,
				...options,
			};
		}

		static setCustomWarp(customWarp: HTMLElement) {
			// if (StackDrawer?.instance?.vector?.length) {
			//     console.error('StackDrawer 栈不为空, 你可以调用 StackDrawer.close() 清空StackDrawer后再尝试设置customWarp');
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
				StackDrawer.close();
				if (!StackDrawer.customWarp) {
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
			StackDrawer.close();
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

		/** 创建容器 */
		_createWarp() {
			this.$warp = document.createElement('div');
			this.$warp.classList.add(DOM_CLASS_LIST.warpClass);
			this.$warp.classList.add(DOM_CLASS_LIST.warpClassOrigon);
			this.$warp.style.display = 'none';
			document.body.appendChild(this.$warp);
		}

		/** 初始化自定义容器 */
		_initDiyWarp(customWarp: HTMLElement) {
			setElementRemoveMutationObserver(customWarp, () => {
				if (StackDrawer.customWarp === customWarp) {
					StackDrawer.close(false);
				}
			});
			this.$warp = customWarp;
			this.$warp.setAttribute(CUSTOM_WARP_ATTR, '1');
			this.$warp.classList.add(DOM_CLASS_LIST.warpClass);
		}

		_addMask(maskClickAnimate = true) {
			if (!this.$mask) {
				this.$mask = document.createElement('div');
				this.$mask.classList.add(DOM_CLASS_LIST.maskClass);
				this.$mask.addEventListener('click', () =>
					StackDrawer.close(maskClickAnimate)
				);
			}
			if (this.$warp) {
				this.$warp.appendChild(this.$mask);
			}
		}

		_removeMask() {
			if (this.$mask) {
				this.$warp.removeChild(this.$mask);
			}
		}

		async _show(animate: boolean) {
			if (this._getLength() < 1) {
				console.warn('StackDrawer 中没有内容');
				return false;
			}

			let needActivate = false; // 是否需要激活, 第一次挂载不需要激活

			const { currentModel } = this;

			if (!currentModel) return false;

			if (currentModel.vmWarp && currentModel.vmWarp.style.display !== 'none')
				return false;

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

		async _hide(animate: boolean) {
			if (!this._isShow()) {
				return false;
			}
			const { currentModel, $warp } = this;

			if (animate) await _leaveTransition(currentModel);

			_deactivate(currentModel);
			_disapper(currentModel);

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

			if (mOptions.mask) {
				this._addMask(mOptions.maskCloseAnimate);
			} else {
				this._removeMask();
			}

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

		async _close(animate: boolean) {
			const readyDestoryDrawerModel = this._remove(this._getLength());
			delete this.currentModel;
			await this._hide(animate);
			_destoryDrawer(readyDestoryDrawerModel);
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
	};

// getStackDrawer 构建多个实例
export const getStackDrawer = () =>
	new Proxy<ReturnType<typeof getStackDrawerClass>>(getStackDrawerClass(), {
		get(target, key: string) {
			if (startWidthOpPerfix(key as string)) {
				return target._getVmData(transformKey(key));
			}
			return target[key as keyof ReturnType<typeof getStackDrawerClass>];
		},
		set(target, key: string, value) {
			if (startWidthOpPerfix(key as string)) {
				target._setProps(transformKey(key), value);
			} else {
				target[key as keyof ReturnType<typeof getStackDrawerClass>] = value;
			}
			return true;
		},
	});

// 导出一个 构建好的实例
export default getStackDrawer();
