import type { StackDrawerClass } from './index';

export function clearElementRemoveMutationObserver(observer: MutationObserver) {
	observer.disconnect();
}

// 监听自定义容器移除
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

const clickOutFnName = '__windowClickOutFn__';

const createClickOutFn = (stackDrawerClass: StackDrawerClass) => {
	if (!stackDrawerClass[clickOutFnName]) {
		// 创建事件函数
		stackDrawerClass[clickOutFnName] = (event: MouseEvent) => {
			const { ignoreSelector } = stackDrawerClass;
			const stackDrawer = stackDrawerClass._getStackDrawer();
			if (!stackDrawerClass.clickOutClose) return;
			const { $warp } = stackDrawer;
			const targetElement = event.target; // 获取点击的目标元素
			if (!$warp || !targetElement || !document.contains(<Node>targetElement))
				return;

			if (ignoreSelector) {
				const ignoreElement = document.querySelectorAll(ignoreSelector);
				for (let i = 0; i < ignoreElement.length; i++) {
					if (
						targetElement === ignoreElement[i] ||
						ignoreElement[i].contains(<Node>targetElement)
					)
						return;
				}
			}

			// 如果点击的不是要关闭的元素或者要关闭元素的子元素，则关闭要关闭的元素
			if (!$warp.contains(<Node>targetElement)) {
				stackDrawerClass.close();
			}
		};
	}
};

export function addWindowClickOutCloseEvent(
	stackDrawerClass: StackDrawerClass
) {
	createClickOutFn(stackDrawerClass);
	// 挂载事件
	window.addEventListener('click', stackDrawerClass[clickOutFnName]);
}

export function removeWindowClickOutCloseEvent(
	stackDrawerClass: StackDrawerClass
) {
	window.removeEventListener('click', stackDrawerClass[clickOutFnName]);
}

export function addSelectorClickOutCloseEvent(
	stackDrawerClass: StackDrawerClass
) {
	createClickOutFn(stackDrawerClass);
	const { closeSelector } = stackDrawerClass;
	const closeElement = closeSelector
		? document.querySelectorAll(closeSelector)
		: undefined;
	if (stackDrawerClass[clickOutFnName]) {
		if (closeElement) {
			closeElement.forEach((element: Element) => {
				element.addEventListener('click', stackDrawerClass[clickOutFnName]);
			});
		}
	}
}

export function removeSelectorClickOutCloseEvent(
	stackDrawerClass: StackDrawerClass
) {
	const { closeSelector } = stackDrawerClass;
	const closeElement = closeSelector
		? document.querySelectorAll(closeSelector)
		: undefined;
	if (stackDrawerClass[clickOutFnName]) {
		if (closeElement) {
			closeElement.forEach((element: Element) => {
				element.removeEventListener('click', stackDrawerClass[clickOutFnName]);
				element.addEventListener('click', stackDrawerClass[clickOutFnName]);
			});
		}
	}
}
