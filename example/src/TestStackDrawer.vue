<template>
	<div class="test-stack">
		<div class="btn-warp">
			<Button @click="push">push调用</Button>
			<Button type="blue" @click="pushDiy">push自定义容器</Button>
			<Button @click="back">返回</Button>
			<Button @click="close">关闭</Button>
			<Button @click="show">show</Button>
			<Button @click="hide">hide</Button>
			<Button @click="modify">修改props数据</Button>
			<Button @click="invokeComponentFn">调用子组件方法</Button>
		</div>
		<div ref="drawer" class="diy-drawer-warp" />
	</div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import StackDrawer from '../../src/index';

import TestComForStackDrawer from './TestComForStackDrawer.vue';

export default defineComponent({
	setup() {
		const fn1 = (da: string) => {
			console.log('fn1', da);
		};

		let index = 1;

		const push = () => {
			index++;
			let num = 30;
			const data = [];
			while (num-- > 0) {
				data.push(index++);
			}
			StackDrawer.removeCustomWarp();
			// 级联调用 test
			StackDrawer.push(
				TestComForStackDrawer,
				{ list: data, aaa: '55667788' },
				{ mask: false, top: 20 }
			)
				.$on('test', fn1)
				.$on('test', (da: string) => fn1(da))
				.$off('test', fn1)
				.$on('tap', (da: string) => {
					console.log('tap', da);
				})
				.$on('tap', (da: string) => {
					console.log('tap2', da);
				})
				.show()
				.then(() => {
					console.log('show 的动画完成');
				});
		};

		const back = async () => {
			const success = await StackDrawer.goBack();
			if (success) {
				console.log('返回动画完成');
			}
		};

		const close = async () => {
			const success = await StackDrawer.close();
			if (success) {
				console.log('关闭动画完成');
			}
		};

		const show = async () => {
			const success = await StackDrawer.show();
			if (success) {
				console.log('show动画完成');
			}
		};

		const hide = async () => {
			const success = await StackDrawer.hide();
			if (success) {
				console.log('hide动画完成');
			}
		};

		const modify = () => {
			StackDrawer.$$list = [
				'modify1',
				'modify2',
				'modify3',
				'modify4',
				'modify5',
				'modify6',
			];
			console.log(StackDrawer.$$list);
		};

		const invokeComponentFn = () => {
			StackDrawer.$$getSomething();
		};

		/**
		 * 自定义容器 drawer
		 */
		const drawer = ref();

		const pushDiy = () => {
			index++;
			let num = 30;
			const data = [];
			while (num-- > 0) {
				data.push(index++);
			}
			StackDrawer.setCustomWarp(drawer.value);
			// 级联调用 test
			StackDrawer.push(TestComForStackDrawer, { list: data }, { mask: false })
				.$on('test', fn1)
				.$on('test', (da: string) => fn1(da))
				.$off('test', fn1)
				.show()
				.then(() => {
					console.log('show 的动画完成');
				});
		};

		return {
			close,
			push,
			back,
			show,
			hide,
			modify,
			invokeComponentFn,
			drawer,
			pushDiy,
		};
	},
});
</script>

<style lang="scss">
.test-stack {
	width: 100%;
	height: 100%;
	font-size: 14px;
	display: flex;
	justify-content: center;

	.btn-warp {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding-top: 50px;
	}

	.diy-drawer-warp {
		width: 400px;
		height: 600px;
		border-left: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
	}
}
</style>
