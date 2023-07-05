<template>
	<div class="test-stack">
		<div class="btn-warp">
			<Button @click.stop="push">push调用</Button>
			<Button @click.stop="replace">replace调用</Button>
			<Button type="blue" @click.stop="pushDiy">push自定义容器</Button>
			<Button @click.stop="back">返回</Button>
			<Button @click.stop="close">关闭</Button>
			<Button @click.stop="show">show</Button>
			<Button @click.stop="hide">hide</Button>
			<Button @click.stop="modify">修改props数据</Button>
			<Button @click.stop="invokeComponentFn">调用子组件方法</Button>
		</div>
		<div ref="drawer" class="diy-drawer-warp" />
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import StackDrawer from '../../src/index';

import TestComForStackDrawer from './TestComForStackDrawer.vue';

const fn1 = (da: string) => {
	console.log('fn1', da);
};

let index = 1;

StackDrawer.clickOutClose = true; // 开启时 点击空白处 可编辑

const push = () => {
	index++;
	let num = 30;
	const data = [];
	while (num-- > 0) {
		data.push(index++);
	}
	StackDrawer.removeCustomWarp();
	StackDrawer.registerBeforeCloseEvent(() => {
		console.log('BeforeCloseEvent111');
	});

	StackDrawer.registerAfterCloseEvent(() => {
		console.log('AfterCloseEvent222');
	});
	// 级联调用 test
	StackDrawer.push(
		TestComForStackDrawer,
		{ list: data, aaa: '55667788' },
		{ top: 20 }
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

const replace = () => {
	index++;
	let num = 30;
	const data = [];
	while (num-- > 0) {
		data.push(index++);
	}

	StackDrawer.replace(
		// replace 会清空栈 然后渲染最新的组件
		TestComForStackDrawer,
		{ list: data, aaa: '55667788' },
		{ top: 20 }
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
		.show(false)
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
	// StackDrawer.closeNow();
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
	StackDrawer.push(TestComForStackDrawer, { list: data })
		.$on('test', fn1)
		.$on('test', (da: string) => fn1(da))
		.$off('test', fn1)
		.show()
		.then(() => {
			console.log('show 的动画完成');
		});
};
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
